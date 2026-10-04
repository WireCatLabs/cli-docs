/** Body and heading fonts used above the fold, without loading unused scripts. */
export function landingFonts(lang: string) {
  const latin = ["/fonts/gNMKW3F-SZuj7xmf-HY.woff2", "/fonts/heading-lab/unbounded-latin.woff2"]
  return lang === "ru"
    ? [...latin, "/fonts/gNMKW3F-SZuj7xmb-HY6EQ.woff2", "/fonts/heading-lab/unbounded-cyrillic.woff2"]
    : latin
}
