// node design/blog-covers/render.mjs <slug> <version> <layout> <left,top,width,height> <screenshot with {lang}>
// Example: node design/blog-covers/render.mjs wirecat-desktop-0-7 0.7 box 226,60,1179,656 \
//   design/desktop-screenshots/png/wirecat-contacts-dark-{lang}-1440x900.png
import { createRequire } from "node:module"
import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

const repo = new URL("../../", import.meta.url).pathname
const req = createRequire(`${repo}package.json`)
const sharp = createRequire(req.resolve("next/package.json"))("sharp")
const { chromium } = req("@playwright/test")

const [slug, ver, layout, cropArg, shot] = process.argv.slice(2)
if (!shot || !["box", "bleed"].includes(layout)) {
  console.error("usage: render.mjs <slug> <version> <box|bleed> <left,top,width,height> <screenshot with {lang}>")
  process.exit(1)
}
const [left, top, width, height] = cropArg.split(",").map(Number)
const tmp = mkdtempSync(join(tmpdir(), "blog-cover-"))
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })

for (const lang of ["en", "ru", "es"]) {
  const row = join(tmp, `row-${lang}.png`)
  await sharp(join(repo, shot.replace("{lang}", lang))).extract({ left, top, width, height }).toFile(row)
  await page.goto(`file://${repo}design/blog-covers/release-card.html`)
  await page.evaluate(
    ({ src, ver, layout, ratio }) => {
      document.getElementById("ver").textContent = ver
      const frame = document.getElementById("frame")
      frame.className = `shot ${layout}`
      // The box sits centred on the version line; bleed runs off the right and bottom edges.
      if (layout === "box") frame.style.top = `${Math.round(460 - (1000 * ratio) / 2)}px`
      document.getElementById("shot").src = src
    },
    { src: `file://${row}`, ver, layout, ratio: height / width },
  )
  await page.waitForFunction(() => document.getElementById("shot").complete && document.fonts.status === "loaded")
  const png = join(tmp, `cover-${lang}.png`)
  await page.screenshot({ path: png })
  const name = lang === "en" ? "cover.jpg" : `cover.${lang}.jpg`
  await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toFile(join(repo, "content/blog", slug, name))
  console.log(`content/blog/${slug}/${name}`)
}
await browser.close()
