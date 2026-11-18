import type { Media } from "../data"

export function MediaPlaceholder({
  media,
  className = "",
}: {
  media: Media
  className?: string
}) {
  if (media.src) {
    return (
      <img
        className={className}
        src={media.src}
        alt={media.alt}
        decoding="async"
      />
    )
  }

  return (
    <div
      className={`media-placeholder ${className}`}
      role="img"
      aria-label={media.alt}
    >
      <span>{media.label}</span>
    </div>
  )
}
