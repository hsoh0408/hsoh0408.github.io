import { Link, useParams } from "react-router"
import { ImageLightbox } from "../components/ImageLightbox"
import { ProjectImage } from "../components/ProjectImage"
import { siteData } from "../data"
import type { Block, Decision, ImageRef, ListItem } from "../projects"
import { NotFoundPage } from "./NotFoundPage"
import { HOME_PATH } from "../paths"

export function ProjectPage() {
  const { slug } = useParams()
  const projects = siteData.projects
  const projectIndex = projects.findIndex((item) => item.slug === slug)
  const project = projects[projectIndex]

  if (!project) return <NotFoundPage />

  const previous =
    projects[(projectIndex - 1 + projects.length) % projects.length]
  const next = projects[(projectIndex + 1) % projects.length]
  const { labels } = siteData

  return (
    <article className="detail-page shell">
      <Link className="back-link" to={`${HOME_PATH}#work`}>
        <span aria-hidden="true">{labels.symbols.previous}</span>{" "}
        {labels.backToWork}
      </Link>
      <header className="detail-header">
        <p className="eyebrow">{project.subtitle}</p>
        <h1>{project.title}</h1>
        <p className="detail-summary">{project.summaryLine}</p>
        {project.disclaimer && (
          <p className="project-disclaimer">{project.disclaimer}</p>
        )}
        <dl className="project-meta">
          {project.meta.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
        {project.links.length > 0 && (
          <nav className="project-links" aria-label={labels.projectLinks}>
            {project.links.map((link) => (
              <a
                className="button-primary"
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}{" "}
                <span aria-hidden="true" className="external-arrow">
                  ↗
                </span>
              </a>
            ))}
          </nav>
        )}
      </header>

      <section className="project-summary" aria-labelledby="project-summary">
        <p className="eyebrow" id="project-summary">
          {labels.summary}
        </p>
        <dl>
          <div>
            <dt>{labels.summaryProblem}</dt>
            <dd>{project.summary.problem}</dd>
          </div>
          <div>
            <dt>{labels.summaryWhatIDid}</dt>
            <dd>{project.summary.whatIDid}</dd>
          </div>
          <div>
            <dt>{labels.summaryResult}</dt>
            <dd>{project.summary.result}</dd>
          </div>
        </dl>
      </section>

      {project.hero && (
        <ProjectImage
          image={project.hero}
          variant="hero"
          className="detail-hero"
          priority
        />
      )}

      <div className="detail-layout">
        <aside className="toc">
          <p>{labels.contents}</p>
          <nav aria-label={labels.contents}>
            {project.sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="detail-content">
          {project.sections.map((section, index) => (
            <section id={section.id} key={section.id}>
              <p className="section-number">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2>{section.title}</h2>
              {section.blocks.map((block, blockIndex) => (
                <ContentBlock block={block} key={blockIndex} />
              ))}
            </section>
          ))}
        </div>
      </div>

      <nav className="project-pagination" aria-label={labels.projectNavigation}>
        <Link to={`/projects/${previous.slug}`} viewTransition>
          <span>{labels.previous}</span>
          <strong>
            {labels.symbols.previous} {previous.title}
          </strong>
        </Link>
        <Link to={`/projects/${next.slug}`} viewTransition>
          <span>{labels.next}</span>
          <strong>
            {next.title} {labels.symbols.next}
          </strong>
        </Link>
      </nav>
    </article>
  )
}

function ContentBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":
      return <p>{block.text}</p>
    case "list":
      return <ItemList items={block.items} className="content-list" />
    case "steps":
      return <ItemList items={block.items} className="steps-list" ordered />
    case "decisions":
      return (
        <div className="decision-list">
          {block.items.map((decision) => (
            <DecisionCard decision={decision} key={decision.title} />
          ))}
        </div>
      )
    case "table":
      return (
        <div className="content-table-wrap">
          <table className="content-table">
            <caption className="sr-only">{block.caption}</caption>
            <thead>
              <tr>
                {block.columns.map((column) => (
                  <th scope="col" key={column}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")}>
                  {row.map((cell, cellIndex) =>
                    cellIndex === 0 ? (
                      <th scope="row" key={cell}>
                        {cell}
                      </th>
                    ) : (
                      <td key={cell}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case "image":
      return <Figure image={block.image} />
    case "lightbox":
      return <ImageLightbox heading={block.heading} image={block.image} />
    case "video":
      return (
        <figure className="video-embed">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${block.youtubeId}`}
            title={block.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </figure>
      )
  }
}

function DecisionCard({ decision }: { decision: Decision }) {
  return (
    <div className="decision">
      <h3>{decision.title}</h3>
      <p>{decision.text}</p>
      {decision.items && (
        <ItemList items={decision.items} className="content-list" />
      )}
      {decision.image && <Figure image={decision.image} />}
      {decision.images?.map((image) => (
        <Figure image={image} key={image.file} />
      ))}
      {decision.rejected && (
        <div className="rejected">
          <strong>{siteData.labels.rejected}</strong>
          <p>{decision.rejected}</p>
        </div>
      )}
    </div>
  )
}

function Figure({ image }: { image: ImageRef }) {
  return (
    <figure className="content-figure">
      <ProjectImage image={image} variant="figure" />
    </figure>
  )
}

function ItemList({
  items,
  className,
  ordered = false,
}: {
  items: ListItem[]
  className: string
  ordered?: boolean
}) {
  const children = items.map((item, index) => {
    if (typeof item === "string") return <li key={index}>{item}</li>
    return (
      <li key={index}>
        {item.label && <strong>{item.label}</strong>}
        {item.label && item.text && ": "}
        {item.text}
        {item.items && <ItemList items={item.items} className={className} />}
      </li>
    )
  })

  return ordered ? (
    <ol className={className}>{children}</ol>
  ) : (
    <ul className={className}>{children}</ul>
  )
}
