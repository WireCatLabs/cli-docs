"use client"

import { useEffect, useRef } from "react"
import { useThemeToggle } from "@/components/use-theme-toggle"
import { prepareInstallationButton } from "@/lib/installation-command"

type Step = { html: string; tool: boolean; delay: number }
type Session = { title: string; hint: string; steps: Step[] }
type Props = { html: string; sessions: Session[]; lang: string }

/** The markup and demo responses are exported from our reviewed static prototypes. */
export function Landing({ html, sessions, lang }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  useThemeToggle(rootRef, lang)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const controller = new AbortController()
    const timers = new Set<ReturnType<typeof setTimeout>>()
    const later = (fn: () => void, delay: number) => {
      const timer = setTimeout(() => {
        timers.delete(timer)
        fn()
      }, delay)
      timers.add(timer)
    }
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>(".session"))
    const log = root.querySelector<HTMLElement>("#log")
    const app = root.querySelector<HTMLElement>("#app")
    const sessionNav = root.querySelector<HTMLElement>("#sessions")
    const bar = root.querySelector<HTMLElement>("#bar")
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches
    let current = 0
    const show = (index: number, animate: boolean) => {
      if (!log || !app) return
      current = index
      log.scrollTop = 0
      const url = new URL(window.location.href)
      url.searchParams.set("scenario", String(index + 1))
      window.history.replaceState(null, "", url)
      for (const timer of timers) clearTimeout(timer)
      timers.clear()
      buttons.forEach((button, i) => {
        button.setAttribute("aria-current", String(i === index))
      })
      const active = buttons[index]
      if (active && sessionNav) {
        if (matchMedia("(max-width: 760px)").matches) {
          sessionNav.scrollLeft = active.offsetLeft - sessionNav.offsetLeft
        } else {
          sessionNav.scrollTop = active.offsetTop - sessionNav.offsetTop - 44
        }
      }
      const steps = sessions[index].steps
      app.classList.toggle("playing", animate && !still)
      if (!animate || still) {
        log.innerHTML = steps.map((step) => step.html).join("")
        return
      }
      log.innerHTML = ""
      let at = 0
      for (const step of steps) {
        at += step.delay
        later(() => {
          log.insertAdjacentHTML("beforeend", step.html)
          log.scrollTop = log.scrollHeight
          const element = log.lastElementChild
          const state = element?.querySelector(".state")
          if (step.tool && element && state) {
            const tick = state.innerHTML
            element.classList.add("running")
            state.innerHTML =
              '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M8 2a6 6 0 1 1-6 6"/></svg>'
            later(() => {
              element.classList.remove("running")
              state.innerHTML = tick
            }, 700)
          }
        }, at)
        if (step.tool) at += 700
      }
      later(() => app.classList.remove("playing"), at + 500)
    }
    buttons.forEach((button, i) => {
      button.addEventListener("click", () => show(i, true), { signal: controller.signal })
    })
    const requested = Number(new URL(window.location.href).searchParams.get("scenario")) - 1
    show(Number.isInteger(requested) && requested >= 0 && requested < sessions.length ? requested : 0, false)
    root.querySelector("#replay")?.addEventListener("click", () => show(current, true), { signal: controller.signal })
    const onScroll = () => bar?.classList.toggle("scrolled", scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true, signal: controller.signal })
    onScroll()
    const nav = root.querySelector<HTMLElement>("nav.site")
    const glide = nav?.querySelector<HTMLElement>(".glide")
    for (const link of nav?.querySelectorAll<HTMLElement>("a") ?? []) {
      const move = () => {
        if (!glide) return
        glide.style.width = `${link.offsetWidth}px`
        glide.style.transform = `translateX(${link.offsetLeft}px)`
        glide.style.opacity = "1"
      }
      link.addEventListener("mouseenter", move, { signal: controller.signal })
      link.addEventListener("focus", move, { signal: controller.signal })
    }
    nav?.addEventListener(
      "mouseleave",
      () => {
        if (glide) glide.style.opacity = "0"
      },
      { signal: controller.signal },
    )
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("seen")
            observer.unobserve(entry.target)
          }
      },
      { threshold: 0.15 },
    )
    root.classList.add("is-ready")
    for (const element of root.querySelectorAll(".reveal")) observer.observe(element)
    for (const button of root.querySelectorAll<HTMLButtonElement>("[data-copy]")) {
      prepareInstallationButton(button)
      const feedback = button.querySelector<HTMLElement>("[data-copy-label]") ?? button
      const label = feedback.textContent
      button.addEventListener(
        "click",
        async () => {
          try {
            await navigator.clipboard.writeText(button.dataset.copy ?? "")
            if (controller.signal.aborted) return
            feedback.textContent =
              { en: "Copied", ru: "Скопировано", es: "Copiado" }[document.documentElement.lang] ?? "Copied"
            button.dataset.done = ""
          } catch {
            if (controller.signal.aborted) return
            const code = button.querySelector("code") ?? button.previousElementSibling
            if (code) {
              const range = document.createRange()
              range.selectNodeContents(code)
              const selection = getSelection()
              selection?.removeAllRanges()
              selection?.addRange(range)
            }
            return
          }
          later(() => {
            feedback.textContent = label
            delete button.dataset.done
          }, 1600)
        },
        { signal: controller.signal },
      )
    }
    const connect = root.querySelector<HTMLDetailsElement>(".agent-connect")
    document.addEventListener(
      "click",
      (event) => {
        if (connect && event.target instanceof Node && !connect.contains(event.target)) connect.open = false
      },
      { signal: controller.signal },
    )
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape" && connect?.open) {
          connect.open = false
          connect.querySelector<HTMLElement>("summary")?.focus()
        }
      },
      { signal: controller.signal },
    )
    return () => {
      controller.abort()
      observer.disconnect()
      for (const timer of timers) clearTimeout(timer)
      root.classList.remove("is-ready")
    }
  }, [sessions])
  // biome-ignore lint/security/noDangerouslySetInnerHtml: Reviewed local HTML only, exported without scripts or user input.
  return <div ref={rootRef} className="landing-content" dangerouslySetInnerHTML={{ __html: html }} />
}
