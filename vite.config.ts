import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { imagetools } from "vite-imagetools"
import fs from "node:fs"
import path from "node:path"

// The site is served from https://hsoh0408.github.io/ (a GitHub user site).
// The Gensler build (`--mode gensler`) is served from /gensler/ and also ships
// the Gensler cover letter.
const BASE_PATH = "/"
const GENSLER_BASE_PATH = "/gensler/"
const GENSLER_FILES = ["variants/gensler/Gensler_CoverLetter.pdf"]

// Responsive widths generated for project images (never upscaled).
const PROJECT_IMAGE_WIDTHS = [480, 800, 1200, 1600]

// Vite config — https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isGensler = mode === "gensler"
  return {
  base: isGensler ? GENSLER_BASE_PATH : BASE_PATH,
  build: isGensler ? { outDir: "dist/gensler" } : {},
  plugins: [
    react(),
    tailwindcss(),
    imagetools({
      // Every image in src/assets/projects is resized and converted to WebP at
      // build time, so a file dropped in later is optimized automatically.
      defaultDirectives: async (url, metadata) => {
        if (!url.pathname.includes("/src/assets/projects/")) {
          return new URLSearchParams()
        }
        const { width = 1600 } = await metadata()
        const largest = Math.min(width, 1600)
        const widths = [
          ...PROJECT_IMAGE_WIDTHS.filter((w) => w < largest),
          largest,
        ]
        return new URLSearchParams({
          w: widths.join(";"),
          format: "webp",
          quality: "80",
        })
      },
    }),
    spaFallback(),
    isGensler && variantFiles(GENSLER_FILES),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  }
})

/** Serves (dev) and emits (build) variant-only files at the site root. */
function variantFiles(files: string[]): Plugin {
  const byName = new Map(files.map((file) => [path.basename(file), file]))
  return {
    name: "variant-files",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const name = decodeURIComponent((req.url ?? "").split("?")[0]).split("/").pop()
        const file = name && byName.get(name)
        if (!file) return next()
        res.setHeader("Content-Type", "application/pdf")
        fs.createReadStream(file).pipe(res)
      })
    },
    generateBundle() {
      for (const [fileName, file] of byName) {
        this.emitFile({ type: "asset", fileName, source: fs.readFileSync(file) })
      }
    },
  }
}

/**
 * GitHub Pages has no SPA rewrites. It serves 404.html for any path that
 * doesn't exist, so shipping a copy of index.html as 404.html lets the client
 * router handle direct visits and refreshes on /work, /projects/:slug, etc.
 */
function spaFallback(): Plugin {
  let outDir = "dist"
  return {
    name: "spa-fallback-404",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const index = path.join(outDir, "index.html")
      if (fs.existsSync(index)) {
        fs.copyFileSync(index, path.join(outDir, "404.html"))
      }
    },
  }
}
