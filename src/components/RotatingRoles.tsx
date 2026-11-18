import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { siteData } from "../data"

type RoleState = {
  current: number
  previous: number | null
  cycle: number
}

type FlowWordStyle = CSSProperties & {
  "--flow-index": number
  "--flow-reverse-index": number
  "--role-color": string
}

type CurrentChipStyle = CSSProperties & {
  "--role-color": string
}

const ROLE_TRANSITION_DURATION = 500

function getChipColorClass(color: string) {
  if (color.toUpperCase() === "#DDD6FB") return "role-chip-lavender"
  if (color.toUpperCase() === "#CFE3FC") return "role-chip-blue"
  return "role-chip-pink"
}

export function RotatingRoles() {
  const { prefix, roles, toggleLabel, listLabel } = siteData.person.roleLine
  const [roleState, setRoleState] = useState<RoleState>({
    current: 0,
    previous: null,
    cycle: 0,
  })
  const [interactionActive, setInteractionActive] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [currentChipWidth, setCurrentChipWidth] = useState<number>()
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )
  const roleAnchorRef = useRef<HTMLDivElement>(null)
  const currentChipRef = useRef<HTMLSpanElement>(null)
  const currentRoleRef = useRef<HTMLSpanElement>(null)
  const flowRef = useRef<HTMLDivElement>(null)
  const flowWordRefs = useRef<Array<HTMLSpanElement | null>>([])
  const touchInteraction = useRef(false)
  const exitTimeout = useRef<number | undefined>(undefined)
  const showRoles = interactionActive || expanded
  const otherRoles = roles.filter((_, index) => index !== roleState.current)
  const currentRole = roles[roleState.current]

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    )
    const updateMotionPreference = () =>
      setReducedMotion(motionPreference.matches)

    motionPreference.addEventListener("change", updateMotionPreference)
    return () =>
      motionPreference.removeEventListener("change", updateMotionPreference)
  }, [])

  useEffect(() => {
    if (reducedMotion || showRoles || roles.length < 2) return

    const interval = window.setInterval(() => {
      setRoleState((state) => ({
        current: (state.current + 1) % roles.length,
        previous: state.current,
        cycle: state.cycle + 1,
      }))

      if (exitTimeout.current) window.clearTimeout(exitTimeout.current)
      exitTimeout.current = window.setTimeout(() => {
        setRoleState((state) => ({ ...state, previous: null }))
      }, ROLE_TRANSITION_DURATION)
    }, 2500)

    return () => window.clearInterval(interval)
  }, [reducedMotion, roles.length, showRoles])

  useEffect(
    () => () => {
      if (exitTimeout.current) window.clearTimeout(exitTimeout.current)
    },
    [],
  )

  useLayoutEffect(() => {
    const currentRoleElement = currentRoleRef.current
    if (!currentRoleElement) return

    const measureCurrentChip = () =>
      setCurrentChipWidth(
        Math.ceil(currentRoleElement.getBoundingClientRect().width + 32),
      )

    measureCurrentChip()

    // The first measurement can run before the web font has loaded, which
    // left the chip too narrow and clipped its label. Re-measure once it has.
    let cancelled = false
    void document.fonts?.ready.then(() => {
      if (!cancelled) measureCurrentChip()
    })
    return () => {
      cancelled = true
    }
  }, [roleState.current])

  useLayoutEffect(() => {
    const anchor = roleAnchorRef.current
    const currentChip = currentChipRef.current
    const flow = flowRef.current
    if (!anchor || !currentChip || !flow) return

    const updateFlowLayout = () => {
      // Keep the expanded chips inside the hero's text column so they wrap
      // (with even gaps) instead of running under the photo.
      const column = anchor.closest(".intro-content") ?? document.body
      const columnRight = column.getBoundingClientRect().right
      const anchorBounds = anchor.getBoundingClientRect()
      const availableWidth = Math.max(
        180,
        columnRight - (anchorBounds.left + flow.offsetLeft),
      )

      flow.style.setProperty("--flow-width", `${availableWidth}px`)

      const currentBounds = currentChip.getBoundingClientRect()
      const flowBounds = flow.getBoundingClientRect()
      flowWordRefs.current.forEach((word) => {
        if (!word) return

        const originX = currentBounds.left - (flowBounds.left + word.offsetLeft)
        const originY = currentBounds.top - (flowBounds.top + word.offsetTop)
        word.style.setProperty("--flow-origin-x", `${originX}px`)
        word.style.setProperty("--flow-origin-y", `${originY}px`)
      })
    }

    updateFlowLayout()
    window.addEventListener("resize", updateFlowLayout)
    return () => window.removeEventListener("resize", updateFlowLayout)
  }, [currentChipWidth, otherRoles, roleState.current])

  return (
    <div
      className={`role-line ${showRoles ? "is-open" : ""}`}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setInteractionActive(true)
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") setInteractionActive(false)
      }}
      onPointerDown={(event) => {
        touchInteraction.current = event.pointerType === "touch"
      }}
      onKeyDown={(event) => {
        touchInteraction.current = false
        if (event.key === "Escape") {
          setInteractionActive(false)
          setExpanded(false)
        }
      }}
      onFocus={() => {
        if (!touchInteraction.current) setInteractionActive(true)
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setInteractionActive(false)
          setExpanded(false)
          touchInteraction.current = false
        }
      }}
    >
      <div className="role-line-row">
        <span className="role-prefix" aria-hidden="true">
          {prefix}
        </span>
        <div className="role-anchor" ref={roleAnchorRef}>
          <span
            className="role-trigger"
            tabIndex={0}
            aria-label={toggleLabel}
            onClick={() => {
              if (
                window.matchMedia("(hover: none), (pointer: coarse)").matches
              ) {
                setExpanded((current) => !current)
              }
            }}
          >
            <span
              className={`role-chip role-current-chip ${getChipColorClass(
                currentRole.color,
              )}`}
              aria-hidden="true"
              ref={currentChipRef}
              style={
                {
                  "--role-color": currentRole.color,
                  width: currentChipWidth ? `${currentChipWidth}px` : undefined,
                } as CurrentChipStyle
              }
            >
              <span className="role-chip-values">
                {roleState.previous !== null && (
                  <span
                    className="role-value role-value-exit"
                    key={`previous-${roleState.cycle}`}
                  >
                    {roles[roleState.previous].label}
                  </span>
                )}
                <span
                  className="role-value role-value-enter"
                  key={`current-${roleState.cycle}`}
                  ref={currentRoleRef}
                >
                  {currentRole.label}
                </span>
              </span>
            </span>
          </span>

          <div className="role-flow" ref={flowRef} aria-hidden="true">
            {otherRoles.map((role, index) => (
              <span
                className={`role-chip role-flow-word ${getChipColorClass(
                  role.color,
                )}`}
                key={role.label}
                ref={(element) => {
                  flowWordRefs.current[index] = element
                }}
                style={
                  {
                    "--flow-index": index,
                    "--flow-reverse-index": otherRoles.length - index - 1,
                    "--role-color": role.color,
                  } as FlowWordStyle
                }
              >
                {role.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="sr-only">
        <p>{listLabel}</p>
        <ul>
          {roles.map((role) => (
            <li key={role.label}>{role.label}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
