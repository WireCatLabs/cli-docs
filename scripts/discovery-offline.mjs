import dgram from "node:dgram"
import dns from "node:dns"
import { syncBuiltinESMExports } from "node:module"
import net from "node:net"

const denied = () => {
  throw new Error("Documentation discovery cannot access network or keyring sockets")
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
