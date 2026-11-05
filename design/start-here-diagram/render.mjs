import { mkdir, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { chromium } from "@playwright/test"

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, "../../public/screenshots/start-here")
const page = pathToFileURL(join(here, "index.html")).href
const scale = 2
const displayWidth = { wide: 820, tall: 360 }

await mkdir(outDir, { recursive: true })
const browser = await chromium.launch()
const context = await browser.newContext({ deviceScaleFactor: scale, viewport: { width: 1600, height: 1000 } })
const tab = await context.newPage()

for (const layout of ["wide", "tall"]) {
  for (const theme of ["light", "dark"]) {
    await tab.goto(`${page}?theme=${theme}&layout=${layout}`)
    await tab.waitForSelector("body[data-ready='1']")
    const frame = tab.locator("#frame")
    const box = await frame.boundingBox()
    const smallest = await tab.evaluate(() => {
      let min = Number.POSITIVE_INFINITY
      const walker = document.createTreeWalker(document.getElementById("frame"), NodeFilter.SHOW_TEXT)
      while (walker.nextNode()) {
        const text = walker.currentNode
        if (!text.textContent.trim()) continue
        const range = document.createRange()
        range.selectNodeContents(text)
        if (!range.getClientRects().length) continue
        min = Math.min(min, Number.parseFloat(getComputedStyle(text.parentElement).fontSize))
      }
      return min
    })
    const png = await frame.screenshot({ omitBackground: true })

    // Transparent, so the image takes the page colour in either theme instead of showing an edge.
    // Playwright only writes PNG or JPEG, so Chromium's own canvas encoder makes the WebP.
    const webp = await tab.evaluate(async (b64) => {
      const image = new Image()
      image.src = `data:image/png;base64,${b64}`
      await image.decode()
      const canvas = document.createElement("canvas")
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      canvas.getContext("2d").drawImage(image, 0, 0)
      return canvas.toDataURL("image/webp", 0.9).split(",")[1]
    }, png.toString("base64"))

    const file = join(outDir, `how-wirecat-links-${layout}-${theme}.webp`)
    const bytes = Buffer.from(webp, "base64")
    await writeFile(file, bytes)
    const shown = (smallest * displayWidth[layout]) / box.width
    console.log(
      `${file}: ${Math.round(box.width * scale)}x${Math.round(box.height * scale)}, ${Math.round(bytes.length / 1024)} KB,`,
      `smallest text ${smallest}px, ${shown.toFixed(1)}px at ${displayWidth[layout]}px wide`,
    )
  }
}

await browser.close()
