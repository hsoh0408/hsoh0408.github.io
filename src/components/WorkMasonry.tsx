import { useLayoutEffect, useRef } from "react"
import type { Project } from "../data"
import { ProjectCard } from "./ProjectCard"
import { Reveal } from "./Reveal"

const GAP = 24

function getColumnCount() {
  if (window.innerWidth <= 640) return 1
  if (window.innerWidth <= 1000) return 2
  return 3
}

export function WorkMasonry({ projects }: { projects: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationFrame = 0

    const layoutItems = () => {
      const items = itemRefs.current
      const columnCount = getColumnCount()
      const columnWidth =
        (container.getBoundingClientRect().width - GAP * (columnCount - 1)) /
        columnCount
      const columnHeights = Array<number>(columnCount).fill(0)

      container.dataset.masonryReady = "true"

      // Write all widths, read all heights in one pass (a single forced
      // layout), then write positions. Interleaving reads and writes forced a
      // layout per card.
      items.forEach((item) => {
        if (item) item.style.width = `${columnWidth}px`
      })

      const heights = items.map((item) => item?.offsetHeight ?? 0)

      items.forEach((item, index) => {
        if (!item) return

        const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights))
        const left = shortestColumn * (columnWidth + GAP)
        const top = columnHeights[shortestColumn]

        item.style.left = `${left}px`
        item.style.top = `${top}px`
        columnHeights[shortestColumn] = top + heights[index] + GAP
      })

      container.style.height = `${Math.max(...columnHeights) - GAP}px`
    }

    const scheduleLayout = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(layoutItems)
    }

    const resizeObserver = new ResizeObserver(scheduleLayout)
    resizeObserver.observe(container)
    itemRefs.current.forEach((item) => {
      if (item) resizeObserver.observe(item)
    })
    window.addEventListener("resize", scheduleLayout)
    // Lay out synchronously on mount, before the browser paints or the page
    // transition captures the new page. requestAnimationFrame doesn't run
    // while a view transition is updating, so a deferred first layout made
    // cards jump into place mid-slide.
    layoutItems()
    document.fonts?.ready.then(scheduleLayout)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      window.removeEventListener("resize", scheduleLayout)
    }
  }, [projects])

  return (
    <div className="work-masonry" ref={containerRef}>
      {projects.map((project, index) => (
        <div
          className="work-masonry-item"
          key={project.slug}
          ref={(element) => {
            itemRefs.current[index] = element
          }}
        >
          <Reveal delay={index * 80}>
            <ProjectCard
              project={project}
              description={project.workDescription}
            />
          </Reveal>
        </div>
      ))}
    </div>
  )
}
