"use client"

import { useState } from "react"

/** Hides the topics panel's entries that do not contain what the reader types. */
export function TopicFilter({ label }: { label: string }) {
  const [value, setValue] = useState("")
  const filter = (text: string, input: HTMLInputElement) => {
    setValue(text)
    const term = text.trim().toLowerCase()
    for (const item of input.closest(".blog-topics-panel")?.querySelectorAll<HTMLElement>("li[data-topic]") ?? [])
      item.hidden = !!term && !item.dataset.topic?.includes(term)
  }
  return (
    <input
      className="blog-topics-filter"
      type="search"
      value={value}
      aria-label={label}
      placeholder={label}
      onChange={(event) => filter(event.target.value, event.currentTarget)}
    />
  )
}
