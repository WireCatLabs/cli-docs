import type { CommandInfo, OptionInfo } from "@wirecat/cli-base/commands"
import type { Program } from "./docs-quality.ts"

export function discoveryContract(value: unknown, executable: string): Program {
  if (!value || typeof value !== "object") throw new Error("Invalid discovery contract")
  const raw = value as Record<string, unknown>
  const options = raw.globalOptions ?? raw.options
  if ((raw.cli !== undefined && raw.cli !== executable) || !Array.isArray(raw.commands) || !Array.isArray(options))
    throw new Error("Invalid discovery contract")
  return { cli: executable, commands: raw.commands as CommandInfo[], globalOptions: options as OptionInfo[] }
}
