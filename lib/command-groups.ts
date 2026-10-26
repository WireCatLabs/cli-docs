export type CommandGroup = "personal" | "bot" | "admin" | "setup"
export const commandGroups: CommandGroup[] = ["personal", "bot", "admin", "setup"]
const setup = new Set([
  "session",
  "setup",
  "account",
  "config",
  "server",
  "serve",
  "watch",
  "store",
  "models",
  "doctor",
  "runs",
  "flood",
  "mcp",
  "skill",
  "commands",
  "complete",
  "upgrade",
])
const adminChat = new Set([
  "create",
  "update",
  "delete",
  "moderate",
  "members",
  "links",
  "requests",
  "pin",
  "unpin",
  "admins",
])
const adminTopics = new Set(["enable", "create", "edit", "delete", "order"])
export function commandGroup(command: string): CommandGroup {
  const words = command.trim().split(/\s+/).slice(1)
  if (words[0] === "bot") return "bot"
  if (setup.has(words[0]) || (words[0] === "search" && words[1] === "runs")) return "setup"
  if (
    words[0] === "stats" ||
    (words[0] === "chats" && adminChat.has(words[1])) ||
    (words[0] === "topics" && adminTopics.has(words[1]))
  )
    return "admin"
  return "personal"
}
export function commandGroupForAnchor(anchor: string): CommandGroup {
  let value: string
  try {
    value = decodeURIComponent(anchor).replace(/^#/, "")
  } catch {
    return "personal"
  }
  if (/^(tg|max|wa)-search-runs(?:-|$)/.test(value)) return "setup"
  if (/^(tg|max|wa)-bot(?:-|$)/.test(value)) return "bot"
  if ([...setup].some((name) => new RegExp(`^(tg|max|wa)-${name}(?:-|$)`).test(value))) return "setup"
  if (
    /^(tg|max|wa)-stats(?:-|$)/.test(value) ||
    [...adminChat].some((name) => new RegExp(`^(tg|max|wa)-chats-${name}(?:-|$)`).test(value)) ||
    [...adminTopics].some((name) => new RegExp(`^(tg|max|wa)-topics-${name}(?:-|$)`).test(value))
  )
    return "admin"
  return "personal"
}

export const commandGroupCopy = {
  ru: {
    intro:
      "Выберите справочник под свою задачу. Для первого знакомства начните с первых задач; здесь можно найти точную команду, аргументы и параметры.",
    personal: "Личный аккаунт",
    bot: "Боты",
    admin: "Управление группами и каналами",
    setup: "Настройка и обслуживание",
    descriptions: {
      personal: "Чаты, сообщения, контакты, поиск, файлы, отправка и автоответы в своём аккаунте.",
      bot: "Подключение бота, сообщения, события и полный Bot API.",
      admin:
        "Участники, приглашения, права, модерация, темы форумов и статистика групп и каналов. Изменения требуют соответствующих прав.",
      setup:
        "Вход, профили, настройки, фоновый сервер, локальное хранилище, диагностика, подключение агента и обновления.",
    },
    all: "Полный справочник в Markdown",
    options: "Общие параметры",
    task: "Первые задачи",
  },
  en: {
    intro:
      "Choose the reference for your task. Start with First tasks if you're getting acquainted; use this reference for exact commands, arguments and options.",
    personal: "Personal account",
    bot: "Bots",
    admin: "Group and channel administration",
    setup: "Setup and maintenance",
    descriptions: {
      personal: "Chats, messages, contacts, search, files, sending and auto-replies in your own account.",
      bot: "Bot connection, messages, updates and the full Bot API.",
      admin:
        "Members, invitations, permissions, moderation, forum topics and statistics for groups and channels. Changes require the relevant permissions.",
      setup:
        "Login, profiles, configuration, the background server, the local store, diagnostics, agent connection and updates.",
    },
    all: "Full reference in Markdown",
    options: "Global options",
    task: "First tasks",
  },
  es: {
    intro:
      "Elige la referencia para tu tarea. Empieza por Primeras tareas si estás conociendo la herramienta; aquí encontrarás comandos, argumentos y opciones exactos.",
    personal: "Cuenta personal",
    bot: "Bots",
    admin: "Administración de grupos y canales",
    setup: "Configuración y mantenimiento",
    descriptions: {
      personal: "Chats, mensajes, contactos, búsqueda, archivos, envío y respuestas automáticas en tu cuenta.",
      bot: "Conexión del bot, mensajes, eventos y Bot API completa.",
      admin:
        "Miembros, invitaciones, permisos, moderación, temas de foro y estadísticas de grupos y canales. Los cambios requieren los permisos pertinentes.",
      setup:
        "Acceso, perfiles, configuración, servidor en segundo plano, almacén local, diagnóstico, conexión del agente y actualizaciones.",
    },
    all: "Referencia completa en Markdown",
    options: "Opciones globales",
    task: "Primeras tareas",
  },
}
export function commandCopy(tool: string, lang: string) {
  const locale = commandLanguage(lang)
  const base = commandGroupCopy[locale]
  if (tool !== "wa") return base
  const descriptions = {
    en: {
      personal: "Your WhatsApp chats, messages, contacts, search, files, polls and explicit sends.",
      bot: "WhatsApp Business numbers through Meta’s Cloud API: tokens, messages, approved templates and webhooks.",
      admin:
        "Group members, invitations, settings, moderation and statistics. Changes require the relevant permissions.",
    },
    ru: {
      personal: "Ваши чаты WhatsApp, сообщения, контакты, поиск, файлы, опросы и отправка по явной команде.",
      bot: "Бизнес-номера WhatsApp через Cloud API Meta: токены, сообщения, одобренные шаблоны и вебхуки.",
      admin: "Участники групп, приглашения, настройки, модерация и статистика. Изменения требуют соответствующих прав.",
    },
    es: {
      personal: "Tus chats de WhatsApp, mensajes, contactos, búsquedas, archivos, encuestas y envíos explícitos.",
      bot: "Números de WhatsApp Business con Cloud API de Meta: tokens, mensajes, plantillas aprobadas y webhooks.",
      admin: "Miembros, invitaciones, ajustes, moderación y estadísticas de grupos. Los cambios requieren permisos.",
    },
  }[locale]
  return { ...base, descriptions: { ...base.descriptions, ...descriptions } }
}

export const commandLanguage = (lang: string) => (lang === "ru" || lang === "es" ? lang : "en")
/** Derive smaller presentation pages without changing the release-owned full reference. */
export function splitCommandReference(markdown: string, lang: string): Record<CommandGroup, string> {
  const body = markdown.replace(/^---\n[\s\S]*?\n---\n/, "")
  const starts = [...body.matchAll(/^#{2,3} `((?:tg|max|wa)(?: [a-z0-9-]+)+)`[^\n]*$/gm)]
  if (!starts.length) throw new Error("Command reference has no command sections")
  const preambleRaw = body.slice(0, starts[0].index)
  const options = /^(?:<a id="[^"\n]+" \/>\n\n)?## [^`].*$/m.exec(preambleRaw)
  const preamble = options ? preambleRaw.slice(options.index) : preambleRaw
  const lastStart = starts.at(-1)?.index ?? body.length
  const tail = body.slice(lastStart)
  const footerMatch = /^(?:<a id="[^"\n]+" \/>\n\n)?## (?!`(?:tg|max|wa))[^\n]+[\s\S]*$/m.exec(tail)
  const footerIndex = footerMatch ? lastStart + footerMatch.index : body.length
  const footer = footerMatch?.[0] ?? ""
  const sections: Record<CommandGroup, string[]> = { personal: [], bot: [], admin: [], setup: [] }
  starts.forEach((match, index) => {
    const part = body.slice(match.index, starts[index + 1]?.index ?? footerIndex)
    sections[commandGroup(match[1])].push(part)
  })
  const text = commandCopy(starts[0][1].split(" ")[0], lang)
  return Object.fromEntries(
    commandGroups.map((group) => [
      group,
      `---\ntitle: "${text[group]}"\ndescription: ${JSON.stringify(text.descriptions[group])}\ncontentLanguage: "${lang}"\n---\n\n${text.descriptions[group]}\n\n${preamble}\n## ${{ en: "Commands", ru: "Команды", es: "Comandos" }[commandLanguage(lang)]}\n\n${sections[group].join("\n")}\n${footer}`,
    ]),
  ) as Record<CommandGroup, string>
}
