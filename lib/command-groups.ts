export type CommandGroup = "personal" | "bot" | "admin"
export const commandGroups: CommandGroup[] = ["personal", "bot", "admin"]
const adminChat = new Set([
  "create",
  "update",
  "photo",
  "delete",
  "moderate",
  "check",
  "members",
  "invite",
  "invites",
  "link",
  "requests",
  "join-requests",
  "permissions",
  "pin",
  "unpin",
  "admins",
])
export function commandGroup(command: string): CommandGroup {
  const words = command.trim().split(/\s+/).slice(1)
  if (words[0] === "bot") return "bot"
  if (words[0] === "groups" || (words[0] === "chats" && adminChat.has(words[1]))) return "admin"
  return "personal"
}
export function commandGroupForAnchor(anchor: string): CommandGroup {
  let value: string
  try {
    value = decodeURIComponent(anchor).replace(/^#/, "")
  } catch {
    return "personal"
  }
  if (/^(tg|max)-bot(?:-|$)/.test(value)) return "bot"
  if (
    /^(tg|max)-groups(?:-|$)/.test(value) ||
    [...adminChat].some((name) => new RegExp(`^(tg|max)-chats-${name}(?:-|$)`).test(value))
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
    descriptions: {
      personal: "Вход, чтение, поиск, файлы, отправка, архив и настройки своего аккаунта.",
      bot: "Подключение бота, сообщения, события и полный Bot API.",
      admin: "Участники, приглашения, права и модерация групп и каналов. Нужные действия требуют соответствующих прав.",
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
    descriptions: {
      personal: "Login, reading, search, files, sending, archive and your account settings.",
      bot: "Bot connection, messages, updates and the full Bot API.",
      admin:
        "Members, invitations, permissions and moderation for groups and channels. Actions require the relevant permissions.",
    },
    all: "Full reference in Markdown",
    options: "Global options",
    task: "First tasks",
  },
  es: {
    intro:
      "Elige la referencia para tu tarea. Empieza por Primeras tareas si estás conociendo el instrumento; aquí encontrarás comandos, argumentos y opciones exactos.",
    personal: "Cuenta personal",
    bot: "Bots",
    admin: "Administración de grupos y canales",
    descriptions: {
      personal: "Acceso, lectura, búsqueda, archivos, envío, historial y ajustes de tu cuenta.",
      bot: "Conexión del bot, mensajes, eventos y Bot API completa.",
      admin:
        "Miembros, invitaciones, permisos y moderación de grupos y canales. Las acciones requieren los permisos pertinentes.",
    },
    all: "Referencia completa en Markdown",
    options: "Opciones globales",
    task: "Primeras tareas",
  },
}
export const commandLanguage = (lang: string) => (lang === "ru" || lang === "es" ? lang : "en")
/** Derive smaller presentation pages without changing the release-owned full reference. */
export function splitCommandReference(markdown: string, lang: string): Record<CommandGroup, string> {
  const body = markdown.replace(/^---\n[\s\S]*?\n---\n/, "")
  const starts = [...body.matchAll(/^#{2,3} `((?:tg|max)(?: [a-z0-9-]+)+)`[^\n]*$/gm)]
  if (!starts.length) throw new Error("Command reference has no command sections")
  const preambleRaw = body.slice(0, starts[0].index)
  const options = /^## [^`].*$/m.exec(preambleRaw)
  const preamble = options ? preambleRaw.slice(options.index) : preambleRaw
  const lastStart = starts.at(-1)?.index ?? body.length
  const tail = body.slice(lastStart)
  const footerMatch = /^(?:<a id="[^"\n]+" \/>\n\n)?## (?!`(?:tg|max))[^\n]+[\s\S]*$/m.exec(tail)
  const footerIndex = footerMatch ? lastStart + footerMatch.index : body.length
  const footer = footerMatch?.[0] ?? ""
  const sections: Record<CommandGroup, string[]> = { personal: [], bot: [], admin: [] }
  starts.forEach((match, index) => {
    const part = body.slice(match.index, starts[index + 1]?.index ?? footerIndex)
    sections[commandGroup(match[1])].push(part)
  })
  const text = commandGroupCopy[commandLanguage(lang)]
  return Object.fromEntries(
    commandGroups.map((group) => [
      group,
      `---\ntitle: "${text[group]}"\ndescription: ${JSON.stringify(text.descriptions[group])}\ncontentLanguage: "${lang}"\n---\n\n${text.descriptions[group]}\n\n${preamble}\n## ${{ en: "Commands", ru: "Команды", es: "Comandos" }[commandLanguage(lang)]}\n\n${sections[group].join("\n")}\n${footer}`,
    ]),
  ) as Record<CommandGroup, string>
}
