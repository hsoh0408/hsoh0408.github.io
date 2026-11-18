import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"

type RevealStyle = CSSProperties & {
  "--reveal-delay": string
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    const startRevealObserver = () => {
      if (reducedMotion || !("IntersectionObserver" in window)) {
        element.dataset.revealState = "visible"
        return
      }

      let observer: IntersectionObserver | undefined
      let fallback: number | undefined
      let previousScrollY = window.scrollY
      let scrollDirection: "up" | "down" = "down"

      const updateScrollDirection = () => {
        const currentScrollY = window.scrollY
        if (currentScrollY > previousScrollY) scrollDirection = "down"
        if (currentScrollY < previousScrollY) scrollDirection = "up"
        previousScrollY = currentScrollY
      }

      const updateRevealState = (
        isIntersecting: boolean,
        bounds: DOMRectReadOnly,
      ) => {
        if (isIntersecting) {
          if (
            scrollDirection === "down" &&
            element.dataset.revealState === "ready"
          ) {
            element.dataset.revealState = "visible"
          } else if (scrollDirection === "up") {
            element.dataset.revealState = "visible-static"
          }
          return
        }

        if (scrollDirection === "up" && bounds.top >= window.innerHeight) {
          element.dataset.revealState = "ready"
        }
      }

      try {
        const initialBounds = element.getBoundingClientRect()
        element.dataset.revealState =
          initialBounds.top >= window.innerHeight ? "ready" : "visible-static"

        observer = new IntersectionObserver(
          (entries) => {
            const entry = entries[0]
            if (!entry) return
            updateRevealState(entry.isIntersecting, entry.boundingClientRect)
          },
          { threshold: 0 },
        )

        observer.observe(element)
        window.addEventListener("scroll", updateScrollDirection, {
          passive: true,
        })

        fallback = window.setInterval(() => {
          const bounds = element.getBoundingClientRect()
          const isIntersecting =
            bounds.top < window.innerHeight && bounds.bottom > 0
          updateRevealState(isIntersecting, bounds)
        }, 250)
      } catch {
        element.dataset.revealState = "visible"
      }

      return () => {
        observer?.disconnect()
        window.removeEventListener("scroll", updateScrollDirection)
        if (fallback) window.clearInterval(fallback)
      }
    }

    if (
      !reducedMotion &&
      document.documentElement.dataset.pageTransitionActive === "true"
    ) {
      // During a Home <-> Work page transition, stay fully visible so the
      // incoming page slides in complete. Hiding items here made the page slide
      // in empty and then replay reveal animations after the 450ms transition.
      // Once it ends, items on screen stay static and items below the fold
      // switch to "ready" (invisibly) and reveal on scroll as usual.
      let stopObserver: (() => void) | undefined
      const startAfterTransition = () => {
        stopObserver = startRevealObserver()
      }

      window.addEventListener(
        "portfolio-page-transition-end",
        startAfterTransition,
        { once: true },
      )

      return () => {
        window.removeEventListener(
          "portfolio-page-transition-end",
          startAfterTransition,
        )
        stopObserver?.()
      }
    }

    return startRevealObserver()
  }, [])

  return (
    <div
      ref={elementRef}
      className={`reveal-item ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as RevealStyle}
    >
      {children}
    </div>
  )
}
