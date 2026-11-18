import { CARD_IMAGE_SIZES } from "./components/ProjectImage"
import { siteData } from "./data"
import { getProjectImage } from "./projectImages"

const preloaded = new Set<string>()

/**
 * Warms the browser cache with the Work page's card images so they're ready
 * before the Home -> Work transition captures the page. The Work page's code
 * is already in the main bundle, so images are the only thing left to fetch.
 * srcset and sizes match the cards, so the browser fetches the same file.
 */
export function preloadWorkImages() {
  for (const project of siteData.projects) {
    const resolved = getProjectImage(project.thumbnail.file)
    if (!resolved || preloaded.has(resolved.src)) continue
    preloaded.add(resolved.src)
    const image = new Image()
    image.decoding = "async"
    if (resolved.srcset) {
      image.sizes = CARD_IMAGE_SIZES
      image.srcset = resolved.srcset
    }
    image.src = resolved.src
  }
}

/** Runs preloadWorkImages once the browser is idle after the first render. */
export function preloadWorkImagesWhenIdle() {
  const idle =
    window.requestIdleCallback ??
    ((callback: () => void) => window.setTimeout(callback, 1500))
  idle(() => preloadWorkImages())
}
