import { Link } from "react-router"
import { siteData } from "../data"
import { IS_GENSLER } from "../variant"

export function ResumeLink({ className = "" }: { className?: string }) {
  return (
    <a
      className={`button-primary ${className}`}
      href={siteData.resume.href}
      target="_blank"
      rel="noreferrer"
      aria-label={siteData.resume.ariaLabel}
    >
      {siteData.resume.label}
    </a>
  )
}

function CoverLetterLink() {
  return (
    <a
      className="button-secondary"
      href={siteData.coverLetter.href}
      target="_blank"
      rel="noreferrer"
      aria-label={siteData.coverLetter.ariaLabel}
    >
      {siteData.coverLetter.label}
    </a>
  )
}

/** Resume button, plus the cover letter in the Gensler build. */
export function DocumentLinks({ className = "" }: { className?: string }) {
  if (!IS_GENSLER) return <ResumeLink className={className} />
  return (
    <span className="document-links">
      <ResumeLink className={className} />
      <CoverLetterLink />
    </span>
  )
}

export function NavigationLinks({
  className = "",
  activeItem = null,
}: {
  className?: string
  activeItem?: string | null
}) {
  return (
    <nav className={className} aria-label={siteData.labels.primaryNavigation}>
      {siteData.navigation.items.map((item) => {
        const isActive = item.label === activeItem
        return (
          <Link
            className={isActive ? "is-active" : undefined}
            key={item.label}
            to={item.href}
            aria-current={
              isActive
                ? item.label === "Work"
                  ? "page"
                  : "location"
                : undefined
            }
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
