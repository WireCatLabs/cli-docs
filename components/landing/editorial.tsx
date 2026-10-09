"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"
import { prepareInstallationButton } from "@/lib/installation-command"
import { searchDemo } from "@/lib/search-playground/engine"
import { copiedInstallationTool, trackSiteEvent } from "@/lib/site-events"
import { wordsFor } from "@/lib/words"

const copyWords = {
  en: {
    copied: "Copied. Paste it into your agent.",
    unavailable: "Select the text and copy it manually.",
    light: "Switch to light theme",
    dark: "Switch to dark theme",
    savings: "Time you could free up",
    slower: "Manual work is faster with these assumptions",
    matches: "matching messages · showing 1",
    empty: "No matches. Try a broader query.",
    invalid: "Check the query",
    file: "file",
  },
  ru: {
    copied: "Скопировано. Вставьте в своего агента.",
    unavailable: "Выделите текст и скопируйте вручную.",
    light: "Включить светлую тему",
    dark: "Включить тёмную тему",
    savings: "Время, которое можно сэкономить",
    slower: "При этих допущениях вручную быстрее",
    matches: "совпадений · показано 1",
    empty: "Совпадений нет. Попробуйте более широкий запрос.",
    invalid: "Проверьте запрос",
    file: "файл",
  },
  es: {
    copied: "Copiado. Pégalo en tu agente.",
    unavailable: "Selecciona el texto y cópialo manualmente.",
    light: "Cambiar al tema claro",
    dark: "Cambiar al tema oscuro",
    savings: "Tiempo que podrías ahorrar",
    slower: "Con estas suposiciones, el trabajo manual es más rápido",
    matches: "mensajes coincidentes · se muestra 1",
    empty: "No hay coincidencias. Prueba una búsqueda más amplia.",
    invalid: "Comprueba la consulta",
    file: "archivo",
  },
}
const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c)

/** Reviewed static HTML is committed by export-editorial; only fixture results are built here. */
export function Editorial({ html, lang }: { html: string; lang: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { setTheme } = useTheme()
  useEffect(() => {
    const root = rootRef.current
    if (!root || !html) return
    const words = copyWords[lang as keyof typeof copyWords] ?? copyWords.en
    const controller = new AbortController()
    const signal = controller.signal
    let toastTimer: ReturnType<typeof setTimeout> | undefined
    const copyTimers = new Map<HTMLElement, ReturnType<typeof setTimeout>>()
    const copyLabels = new Map<HTMLElement, string | null>()
    const scrollFrames = new Map<HTMLElement, number>()
    const reveals = new Set<Animation>()
    const cancelScroll = (scene: HTMLElement) => {
      const frame = scrollFrames.get(scene)
      if (frame !== undefined) cancelAnimationFrame(frame)
      scrollFrames.delete(scene)
    }
    const interruptScroll = (event: Event) => {
      if (!(event.target instanceof Element)) return
      const scene = event.target.closest<HTMLElement>(".chat-scene")
      if (scene) cancelScroll(scene)
    }
    root.addEventListener("wheel", interruptScroll, { passive: true, signal })
    root.addEventListener("touchstart", interruptScroll, { passive: true, signal })
    root.addEventListener("keydown", interruptScroll, { signal })
    const resetCopy = (button: HTMLElement) => {
      clearTimeout(copyTimers.get(button))
      copyTimers.delete(button)
      delete button.dataset.copied
      const label = copyLabels.get(button)
      if (label == null) button.removeAttribute("aria-label")
      else button.setAttribute("aria-label", label)
    }
    const all = <T extends HTMLElement>(selector: string) => Array.from(root.querySelectorAll<T>(selector))
    const cueObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.target.classList.toggle("cue-in-view", entry.isIntersecting)
    })
    for (const cue of all<HTMLElement>(".scroll-invitation, .landing5 .hero-copy h1 em")) {
      cue.classList.add("cue-observed")
      cueObserver.observe(cue)
    }
    const updateVisibility = () => root.classList.toggle("is-page-hidden", document.hidden)
    document.addEventListener("visibilitychange", updateVisibility, { signal })
    updateVisibility()
    const notify = (message: string) => {
      const toast = root.querySelector<HTMLElement>(".toast")
      if (!toast) return
      toast.textContent = message
      toast.classList.add("visible")
      clearTimeout(toastTimer)
      toastTimer = setTimeout(() => toast.classList.remove("visible"), 2300)
    }
    const surface = (element: Element) =>
      element.closest(".footer-host")
        ? ("footer" as const)
        : element.closest(".setup")
          ? ("closing" as const)
          : ("hero" as const)
    for (const button of all<HTMLButtonElement>("[data-copy]")) {
      prepareInstallationButton(button)
      copyLabels.set(button, button.getAttribute("aria-label"))
    }
    for (const code of all<HTMLElement>("pre,code")) code.tabIndex = 0
    const selectTab = (button: HTMLElement, focus = false) => {
      const list = button.closest('[role="tablist"]')
      if (!list) return
      for (const other of Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]'))) {
        const active = other === button
        other.setAttribute("aria-selected", String(active))
        other.tabIndex = active ? 0 : -1
        const panel = root.querySelector<HTMLElement>(`#${CSS.escape(other.getAttribute("aria-controls") ?? "")}`)
        if (panel) panel.hidden = !active
      }
      if (focus) button.focus()
      const choice = root.querySelector<HTMLSelectElement>("#example-choice")
      if (choice && button.dataset.walkthrough) {
        choice.value = button.dataset.walkthrough
        const url = new URL(location.href)
        url.searchParams.set("case", button.dataset.walkthrough)
        history.replaceState(null, "", url)
      }
    }
    const calculate = () => {
      if (!root.querySelector("[data-calc]")) return
      const read = (selector: string) => Math.max(0, Number(root.querySelector<HTMLInputElement>(selector)?.value) || 0)
      const volume = (key: string) => read(`[data-calc="${key}"]`)
      const timing = (key: string) => read(`[data-timing="${key}"]`)
      for (const input of all<HTMLInputElement>("[data-calc]")) {
        const output = root.querySelector<HTMLElement>(`[data-volume="${input.dataset.calc}"]`)
        if (output) output.textContent = input.value
      }
      const manual =
        (volume("messages") * timing("readSeconds") + volume("chats") * timing("contextSeconds")) / 60 +
        volume("replies") * timing("writeMinutes")
      const assisted =
        timing("summaryMinutes") +
        (volume("chats") * timing("checkContextSeconds")) / 60 +
        volume("replies") * timing("checkReplyMinutes")
      const saved = manual - assisted
      const values = {
        "saved-minutes": Math.abs(saved).toFixed(0),
        "saved-monthly": ((Math.abs(saved) * 22) / 60).toFixed(1),
        "manual-time": manual.toFixed(0),
        "agent-time": assisted.toFixed(0),
        "saving-label": saved >= 0 ? words.savings : words.slower,
      }
      for (const [id, value] of Object.entries(values)) {
        const element = root.querySelector<HTMLElement>(`#${id}`)
        if (element) element.textContent = value
      }
    }
    const search = (panel: HTMLElement) => {
      const input = panel.querySelector<HTMLTextAreaElement>("[data-mini-query]")
      const status = panel.querySelector<HTMLElement>("[data-mini-status]")
      const results = panel.querySelector<HTMLElement>("[data-mini-results]")
      if (!input || !status || !results) return
      for (const button of Array.from(panel.querySelectorAll<HTMLElement>("[data-search-preset]")))
        button.setAttribute("aria-pressed", String(button.dataset.searchPreset === input.value))
      try {
        const hits = searchDemo(input.value)
        status.textContent = hits.length ? `${hits.length} ${words.matches}` : words.empty
        results.innerHTML = hits
          .slice(0, 1)
          .map(
            ({ message }) =>
              `<div class="mini-hit"><b>${escapeHtml(message.from)} · ${escapeHtml(message.chat)}</b><p lang="en">${escapeHtml(message.text)}</p><small>${message.provider === "telegram" ? "Telegram" : "MAX"} · ${escapeHtml(message.date.slice(0, 10))}${message.has.includes("file") ? ` · ${words.file}` : ""}</small></div>`,
          )
          .join("")
        input.removeAttribute("aria-invalid")
      } catch (error) {
        status.textContent = `${words.invalid}: ${error instanceof Error ? error.message : String(error)}`
        results.innerHTML = ""
        input.setAttribute("aria-invalid", "true")
      }
    }
    root.addEventListener(
      "click",
      async (event) => {
        if (!(event.target instanceof Element)) return
        const button = event.target.closest<HTMLElement>("button,a,[role=tab]")
        if (!button || !root.contains(button)) return
        if (button.matches(".theme-switch,.theme-toggle")) {
          const dark = document.documentElement.classList.contains("dark")
          setTheme(dark ? "light" : "dark")
          button.setAttribute("aria-label", dark ? words.dark : words.light)
        }
        if (button.dataset.copy) {
          try {
            await navigator.clipboard.writeText(button.dataset.copy)
            if (signal.aborted) return
            clearTimeout(copyTimers.get(button))
            button.dataset.copied = ""
            button.setAttribute("aria-label", words.copied)
            copyTimers.set(
              button,
              setTimeout(() => resetCopy(button), 3000),
            )
            notify(words.copied)
            const selectedProvider = button
              .closest("[data-connect]")
              ?.querySelector<HTMLElement>('[data-connect-provider][aria-pressed="true"]')?.dataset.connectProvider
            const tool =
              copiedInstallationTool(button.dataset.copy) ??
              (button.matches(".copy-agent") ? (selectedProvider === "max" ? "max" : "tg") : undefined)
            if (tool) trackSiteEvent("installation_command_copy", { tool, locale: lang, surface: surface(button) })
          } catch {
            if (!signal.aborted) notify(words.unavailable)
          }
        }
        if (button.matches('[role="tab"]')) selectTab(button)
        if (button.dataset.demoProvider) {
          for (const other of all<HTMLElement>("[data-demo-provider]"))
            other.setAttribute("aria-pressed", String(other.dataset.demoProvider === button.dataset.demoProvider))
          for (const panel of all<HTMLElement>("[data-dialogue-provider]"))
            panel.hidden = panel.dataset.dialogueProvider !== button.dataset.demoProvider
        }
        if (button.dataset.connectProvider) {
          const menu = button.closest<HTMLElement>("[data-connect]")
          const tool = button.dataset.connectProvider === "max" ? "max" : "tg"
          if (menu) {
            for (const other of Array.from(menu.querySelectorAll<HTMLElement>("[data-connect-provider]")))
              other.setAttribute("aria-pressed", String(other === button))
            const prompt = wordsFor(lang).onboarding.prompt(tool, `@leemour/${tool}-cli`)
            const text = menu.querySelector<HTMLElement>(".agent-prompt")
            const copy = menu.querySelector<HTMLElement>(".copy-agent")
            if (text) text.textContent = prompt
            if (copy) {
              resetCopy(copy)
              copy.dataset.copy = prompt
            }
            const command = menu.querySelector<HTMLButtonElement>(".command [data-copy]")
            if (command) {
              resetCopy(command)
              command.dataset.copy = `npm install -g @leemour/${tool}-cli && ${tool} skill install --for all`
              prepareInstallationButton(command)
              const code = menu.querySelector<HTMLElement>(".command code")
              if (code) code.textContent = command.dataset.copy ?? ""
            }
            const guide = menu.querySelector<HTMLAnchorElement>(".connect-guide")
            if (guide) guide.href = `/${lang}/docs/installation#${tool}`
          }
        }
        if (button.hasAttribute("data-reveal-next")) {
          const next = root.querySelector<HTMLElement>(`#${CSS.escape(button.getAttribute("aria-controls") ?? "")}`)
          const scene = button.closest<HTMLElement>(".chat-scene")
          if (next && scene && next.hidden) {
            cancelScroll(scene)
            const start = scene.scrollTop
            next.hidden = false
            button.setAttribute("aria-expanded", "true")
            const cue = button.closest<HTMLElement>(".scroll-invitation")
            if (cue) cue.hidden = true
            scene.scrollTop = start
            const top = Math.max(
              0,
              Math.min(
                next.getBoundingClientRect().top - scene.getBoundingClientRect().top + scene.scrollTop - 18,
                scene.scrollHeight - scene.clientHeight,
              ),
            )
            if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
              scene.scrollTop = top
              next.focus({ preventScroll: true })
            } else {
              const reveal = next.animate([{ opacity: 0 }, { opacity: 1 }], {
                duration: 280,
                delay: 100,
                easing: "cubic-bezier(.16, 1, .3, 1)",
                fill: "backwards",
              })
              reveals.add(reveal)
              reveal.addEventListener("finish", () => reveals.delete(reveal), { once: true })
              const began = performance.now()
              const duration = Math.min(480, 320 + Math.abs(top - start) / 4)
              const advance = (now: number) => {
                const progress = Math.min(1, (now - began) / duration)
                scene.scrollTop = start + (top - start) * (1 - (1 - progress) ** 3)
                if (progress < 1) scrollFrames.set(scene, requestAnimationFrame(advance))
                else {
                  scrollFrames.delete(scene)
                  next.focus({ preventScroll: true })
                }
              }
              scrollFrames.set(scene, requestAnimationFrame(advance))
            }
          }
        }
        if (button.dataset.searchPreset) {
          const panel = button.closest<HTMLElement>("[data-mini-search]")
          const input = panel?.querySelector<HTMLTextAreaElement>("[data-mini-query]")
          if (panel && input) {
            input.value = button.dataset.searchPreset
            search(panel)
          }
        }
        if (button instanceof HTMLAnchorElement && /\/docs\/installation/.test(button.pathname))
          trackSiteEvent("setup_guide_open", {
            tool: button.hash === "#max" ? "max" : "tg",
            locale: lang,
            surface: surface(button),
          })
        if (
          button instanceof HTMLAnchorElement &&
          button.origin === location.origin &&
          !button.target &&
          !button.hasAttribute("download") &&
          !/\.(?:txt|md|json|pdf|zip|png|svg)$/.test(button.pathname) &&
          event instanceof MouseEvent &&
          event.button === 0 &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.shiftKey &&
          !event.altKey
        ) {
          event.preventDefault()
          router.push(`${button.pathname}${button.search}${button.hash}`)
        }
      },
      { signal },
    )
    root.addEventListener(
      "input",
      (event) => {
        if (!(event.target instanceof Element)) return
        if (event.target.matches("[data-calc],[data-timing]")) calculate()
        const panel = event.target.closest<HTMLElement>("[data-mini-search]")
        if (panel) search(panel)
      },
      { signal },
    )
    root.addEventListener(
      "change",
      (event) => {
        if (!(event.target instanceof HTMLSelectElement) || event.target.id !== "example-choice") return
        const chosen = all<HTMLElement>("[data-walkthrough]").find(
          (b) => b.dataset.walkthrough === (event.target as HTMLSelectElement).value,
        )
        if (chosen) selectTab(chosen)
      },
      { signal },
    )
    root.addEventListener(
      "keydown",
      (event) => {
        if (!(event.target instanceof HTMLElement) || event.target.getAttribute("role") !== "tab") return
        const tabs = Array.from(
          event.target.closest('[role="tablist"]')?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [],
        )
        const index = tabs.indexOf(event.target)
        const offset = ["ArrowRight", "ArrowDown"].includes(event.key)
          ? 1
          : ["ArrowLeft", "ArrowUp"].includes(event.key)
            ? -1
            : 0
        const next =
          event.key === "Home"
            ? tabs[0]
            : event.key === "End"
              ? tabs.at(-1)
              : offset
                ? tabs[(index + tabs.length + offset) % tabs.length]
                : undefined
        if (next) {
          event.preventDefault()
          selectTab(next, true)
        }
      },
      { signal },
    )
    const menus = all<HTMLDetailsElement>("[data-connect],.editorial-language")
    for (const menu of menus)
      menu.addEventListener(
        "toggle",
        () => {
          if (menu.open) for (const other of menus) if (other !== menu) other.open = false
        },
        { signal },
      )
    document.addEventListener(
      "click",
      (event) => {
        for (const menu of menus)
          if (menu.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false
      },
      { signal },
    )
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") {
          const menu = menus.find((m) => m.open)
          if (menu) {
            menu.open = false
            menu.querySelector<HTMLElement>("summary")?.focus()
          }
        }
      },
      { signal },
    )
    const parameters = new URL(location.href)
    const initialScenario = all<HTMLElement>("[data-hero-case]").find(
      (b) => b.dataset.heroCase === parameters.searchParams.get("scenario"),
    )
    if (initialScenario) selectTab(initialScenario)
    if (parameters.searchParams.get("messenger") === "max")
      all<HTMLButtonElement>("[data-demo-provider]")
        .find((b) => b.dataset.demoProvider === "max")
        ?.click()
    if (
      root.querySelector("[data-hero-case]") &&
      (parameters.searchParams.has("scenario") || parameters.searchParams.has("messenger"))
    ) {
      parameters.searchParams.delete("scenario")
      parameters.searchParams.delete("messenger")
      history.replaceState(null, "", parameters)
    }
    const chosen = new URL(location.href).searchParams.get("case")
    const example = all<HTMLElement>("[data-walkthrough]").find((b) => b.dataset.walkthrough === chosen)
    if (example) selectTab(example)
    for (const panel of all<HTMLElement>("[data-mini-search]")) search(panel)
    calculate()
    return () => {
      controller.abort()
      cueObserver.disconnect()
      for (const scene of scrollFrames.keys()) cancelScroll(scene)
      for (const reveal of reveals) reveal.cancel()
      clearTimeout(toastTimer)
      for (const button of copyTimers.keys()) resetCopy(button)
    }
  }, [lang, setTheme, router, html])
  return <div className="wirecat-editorial" ref={rootRef} dangerouslySetInnerHTML={{ __html: html }} />
}
