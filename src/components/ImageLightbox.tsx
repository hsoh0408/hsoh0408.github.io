import { useEffect, useRef, useState } from "react"
import type { ImageRef } from "../projects"
import { siteData } from "../data"
import { ProjectImage } from "./ProjectImage"

/**
 * A modest inline image that opens full-screen in a modal dialog, so small
 * text (e.g. on a poster) can be read. Esc, the close button, or a click
 * outside the image closes it.
 */
export function ImageLightbox({
  heading,
  image,
}: {
  heading: string
  image: ImageRef
}) {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !open) return

    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = "hidden"
    if (!dialog.open) dialog.showModal()

    return () => {
      if (dialog.open) dialog.close()
      root.style.overflow = previousOverflow
      openerRef.current?.focus({ preventScroll: true })
    }
  }, [open])

  return (
    <div className="lightbox-block">
      <h3 className="lightbox-heading">{heading}</h3>
      <button
        ref={openerRef}
        className="lightbox-trigger"
        type="button"
        aria-haspopup="dialog"
        aria-label={`${image.alt}. ${siteData.labels.openFullScreen}`}
        onClick={() => setOpen(true)}
      >
        <ProjectImage image={image} variant="figure" />
        <span className="lightbox-hint" aria-hidden="true">
          {siteData.labels.openFullScreen}
        </span>
      </button>

      {open && (
        <dialog
          ref={dialogRef}
          className="lightbox"
          aria-label={heading}
          onCancel={(event) => {
            event.preventDefault()
            setOpen(false)
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false)
          }}
        >
          <button
            className="lightbox-close"
            type="button"
            aria-label={siteData.labels.closeFullScreen}
            onClick={() => setOpen(false)}
          >
            <span aria-hidden="true">×</span>
          </button>
          <ProjectImage image={image} variant="full" priority />
        </dialog>
      )}
    </div>
  )
}
