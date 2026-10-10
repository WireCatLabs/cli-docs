"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeSwitch({ lang }: { lang: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dark = mounted && resolvedTheme === "dark"
  const label =
    {
      en: dark ? "Switch to light theme" : "Switch to dark theme",
      ru: dark ? "Включить светлую тему" : "Включить тёмную тему",
      es: dark ? "Cambiar al tema claro" : "Cambiar al tema oscuro",
    }[lang] ?? "Switch theme"
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-fd-border text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground active:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-primary"
    >
      {dark ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
    </button>
  )
}
