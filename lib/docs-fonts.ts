/** Preload only the scripts used by this documentation locale. */
export function documentationFonts(lang: string): string[] {
  return ["/fonts/docs-inter/inter-latin.woff2", ...(lang === "ru" ? ["/fonts/docs-inter/inter-cyrillic.woff2"] : [])]
}
