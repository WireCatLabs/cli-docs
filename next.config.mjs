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
  // Next starts one worker per core but one, about 23 here, each 1 to 2 GB, and several agents build at once on one
  // machine. CI keeps Next's default.
  ...(process.env.CI ? {} : { experimental: { cpus: 4 } }),
}

export default withMDX(config)
