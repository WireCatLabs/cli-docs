import type { CommandInfo, OptionInfo } from "@wirecat/cli-base/commands"
import type { Program } from "./docs-quality.ts"

const snakeOption = (option: OptionInfo & { takesValue?: boolean }): OptionInfo => {
  const { takesValue, ...rest } = option
  return takesValue === undefined ? option : { ...rest, takes_value: takesValue }
}
const snakeCommand = (command: CommandInfo): CommandInfo => ({
  ...command,
  options: command.options.map(snakeOption),
  commands: command.commands.map(snakeCommand),
})

export function discoveryContract(value: unknown, executable: string): Program {
  if (!value || typeof value !== "object") throw new Error("Invalid discovery contract")
  const raw = value as Record<string, unknown>
  const options = raw.global_options ?? raw.globalOptions ?? raw.options
  if ((raw.cli !== undefined && raw.cli !== executable) || !Array.isArray(raw.commands) || !Array.isArray(options))
    throw new Error("Invalid discovery contract")
  const commands = (raw.commands as CommandInfo[]).map(snakeCommand)
  // The contract has no profile field; cli-core states the rule in the root help, drive in each usage line.
  const profile =
    /first word is the profile/i.test(String(raw.description ?? "")) ||
    commands.some((command) => command.usage.includes("<profile>"))
  return {
    cli: executable,
    commands,
    globalOptions: (options as OptionInfo[]).map(snakeOption),
    ...(profile ? { profile } : {}),
  }
}
