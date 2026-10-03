"use client"

import { ChevronLeft, ChevronRight, RotateCcw, Type } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import fonts from "@/lib/landing/heading-fonts.json"
import "@/lib/landing/font-switcher.css"

const copy = {
  en: {
    title: "Heading fonts",
    previous: "Previous font",
    next: "Next font",
    reset: "Reset font",
    loading: "Loading font…",
    error: "Could not load this font. Try again.",
    scope: "All landing headings · body text stays the same",
    coverage: "All fonts support Latin and Cyrillic.",
    source: "Font specimen",
  },
  ru: {
    title: "Шрифты заголовков",
    previous: "Предыдущий шрифт",
    next: "Следующий шрифт",
    reset: "Сбросить шрифт",
    loading: "Загрузка шрифта…",
    error: "Не удалось загрузить шрифт. Попробуйте ещё раз.",
    scope: "Все заголовки · основной текст не меняется",
    coverage: "Все шрифты поддерживают латиницу и кириллицу.",
    source: "Образец шрифта",
  },
  es: {
    title: "Fuentes de títulos",
    previous: "Fuente anterior",
    next: "Fuente siguiente",
    reset: "Restablecer fuente",
    loading: "Cargando fuente…",
    error: "No se pudo cargar la fuente. Inténtalo de nuevo.",
    scope: "Todos los títulos · el texto conserva su fuente",
    coverage: "Todas las fuentes admiten latín y cirílico.",
    source: "Muestra de la fuente",
  },
}

const loadStylesheet = (id: string) =>
  new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLLinkElement>(`link[data-heading-font="${id}"]`)
    if (existing?.sheet) {
      resolve()
      return
    }
    const link = existing ?? document.createElement("link")
    link.onload = () => resolve()
    link.onerror = () => {
      link.remove()
      reject(new Error("Font stylesheet failed"))
    }
    if (!existing) {
      link.rel = "stylesheet"
      link.href = `/fonts/heading-lab/${id}.css`
      link.dataset.headingFont = id
      document.head.append(link)
    }
  })

const resetHeading = (root: HTMLElement | null) => {
  if (!root) return
  for (const property of ["--heading-family", "--heading-weight", "--heading-stretch"])
    root.style.removeProperty(property)
  delete root.dataset.headingFont
}

export function FontSwitcher({ lang }: { lang: string }) {
  const language = lang === "ru" || lang === "es" ? lang : "en"
  const text = copy[language]
  const defaultIndex = fonts.findIndex((candidate) => candidate.id === "firasansextracondensed")
  const [enabled, setEnabled] = useState(false)
  const [index, setIndex] = useState(defaultIndex)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("ready")
  const panel = useRef<HTMLElement>(null)
  const headingRoot = useRef<HTMLElement>(null)
  const request = useRef(0)
  const font = fonts[index]

  useEffect(() => {
    const restore = () => {
      const params = new URL(location.href).searchParams
      const selected = fonts.findIndex((candidate) => candidate.id === params.get("font"))
      if (params.has("font") && selected < 0) {
        const url = new URL(location.href)
        url.searchParams.set("font", fonts[defaultIndex].id)
        history.replaceState(null, "", url)
      }
      setIndex(selected >= 0 ? selected : defaultIndex)
      setEnabled(params.get("fonts") === "1" || params.has("font"))
    }
    restore()
    window.addEventListener("popstate", restore)
    return () => window.removeEventListener("popstate", restore)
  }, [defaultIndex])

  useEffect(() => {
    if (!enabled) resetHeading(headingRoot.current)
  }, [enabled])
  useEffect(() => () => resetHeading(headingRoot.current), [])

  useEffect(() => {
    if (!enabled) return
    const root = panel.current?.closest<HTMLElement>(".wirecat-landing")
    if (!root) return
    headingRoot.current = root
    const current = ++request.current
    setStatus("loading")
    const apply = async () => {
      try {
        if (!("existing" in font && font.existing)) await loadStylesheet(font.id)
        const faces = await document.fonts.load(
          `${font.weight} 32px "${font.family}"`,
          language === "ru" ? "Каждый разговор" : "Every conversation",
        )
        if (!faces.length) throw new Error("Font face unavailable")
        if (current !== request.current) return
        root.style.setProperty("--heading-family", `"${font.family}", sans-serif`)
        root.style.setProperty("--heading-weight", String(font.weight))
        root.style.setProperty("--heading-stretch", font.stretch)
        root.dataset.headingFont = font.id
        setStatus("ready")
      } catch {
        if (current === request.current) setStatus("error")
      }
    }
    void apply()
    return () => {
      request.current++
    }
  }, [enabled, font, language])

  const choose = (next: number) => {
    setIndex(next)
    const url = new URL(location.href)
    url.searchParams.set("fonts", "1")
    url.searchParams.set("font", fonts[next].id)
    history.replaceState(null, "", url)
  }
  const rotate = (direction: number) => choose((index + direction + fonts.length) % fonts.length)

  if (!enabled) return null
  return (
    <aside ref={panel} className="font-lab" aria-label={text.title}>
      <div className="font-lab-title">
        <Type size={15} aria-hidden />
        <strong>{text.title}</strong>
        <span>
          {index + 1} / {fonts.length}
        </span>
      </div>
      <div className="font-lab-controls">
        <button type="button" onClick={() => rotate(-1)} aria-label={text.previous}>
          <ChevronLeft size={18} aria-hidden />
        </button>
        <select
          aria-label={text.title}
          value={font.id}
          onChange={(event) => choose(fonts.findIndex((candidate) => candidate.id === event.target.value))}
        >
          {fonts.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.family}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => rotate(1)} aria-label={text.next}>
          <ChevronRight size={18} aria-hidden />
        </button>
        <button type="button" onClick={() => choose(defaultIndex)} aria-label={text.reset}>
          <RotateCcw size={15} aria-hidden />
        </button>
      </div>
      <div className="font-lab-meta" role="status">
        {status === "loading" ? text.loading : status === "error" ? text.error : `${font.style} · ${font.weight}`}
      </div>
      <p>{text.scope}</p>
      <p>{text.coverage}</p>
      <a
        href={`https://fonts.google.com/specimen/${font.family.replaceAll(" ", "+")}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text.source} ↗
      </a>
    </aside>
  )
}
