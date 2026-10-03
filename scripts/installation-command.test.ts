import { describe, expect, it } from "vitest"
import { readyInstallationCommand } from "../lib/installation-command"

describe("ready installation commands", () => {
  it.each(["tg", "max"])("copies the Windows installer for %s from any install button", (tool) => {
    const command = readyInstallationCommand(`npm i -g @leemour/${tool}-cli`, true)
    expect(command).toContain("https://wirecat.dev/install.ps1")
    expect(command).toContain(`-Tool ${tool} -Agent all`)
    expect(command).not.toContain("npm exec")
  })
  it.each(["tg", "max"])("includes skill installation on Unix for %s", (tool) => {
    expect(readyInstallationCommand(`npm install -g @leemour/${tool}-cli`, false)).toBe(
      `npm install -g @leemour/${tool}-cli && ${tool} skill install --for all`,
    )
  })
  it("leaves unrelated copy commands unchanged", () => {
    expect(readyInstallationCommand("tg chats list", true)).toBe("tg chats list")
    expect(readyInstallationCommand("npm i -g unrelated", true)).toBe("npm i -g unrelated")
  })
})
