import { WorkMasonry } from "../components/WorkMasonry"
import { siteData } from "../data"

export function WorkPage() {
  return (
    <article className="detail-page work-page shell">
      <header className="detail-header">
        <p className="eyebrow">{siteData.workPage.eyebrow}</p>
        <h1>{siteData.workPage.title}</h1>
        <p className="detail-summary">{siteData.workPage.introduction}</p>
      </header>

      <section className="work-project-section">
        <WorkMasonry projects={siteData.projects} />
      </section>
    </article>
  )
}
