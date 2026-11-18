import { siteData } from "../data"
import { getProjectImage } from "../projectImages"
import type { ImageRef } from "../projects"

export const CARD_IMAGE_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 600px"
const SIZES = {
  card: CARD_IMAGE_SIZES,
  hero: "(max-width: 1240px) 100vw, 1200px",
  figure: "(max-width: 800px) 100vw, 704px",
  full: "100vw",
}

/**
 * Renders a project image from src/assets/projects/, or a neutral labeled
 * placeholder while the file is missing. Width and height are always set so
 * the space is reserved before the image loads.
 */
export function ProjectImage({
  image,
  variant,
  className = "",
  priority = false,
}: {
  image: ImageRef
  variant: keyof typeof SIZES
  className?: string
  priority?: boolean
}) {
  const resolved = getProjectImage(image.file)

  if (!resolved) {
    return (
      <div
        className={`image-placeholder image-placeholder-${variant} ${className}`}
        role="img"
        aria-label={`${siteData.labels.imageComingSoon}: ${image.label}`}
      >
        <span>{image.label}</span>
      </div>
    )
  }

  return (
    <img
      className={`project-img project-img-${variant} ${
        image.uncropped ? "project-img-uncropped" : ""
      } ${className}`}
      style={image.focus ? { objectPosition: image.focus } : undefined}
      src={resolved.src}
      srcSet={resolved.srcset}
      sizes={resolved.srcset ? SIZES[variant] : undefined}
      width={resolved.w}
      height={resolved.h}
      alt={image.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
    />
  )
}
