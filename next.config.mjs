import { readFileSync } from "node:fs"
import { createMDX } from "fumadocs-mdx/next"
import { publicSiteOrigin } from "./lib/site-origin.mjs"

publicSiteOrigin(JSON.parse(readFileSync(new URL("./site.config.json", import.meta.url), "utf8")).url)

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
}

export default withMDX(config)
