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
const adminTopics = new Set(["enable", "create", "edit", "delete", "order"])
export function commandGroup(command: string): CommandGroup {
  const words = command.trim().split(/\s+/).slice(1)
  if (words[0] === "bot") return "bot"
  if (
    words[0] === "groups" ||
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
  if (/^(tg|max)-bot(?:-|$)/.test(value)) return "bot"
  if (
    /^(tg|max)-(?:groups|stats)(?:-|$)/.test(value) ||
    [...adminChat].some((name) => new RegExp(`^(tg|max)-chats-${name}(?:-|$)`).test(value)) ||
    [...adminTopics].some((name) => new RegExp(`^(tg|max)-topics-${name}(?:-|$)`).test(value))
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
      admin:
        "Участники, приглашения, права, модерация, темы форумов и статистика групп и каналов. Изменения требуют соответствующих прав.",
    },
    all: "Полный справочник в Markdown",
    options: "Общие параметры",
    task: "Первые задачи",
    rules: {
      heading: "Как устроены команды",
      items: [
        "Сначала ресурс, потом действие. Ресурс — то, с чем вы работаете: `chats`, `messages`, `contacts`. Действие — что с ним сделать: `list`, `show`, `send`.",
        "Первое слово может быть именем профиля: `{tool} work chats list` показывает чаты профиля `work`. Так одна установка работает с несколькими аккаунтами.",
        "Общие параметры работают с любой командой: `--json` для скриптов и агентов, `--dry-run` для проверки без выполнения, `--offline` для ответа только из локальной копии.",
        "Команда, которая что-то меняет, отмечена в справочнике: «Changes something in {messenger}» меняет данные в мессенджере, «Changes something on this computer only» меняет только файлы на этом компьютере.",
        "Уровни разрешений могут требовать подтверждения перед записью. `--yes` даёт это подтверждение заранее.",
        "Каждый справочник заканчивается кодами выхода. `{tool} commands --json` выводит всё дерево команд в JSON.",
      ],
      links: { profiles: "Профили", permissions: "Разрешения", "cli-contract": "Контракт CLI" },
    },
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
        "Members, invitations, permissions, moderation, forum topics and statistics for groups and channels. Changes require the relevant permissions.",
    },
    all: "Full reference in Markdown",
    options: "Global options",
    task: "First tasks",
    rules: {
      heading: "How commands work",
      items: [
        "Resource first, then the action. The resource is what you work with: `chats`, `messages`, `contacts`. The action is what you do with it: `list`, `show`, `send`.",
        "The first word can be a profile name: `{tool} work chats list` lists the chats of profile `work`. One installation works with several accounts this way.",
        "Global options work with every command: `--json` for scripts and agents, `--dry-run` to check a command without running it, `--offline` to answer from the local copy only.",
        "A command that changes something is marked in the reference: “Changes something in {messenger}” changes data in the messenger, “Changes something on this computer only” changes only files on this computer.",
        "Permission levels can make a write ask for confirmation first. `--yes` gives that confirmation in advance.",
        "Each reference ends with the exit codes. `{tool} commands --json` prints the whole command tree as JSON.",
      ],
      links: { profiles: "Profiles", permissions: "Permissions", "cli-contract": "CLI contract" },
    },
  },
  es: {
    intro:
      "Elige la referencia para tu tarea. Empieza por Primeras tareas si estás conociendo la herramienta; aquí encontrarás comandos, argumentos y opciones exactos.",
    personal: "Cuenta personal",
    bot: "Bots",
    admin: "Administración de grupos y canales",
    descriptions: {
      personal: "Acceso, lectura, búsqueda, archivos, envío, historial y ajustes de tu cuenta.",
      bot: "Conexión del bot, mensajes, eventos y Bot API completa.",
      admin:
        "Miembros, invitaciones, permisos, moderación, temas de foro y estadísticas de grupos y canales. Los cambios requieren los permisos pertinentes.",
    },
    all: "Referencia completa en Markdown",
    options: "Opciones globales",
    task: "Primeras tareas",
    rules: {
      heading: "Cómo funcionan los comandos",
      items: [
        "Primero el recurso, después la acción. El recurso es aquello con lo que trabajas: `chats`, `messages`, `contacts`. La acción es lo que haces con él: `list`, `show`, `send`.",
        "La primera palabra puede ser el nombre de un perfil: `{tool} work chats list` muestra los chats del perfil `work`. Así una instalación trabaja con varias cuentas.",
        "Las opciones globales funcionan con cualquier comando: `--json` para scripts y agentes, `--dry-run` para comprobar un comando sin ejecutarlo, `--offline` para responder solo desde la copia local.",
        "Un comando que cambia algo está marcado en la referencia: «Changes something in {messenger}» cambia datos en el mensajero, «Changes something on this computer only» cambia solo archivos en este ordenador.",
        "Los niveles de permisos pueden pedir confirmación antes de una escritura. `--yes` da esa confirmación por adelantado.",
        "Cada referencia termina con los códigos de salida. `{tool} commands --json` muestra todo el árbol de comandos en JSON.",
      ],
      links: { profiles: "Perfiles", permissions: "Permisos", "cli-contract": "Contrato de la CLI" },
    },
  },
}
export const commandLanguage = (lang: string) => (lang === "ru" || lang === "es" ? lang : "en")
/** Derive smaller presentation pages without changing the release-owned full reference. */
export function splitCommandReference(markdown: string, lang: string): Record<CommandGroup, string> {
  const body = markdown.replace(/^---\n[\s\S]*?\n---\n/, "")
  const starts = [...body.matchAll(/^#{2,3} `((?:tg|max)(?: [a-z0-9-]+)+)`[^\n]*$/gm)]
  if (!starts.length) throw new Error("Command reference has no command sections")
  const preambleRaw = body.slice(0, starts[0].index)
  const options = /^(?:<a id="[^"\n]+" \/>\n\n)?## [^`].*$/m.exec(preambleRaw)
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
