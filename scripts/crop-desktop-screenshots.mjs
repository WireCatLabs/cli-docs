/**
 * Crop WireCat Desktop showcase captures (1440×900 PNG, from wirecat-desktop's `?showcase` build) into the
 * 16:10 WebP files under public/screenshots/desktop/. Each crop keeps the sidebar edge and the left-to-centre
 * content, and leaves out the window controls.
 *
 *   node scripts/crop-desktop-screenshots.mjs <folder with wirecat-<screen>-<theme>-<lang>-1440x900.png> [screen…]
 */
import { existsSync } from "node:fs"
import { createRequire } from "node:module"

// sharp comes with Next; it is not a direct dependency of this site.
const sharp = createRequire(createRequire(import.meta.url).resolve("next/package.json"))("sharp")

const crops = {
  tools: { box: { left: 0, top: 0, width: 1008, height: 630 } },
  agents: { box: { left: 0, top: 100, width: 1040, height: 650 } },
  "search-hit": { box: { left: 0, top: 90, width: 1040, height: 650 } },
  tasks: { box: { left: 208, top: 120, width: 1232, height: 770 } },
  memory: { box: { left: 0, top: 100, width: 1040, height: 650 } },
  connect: { box: { left: 200, top: 100, width: 1200, height: 750 } },
}

const langs = ["en", "ru", "es"]
const [source, ...only] = process.argv.slice(2)
if (!source) {
  console.error("Usage: node scripts/crop-desktop-screenshots.mjs <source folder> [screen…]")
  process.exit(2)
}
for (const [screen, { box }] of Object.entries(crops)) {
  if (only.length && !only.includes(screen)) continue
  for (const lang of langs)
    for (const theme of ["light", "dark"]) {
      const input = `${source}/wirecat-${screen}-${theme}-${lang}-1440x900.png`
      // The site falls back to the English shot when a language has none.
      if (!existsSync(input)) {
        console.warn(`skipped ${screen} ${theme} ${lang}: no ${input}`)
        continue
      }
      const output = `public/screenshots/desktop/${screen}-${theme}-${lang}.webp`
      const info = await sharp(input).extract(box).resize(1040, 650).webp({ quality: 80, effort: 6 }).toFile(output)
      console.log(`${output} ${Math.round(info.size / 1024)} KB`)
    }
}
