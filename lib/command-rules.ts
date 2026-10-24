type Lang = "en" | "ru" | "es"
type Rules = { shape: string; items: string[]; links: Record<string, string> }

const heading = { en: "How commands work", ru: "Как устроены команды", es: "Cómo funcionan los comandos" }

const listing = (tool: string, parts = false): Record<Lang, string> => ({
  en: `${parts ? "Each reference ends" : "The reference ends"} with the exit codes. \`${tool} commands\` lists every command by section and marks the ones that change something${tool === "wa" ? "." : `; \`${tool} guide\` lists step-by-step scenarios.`} Options are in \`${tool} commands --json\` and \`${tool} <command> --help\`.`,
  ru: `${parts ? "Каждый справочник заканчивается" : "Справочник заканчивается"} кодами выхода. \`${tool} commands\` перечисляет все команды по разделам и отмечает те, что что-то меняют${tool === "wa" ? "." : `; \`${tool} guide\` перечисляет пошаговые сценарии.`} Параметры — в \`${tool} commands --json\` и \`${tool} <command> --help\`.`,
  es: `${parts ? "Cada referencia termina" : "La referencia termina"} con los códigos de salida. \`${tool} commands\` enumera todos los comandos por secciones y marca los que cambian algo${tool === "wa" ? "." : `; \`${tool} guide\` enumera escenarios paso a paso.`} Las opciones están en \`${tool} commands --json\` y \`${tool} <command> --help\`.`,
})

const messenger = (tool: string): Record<Lang, Rules> => {
  const name = tool === "wa" ? "WhatsApp" : tool === "max" ? "MAX" : "Telegram"
  return {
    en: {
      shape: `${tool} [profile] [options] <resource> <action> [arguments]`,
      items: [
        "Resource first, then the action. The resource is what you work with: `chats`, `messages`, `contacts`. The action is what you do with it: `list`, `show`, `send`.",
        `Name the profile as the first word: \`${tool} work chats list\` lists the chats of profile \`work\`. No profile is ever assumed: a command that needs an account and gets none from the first word or \`${tool.toUpperCase()}_PROFILE\` stops and lists your profiles, even when there is only one.`,
        "Global options work with every command: `--json` for scripts and agents, `--dry-run` to check a command without running it, `--offline` to answer from the local copy only.",
        `A command that changes something is marked in the reference: “Changes something in ${name}” changes data in the messenger, “Changes something on this computer only” changes only files on this computer.`,
        "Permission levels can make a write ask for confirmation first. `--yes` gives that confirmation in advance.",
        listing(tool, true).en,
      ],
      links: { profiles: "Profiles", permissions: "Permissions", "cli-contract": "CLI contract" },
    },
    ru: {
      shape: `${tool} [профиль] [опции] <ресурс> <действие> [аргументы]`,
      items: [
        "Сначала ресурс, потом действие. Ресурс — то, с чем вы работаете: `chats`, `messages`, `contacts`. Действие — что с ним сделать: `list`, `show`, `send`.",
        `Называйте профиль первым словом: \`${tool} work chats list\` показывает чаты профиля \`work\`. Профиль никогда не подставляется сам: если команде нужен аккаунт, а профиль не задан ни первым словом, ни \`${tool.toUpperCase()}_PROFILE\`, она останавливается и перечисляет ваши профили, даже если профиль один.`,
        "Общие параметры работают с любой командой: `--json` для скриптов и агентов, `--dry-run` для проверки без выполнения, `--offline` для ответа только из локальной копии.",
        `Команда, которая что-то меняет, отмечена в справочнике: «Changes something in ${name}» меняет данные в мессенджере, «Changes something on this computer only» меняет только файлы на этом компьютере.`,
        "Уровни разрешений могут требовать подтверждения перед записью. `--yes` даёт это подтверждение заранее.",
        listing(tool, true).ru,
      ],
      links: { profiles: "Профили", permissions: "Разрешения", "cli-contract": "Контракт CLI" },
    },
    es: {
      shape: `${tool} [perfil] [opciones] <recurso> <acción> [argumentos]`,
      items: [
        "Primero el recurso, después la acción. El recurso es aquello con lo que trabajas: `chats`, `messages`, `contacts`. La acción es lo que haces con él: `list`, `show`, `send`.",
        `Indica el perfil como primera palabra: \`${tool} work chats list\` muestra los chats del perfil \`work\`. Nunca se asume un perfil: si un comando necesita una cuenta y no recibe perfil por la primera palabra ni por \`${tool.toUpperCase()}_PROFILE\`, se detiene y muestra tus perfiles, aunque solo haya uno.`,
        "Las opciones globales funcionan con cualquier comando: `--json` para scripts y agentes, `--dry-run` para comprobar un comando sin ejecutarlo, `--offline` para responder solo desde la copia local.",
        `Un comando que cambia algo está marcado en la referencia: «Changes something in ${name}» cambia datos en el mensajero, «Changes something on this computer only» cambia solo archivos en este ordenador.`,
        "Los niveles de permisos pueden pedir confirmación antes de una escritura. `--yes` da esa confirmación por adelantado.",
        listing(tool, true).es,
      ],
      links: { profiles: "Perfiles", permissions: "Permisos", "cli-contract": "Contrato de la CLI" },
    },
  }
}

const memo: Record<Lang, Rules> = {
  en: {
    shape: "memo <resource> <action> [arguments] [options]",
    items: [
      "Resource first, then the action: `memo notes list`, `memo tasks list`, `memo tags add`.",
      "A command that works in one messenger or mail account takes `--provider` and `--account`. Memo never chooses an account for you.",
      "Most commands take `--json` for an answer a script or agent can read.",
      listing("memo").en,
    ],
    links: { usage: "Using Memo", recipes: "Recipes", configuration: "Configuration" },
  },
  ru: {
    shape: "memo <ресурс> <действие> [аргументы] [опции]",
    items: [
      "Сначала ресурс, потом действие: `memo notes list`, `memo tasks list`, `memo tags add`.",
      "Команда, которая работает в одном аккаунте мессенджера или почты, принимает `--provider` и `--account`. Memo никогда не выбирает аккаунт за вас.",
      "Большинство команд принимают `--json`, чтобы ответ мог прочитать скрипт или агент.",
      listing("memo").ru,
    ],
    links: { usage: "Работа с Memo", recipes: "Рецепты", configuration: "Настройки" },
  },
  es: {
    shape: "memo <recurso> <acción> [argumentos] [opciones]",
    items: [
      "Primero el recurso, después la acción: `memo notes list`, `memo tasks list`, `memo tags add`.",
      "Un comando que trabaja en una cuenta de mensajería o de correo acepta `--provider` y `--account`. Memo nunca elige una cuenta por ti.",
      "La mayoría de los comandos aceptan `--json` para que un script o un agente pueda leer la respuesta.",
      listing("memo").es,
    ],
    links: { usage: "Usar Memo", recipes: "Recetas", configuration: "Configuración" },
  },
}

const zm: Record<Lang, Rules> = {
  en: {
    shape: "zm <profile> [options] <resource> <action> [arguments]",
    items: [
      "Name the profile as the first word, then the resource and action: `zm personal meetings list`, `zm personal meetings show`, `zm personal recordings list`. No profile is ever assumed; `ZM_PROFILE` names one for a whole shell. Help, `doctor`, `guide` and `skill` need none.",
      "Global options work with every command: `--json` or `--jsonl` for scripts and agents, `--offline` to refuse network requests, `--no-input` to never start an interactive login.",
      "A command that changes something is marked in the reference: “Changes remote Zoom data” changes data in Zoom, “Changes local data” changes only files on this computer.",
      "Some writes take `--dry-run` to preview the change and `--yes` to confirm it in advance.",
      listing("zm").en,
    ],
    links: { sessions: "Login", usage: "Usage", configuration: "Configuration" },
  },
  ru: {
    shape: "zm <профиль> [опции] <ресурс> <действие> [аргументы]",
    items: [
      "Первым словом укажите профиль, затем ресурс и действие: `zm personal meetings list`, `zm personal meetings show`, `zm personal recordings list`. Профиль никогда не подставляется сам; `ZM_PROFILE` задаёт его для всей оболочки. Справке, `doctor`, `guide` и `skill` профиль не нужен.",
      "Общие параметры работают с любой командой: `--json` или `--jsonl` для скриптов и агентов, `--offline`, чтобы не обращаться к сети, `--no-input`, чтобы никогда не начинать интерактивный вход.",
      "Команда, которая что-то меняет, отмечена в справочнике: «Changes remote Zoom data» меняет данные в Zoom, «Changes local data» меняет только файлы на этом компьютере.",
      "Некоторые команды записи принимают `--dry-run` для предпросмотра изменения и `--yes` для подтверждения заранее.",
      listing("zm").ru,
    ],
    links: { sessions: "Вход", usage: "Работа", configuration: "Настройки" },
  },
  es: {
    shape: "zm <perfil> [opciones] <recurso> <acción> [argumentos]",
    items: [
      "Indica el perfil como primera palabra y después el recurso y la acción: `zm personal meetings list`, `zm personal meetings show`, `zm personal recordings list`. Nunca se asume un perfil; `ZM_PROFILE` lo fija para toda la shell. La ayuda, `doctor`, `guide` y `skill` no lo necesitan.",
      "Las opciones globales funcionan con cualquier comando: `--json` o `--jsonl` para scripts y agentes, `--offline` para rechazar peticiones de red, `--no-input` para no iniciar nunca un acceso interactivo.",
      "Un comando que cambia algo está marcado en la referencia: «Changes remote Zoom data» cambia datos en Zoom, «Changes local data» cambia solo archivos en este ordenador.",
      "Algunas escrituras aceptan `--dry-run` para previsualizar el cambio y `--yes` para confirmarlo por adelantado.",
      listing("zm").es,
    ],
    links: { sessions: "Acceso", usage: "Uso", configuration: "Configuración" },
  },
}

const drive: Record<Lang, Rules> = {
  en: {
    shape: "drive <profile> [options] <resource> <action> [arguments]",
    items: [
      "Name the profile, then the resource and action: `drive personal files list`, `drive personal folders list`, `drive personal documents show DOC_ID`.",
      "Every account operation needs an explicit profile: `drive personal documents show DOC_ID` or `--profile personal`. Help, discovery, schemas and shell completion need none.",
      "Global options work with every command: `--json` or `--jsonl` for scripts and agents, `--offline` for cached data only, `--read-only` to refuse every change.",
      "`--dry-run` previews a change. At a terminal, `--yes` answers a policy confirmation and `--allow-dangerous` answers a permanent-deletion confirmation. Under MCP, `ask` proceeds without a terminal prompt; use `deny` or `readonly` to block changes.",
      listing("drive").en,
      "`drive api show <method>` shows the request schema of one API method.",
    ],
    links: { usage: "Import and storage", recipes: "Recipes", configuration: "Configuration" },
  },
  ru: {
    shape: "drive <профиль> [опции] <ресурс> <действие> [аргументы]",
    items: [
      "Укажите профиль, затем ресурс и действие: `drive personal files list`, `drive personal folders list`, `drive personal documents show DOC_ID`.",
      "Каждой операции с аккаунтом нужен явный профиль: `drive personal documents show DOC_ID` или `--profile personal`. Справке, обзору команд, схемам и автодополнению профиль не нужен.",
      "Общие параметры работают с любой командой: `--json` или `--jsonl` для скриптов и агентов, `--offline` только для сохранённых данных, `--read-only`, чтобы запретить любые изменения.",
      "`--dry-run` показывает изменение заранее. В терминале `--yes` отвечает на подтверждение политики, а `--allow-dangerous` — на подтверждение безвозвратного удаления. Через MCP уровень `ask` выполняет действие без запроса в терминале; используйте `deny` или `readonly`, чтобы запретить изменения.",
      listing("drive").ru,
      "`drive api show <method>` показывает схему запроса одного метода API.",
    ],
    links: { usage: "Импорт и хранение", recipes: "Рецепты", configuration: "Настройки" },
  },
  es: {
    shape: "drive <perfil> [opciones] <recurso> <acción> [argumentos]",
    items: [
      "Indica el perfil, después el recurso y la acción: `drive personal files list`, `drive personal folders list`, `drive personal documents show DOC_ID`.",
      "Cada operación de cuenta necesita un perfil explícito: `drive personal documents show DOC_ID` o `--profile personal`. La ayuda, el descubrimiento, los esquemas y el autocompletado no lo necesitan.",
      "Las opciones globales funcionan con cualquier comando: `--json` o `--jsonl` para scripts y agentes, `--offline` solo para datos guardados, `--read-only` para rechazar cualquier cambio.",
      "`--dry-run` previsualiza un cambio. En la terminal, `--yes` responde a una confirmación de política y `--allow-dangerous` a la de borrado permanente. En MCP, `ask` ejecuta sin preguntar en la terminal; usa `deny` o `readonly` para bloquear cambios.",
      listing("drive").es,
      "`drive api show <method>` muestra el esquema de petición de un método de la API.",
    ],
    links: { usage: "Importación y almacenamiento", recipes: "Recetas", configuration: "Configuración" },
  },
}

export function commandRules(tool: string, lang: string) {
  const language: Lang = lang === "ru" || lang === "es" ? lang : "en"
  const rules =
    tool === "tg" || tool === "max" || tool === "wa"
      ? messenger(tool)
      : tool === "memo"
        ? memo
        : tool === "zm"
          ? zm
          : tool === "drive"
            ? drive
            : undefined
  if (!rules) return
  const selected = rules[language]
  const unsupported = {
    en: "The shared reference includes paths WhatsApp cannot run. Those commands stop with exit code 2 before any account action; check the personal-account guide’s current limitations.",
    ru: "Общий справочник включает команды, которые WhatsApp не поддерживает. Они завершаются с кодом 2 до действия в аккаунте; проверьте текущие ограничения в руководстве личного аккаунта.",
    es: "La referencia compartida incluye comandos que WhatsApp no admite. Terminan con código 2 antes de actuar en la cuenta; consulta las limitaciones de la guía personal.",
  }[language]
  return {
    heading: heading[language],
    ...selected,
    items: tool === "wa" ? [...selected.items, unsupported] : selected.items,
    links:
      tool === "wa"
        ? {
            ...selected.links,
            "usage#not-in-wa-yet": {
              en: "Current limitations",
              ru: "Текущие ограничения",
              es: "Limitaciones actuales",
            }[language],
          }
        : selected.links,
  }
}
