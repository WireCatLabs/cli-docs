"use client"

import { useEffect, useState } from "react"

const platforms = ["all", "windows", "linux", "macos"] as const
const labels = {
  en: { all: "Compare all", label: "Paths for your operating system" },
  ru: { all: "Все системы", label: "Пути для вашей операционной системы" },
  es: { all: "Todos los sistemas", label: "Rutas para tu sistema operativo" },
}

/** The original Markdown table remains the source of every path and the no-JS fallback. */
export function PlatformPaths({ children, language = "en" }: { children: React.ReactNode; language?: string }) {
  const [platform, setPlatform] = useState<(typeof platforms)[number]>("all")
  const text = labels[language as keyof typeof labels] ?? labels.en
  useEffect(() => {
    const system = navigator.platform.toLowerCase()
    if (system.includes("win")) setPlatform("windows")
    else if (system.includes("mac")) setPlatform("macos")
    else if (system.includes("linux")) setPlatform("linux")
  }, [])
  return (
    <div className="platform-paths" data-platform={platform}>
      <fieldset className="not-prose platform-options" aria-label={text.label}>
        {platforms.map((value) => (
          <button key={value} type="button" aria-pressed={platform === value} onClick={() => setPlatform(value)}>
            {value === "all" ? text.all : { windows: "Windows", linux: "Linux", macos: "macOS" }[value]}
          </button>
        ))}
      </fieldset>
      {children}
    </div>
  )
}
