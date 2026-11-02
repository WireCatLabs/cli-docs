import { apiSource } from "./api"
import { ideasApiUrl, ideasLive } from "./config"
import { sampleSource } from "./sample"
import type { IdeasSource } from "./types"

export * from "./config"

export const ideas: IdeasSource = ideasLive ? apiSource(ideasApiUrl) : sampleSource
