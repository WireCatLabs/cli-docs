// Test-only preload: block Node network primitives before loading the actual tg CLI.
// Unix sockets are denied too, so this runner cannot contact a system keyring daemon.

import dgram from "node:dgram"
import dns from "node:dns"
import { appendFileSync } from "node:fs"
import { syncBuiltinESMExports } from "node:module"
import net from "node:net"

const denied = (...args) => {
  appendFileSync(
    process.env.AGENT_EVAL_NETWORK_LOG,
    `${JSON.stringify({ attempted: true, primitive: typeof args[0] })}\n`,
  )
  throw new Error("AGENT_EVAL_NETWORK_DENIED: synthetic offline checks cannot open sockets")
}
net.Socket.prototype.connect = denied
net.connect = denied
net.createConnection = denied
dgram.createSocket = denied
dns.lookup = denied
dns.resolve = denied
dns.promises.lookup = denied
dns.promises.resolve = denied
globalThis.fetch = denied
syncBuiltinESMExports()
