import siteConfig from "@/site.config.json"
import { apiSource } from "./api"
import { ideasLive } from "./config"
import { sampleSource } from "./sample"
import type { IdeasSource } from "./types"

export * from "./config"

export const ideas: IdeasSource = ideasLive ? apiSource(siteConfig.ideas.apiUrl) : sampleSource
