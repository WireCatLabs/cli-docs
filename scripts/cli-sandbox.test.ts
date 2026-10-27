import { rmSync } from "node:fs"
import { describe, expect, it, vi } from "vitest"
import { createSandbox, sandboxEnv } from "./cli-sandbox.ts"

describe("sandbox env for released CLIs", () => {
  it("never carries the real HOME or XDG paths", () => {
    vi.stubEnv("HOME", "/home/owner")
    vi.stubEnv("XDG_CONFIG_HOME", "/home/owner/.config")
    vi.stubEnv("XDG_DATA_HOME", "/home/owner/.local/share")
    vi.stubEnv("XDG_STATE_HOME", "/home/owner/.local/state")
    vi.stubEnv("XDG_CACHE_HOME", "/home/owner/.cache")
    vi.stubEnv("MESSAGING_STORE", "/home/owner/messages.db")
    vi.stubEnv("TG_CONFIG_DIR", "/home/owner/tg")
    const { dir, env } = createSandbox("test")
    const { PATH: _path, ...rest } = env
    for (const value of Object.values(rest)) expect(value).not.toContain("/home/owner")
    for (const key of ["HOME", "MESSAGING_STORE", "WIRECAT_STATE_DIR", "XDG_CONFIG_HOME", "XDG_DATA_HOME"])
      expect(env[key]?.startsWith(dir)).toBe(true)
    vi.unstubAllEnvs()
    rmSync(dir, { recursive: true, force: true })
  })

  it("does not inherit other variables", () => {
    vi.stubEnv("TELEGRAM_TOKEN", "secret")
    expect(sandboxEnv("/tmp/x")).not.toHaveProperty("TELEGRAM_TOKEN")
    vi.unstubAllEnvs()
  })
})
