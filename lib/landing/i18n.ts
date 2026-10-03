import data from "./messages.json"

type Lang = "en" | "ru" | "es"
const messages = data.messages as Record<string, Record<string, string>>

export const landingTitle = (lang: string) => data.title[lang as Lang] ?? data.title.en

export function translator(lang: string) {
  const table = messages[lang] ?? {}
  const index = lang === "ru" ? 1 : lang === "es" ? 2 : 0
  const rows = [...data.code].sort((a, b) => (b[0]?.length ?? 0) - (a[0]?.length ?? 0))
  const code = (text: string) =>
    index === 0 ? text : rows.reduce((out, row) => out.replaceAll(row[0] ?? "", row[index] ?? ""), text)
  return { t: (text: string) => table[text] ?? text, c: code }
}
