import { Link, Navigate, useLocation } from "react-router"
import headshot from "../assets/profile-headshot.jpg?w=180;360;540;720&format=webp&quality=82&as=img"
import { siteData } from "../data"
import { HOME_PATH } from "../paths"
import { IS_GENSLER } from "../variant"

/**
 * The front door: a short, Linktree-style chooser between the portfolio,
 * LinkedIn, and the resume (plus the cover letter in the Gensler build).
 */
export function LandingPage() {
  const { hash } = useLocation()
  const { person, landing, resume, coverLetter } = siteData

  // Old links like /#about or /#experience/… still reach the right place.
  if (hash) return <Navigate to={{ pathname: HOME_PATH, hash }} replace />

  return (
    <main className="landing">
      <div className="landing-card">
        <div className="landing-photo">
          <img
            src={headshot.src}
            srcSet={headshot.srcset}
            sizes="160px"
            width={headshot.w}
            height={headshot.h}
            alt={person.photo.alt}
            decoding="async"
            fetchPriority="high"
          />
        </div>
        <p className="eyebrow">{person.eyebrow}</p>
        <h1>{person.name}</h1>
        <p className="landing-name-note" lang="ko">
          {person.nameNote}
        </p>

        <p className="landing-prompt">{landing.prompt}</p>
        <nav className="landing-links" aria-label={landing.prompt}>
          <Link className="landing-link landing-link-primary" to={HOME_PATH}>
            <span className="landing-link-text">
              <strong>{landing.portfolio.label}</strong>
              <span>{landing.portfolio.note}</span>
            </span>
            <span className="landing-link-arrow" aria-hidden="true">
              →
            </span>
          </Link>
          <a
            className="landing-link"
            href={person.linkedin.href}
            target="_blank"
            rel="noreferrer"
          >
            <span className="landing-link-text">
              <strong>{person.linkedin.label}</strong>
              <span>{landing.linkedin.note}</span>
            </span>
            <span className="landing-link-arrow" aria-hidden="true">
              ↗
            </span>
            <span className="sr-only">({landing.newTab})</span>
          </a>
          <a
            className="landing-link"
            href={resume.href}
            target="_blank"
            rel="noreferrer"
          >
            <span className="landing-link-text">
              <strong>{resume.label}</strong>
              <span>{landing.resume.note}</span>
            </span>
            <span className="landing-link-arrow" aria-hidden="true">
              ↗
            </span>
            <span className="sr-only">({landing.newTab})</span>
          </a>
          {IS_GENSLER && (
            <a
              className="landing-link"
              href={coverLetter.href}
              target="_blank"
              rel="noreferrer"
            >
              <span className="landing-link-text">
                <strong>{coverLetter.label}</strong>
                <span>{landing.coverLetter.note}</span>
              </span>
              <span className="landing-link-arrow" aria-hidden="true">
                ↗
              </span>
              <span className="sr-only">({landing.newTab})</span>
            </a>
          )}
        </nav>
      </div>
    </main>
  )
}
