/** Adapt released syntax deliberately; source locators retain their original messenger. */
export function maxSession(session) {
  const result = structuredClone(session)
  result.hint = result.hint.replaceAll("tg ", "max ")
  result.steps = result.steps.flatMap((step) => {
    if (step.ask) step.ask = step.ask.replace("tg cli,", "max cli,")
    if (step.tool && !step.fixedMessenger) {
      step.tool = step.tool.replace(/^tg\b/, "max")
      // These demonstrations use the forgiving search supported by both reviewed releases.
      if (/^max messages search\b/.test(step.tool)) step.tool += " --language legacy"
      if (/^max chats moderate\b/.test(step.tool)) {
        const output = JSON.parse(step.out)
        step.out = JSON.stringify({ chatId: "301", rows: output.items }, null, 2)
      }
      if (/^max messages download\b/.test(step.tool)) step.tool = step.tool.replace("--output-dir", "--output")
      if (/^max \w+ bot messages list\b/.test(step.tool)) step.tool += " --offline"
    }
    if (session.id !== "search") {
      if (step.say) step.say = step.say.replaceAll("Telegram", "MAX")
      if (step.sources) step.sources = step.sources.map((source) => ({ ...source, messenger: "max" }))
    }
    if (session.id === "bot") {
      const messageId = (id) => `mid.${(BigInt(id) + 0x19a7f3c0000n).toString(16).padStart(16, "0")}`
      if (step.out) {
        const output = JSON.parse(step.out)
        for (const item of output.items ?? []) if (item.text && item.id) item.id = messageId(item.id)
        if (output.messageId) output.messageId = messageId(output.messageId)
        step.out = JSON.stringify(output, null, 2)
      }
      if (step.sources) step.sources = step.sources.map((source) => ({ ...source, id: messageId(source.id) }))
    }
    if (/^max messages transcribe\b/.test(step.tool ?? "")) {
      step.tool += " --model parakeet-v3"
      return [
        {
          tool: "max models audio list",
          out: JSON.stringify({ items: [{ id: "parakeet-v3", downloaded: true }] }, null, 2),
        },
        step,
      ]
    }
    return [step]
  })
  return result
}
