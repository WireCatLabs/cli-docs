import { gzipSync } from "node:zlib"

/** Keep the complete index while fitting Cloudflare Pages' per-asset upload limit. */
export function staticSearchResponse(data: unknown): Response {
  const body = new Uint8Array(gzipSync(JSON.stringify(data), { level: 9 }))
  if (body.byteLength > 25 * 1024 * 1024) throw new Error("Compressed search index exceeds the Pages 25 MiB limit")
  return new Response(body, {
    headers: { "Content-Type": "application/json; charset=utf-8", "Content-Encoding": "gzip" },
  })
}
