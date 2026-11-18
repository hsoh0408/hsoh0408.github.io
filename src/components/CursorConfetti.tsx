import { useEffect, useRef } from "react"

const MAX_PARTICLES = 24
const PARTICLE_LIFETIME = 800
const CONFETTI_COLORS = [
  "var(--color-accent-pink)",
  "var(--color-confetti-lavender)",
  "var(--color-accent-blue)",
]
const SVG_NAMESPACE = "http://www.w3.org/2000/svg"

export function CursorConfetti() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let lastX = 0
    let lastY = 0
    let lastTime = 0

    const clearParticles = () => container.replaceChildren()

    const handlePointerMove = (event: PointerEvent) => {
      if (
        !finePointer.matches ||
        reducedMotion.matches ||
        event.pointerType === "touch" ||
        container.childElementCount >= MAX_PARTICLES ||
        // Don't add DOM nodes while a page transition is capturing/animating.
        document.documentElement.dataset.pageTransitionActive === "true"
      ) {
        return
      }

      const now = performance.now()
      const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY)
      if (now - lastTime < 36 || distance < 10) return

      lastX = event.clientX
      lastY = event.clientY
      lastTime = now

      const particle = document.createElementNS(SVG_NAMESPACE, "svg")
      const shapeIndex = Math.floor(Math.random() * 3)
      const size = 12
      const rotation = Math.random() * 180
      const driftAngle = Math.random() * Math.PI * 2
      const driftDistance = 10 + Math.random() * 12
      const shape = document.createElementNS(
        SVG_NAMESPACE,
        shapeIndex === 0 ? "line" : shapeIndex === 1 ? "circle" : "polyline",
      )

      particle.classList.add("cursor-confetti-piece")
      particle.setAttribute("viewBox", "0 0 12 12")
      particle.setAttribute("aria-hidden", "true")
      particle.style.left = `${event.clientX}px`
      particle.style.top = `${event.clientY}px`
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.setProperty(
        "--confetti-x",
        `${Math.cos(driftAngle) * driftDistance}px`,
      )
      particle.style.setProperty(
        "--confetti-y",
        `${Math.sin(driftAngle) * driftDistance}px`,
      )
      particle.style.setProperty("--confetti-start-rotation", `${rotation}deg`)
      particle.style.setProperty(
        "--confetti-end-rotation",
        `${rotation + (Math.random() - 0.5) * 120}deg`,
      )
      shape.setAttribute(
        "stroke",
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      )
      shape.setAttribute("stroke-width", "1.5")
      shape.setAttribute("stroke-linecap", "round")
      shape.setAttribute("stroke-linejoin", "round")
      shape.setAttribute("fill", "none")

      if (shapeIndex === 0) {
        shape.setAttribute("x1", "1")
        shape.setAttribute("y1", "6")
        shape.setAttribute("x2", "11")
        shape.setAttribute("y2", "6")
      } else if (shapeIndex === 1) {
        shape.setAttribute("cx", "6")
        shape.setAttribute("cy", "6")
        shape.setAttribute("r", "4")
      } else {
        shape.setAttribute("points", "6,1 11,10 1,10 6,1")
      }

      particle.appendChild(shape)
      container.appendChild(particle)

      const removeParticle = () => particle.remove()
      particle.addEventListener("animationend", removeParticle, { once: true })
      window.setTimeout(removeParticle, PARTICLE_LIFETIME + 50)
    }

    const handlePreferenceChange = () => {
      if (!finePointer.matches || reducedMotion.matches) clearParticles()
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    finePointer.addEventListener("change", handlePreferenceChange)
    reducedMotion.addEventListener("change", handlePreferenceChange)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      finePointer.removeEventListener("change", handlePreferenceChange)
      reducedMotion.removeEventListener("change", handlePreferenceChange)
      clearParticles()
    }
  }, [])

  return (
    <div ref={containerRef} className="cursor-confetti" aria-hidden="true" />
  )
}
