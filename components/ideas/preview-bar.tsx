"use client"

import { useEffect, useState } from "react"
import { type PreviewMode, previewMode, previewModes } from "@/lib/ideas/sample"
import { ideasWords } from "@/lib/ideas/words"

/** Only in sample mode: lets the owner see each state before the API exists. */
export function PreviewBar({ lang }: { lang: string }) {
  const words = ideasWords(lang).preview
  const [mode, setMode] = useState<PreviewMode>()
  const [search, setSearch] = useState("")
  useEffect(() => {
    setMode(previewMode())
    setSearch(window.location.search)
  }, [])
  const href = (next: PreviewMode) => {
    const params = new URLSearchParams(search)
    params.set("preview", next)
    return `?${params}`
  }
  return (
    <nav className="ideas-preview" aria-label={words.label}>
      <span>{words.label}</span>
      <ul>
        {previewModes.map((option) => (
          <li key={option}>
            <a href={href(option)} aria-current={mode === option ? "true" : undefined}>
              {words[option]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
