import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

// Immutable evidence URLs and release history retain revisions. User guides install latest.
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  )
const findings = []
for (const file of walk("content/docs")) {
  if (!/\.mdx?$/.test(file) || /\/(changelog|roadmap)(\.|\/)/.test(file)) continue
  const lines = readFileSync(file, "utf8").split("\n")
  lines.forEach((line, index) => {
    const editorialArtifact =
      /If the command is missing, update|Если команды нет, обновите|Si falta el comando, actualiza|The owner confirmed|Владелец подтвердил|El propietario confirmó|What was checked|Что проверено|Qué se ha comprobado|has not been established here|подтверждённого пути пока нет|Use WireCat|Используйте WireCat|Usa WireCat/i
    if (editorialArtifact.test(line)) findings.push(`${file}:${index + 1}: editorial artifact: ${line.trim()}`)
    if (/@leemour(?:\/|%2[fF])/.test(line)) {
      findings.push(`${file}:${index + 1}: use the published @wirecat package: ${line.trim()}`)
    }
    const text = line.replace(/https?:\/\/[^\s)"<>]+/g, "")
    // WireCat packages currently use 0.x releases. Ignore addresses such as 127.0.0.1.
    if (
      /(?<![\w.])v?0\.\d+\.\d+(?![\w.])/.test(text) ||
      /(?:`?(?:tg|max)`?\s+0\.\d+\+|@wirecat\/[\w-]+@\d)/.test(text)
    ) {
      findings.push(`${file}:${index + 1}: ${line.trim()}`)
    }
  })
}
if (findings.length) {
  console.error(
    `Remove old package scopes, release numbers and editorial artifacts from current user guides:\n${findings.join("\n")}`,
  )
  process.exitCode = 1
} else console.log("Current user guides: no old package scopes, pins, release-number prose or editorial artifacts")
