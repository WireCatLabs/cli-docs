"use client"

import { useEffect } from "react"

// The page is server-rendered markup; this wires its small behaviours without re-rendering it.
export function LandingEffects({ copied, copy }: { copied: string; copy: string }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".wc")
    if (!root) return
    root.classList.add("js")

    const bar = root.querySelector<HTMLElement>(".bar")
    const onScroll = () => bar?.classList.toggle("scrolled", window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    const nav = root.querySelector<HTMLElement>("nav.site")
    const glide = nav?.querySelector<HTMLElement>(".glide")
    const moveGlide = (event: Event) => {
      const link = event.currentTarget as HTMLElement
      if (!glide) return
      glide.style.width = `${link.offsetWidth}px`
      glide.style.transform = `translateX(${link.offsetLeft}px)`
      glide.style.opacity = "1"
    }
    const hideGlide = () => {
      if (glide) glide.style.opacity = "0"
    }
    const links = [...(nav?.querySelectorAll("a") ?? [])]
    for (const link of links) {
      link.addEventListener("mouseenter", moveGlide)
      link.addEventListener("focus", moveGlide)
    }
    nav?.addEventListener("mouseleave", hideGlide)

    const onClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const button = target.closest<HTMLButtonElement>("[data-copy]")
      if (button) {
        try {
          await navigator.clipboard.writeText(button.dataset.copy ?? "")
        } catch {
          const range = document.createRange()
          if (button.previousElementSibling) range.selectNodeContents(button.previousElementSibling)
          getSelection()?.removeAllRanges()
          getSelection()?.addRange(range)
        }
        button.textContent = copied
        button.dataset.done = ""
        setTimeout(() => {
          button.textContent = copy
          delete button.dataset.done
        }, 1600)
        return
      }
      const tab = target.closest<HTMLButtonElement>(".ftab")
      if (tab) {
        for (const other of root.querySelectorAll<HTMLButtonElement>(".ftab")) {
          const on = other === tab
          other.setAttribute("aria-selected", String(on))
          const panel = document.getElementById(other.getAttribute("aria-controls") ?? "")
          if (panel) panel.hidden = !on
        }
      }
      const menu = root.querySelector<HTMLDetailsElement>("details.lang")
      if (menu?.open && !menu.contains(target)) menu.open = false
    }
    root.addEventListener("click", onClick)

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add("seen")
          reveal.unobserve(entry.target)
        }
      },
      { threshold: 0.15 },
    )
    for (const element of root.querySelectorAll(".reveal")) reveal.observe(element)

    return () => {
      window.removeEventListener("scroll", onScroll)
      for (const link of links) {
        link.removeEventListener("mouseenter", moveGlide)
        link.removeEventListener("focus", moveGlide)
      }
      nav?.removeEventListener("mouseleave", hideGlide)
      root.removeEventListener("click", onClick)
      reveal.disconnect()
    }
  }, [copied, copy])
  return null
}
