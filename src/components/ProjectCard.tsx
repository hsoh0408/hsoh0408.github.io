import { Link } from "react-router"
import type { Project } from "../data"
import { siteData } from "../data"
import { ProjectImage } from "./ProjectImage"

export function ProjectCard({
  project,
  description = project.homeDescription,
}: {
  project: Project
  description?: string
}) {
  return (
    <Link
      className="project-card"
      to={`/projects/${project.slug}`}
      viewTransition
    >
      <div className="project-image">
        <ProjectImage image={project.thumbnail} variant="card" />
      </div>
      <div className="project-card-body">
        <div>
          <p className="project-role">{project.subtitle}</p>
          <h3>{project.title}</h3>
        </div>
        <p className="project-outcome">{description}</p>
        <ul className="tag-list" aria-label={project.title}>
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <span className="see-more">
          {siteData.labels.seeMore}{" "}
          <span aria-hidden="true">{siteData.labels.symbols.next}</span>
        </span>
      </div>
    </Link>
  )
}
