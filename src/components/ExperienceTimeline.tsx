import { Link } from "react-router"
import { siteData } from "../data"
import {
  experienceModalLocation,
  rememberExperienceOpener,
  type ExperienceModalState,
} from "./ExperienceModal"
import { Reveal } from "./Reveal"

export function ExperienceTimeline() {
  const experiences = [...siteData.experiences].sort(
    (a, b) => a.order - b.order,
  )

  return (
    <ol className="timeline">
      {experiences.map((experience, index) => (
        <li key={experience.slug}>
          <Reveal delay={index * 80}>
            <Link
              className="timeline-entry"
              to={experienceModalLocation(experience.slug)}
              state={{ experienceModal: true } satisfies ExperienceModalState}
              data-experience-slug={experience.slug}
              onClick={(event) => rememberExperienceOpener(event.currentTarget)}
            >
              <span className="timeline-dot" aria-hidden="true" />
              <div className="timeline-content">
                <p className="timeline-date">{experience.dates}</p>
                <h3>{experience.role}</h3>
                <p className="timeline-org">{experience.organization}</p>
                <p className="timeline-impact">{experience.impact}</p>
                <span className="see-more">
                  {siteData.labels.seeMore}{" "}
                  <span aria-hidden="true">{siteData.labels.symbols.next}</span>
                </span>
              </div>
            </Link>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}
