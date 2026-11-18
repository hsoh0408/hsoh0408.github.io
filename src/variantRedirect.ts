import { IS_GENSLER } from "./variant"

// GitHub Pages serves the root 404.html (the main build) for any missing
// path, including deep links into the Gensler build at /gensler/…. Hand those
// to the Gensler build, which restores the original path below.
const GENSLER_BASE = "/gensler/"
const REDIRECT_PARAM = "p"
if (!IS_GENSLER && window.location.pathname.startsWith(GENSLER_BASE)) {
  const { pathname, search, hash } = window.location
  const rest = pathname.slice(GENSLER_BASE.length) + search + hash
  window.location.replace(
    `${GENSLER_BASE}?${REDIRECT_PARAM}=${encodeURIComponent(rest)}`,
  )
} else if (IS_GENSLER) {
  const redirect = new URLSearchParams(window.location.search).get(
    REDIRECT_PARAM,
  )
  if (redirect !== null) {
    window.history.replaceState(null, "", GENSLER_BASE + redirect)
  }
}
