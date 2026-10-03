/** Regenerate browser icons from the WireCat vector mark. Requires ImageMagick. */
import { execFileSync } from "node:child_process"
import { copyFileSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"

// Next already supplies Sharp, whose SVG renderer preserves the monogram.
const sharp = createRequire(import.meta.resolve("next"))("sharp")

copyFileSync("app/icon.svg", "public/favicon.svg")
for (const [name, size] of [
  ["favicon-16x16.png", 16],
  ["favicon-32x32.png", 32],
  ["apple-touch-icon.png", 180],
  ["android-chrome-192x192.png", 192],
  ["android-chrome-512x512.png", 512],
]) {
  await sharp("app/icon.svg", { density: 384 }).resize(size, size).png().toFile(`public/${name}`)
}
execFileSync("magick", [
  "public/android-chrome-512x512.png",
  "-define",
  "icon:auto-resize=64,48,32,16",
  "public/favicon.ico",
])
writeFileSync(
  "public/site.webmanifest",
  `${JSON.stringify(
    {
      name: "WireCat",
      short_name: "WireCat",
      icons: [192, 512].map((size) => ({
        src: `/android-chrome-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: "image/png",
      })),
      theme_color: "#131718",
      background_color: "#131718",
      display: "standalone",
    },
    null,
    2,
  )}\n`,
)
