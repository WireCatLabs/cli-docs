import { siteUrl } from "./shared"

export function readyInstallationCommand(command: string, windows: boolean): string {
  if (!/^npm(?:\.cmd)?\s+(?:i|install)\s+-g\s+/.test(command)) return command
  const tool = /@leemour\/(tg|max)-cli\b/.exec(command)?.[1]
  if (!tool) return command
  if (windows) return `& ([scriptblock]::Create((Invoke-RestMethod '${siteUrl}/install.ps1'))) -Tool ${tool} -Agent all`
  return `npm install -g @leemour/${tool}-cli && ${tool} skill install --for all`
}

export function prepareInstallationButton(button: HTMLButtonElement): void {
  const previous = button.dataset.copy ?? ""
  const command = readyInstallationCommand(previous, navigator.userAgent.includes("Windows"))
  if (command === previous) return
  button.dataset.copy = command
  const code = button.querySelector("code") ?? button.closest(".cmd")?.querySelector("code")
  if (code) code.textContent = command
}
