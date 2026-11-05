import { existsSync } from "node:fs"
import { join } from "node:path"

/** The language of the capture to show: the page's own, else English. Null while the shot has not been captured. */
export function desktopShotLang(
  shot: string,
  theme: "light" | "dark",
  lang: string,
  folder = "desktop",
): string | null {
  const dir = join(process.cwd(), "public", "screenshots", folder)
  return [lang, "en"].find((l) => existsSync(join(dir, `${shot}-${theme}-${l}.webp`))) ?? null
}
