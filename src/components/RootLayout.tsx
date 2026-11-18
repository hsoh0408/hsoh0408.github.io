import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import {
  Link,
  Outlet,
  useBlocker,
  useLocation,
  type BlockerFunction,
} from "react-router"
import { siteData } from "../data"
import { isExperienceModalHash } from "./ExperienceModal"
import { preloadWorkImagesWhenIdle } from "../preloadWorkImages"
import { CursorConfetti } from "./CursorConfetti"
import { DocumentLinks, NavigationLinks } from "./SiteNavigation"
import { HOME_PATH } from "../paths"

export type RootOutletContext = {
  setHeroNavigationVisible: (visible: boolean) => void
  activeNavigationItem: string | null
}

type TransitionIntent = {
  direction: "to-work" | "to-home"
  historyAction: string
  hash: string
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (
    update: () => void | Promise<void>,
  ) => { finished: Promise<void> }
}

export function RootLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroNavigationVisible, setHeroNavigationVisible] = useState(true)
  const [activeHomeSection, setActiveHomeSection] = useState<string | null>(
    "About",
  )
  const location = useLocation()
  const transitionIntent = useRef<TransitionIntent | null>(null)
  const transitionRunning = useRef(false)
  const homeScrollPosition = useRef(0)
  const previousLocation = useRef(location)
  const resolveRouteCommit = useRef<(() => void) | null>(null)
  const isHome = location.pathname === HOME_PATH
  const compactNavigationVisible = !isHome || !heroNavigationVisible
  const activeNavigationItem = isHome
    ? activeHomeSection
    : location.pathname === "/work" ||
        location.pathname.startsWith("/projects/")
      ? "Work"
      : location.pathname.startsWith("/experience/")
        ? "Experience"
        : null
  const blocker = useBlocker(
    useCallback<BlockerFunction>(({ currentLocation, nextLocation, historyAction }) => {
      const isHomeWorkTransition =
        (currentLocation.pathname === HOME_PATH &&
          nextLocation.pathname === "/work") ||
        (currentLocation.pathname === "/work" &&
          nextLocation.pathname === HOME_PATH)

      if (!isHomeWorkTransition || transitionRunning.current) return false

      transitionIntent.current = {
        direction: nextLocation.pathname === "/work" ? "to-work" : "to-home",
        historyAction,
        hash: nextLocation.hash,
      }
      return true
    }, []),
  )

  useEffect(() => {
    setMenuOpen(false)

    // Opening, closing, or switching the experience modal only changes the
    // hash; keep the home page exactly where it is.
    const from = previousLocation.current
    previousLocation.current = location
    if (
      location.pathname === HOME_PATH &&
      from.pathname === HOME_PATH &&
      (isExperienceModalHash(location.hash) || isExperienceModalHash(from.hash))
    ) {
      return
    }

    if (location.pathname === HOME_PATH) setHeroNavigationVisible(true)
    let scrollFrame = 0

    if (
      location.pathname === HOME_PATH &&
      location.hash &&
      !transitionRunning.current
    ) {
      scrollFrame = window.requestAnimationFrame(() => {
        const target = document.getElementById(location.hash.slice(1))
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches
        target?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        })
      })
    } else if (!location.hash && !transitionRunning.current) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return () => window.cancelAnimationFrame(scrollFrame)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!isHome) {
      setActiveHomeSection(null)
      return
    }

    let updateFrame = 0

    const updateActiveSection = () => {
      window.cancelAnimationFrame(updateFrame)
      updateFrame = window.requestAnimationFrame(() => {
        const about = document.getElementById("about")
        const experience = document.getElementById("experience")
        const marker = Math.min(window.innerHeight * 0.36, 320)
        let nextActiveSection: string | null = null

        if (experience) {
          const bounds = experience.getBoundingClientRect()
          if (bounds.top <= marker && bounds.bottom > marker) {
            nextActiveSection = "Experience"
          }
        }

        if (!nextActiveSection && about) {
          const bounds = about.getBoundingClientRect()
          if (bounds.top <= marker && bounds.bottom > marker) {
            nextActiveSection = "About"
          }
        }

        setActiveHomeSection((current) =>
          current === nextActiveSection ? current : nextActiveSection,
        )
      })
    }

    updateActiveSection()
    window.addEventListener("scroll", updateActiveSection, { passive: true })
    window.addEventListener("resize", updateActiveSection)

    return () => {
      window.cancelAnimationFrame(updateFrame)
      window.removeEventListener("scroll", updateActiveSection)
      window.removeEventListener("resize", updateActiveSection)
    }
  }, [isHome])

  useEffect(() => {
    preloadWorkImagesWhenIdle()
  }, [])

  // Signals the view-transition update callback that React has committed the
  // new route to the DOM. Layout effects run synchronously after the DOM
  // mutation, so this works while the browser has rendering suppressed.
  useLayoutEffect(() => {
    resolveRouteCommit.current?.()
    resolveRouteCommit.current = null
  }, [location])

  // Layout effect (not passive) so the view transition starts in the same
  // frame as the click instead of one frame later.
  useLayoutEffect(() => {
    if (blocker.state !== "blocked" || transitionRunning.current) return

    const intent = transitionIntent.current
    if (!intent) {
      blocker.proceed()
      return
    }

    transitionRunning.current = true
    if (intent.direction === "to-work") {
      homeScrollPosition.current = window.scrollY
    }

    const root = document.documentElement
    root.dataset.pageTransition = intent.direction
    root.dataset.pageTransitionActive = "true"

    const setScrollPosition = (top: number) => {
      // Pass behavior: "instant" explicitly. Temporarily overriding the inline
      // scroll-behavior isn't enough inside a view-transition update: Chrome
      // still used the stylesheet's `scroll-behavior: smooth`, so the incoming
      // page kept smooth-scrolling for ~850ms while (and after) it slid in.
      const previousBehavior = root.style.scrollBehavior
      root.style.scrollBehavior = "auto"
      window.scrollTo({ top, left: 0, behavior: "instant" })
      root.style.scrollBehavior = previousBehavior
    }

    const commitNavigation = async () => {
      // Don't await requestAnimationFrame here: browsers suppress rendering
      // (and therefore rAF) while a view transition's update callback is
      // pending, which stalled every transition until the 4s timeout.
      // Wait for the route commit instead, with a short macrotask fallback.
      const routeCommitted = new Promise<void>((resolve) => {
        resolveRouteCommit.current = resolve
        window.setTimeout(resolve, 300)
      })
      blocker.proceed()
      await routeCommitted
      resolveRouteCommit.current = null

      if (intent.direction === "to-work") {
        setScrollPosition(0)
      } else if (intent.historyAction === "POP") {
        setScrollPosition(homeScrollPosition.current)
      } else {
        setScrollPosition(0)
      }
    }

    const finishTransition = () => {
      delete root.dataset.pageTransition
      delete root.dataset.pageTransitionActive
      transitionRunning.current = false
      window.dispatchEvent(new Event("portfolio-page-transition-end"))

      if (
        intent.direction === "to-home" &&
        intent.historyAction !== "POP" &&
        intent.hash
      ) {
        const target = document.getElementById(intent.hash.slice(1))
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches
        target?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        })
      }
    }

    const viewTransitionDocument = document as ViewTransitionDocument
    const startViewTransition = viewTransitionDocument.startViewTransition

    if (!startViewTransition) {
      void commitNavigation().finally(finishTransition)
      return
    }

    try {
      const viewTransition = startViewTransition.call(
        document,
        commitNavigation,
      )
      void viewTransition.finished.finally(finishTransition)
    } catch {
      void commitNavigation().finally(finishTransition)
    }
  }, [blocker])

  useEffect(() => {
    if (!compactNavigationVisible) setMenuOpen(false)
  }, [compactNavigationVisible])

  return (
    <>
      <CursorConfetti />
      <a className="skip-link" href="#main-content">
        {siteData.labels.skipToContent}
      </a>
      <header
        className={`site-header ${
          compactNavigationVisible ? "is-visible" : ""
        }`}
        aria-hidden={!compactNavigationVisible}
        inert={!compactNavigationVisible ? true : undefined}
      >
        <div className="header-inner">
          <Link
            className="wordmark"
            to={HOME_PATH}
            aria-label={siteData.navigation.homeLabel}
          >
            {siteData.person.name}
          </Link>
          <div className="nav-actions">
            <NavigationLinks
              className={`desktop-nav ${menuOpen ? "is-open" : ""}`}
              activeItem={activeNavigationItem}
            />
            <DocumentLinks />
            <button
              className="menu-button"
              type="button"
              aria-expanded={menuOpen}
              aria-label={
                menuOpen
                  ? siteData.navigation.closeLabel
                  : siteData.navigation.menuLabel
              }
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <main id="main-content" className={isHome ? "home-main" : "detail-main"}>
        <Outlet
          context={
            {
              setHeroNavigationVisible,
              activeNavigationItem,
            } satisfies RootOutletContext
          }
        />
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <p className="footer-prompt">{siteData.footer.prompt}</p>
            <p className="footer-note">{siteData.footer.note}</p>
          </div>
          <div className="footer-actions">
            <a href={siteData.person.email.href}>
              {siteData.person.email.label}
            </a>
            <a
              href={siteData.person.linkedin.href}
              target="_blank"
              rel="noreferrer"
            >
              {siteData.person.linkedin.label}
            </a>
            <DocumentLinks />
          </div>
        </div>
        <div className="footer-meta">{siteData.footer.copyright}</div>
      </footer>
    </>
  )
}
