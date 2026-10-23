import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

// Released CLIs write to HOME and may even repoint the owner's systemd timers (issue #259), so
// anything run from .docs-tooling gets this environment and never inherits the caller's.
export function sandboxEnv(dir: string): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {
    HOME: dir,
    MESSAGING_STORE: join(dir, "wirecat.db"),
    WIRECAT_STATE_DIR: join(dir, "wirecat-state"),
    XDG_CONFIG_HOME: join(dir, "config"),
    XDG_DATA_HOME: join(dir, "data"),
    XDG_STATE_HOME: join(dir, "state"),
    XDG_CACHE_HOME: join(dir, "cache"),
    TMPDIR: dir,
    NODE_ENV: "test",
    NO_COLOR: "1",
    PATH: process.env.PATH ?? "",
  }
  for (const prefix of ["TG", "MAX", "ZM", "WA", "DRIVE", "MEMO", "CLI_MESSAGING"])
    for (const suffix of ["CONFIG_DIR", "STATE_DIR", "CACHE_DIR"])
      env[`${prefix}_${suffix}`] = join(dir, prefix, suffix)
  return env
}

export function createSandbox(label: string): { dir: string; env: NodeJS.ProcessEnv } {
  const dir = mkdtempSync(join(tmpdir(), `wirecat-doc-${label}-`))
  return { dir, env: sandboxEnv(dir) }
}
