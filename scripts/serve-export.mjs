import { existsSync, readFileSync, statSync } from "node:fs"
import { createServer } from "node:http"
import { extname, resolve, sep } from "node:path"
import { pathToFileURL } from "node:url"
import { gzipSync } from "node:zlib"

const types = {
  ".html": "text/html",
  ".md": "text/markdown",
  ".txt": "text/plain",
  ".json": "application/json",
  ".js": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
}

/** Real 404s, clean static routes, loopback binding and production-like gzip. */
export async function serveExport(directory, { port = 0, gzip = true } = {}) {
  const root = resolve(directory)
  const cache = new Map()
  const server = createServer((request, response) => {
    let pathname
    try {
      pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname)
    } catch {
      response.writeHead(400).end()
      return
    }
    const candidate = resolve(root, `.${pathname}`)
    if (candidate !== root && !candidate.startsWith(root + sep)) {
      response.writeHead(400).end()
      return
    }
    const file = [candidate, `${candidate}.html`, resolve(candidate, "index.html")].find(
      (value) => existsSync(value) && statSync(value).isFile(),
    )
    const bodyFile = file ?? (existsSync(resolve(root, "404.html")) ? resolve(root, "404.html") : null)
    const body = bodyFile ? readFileSync(bodyFile) : Buffer.from("Not found")
    const extension = extname(bodyFile ?? ".txt")
    const headers = { "Content-Type": types[extension] ?? "application/octet-stream", "Cache-Control": "no-store" }
    const compress =
      gzip &&
      /gzip/.test(request.headers["accept-encoding"] ?? "") &&
      /\.(html|md|txt|json|js|css|svg)$/.test(extension)
    if (compress) {
      headers["Content-Encoding"] = "gzip"
      headers.Vary = "Accept-Encoding"
      if (!cache.get(bodyFile)?.body.equals(body)) cache.set(bodyFile, { body, gzip: gzipSync(body) })
    }
    response.writeHead(file ? 200 : 404, headers)
    response.end(request.method === "HEAD" ? undefined : compress ? cache.get(bodyFile).gzip : body)
  })
  await new Promise((yes, no) => {
    server.once("error", no)
    server.listen(port, "127.0.0.1", yes)
  })
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((yes, no) => server.close((error) => (error ? no(error) : yes()))),
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const directory = process.argv[2] ?? "out"
  const port = Number(process.argv[3] ?? 4319)
  const server = await serveExport(directory, { port })
  console.log(`Production export: ${server.url}`)
  for (const signal of ["SIGTERM", "SIGINT"])
    process.once(signal, async () => {
      await server.close()
      process.exit(0)
    })
}
