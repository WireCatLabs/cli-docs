import { existsSync } from "node:fs"
import { join } from "node:path"

const folder = join(process.cwd(), "public", "screenshots", "desktop")

/** The language of the capture to show: the page's own, else English. Null while the shot has not been captured. */
export function desktopShotLang(shot: string, theme: "light" | "dark", lang: string): string | null {
  return [lang, "en"].find((l) => existsSync(join(folder, `${shot}-${theme}-${l}.webp`))) ?? null
}
