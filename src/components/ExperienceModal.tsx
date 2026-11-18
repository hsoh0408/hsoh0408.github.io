import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react"
import { Link, useLocation, useNavigate } from "react-router"
import { siteData, type Experience } from "../data"
import { HOME_PATH } from "../paths"

/**
 * Experience details open in a modal over the home page. The open experience
 * lives in the URL hash (/#experience/<slug>) so each one stays shareable.
 */
export const EXPERIENCE_HASH_PREFIX = "#experience/"

// Matches the close animation in index.css.
const CLOSE_DURATION = 200

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** History state marking that the modal was opened from within the site. */
export type ExperienceModalState = { experienceModal: true }

export const experienceModalLocation = (slug: string) => ({
  pathname: HOME_PATH,
  hash: `${EXPERIENCE_HASH_PREFIX}${slug}`,
})

export function isExperienceModalHash(hash: string) {
  return hash.startsWith(EXPERIENCE_HASH_PREFIX)
}

function slugFromHash(hash: string) {
  if (!isExperienceModalHash(hash)) return null
  try {
    return decodeURIComponent(hash.slice(EXPERIENCE_HASH_PREFIX.length))
  } catch {
    return null
  }
}

const orderedExperiences = [...siteData.experiences].sort(
  (a, b) => a.order - b.order,
)

// The timeline entry that opened the modal, so focus can return to it.
let lastOpener: HTMLElement | null = null

export function rememberExperienceOpener(element: HTMLElement) {
  lastOpener = element
}

export function ExperienceModal() {
  const location = useLocation()
  const navigate = useNavigate()
  const slug = slugFromHash(location.hash)
  const current = slug
    ? (orderedExperiences.find((item) => item.slug === slug) ?? null)
    : null

  // Keeps the last experience rendered while the close animation plays.
  const [lastShown, setLastShown] = useState<Experience | null>(current)
  const closeRequested = useRef(false)

  useEffect(() => {
    closeRequested.current = false
    if (current) setLastShown(current)
  }, [current])

  useEffect(() => {
    if (current || !lastShown) return
    const timeout = window.setTimeout(() => setLastShown(null), CLOSE_DURATION)
    return () => window.clearTimeout(timeout)
  }, [current, lastShown])

  const openedInSite = Boolean(
    (location.state as Partial<ExperienceModalState> | null)?.experienceModal,
  )

  const requestClose = useCallback(() => {
    if (closeRequested.current) return
    closeRequested.current = true
    // Opened from the timeline: step back, so the back button and the close
    // button behave the same. Opened from a shared link: drop the hash.
    if (openedInSite) navigate(-1)
    else navigate({ pathname: HOME_PATH, hash: "" }, { replace: true })
  }, [navigate, openedInSite])

  const goTo = useCallback(
    (target: Experience) => {
      // Replace, so back still closes the modal instead of stepping through
      // every experience viewed.
      navigate(experienceModalLocation(target.slug), {
        replace: true,
        state: location.state,
      })
    },
    [location.state, navigate],
  )

  const experience = current ?? lastShown
  if (!experience) return null

  return (
    <ExperienceDialog
      experience={experience}
      closing={!current}
      onRequestClose={requestClose}
      onNavigate={goTo}
    />
  )
}

function ExperienceDialog({
  experience,
  closing,
  onRequestClose,
  onNavigate,
}: {
  experience: Experience
  closing: boolean
  onRequestClose: () => void
  onNavigate: (experience: Experience) => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const scrimPointerDown = useRef(false)
  const { labels } = siteData

  // Open as a modal dialog (the rest of the page becomes inert), lock
  // background scrolling, and restore both plus focus on unmount.
  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const root = document.documentElement
    const scrollbarWidth = window.innerWidth - root.clientWidth
    const previousOverflow = root.style.overflow
    const previousPaddingRight = root.style.paddingRight
    root.style.overflow = "hidden"
    if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`

    const opener = lastOpener
    if (!dialog.open) dialog.showModal()

    return () => {
      if (dialog.open) dialog.close()
      root.style.overflow = previousOverflow
      root.style.paddingRight = previousPaddingRight

      const fallback = document.querySelector<HTMLElement>(
        `[data-experience-slug="${CSS.escape(experience.slug)}"]`,
      )
      const target = opener?.isConnected ? opener : fallback
      target?.focus({ preventScroll: Boolean(opener?.isConnected) })
      lastOpener = null
    }
    // Runs once per open; the experience shown can change while open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // New experience via previous/next: start reading from the top.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [experience.slug])

  const index = orderedExperiences.findIndex(
    (item) => item.slug === experience.slug,
  )
  const count = orderedExperiences.length
  const previous = orderedExperiences[(index - 1 + count) % count]
  const next = orderedExperiences[(index + 1) % count]

  const relatedProject = experience.relatedProject
    ? siteData.projects.find((item) => item.slug === experience.relatedProject)
    : undefined

  const sections = [
    { title: labels.whatIDid, items: experience.whatIDid },
    { title: labels.impact, items: experience.result },
    { title: labels.learned, items: experience.learned },
  ]
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.trim()),
    }))
    .filter((section) => section.items.length > 0)

  const details = [experience.dates, experience.location]
    .filter((value) => value?.trim())
    .join(" · ")

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      event.preventDefault()
      onRequestClose()
      return
    }

    if (event.key !== "Tab") return
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
    )
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement

    if (event.shiftKey && (active === first || active === dialogRef.current)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="experience-modal"
      data-closing={closing ? "" : undefined}
      aria-labelledby="experience-modal-title"
      onKeyDown={handleKeyDown}
      onCancel={(event) => {
        event.preventDefault()
        onRequestClose()
      }}
      onClose={() => {
        // The browser can force-close a dialog (e.g. a repeated Esc). Skip
        // when it is open again (StrictMode re-runs the open effect).
        if (!closing && !dialogRef.current?.open) onRequestClose()
      }}
    >
      <div
        className="experience-modal-scrim"
        aria-hidden="true"
        onPointerDown={() => {
          scrimPointerDown.current = true
        }}
        onClick={() => {
          if (scrimPointerDown.current) onRequestClose()
          scrimPointerDown.current = false
        }}
      />
      <div
        className="experience-modal-panel"
        onPointerDown={() => {
          scrimPointerDown.current = false
        }}
      >
        <header className="experience-modal-header">
          <button
            className="experience-modal-close"
            type="button"
            aria-label={labels.closeExperience}
            onClick={onRequestClose}
          >
            <span aria-hidden="true">×</span>
          </button>
          {details && <p className="eyebrow">{details}</p>}
          <h2 id="experience-modal-title">{experience.role}</h2>
          <p className="experience-modal-org">{experience.organization}</p>
        </header>

        <div className="experience-modal-body" ref={bodyRef}>
          {sections.map((section) => (
            <section key={section.title}>
              <h3>{section.title}</h3>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}

          {relatedProject && (
            <section className="experience-modal-related">
              <h3>{labels.relatedProject}</h3>
              <Link
                className="experience-related-link"
                to={`/projects/${relatedProject.slug}`}
                replace
              >
                <strong>{relatedProject.title}</strong>
                <span>{relatedProject.subtitle}</span>
                <span className="see-more">
                  {labels.seeMore}{" "}
                  <span aria-hidden="true">{labels.symbols.next}</span>
                </span>
              </Link>
            </section>
          )}
        </div>

        {count > 1 && (
          <nav
            className="experience-modal-pagination"
            aria-label={labels.experienceNavigation}
          >
            <button type="button" onClick={() => onNavigate(previous)}>
              <span>
                <span aria-hidden="true">{labels.symbols.previous}</span>{" "}
                {labels.previousExperience}
              </span>
              <strong>{previous.role}</strong>
            </button>
            <button type="button" onClick={() => onNavigate(next)}>
              <span>
                {labels.nextExperience}{" "}
                <span aria-hidden="true">{labels.symbols.next}</span>
              </span>
              <strong>{next.role}</strong>
            </button>
          </nav>
        )}
      </div>
    </dialog>
  )
}
