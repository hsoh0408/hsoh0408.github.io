import { Link } from "react-router"
import { siteData } from "../data"
import { HOME_PATH } from "../paths"

export function NotFoundPage() {
  return (
    <section className="not-found shell">
      <p className="eyebrow">{siteData.labels.notFoundCode}</p>
      <h1>{siteData.labels.notFoundTitle}</h1>
      <p>{siteData.labels.notFoundBody}</p>
      <Link className="text-link" to={HOME_PATH}>
        {siteData.labels.returnHome}{" "}
        <span aria-hidden="true">{siteData.labels.symbols.next}</span>
      </Link>
    </section>
  )
}
