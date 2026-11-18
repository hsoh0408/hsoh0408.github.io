import { Navigate, useParams } from "react-router"
import { experienceModalLocation } from "../components/ExperienceModal"
import { siteData } from "../data"
import { NotFoundPage } from "./NotFoundPage"

/** /experience/:slug → /#experience/:slug (the experience modal). */
export function ExperienceRedirect() {
  const { slug } = useParams()
  const exists = siteData.experiences.some((item) => item.slug === slug)

  if (!slug || !exists) return <NotFoundPage />

  return <Navigate to={experienceModalLocation(slug)} replace />
}
