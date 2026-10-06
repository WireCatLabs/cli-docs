import { searchIndex } from "@/lib/search-index"

export const revalidate = false
export const dynamicParams = false

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ru" }, { lang: "es" }]
}

/**
 * One language per file: Cloudflare Pages refuses files over 25 MiB, which the three together
 * passed, and a reader only ever searches their own language.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const all = (await (await searchIndex.staticGET()).json()) as { type: string; data: Record<string, unknown> }
  return Response.json({ type: all.type, data: { [lang]: all.data[lang] } })
}
