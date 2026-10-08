import { demoScenarioIds } from "./demo-scenarios"
import en from "./landing/en.json"
import es from "./landing/es.json"
import ru from "./landing/ru.json"

export type ScenarioStep = { html: string; tool: boolean; delay: number }
export type MeetingSession = { id: string; title: string; hint: string; steps: ScenarioStep[] }
export const meetingCopy = {
  ru: {
    send: "Отправить",
    restart: "Начать заново",
    working: "Агент собирает контекст…",
    finished: "Пример завершён. Можно выбрать другой сценарий или начать заново.",
    copied: "Скопировано",
    copyFailed: "Не удалось скопировать. Выделите текст запроса.",
    hint: "Нажмите «Отправить» в готовом сообщении. Затем попробуйте уточнения.",
    title: "Выберите сценарий",
  },
  en: {
    send: "Send",
    restart: "Start again",
    working: "The agent is gathering context…",
    finished: "Example complete. Choose another scenario or start again.",
    copied: "Copied",
    copyFailed: "Copy failed. Select the request text.",
    hint: "Press Send on the prepared message, then try the follow-ups.",
    title: "Choose a scenario",
  },
  es: {
    send: "Enviar",
    restart: "Empezar de nuevo",
    working: "El agente está reuniendo contexto…",
    finished: "Ejemplo completado. Elige otro escenario o empieza de nuevo.",
    copied: "Copiado",
    copyFailed: "No se pudo copiar. Selecciona el texto de la petición.",
    hint: "Pulsa Enviar en el mensaje preparado y prueba las peticiones siguientes.",
    title: "Elige un escenario",
  },
}
export function meetingLanguage(lang: string) {
  return lang === "ru" || lang === "es" ? lang : "en"
}
export function meetingSessions(lang: string) {
  const data = lang === "ru" ? ru : lang === "es" ? es : en
  return demoScenarioIds.map((id) => {
    const tg = data.sessions.find((s) => s.id === id)
    const max = data.maxSessions.find((s) => s.id === id)
    if (!tg || !max) throw new Error(`Landing scenario missing: ${id}`)
    return { tg, max }
  })
}
const decode = (text: string) =>
  text.replace(
    /&(?:quot|amp|lt|gt|#39|apos);/g,
    (e) => ({ "&quot;": '"', "&amp;": "&", "&lt;": "<", "&gt;": ">", "&#39;": "'", "&apos;": "'" })[e] ?? e,
  )
const plain = (html: string) =>
  decode(
    html
      .replace(/<button\b[\s\S]*?<\/button>/g, "")
      .replace(/<svg\b[\s\S]*?<\/svg>/g, "")
      .replace(/<li\b[^>]*>/g, "\n- ")
      .replace(/<\/(?:p|ul|ol|div|summary|blockquote|details)>/g, "\n\n")
      .replace(/<span class="answer-label">/g, "\n\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/\n{3,}/g, "\n\n")
    .trim()
export function meetingMarkdown(lang: string) {
  return meetingSessions(lang)
    .flatMap(({ tg, max }) => [
      { session: tg, tool: "Telegram" },
      { session: max, tool: "MAX" },
    ])
    .map(
      ({ session, tool }) =>
        `## ${session.title} (${tool})\n\n${session.steps
          .map((step) => {
            if (step.tool) {
              const command = plain(/<code>([\s\S]*?)<\/code>/.exec(step.html)?.[1] ?? "")
              const output = plain(/<pre>([\s\S]*?)<\/pre>/.exec(step.html)?.[1] ?? "")
              return `\`\`\`sh\n${command}\n\`\`\`\n\n\`\`\`json\n${output}\n\`\`\``
            }
            if (step.html.startsWith('<div class="ask'))
              return `\`\`\`text prompt\n${decode(/data-prompt="([^"]*)"/.exec(step.html)?.[1] ?? plain(step.html))}\n\`\`\``
            return plain(step.html)
          })
          .join("\n\n")} `,
    )
    .join("\n\n")
}
