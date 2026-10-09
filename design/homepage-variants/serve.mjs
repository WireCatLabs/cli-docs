import { createServer } from "node:http"
import { readFile, stat } from "node:fs/promises"
import { extname, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const previewRoot = fileURLToPath(new URL("./", import.meta.url))
const publicRoot = fileURLToPath(new URL("../../public/", import.meta.url))
const port = Number(process.argv[2] ?? 4325)
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png" }
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname)
    const asset = pathname.startsWith("/fonts/")
    const root = asset ? publicRoot : previewRoot
    const name = pathname === "/" ? "/index.html" : pathname === "/icon.svg" ? "/../../app/icon.svg" : pathname
    const candidate = pathname === "/icon.svg" ? fileURLToPath(new URL("../../app/icon.svg", import.meta.url)) : resolve(root, `.${name}`)
    if (pathname !== "/icon.svg" && !candidate.startsWith(resolve(root) + sep)) { res.writeHead(400).end("Invalid path"); return }
    const choices = extname(candidate) ? [candidate] : [`${candidate}.html`]
    let file
    for (const choice of choices) { try { if ((await stat(choice)).isFile()) { file = choice; break } } catch {} }
    if (!file || (!asset && !/\.(html|css|js|svg|png)$/.test(file))) { res.writeHead(404).end("Preview not found"); return }
    const body = await readFile(file)
    res.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" })
    res.end(req.method === "HEAD" ? undefined : body)
  } catch { res.writeHead(400).end("Invalid request") }
})
server.listen(port, "127.0.0.1", () => console.log(`WireCat variants: http://localhost:${port}`))
for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, () => server.close(() => process.exit(0)))
