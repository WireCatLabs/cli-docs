import { spawnSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { expect, test } from "vitest"

test("the evaluation launcher flushes large stdout and stderr before retaining the CLI exit code", () => {
  const scratch = mkdtempSync(join(tmpdir(), "wirecat-launcher-transport-"))
  try {
    const cli = join(scratch, "transport-stub.mjs")
    const stdout = "x".repeat(256 * 1024)
    const stderr = "y".repeat(128 * 1024)
    writeFileSync(
      cli,
      `process.stdout.write(${JSON.stringify(stdout)}); process.stderr.write(${JSON.stringify(stderr)}); process.exitCode = 5`,
    )
    const trace = join(scratch, "trace.jsonl")
    const config = join(scratch, "launcher.json")
    writeFileSync(
      config,
      JSON.stringify({
        node: process.execPath,
        guard: resolve("scripts/agent-evals/deny-network.mjs"),
        cli,
        env: { NO_COLOR: "1", AGENT_EVAL_NETWORK_LOG: join(scratch, "network.jsonl") },
        trace,
      }),
    )
    const result = spawnSync(
      process.execPath,
      [resolve("scripts/agent-evals/cold-real-launcher.mjs"), config, "commands", "--json"],
      {
        encoding: "utf8",
        timeout: 20_000,
        maxBuffer: 1024 * 1024,
      },
    )
    expect(result.error).toBeUndefined()
    expect(result.status).toBe(5)
    expect(result.stdout).toBe(stdout)
    expect(result.stderr).toBe(stderr)
    const record = JSON.parse(readFileSync(trace, "utf8"))
    expect(record.stdout).toBe(result.stdout)
    expect(record.stderr).toBe(result.stderr)
    expect(record.requestedArgv).toEqual(["commands", "--json"])
    expect(record.exitCode).toBe(5)
  } finally {
    rmSync(scratch, { recursive: true, force: true })
  }
})
