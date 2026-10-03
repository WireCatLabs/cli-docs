/** Internal test launcher. Invoke through the generated per-case executable. */
import { spawnSync } from "node:child_process"
import { appendFileSync, readFileSync } from "node:fs"

const config = JSON.parse(readFileSync(process.argv[2], "utf8"))
const requestedArgv = process.argv.slice(3)
// Local reads never reach a personal account. Send intentionally exercises the real permission gate.
const sending = requestedArgv.includes("send")
const argv = sending || requestedArgv.includes("--offline") ? requestedArgv : ["--offline", ...requestedArgv]
const result = spawnSync(config.node, ["--import", config.guard, config.cli, ...argv], {
  env: config.env,
  encoding: "utf8",
  timeout: 20_000,
  maxBuffer: 4 * 1024 * 1024,
})
appendFileSync(
  config.trace,
  `${JSON.stringify({ at: new Date().toISOString(), requestedArgv, argv, stdout: result.stdout, stderr: result.stderr, exitCode: result.status, error: result.error?.message })}\n`,
)
if (result.stdout) process.stdout.write(result.stdout)
if (result.stderr) process.stderr.write(result.stderr)
if (result.error) process.stderr.write(`${result.error.message}\n`)
// Immediate exit can discard buffered stdout/stderr when discovery is larger than a pipe buffer.
process.exitCode = result.status ?? 1
