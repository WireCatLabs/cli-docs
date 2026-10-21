import { en } from "./en"
import { es } from "./es"
import { ru } from "./ru"
import type { ChannelReportCopy, Lang } from "./types"

export type { ChannelReportCopy, Lang } from "./types"
export const channelReportCopy: Record<Lang, ChannelReportCopy> = { en, ru, es }
