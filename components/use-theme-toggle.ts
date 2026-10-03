"use client"

import { useTheme } from "next-themes"
import { type RefObject, useEffect } from "react"

export function useThemeToggle(root: RefObject<HTMLElement | null>, lang: string) {
  const { resolvedTheme, setTheme } = useTheme()
  useEffect(() => {
    const buttons = root.current?.querySelectorAll<HTMLButtonElement>(".theme-toggle")
    if (!buttons) return
    const dark = resolvedTheme === "dark"
    const label =
      (
        {
          en: dark ? "Switch to light theme" : "Switch to dark theme",
          ru: dark ? "Включить светлую тему" : "Включить тёмную тему",
          es: dark ? "Cambiar al tema claro" : "Cambiar al tema oscuro",
        } as Record<string, string>
      )[lang] ?? "Switch theme"
    const toggle = () => setTheme(dark ? "light" : "dark")
    for (const button of buttons) {
      button.setAttribute("aria-label", label)
      button.setAttribute("title", label)
      button.addEventListener("click", toggle)
    }
    return () => {
      for (const button of buttons) button.removeEventListener("click", toggle)
    }
  }, [root, lang, resolvedTheme, setTheme])
}
