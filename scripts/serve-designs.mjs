/** Local-only preserved design collections; never part of the static export. */
import { spawn } from "node:child_process"
import { createConnection } from "node:net"

const collections = [
  ["homepage-variants", 4325],
  ["homepage-next", 4326],
  ["homepage-memory", 4327],
  ["homepage-memory-heroes", 4328],
  ["homepage-chat-treatments", 4329],
]
const children = []
for (const [folder, port] of collections) {
  const socket = createConnection({ host: "127.0.0.1", port })
  const running = await new Promise((resolve) => {
    socket.once("connect", () => resolve(true))
    socket.once("error", () => resolve(false))
  }).finally(() => socket.destroy())
  if (!running) {
    const child = spawn(process.execPath, [`design/${folder}/serve.mjs`, String(port)], { stdio: "inherit" })
    children.push(child)
  }
}
console.log("Design index: http://127.0.0.1:4329/all-designs — studio: http://127.0.0.1:4329/studio")
for (const signal of ["SIGINT", "SIGTERM"])
  process.once(signal, () => {
    for (const child of children) child.kill(signal)
  })
