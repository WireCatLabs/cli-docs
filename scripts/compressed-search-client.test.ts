import { createServer } from "node:http"
import { gzipSync } from "node:zlib"
import { createSearchAPI } from "fumadocs-core/search/server"
import { expect, it } from "vitest"
import { compressedStaticClient } from "../lib/compressed-search-client"

it.each([false, true])("searches and caches a gzip index with HTTP compression=%s", async (httpCompression) => {
  const api = createSearchAPI("advanced", {
    indexes: [
      {
        id: "/es/docs/installation",
        url: "/es/docs/installation",
        title: "Instalación",
        structuredData: {
          headings: [],
          contents: [{ content: "Cómo instalar el servicio de mensajería", heading: undefined }],
        },
      },
    ],
  })
  const asset = gzipSync(JSON.stringify(await api.export()))
  let requests = 0
  const server = createServer((_request, response) => {
    requests++
    response.setHeader("Content-Type", "application/gzip")
    if (httpCompression) response.setHeader("Content-Encoding", "gzip")
    response.end(httpCompression ? gzipSync(asset) : asset)
  })
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const address = server.address()
  if (!address || typeof address === "string") throw new Error("Missing server address")
  const options = { locale: "es", from: `http://127.0.0.1:${address.port}/api/search/es` }
  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      const results = await compressedStaticClient(options).search("instalar")
      expect(results.some((result) => result.url.startsWith("/es/docs/installation"))).toBe(true)
    }
    expect(requests).toBe(1)
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})
