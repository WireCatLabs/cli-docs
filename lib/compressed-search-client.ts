import { staticClient } from "fumadocs-core/search/client/orama-static"

type Options = { from: string; locale?: string }
type Loaded = { client: ReturnType<typeof staticClient>; objectUrl?: string }
const clients = new Map<string, Promise<Loaded>>()

/** Decode the asset separately from any HTTP compression applied by the static host. */
export function compressedStaticClient(options: Options): ReturnType<typeof staticClient> {
  const key = `${options.from}:${options.locale ?? ""}`
  const load = () => {
    let promise = clients.get(key)
    if (!promise) {
      promise = (async () => {
        const response = await fetch(options.from)
        if (!response.ok || !response.body) throw new Error(`Failed to fetch search index: ${options.from}`)
        const decoded = response.body.pipeThrough(new DecompressionStream("gzip"))
        const objectUrl = URL.createObjectURL(await new Response(decoded).blob())
        return { objectUrl, client: staticClient({ ...options, from: objectUrl }) }
      })()
      clients.set(key, promise)
      promise.catch(() => clients.delete(key))
    }
    return promise
  }
  return {
    deps: [options.locale, options.from],
    async search(query) {
      const loaded = await load()
      try {
        return await loaded.client.search(query)
      } finally {
        // Fumadocs caches the loaded database; release the temporary serialized copy.
        if (loaded.objectUrl) {
          URL.revokeObjectURL(loaded.objectUrl)
          delete loaded.objectUrl
        }
      }
    },
  }
}
