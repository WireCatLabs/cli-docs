"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { FontSwitcher } from "@/components/landing/font-switcher"
import { SearchPlayground } from "@/components/search-playground/search-playground"
import { TimeSavings } from "@/components/time-savings"
import { prepareInstallationButton } from "@/lib/installation-command"
import { copiedInstallationTool, trackSiteEvent } from "@/lib/site-events"

type Step = { html: string; tool: boolean; delay: number }
type Session = { id: string; title: string; hint: string; steps: Step[] }
type Props = { html: string; sessions: Session[]; maxSessions: Session[]; lang: string }

/** The markup and demo responses are exported from our reviewed static prototypes. */
export function Landing({ html, sessions, maxSessions, lang }: Props) {
  const router = useRouter()
  const rootRef = useRef<HTMLElement>(null)
  const copyStatusRef = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const controller = new AbortController()
    const timers = new Set<ReturnType<typeof setTimeout>>()
    const copyTimers = new Map<HTMLButtonElement, ReturnType<typeof setTimeout>>()
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
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches
    for (const code of root.querySelectorAll<HTMLElement>(".cmd code, .fv pre")) code.tabIndex = 0
    let current = 0
    let readingEvidence = false
    let messenger = "tg"
    const initialUrl = new URL(window.location.href)
    if (initialUrl.searchParams.has("scenario") || initialUrl.searchParams.has("messenger")) {
      initialUrl.searchParams.delete("scenario")
      initialUrl.searchParams.delete("messenger")
      window.history.replaceState(window.history.state, "", initialUrl)
    }
    const show = (index: number, animate: boolean) => {
      if (!log || !app) return
      current = index
      readingEvidence = false
      log.style.scrollBehavior = still ? "auto" : ""
      log.scrollTop = 0
      const selected = messenger === "max" ? maxSessions : sessions
      for (const timer of timers) clearTimeout(timer)
      timers.clear()
      buttons.forEach((button, i) => {
        button.setAttribute("aria-current", String(i === index))
        if (button.firstChild) button.firstChild.textContent = selected[i].title
        const hint = button.querySelector("small")
        if (hint) hint.textContent = selected[i].hint
      })
      root.querySelectorAll<HTMLButtonElement>("[data-messenger]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.messenger === messenger))
      })
      const active = buttons[index]
      if (active && sessionNav) {
        if (matchMedia("(max-width: 760px)").matches) {
          sessionNav.scrollLeft = active.offsetLeft - sessionNav.offsetLeft
        } else {
          sessionNav.scrollTop = active.offsetTop - sessionNav.offsetTop - 44
        }
      }
      const steps = selected[index].steps
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
          if (!readingEvidence) log.scrollTop = log.scrollHeight
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
    show(0, false)
    root.querySelectorAll<HTMLButtonElement>("[data-messenger]").forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          messenger = button.dataset.messenger === "max" ? "max" : "tg"
          show(current, false)
        },
        { signal: controller.signal },
      )
    })
    root.addEventListener(
      "click",
      async (event) => {
        if (!(event.target instanceof Element)) return
        const button = event.target.closest<HTMLButtonElement>("[data-prompt]")
        if (!button) return
        const feedback = button.querySelector<HTMLElement>("[data-prompt-label]")
        const label = feedback?.textContent ?? ""
        try {
          await navigator.clipboard.writeText(button.dataset.prompt ?? "")
          if (controller.signal.aborted) return
          const copied = { ru: "Скопировано", en: "Copied", es: "Copiado" }[lang] ?? "Copied"
          if (feedback) feedback.textContent = copied
          button.dataset.copied = ""
          button.setAttribute("aria-label", copied)
          button.title = copied
          later(() => {
            if (feedback) feedback.textContent = label
            delete button.dataset.copied
            button.setAttribute("aria-label", label)
            button.title = label
          }, 1600)
        } catch {
          const text = button.closest(".ask")?.querySelector("p")
          if (text) {
            const range = document.createRange()
            range.selectNodeContents(text)
            const selection = getSelection()
            selection?.removeAllRanges()
            selection?.addRange(range)
          }
        }
      },
      { signal: controller.signal },
    )
    root.querySelector("#replay")?.addEventListener("click", () => show(current, true), { signal: controller.signal })
    root.addEventListener(
      "toggle",
      (event) => {
        const detail = event.target
        if (
          !(detail instanceof HTMLDetailsElement) ||
          !detail.matches(".evidence-message,.answer-sources") ||
          !detail.open ||
          !log
        )
          return
        readingEvidence = true
        log.style.scrollBehavior = "auto"
        // Keep a newly opened quote visible inside the chat pane; never scroll the document.
        const overflow = detail.getBoundingClientRect().bottom - log.getBoundingClientRect().bottom + 12
        if (overflow > 0) log.scrollTop += overflow
      },
      { capture: true, signal: controller.signal },
    )
    root.addEventListener(
      "click",
      (event) => {
        const link = event.target instanceof Element ? event.target.closest("a") : null
        if (!link || event.defaultPrevented) return
        const url = new URL(link.href)
        if (url.origin !== location.origin || url.pathname !== `/${lang}/docs/installation`) return
        const tool = url.hash.slice(1)
        if (tool !== "tg" && tool !== "max") return
        trackSiteEvent("setup_guide_open", {
          tool,
          locale: lang,
          surface: link.closest(".hero") ? "hero" : link.closest(".close") ? "closing" : "footer",
        })
        if (
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey &&
          !link.target
        ) {
          event.preventDefault()
          router.push(url.pathname + url.search + url.hash)
        }
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
      const accessibleLabel = button.getAttribute("aria-label")
      button.addEventListener(
        "click",
        async () => {
          try {
            await navigator.clipboard.writeText(button.dataset.copy ?? "")
            if (controller.signal.aborted) return
            const copied = { en: "Copied", ru: "Скопировано", es: "Copiado" }[lang] ?? "Copied"
            feedback.textContent = copied
            const name = button.querySelector("strong")?.textContent ?? ""
            const announcement = name ? `${name}: ${copied}` : copied
            if (accessibleLabel) button.setAttribute("aria-label", announcement)
            if (copyStatusRef.current) copyStatusRef.current.textContent = announcement
            button.dataset.done = ""
            const tool = copiedInstallationTool(button.dataset.copy ?? "")
            if (tool)
              trackSiteEvent("installation_command_copy", {
                tool,
                locale: lang,
                surface: button.closest(".hero") ? "hero" : "footer",
              })
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
          clearTimeout(copyTimers.get(button))
          copyTimers.set(
            button,
            setTimeout(() => {
              feedback.textContent = label
              if (accessibleLabel) button.setAttribute("aria-label", accessibleLabel)
              delete button.dataset.done
              if (copyStatusRef.current) copyStatusRef.current.textContent = ""
            }, 1600),
          )
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
      for (const timer of copyTimers.values()) clearTimeout(timer)
      root.classList.remove("is-ready")
    }
  }, [sessions, maxSessions, lang, router])
  const [before, tail] = html.split("<!--time-savings-->")
  const [after, afterSearch] = (tail ?? "").split("<div data-search-playground></div>")
  return (
    <main ref={rootRef} className="landing-content">
      <FontSwitcher lang={lang} />
      <p ref={copyStatusRef} role="status" aria-live="polite" aria-atomic="true" className="sr-only" />
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Reviewed local exported HTML only. */}
      <div dangerouslySetInnerHTML={{ __html: before }} />
      {tail !== undefined && <TimeSavings lang={lang} />}
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Reviewed local exported HTML only. */}
      {tail !== undefined && <div dangerouslySetInnerHTML={{ __html: after }} />}
      {afterSearch !== undefined && <SearchPlayground lang={lang} />}
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Reviewed local exported HTML only. */}
      {afterSearch !== undefined && <div dangerouslySetInnerHTML={{ __html: afterSearch }} />}
    </main>
  )
}
