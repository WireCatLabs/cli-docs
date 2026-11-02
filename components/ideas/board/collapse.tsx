"use client"

import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react"

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Opens and closes its content with one measured height change, and follows later size changes (comments that load
 * after it opened) with the same easing instead of a jump. `height: auto` cannot be transitioned, so the height is
 * always set in pixels while the content is mounted. The content stays mounted until the close has finished.
 */
export function Collapse({
  open,
  children,
  className = "",
}: {
  open: boolean
  children: ReactNode
  className?: string
}) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(open)
  const first = useRef(true)

  useLayoutEffect(() => {
    if (open) setMounted(true)
  }, [open])

  // biome-ignore lint/correctness/useExhaustiveDependencies: `mounted` reruns it once the box exists after an open.
  useLayoutEffect(() => {
    const box = outer.current
    const content = inner.current
    const initial = first.current
    first.current = false
    if (!box || !content) return
    // Shown from the first render (an idea opened by its link): no motion, just its height.
    if (initial && open) {
      box.style.height = `${content.offsetHeight}px`
      return
    }
    // A box mounted a moment ago has no height of its own yet and starts from nothing; it is not painted before this.
    const from = box.style.height ? box.getBoundingClientRect().height : 0
    const to = open ? content.offsetHeight : 0
    if (reduced()) {
      box.style.height = `${to}px`
      if (!open) setMounted(false)
      return
    }
    box.style.height = `${from}px`
    box.getBoundingClientRect()
    box.style.height = `${to}px`
  }, [open, mounted])

  // biome-ignore lint/correctness/useExhaustiveDependencies: `mounted` reruns it once the box exists after an open.
  useEffect(() => {
    const box = outer.current
    const content = inner.current
    if (!box || !content || !open) return
    const observer = new ResizeObserver(() => {
      box.style.height = `${content.offsetHeight}px`
    })
    observer.observe(content)
    return () => observer.disconnect()
  }, [open, mounted])

  if (!mounted) return null
  return (
    <div
      ref={outer}
      className={`board-collapse ${className}`}
      data-state={open ? "open" : "closed"}
      onTransitionEnd={(event) => {
        if (event.target === outer.current && event.propertyName === "height" && !open) setMounted(false)
      }}
    >
      <div ref={inner} className="board-collapse-inner">
        {children}
      </div>
    </div>
  )
}
