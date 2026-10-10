import { localizedPath } from "./site-routes.ts"

const names = { en: "English", ru: "Русский", es: "Español" }
const labels = { en: "Language", ru: "Язык", es: "Idioma" }
const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c)

/** Shared markup for React controls and the reviewed HTML export. */
export function languageSwitcherHtml(lang: string, pathname: string) {
  const locale = Object.hasOwn(names, lang) ? (lang as keyof typeof names) : "en"
  return `<details class="language-switcher editorial-language" data-language-switcher><summary aria-label="${labels[locale]}"><svg class="language-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg><span class="language-code">${locale.toUpperCase()}</span><svg class="language-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></summary><div class="language-options">${Object.entries(
    names,
  )
    .map(
      ([code, name]) =>
        `<a href="${escapeHtml(localizedPath(pathname, code))}" lang="${code}"${code === locale ? ' aria-current="page"' : ""}>${name}</a>`,
    )
    .join("")}</div></details>`
}
