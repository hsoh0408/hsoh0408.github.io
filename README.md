# Portfolio


Personal portfolio site — React + Vite + Tailwind CSS v4, deployed to
GitHub Pages at https://hsoh0408.github.io/.

## Develop

```sh
npm install
npm run dev       # http://localhost:5173/
npm run build     # outputs dist/ (includes 404.html SPA fallback)
npm run preview   # http://localhost:4173/
```

## Assets

Put files in `public/` and reference them in `src/data.ts` with `asset("...")`
so they resolve under the Vite base path (`/`):

- `public/images/profile-cutout.png` — profile photo
- `public/Hazel-Oh-Resume.pdf` — resume

## Gensler version

`npm run build` also builds a Gensler-only copy of the site into
`dist/gensler/`, served at https://hsoh0408.github.io/gensler/. It is the same
site plus a Cover Letter button on the landing page and next to every Resume
button. The cover letter lives in `variants/gensler/` so it never ships with
the main site. Run it locally with `npm run dev:gensler`.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site
and publishes `dist/` to GitHub Pages. In the repo settings, set
**Settings → Pages → Source** to **GitHub Actions** (one time).
