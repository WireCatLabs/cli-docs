"use client"

import { Maximize2 } from "lucide-react"
import { useEffect, useRef } from "react"
import { downloadWords } from "@/lib/download"
import { bindScreenshotLightbox } from "@/lib/screenshot-lightbox"

const shots = ["tools", "agents", "search-hit", "tasks", "memory", "connect"] as const

export function DesktopGallery({ lang }: { lang: string }) {
  const words = downloadWords(lang).gallery
  const section = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!section.current) return
    const controller = new AbortController()
    bindScreenshotLightbox(section.current, words, controller.signal)
    return () => controller.abort()
  }, [words])
  return (
    <section ref={section} className="download-section desktop-gallery" aria-labelledby="desktop-gallery-title">
      <h2 id="desktop-gallery-title">{words.title}</h2>
      <p>{words.intro}</p>
      <ul className="desktop-gallery-grid" data-lightbox="">
        {shots.map((shot) => (
          <li key={shot}>
            <figure className="desktop-shot">
              <button type="button" className="desktop-shot-frame desktop-gallery-open" data-lightbox-item="">
                {(["light", "dark"] as const).map((theme) => (
                  // biome-ignore lint/performance/noImgElement: The static export has no image optimisation server.
                  <img
                    key={theme}
                    className={`desktop-shot-${theme}`}
                    src={`/screenshots/desktop/${shot}-${theme}-${lang}.webp`}
                    width={1040}
                    height={650}
                    loading="lazy"
                    decoding="async"
                    alt={words.shots[shot].alt}
                    onError={(event) => {
                      // Not every screen is captured in every language yet; the English one stands in.
                      const image = event.currentTarget
                      const english = `/screenshots/desktop/${shot}-${theme}-en.webp`
                      if (!image.src.endsWith(english)) image.src = english
                    }}
                  />
                ))}
                <Maximize2 aria-hidden="true" />
              </button>
              <figcaption>{words.shots[shot].caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
