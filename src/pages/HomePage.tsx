import { useEffect, useRef } from "react"
import { Link, useOutletContext } from "react-router"
import { ExperienceModal } from "../components/ExperienceModal"
import { ExperienceTimeline } from "../components/ExperienceTimeline"
import { ProjectCard } from "../components/ProjectCard"
import { Reveal } from "../components/Reveal"
import { RotatingRoles } from "../components/RotatingRoles"
import { NavigationLinks, ResumeLink } from "../components/SiteNavigation"
import type { RootOutletContext } from "../components/RootLayout"
import { siteData } from "../data"
import heroPhoto from "../assets/profile-headshot.jpg?w=180;360;540;720&format=webp&quality=82&as=img"
import { HOME_PATH } from "../paths"

export function HomePage() {
  const heroNavigationRef = useRef<HTMLDivElement>(null)
  const { setHeroNavigationVisible, activeNavigationItem } =
    useOutletContext<RootOutletContext>()
  const { about } = siteData
  const selectedProjects = siteData.projects.filter(
    (project) => project.selected,
  )

  useEffect(() => {
    const navigation = heroNavigationRef.current
    if (!navigation) return

    const updateVisibility = () => {
      const bounds = navigation.getBoundingClientRect()
      setHeroNavigationVisible(
        bounds.bottom > 0 && bounds.top < window.innerHeight,
      )
    }

    updateVisibility()

    if (typeof IntersectionObserver === "undefined") {
      window.addEventListener("scroll", updateVisibility, { passive: true })
      window.addEventListener("resize", updateVisibility)
      return () => {
        window.removeEventListener("scroll", updateVisibility)
        window.removeEventListener("resize", updateVisibility)
      }
    }

    const observer = new IntersectionObserver(updateVisibility, {
      threshold: 0,
    })
    observer.observe(navigation)

    return () => observer.disconnect()
  }, [setHeroNavigationVisible])

  return (
    <>
      <section
        className="intro shell"
        id="intro"
        aria-label={siteData.home.introLabel}
      >
        <div className="hero-navigation" ref={heroNavigationRef}>
          <Link
            className="hero-wordmark"
            to={HOME_PATH}
            aria-label={siteData.navigation.homeLabel}
          >
            {siteData.person.name}
          </Link>
          <div className="hero-navigation-actions">
            <NavigationLinks
              className="hero-navigation-links"
              activeItem={activeNavigationItem}
            />
            <ResumeLink className="hero-resume" />
          </div>
        </div>
        <div className="intro-layout">
          <div className="intro-content">
            <p className="eyebrow">{siteData.person.eyebrow}</p>
            <h1>{siteData.person.name}</h1>
            <p className="intro-name-note" lang="ko">
              {siteData.person.nameNote}
            </p>
            <RotatingRoles />
            <p className="intro-statement">{siteData.person.statement}</p>
            <p className="intro-supporting">{siteData.person.supporting}</p>
            <div className="text-links">
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
            </div>
          </div>
          <div className="intro-figure">
            <img
              className="intro-photo"
              src={heroPhoto.src}
              srcSet={heroPhoto.srcset}
              sizes="(max-width: 800px) 180px, 360px"
              width={heroPhoto.w}
              height={heroPhoto.h}
              alt={siteData.person.photo.alt}
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      <section className="section shell" id="work">
        <Reveal>
          <div className="section-heading">
            <p className="eyebrow">{siteData.home.selectedWork.eyebrow}</p>
            <h2>{siteData.home.selectedWork.title}</h2>
            <p>{siteData.home.selectedWork.description}</p>
          </div>
        </Reveal>
        <div className="project-grid">
          {selectedProjects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 80}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
        <Link className="text-link see-all-work" to="/work">
          {siteData.home.selectedWork.seeAllLabel}{" "}
          <span aria-hidden="true">{siteData.labels.symbols.next}</span>
        </Link>
      </section>

      <section className="section shell experience-section" id="experience">
        <Reveal>
          <div className="section-heading">
            <p className="eyebrow">{siteData.home.experience.eyebrow}</p>
            <h2>{siteData.home.experience.title}</h2>
          </div>
        </Reveal>
        <ExperienceTimeline />
      </section>
      <ExperienceModal />

      <section className="section shell about-section" id="about">
        <Reveal>
          <div className="section-heading">
            <p className="eyebrow">{about.eyebrow}</p>
            <h2>{about.title}</h2>
          </div>
        </Reveal>
        <div className="about-layout">
          <Reveal>
            <div className="about-bio">
              {about.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="about-facts">
              <section aria-labelledby="education-title">
                <p className="eyebrow" id="education-title">
                  {about.education.title}
                </p>
                <ul className="award-list">
                  {about.education.items.map((item) => (
                    <li key={item.school}>
                      <p className="award-name">{item.school}</p>
                      <p className="award-context">
                        {[item.program, item.detail]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <p className="award-context">
                        {[item.dates, item.note].filter(Boolean).join(" · ")}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="skills-title">
                <p className="eyebrow" id="skills-title">
                  {about.skills.title}
                </p>
                <dl className="skill-list">
                  {about.skills.groups
                    .filter((group) => group.value.trim())
                    .map((group) => (
                      <div key={group.label}>
                        <dt>{group.label}</dt>
                        <dd>{group.value}</dd>
                      </div>
                    ))}
                </dl>
              </section>

              <section aria-labelledby="awards-title">
                <p className="eyebrow" id="awards-title">
                  {siteData.awards.title}
                </p>
                <ul className="award-list">
                  {siteData.awards.items.map((award) => (
                    <li key={award.name + award.context}>
                      <p className="award-name">
                        {award.name}
                        {award.detail && (
                          <span className="award-detail">
                            {" "}
                            · {award.detail}
                          </span>
                        )}
                      </p>
                      <p className="award-context">
                        {[award.context, award.date]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="contact-title">
                <p className="eyebrow" id="contact-title">
                  {about.contactTitle}
                </p>
                <div className="text-links about-contact">
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
                </div>
              </section>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
