/**
 * Crop WireCat Desktop showcase captures (1440×900 PNG, from wirecat-desktop's `?showcase` build) into the
 * 16:10 WebP files under public/screenshots/desktop/. Tools keeps the sidebar, the other screens show the page
 * itself, and no crop shows the window controls.
 *
 *   node scripts/crop-desktop-screenshots.mjs <folder with wirecat-<screen>-<theme>-<lang>-1440x900.png> [screen…] [--docs]
 */
import { existsSync } from "node:fs"
import { createRequire } from "node:module"

// sharp comes with Next; it is not a direct dependency of this site.
const sharp = createRequire(createRequire(import.meta.url).resolve("next/package.json"))("sharp")

const crops = {
  tools: { box: { left: 0, top: 118, width: 1216, height: 760 } },
  agents: { box: { left: 208, top: 60, width: 1232, height: 770 } },
  "search-hit": { box: { left: 208, top: 50, width: 1232, height: 770 } },
  tasks: { box: { left: 208, top: 60, width: 1232, height: 770 } },
  memory: { box: { left: 208, top: 60, width: 1232, height: 770 } },
  connect: { box: { left: 208, top: 100, width: 1232, height: 770 } },
  digests: { box: { left: 240, top: 40, width: 1152, height: 720 } },
  analytics: { box: { left: 208, top: 60, width: 1232, height: 770 } },
}

// The docs page shows the whole window. `--docs` writes every screen, uncropped, to public/screenshots/desktop/docs/.
const docsScreens = [
  "onboarding-welcome",
  "onboarding-install",
  "tools",
  "connect",
  "agents",
  "search-hit",
  "tasks",
  "guides",
  "memory",
  "analytics",
  "storage",
  "settings",
  "contacts",
  "clients",
  "digests",
  "memory-add",
]
const docs = process.argv.includes("--docs")
const full = { left: 0, top: 0, width: 1440, height: 900 }

const langs = ["en", "ru", "es"]
const [source, ...only] = process.argv.slice(2).filter((a) => a !== "--docs")
if (!source) {
  console.error("Usage: node scripts/crop-desktop-screenshots.mjs <source folder> [screen…]")
  process.exit(2)
}
for (const [screen, { box }] of docs ? docsScreens.map((name) => [name, { box: full }]) : Object.entries(crops)) {
  if (only.length && !only.includes(screen)) continue
  for (const lang of langs)
    for (const theme of ["light", "dark"]) {
      const input = `${source}/wirecat-${screen}-${theme}-${lang}-1440x900.png`
      // The site falls back to the English shot when a language has none.
      if (!existsSync(input)) {
        console.warn(`skipped ${screen} ${theme} ${lang}: no ${input}`)
        continue
      }
      const output = `public/screenshots/desktop/${docs ? "docs/" : ""}${screen}-${theme}-${lang}.webp`
      const info = await sharp(input).extract(box).resize(1040, 650).webp({ quality: 80, effort: 6 }).toFile(output)
      console.log(`${output} ${Math.round(info.size / 1024)} KB`)
    }
}
