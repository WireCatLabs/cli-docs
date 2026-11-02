"use client"

import { Maximize2, X } from "lucide-react"
import { useRef, useState } from "react"
import { downloadWords } from "@/lib/download"

const shots = ["tools", "agents", "search-hit", "tasks", "memory", "connect"] as const
type Shot = (typeof shots)[number]
// Only these screens were captured with translated labels.
const localized = new Set<Shot>(["tools", "connect"])

function ThemedShot({ shot, lang, alt, eager }: { shot: Shot; lang: string; alt: string; eager?: boolean }) {
  const suffix = localized.has(shot) && (lang === "ru" || lang === "es") ? lang : "en"
  return (
    <>
      {(["light", "dark"] as const).map((theme) => (
        // biome-ignore lint/performance/noImgElement: The static export has no image optimisation server.
        <img
          key={theme}
          className={`desktop-shot-${theme}`}
          src={`/screenshots/desktop/${shot}-${theme}-${suffix}.webp`}
          width={1040}
          height={650}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          alt={alt}
        />
      ))}
    </>
  )
}

export function DesktopGallery({ lang }: { lang: string }) {
  const words = downloadWords(lang).gallery
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState<Shot | null>(null)
  const show = (shot: Shot) => {
    setOpen(shot)
    dialog.current?.showModal()
  }
  return (
    <section className="download-section desktop-gallery" aria-labelledby="desktop-gallery-title">
      <h2 id="desktop-gallery-title">{words.title}</h2>
      <p>{words.intro}</p>
      <ul className="desktop-gallery-grid">
        {shots.map((shot) => (
          <li key={shot}>
            <figure className="desktop-shot">
              <button
                type="button"
                className="desktop-shot-frame desktop-gallery-open"
                onClick={() => show(shot)}
                aria-label={`${words.open}: ${words.shots[shot].caption}`}
              >
                <ThemedShot shot={shot} lang={lang} alt="" />
                <Maximize2 aria-hidden="true" />
              </button>
              <figcaption>{words.shots[shot].caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: A click on the backdrop closes it; Esc does the same for the keyboard. */}
      <dialog
        ref={dialog}
        className="desktop-gallery-dialog"
        aria-label={open ? words.shots[open].caption : words.title}
        onClose={() => setOpen(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close()
        }}
      >
        {open && (
          <figure className="desktop-shot">
            <div className="desktop-shot-frame">
              <ThemedShot shot={open} lang={lang} alt={words.shots[open].alt} eager />
            </div>
            <figcaption>{words.shots[open].caption}</figcaption>
          </figure>
        )}
        <button type="button" className="desktop-gallery-close" onClick={() => dialog.current?.close()}>
          <X aria-hidden="true" />
          {words.close}
        </button>
      </dialog>
    </section>
  )
}
