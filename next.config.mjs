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
  // Source maps for prerender errors cost memory in every worker while it renders the 3283 pages.
  enablePrerenderSourceMaps: false,
  // Next starts one worker per core but one, about 23 here, each 1 to 2 GB, and several agents build at once on one
  // machine. On CI's 4 cores and 16 GB, Next's default of 3 workers with 8 pages each in flight sometimes ran out of
  // memory, most likely, and stalled the deploy at its 50-minute limit.
  experimental: process.env.CI ? { cpus: 2, staticGenerationMaxConcurrency: 4 } : { cpus: 4 },
}

export default withMDX(config)
