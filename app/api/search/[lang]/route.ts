import { searchIndex } from "@/lib/search-index"
import { staticSearchResponse } from "@/lib/static-search-response"

export const revalidate = false
export const dynamicParams = false

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ru" }, { lang: "es" }]
}

/**
 * One language per compressed file: Pages limits uploaded assets to 25 MiB.
 * The static host supplies Content-Encoding via public/_headers.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const all = (await (await searchIndex.staticGET()).json()) as { type: string; data: Record<string, unknown> }
  return staticSearchResponse({ type: all.type, data: { [lang]: all.data[lang] } })
}
