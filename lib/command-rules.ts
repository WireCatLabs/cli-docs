type Lang = "en" | "ru" | "es"
type Rules = { shape: string; items: string[]; links: Record<string, string> }

const heading = { en: "How commands work", ru: "Как устроены команды", es: "Cómo funcionan los comandos" }

const messenger = (tool: string): Record<Lang, Rules> => {
  const name = tool === "max" ? "MAX" : "Telegram"
  return {
    en: {
      shape: `${tool} [profile] [options] <resource> <action> [arguments]`,
      items: [
        "Resource first, then the action. The resource is what you work with: `chats`, `messages`, `contacts`. The action is what you do with it: `list`, `show`, `send`.",
        `Name the profile as the first word: \`${tool} work chats list\` lists the chats of profile \`work\`. Without a profile word or \`${tool.toUpperCase()}_PROFILE\`, the command uses the profile \`default\` even when other profiles exist, so scripts and agents should always name one.`,
        "Global options work with every command: `--json` for scripts and agents, `--dry-run` to check a command without running it, `--offline` to answer from the local copy only.",
        `A command that changes something is marked in the reference: “Changes something in ${name}” changes data in the messenger, “Changes something on this computer only” changes only files on this computer.`,
        "Permission levels can make a write ask for confirmation first. `--yes` gives that confirmation in advance.",
        `Each reference ends with the exit codes. \`${tool} commands --json\` prints the whole command tree as JSON.`,
      ],
      links: { profiles: "Profiles", permissions: "Permissions", "cli-contract": "CLI contract" },
    },
    ru: {
      shape: `${tool} [профиль] [опции] <ресурс> <действие> [аргументы]`,
      items: [
        "Сначала ресурс, потом действие. Ресурс — то, с чем вы работаете: `chats`, `messages`, `contacts`. Действие — что с ним сделать: `list`, `show`, `send`.",
        `Называйте профиль первым словом: \`${tool} work chats list\` показывает чаты профиля \`work\`. Без слова профиля и без \`${tool.toUpperCase()}_PROFILE\` команда берёт профиль \`default\`, даже если есть другие профили. Поэтому скрипты и агенты всегда должны называть профиль.`,
        "Общие параметры работают с любой командой: `--json` для скриптов и агентов, `--dry-run` для проверки без выполнения, `--offline` для ответа только из локальной копии.",
        `Команда, которая что-то меняет, отмечена в справочнике: «Changes something in ${name}» меняет данные в мессенджере, «Changes something on this computer only» меняет только файлы на этом компьютере.`,
        "Уровни разрешений могут требовать подтверждения перед записью. `--yes` даёт это подтверждение заранее.",
        `Каждый справочник заканчивается кодами выхода. \`${tool} commands --json\` выводит всё дерево команд в JSON.`,
      ],
      links: { profiles: "Профили", permissions: "Разрешения", "cli-contract": "Контракт CLI" },
    },
    es: {
      shape: `${tool} [perfil] [opciones] <recurso> <acción> [argumentos]`,
      items: [
        "Primero el recurso, después la acción. El recurso es aquello con lo que trabajas: `chats`, `messages`, `contacts`. La acción es lo que haces con él: `list`, `show`, `send`.",
        `Indica el perfil como primera palabra: \`${tool} work chats list\` muestra los chats del perfil \`work\`. Sin palabra de perfil ni \`${tool.toUpperCase()}_PROFILE\`, el comando usa el perfil \`default\` aunque existan otros perfiles, así que los scripts y agentes deben indicar siempre uno.`,
        "Las opciones globales funcionan con cualquier comando: `--json` para scripts y agentes, `--dry-run` para comprobar un comando sin ejecutarlo, `--offline` para responder solo desde la copia local.",
        `Un comando que cambia algo está marcado en la referencia: «Changes something in ${name}» cambia datos en el mensajero, «Changes something on this computer only» cambia solo archivos en este ordenador.`,
        "Los niveles de permisos pueden pedir confirmación antes de una escritura. `--yes` da esa confirmación por adelantado.",
        `Cada referencia termina con los códigos de salida. \`${tool} commands --json\` muestra todo el árbol de comandos en JSON.`,
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
      "The reference ends with the exit codes. `memo commands --json` prints the whole command tree as JSON.",
    ],
    links: { usage: "Using Memo", recipes: "Recipes", configuration: "Configuration" },
  },
  ru: {
    shape: "memo <ресурс> <действие> [аргументы] [опции]",
    items: [
      "Сначала ресурс, потом действие: `memo notes list`, `memo tasks list`, `memo tags add`.",
      "Команда, которая работает в одном аккаунте мессенджера или почты, принимает `--provider` и `--account`. Memo никогда не выбирает аккаунт за вас.",
      "Большинство команд принимают `--json`, чтобы ответ мог прочитать скрипт или агент.",
      "Справочник заканчивается кодами выхода. `memo commands --json` выводит всё дерево команд в JSON.",
    ],
    links: { usage: "Работа с Memo", recipes: "Рецепты", configuration: "Настройки" },
  },
  es: {
    shape: "memo <recurso> <acción> [argumentos] [opciones]",
    items: [
      "Primero el recurso, después la acción: `memo notes list`, `memo tasks list`, `memo tags add`.",
      "Un comando que trabaja en una cuenta de mensajería o de correo acepta `--provider` y `--account`. Memo nunca elige una cuenta por ti.",
      "La mayoría de los comandos aceptan `--json` para que un script o un agente pueda leer la respuesta.",
      "La referencia termina con los códigos de salida. `memo commands --json` muestra todo el árbol de comandos en JSON.",
    ],
    links: { usage: "Usar Memo", recipes: "Recetas", configuration: "Configuración" },
  },
}

const zm: Record<Lang, Rules> = {
  en: {
    shape: "zm [options] <resource> <action> [arguments]",
    items: [
      "Resource first, then the action: `zm meetings list`, `zm meetings show`, `zm recordings list`.",
      "Global options work with every command: `--json` or `--jsonl` for scripts and agents, `--offline` to refuse network requests, `--no-input` to never start an interactive login.",
      "A command that changes something is marked in the reference: “Changes remote Zoom data” changes data in Zoom, “Changes local data” changes only files on this computer.",
      "Some writes take `--dry-run` to preview the change and `--yes` to confirm it in advance.",
      "The reference ends with the exit codes. `zm commands` lists commands, options and examples, and `--json` gives the same list as JSON.",
    ],
    links: { sessions: "Login", usage: "Usage", configuration: "Configuration" },
  },
  ru: {
    shape: "zm [опции] <ресурс> <действие> [аргументы]",
    items: [
      "Сначала ресурс, потом действие: `zm meetings list`, `zm meetings show`, `zm recordings list`.",
      "Общие параметры работают с любой командой: `--json` или `--jsonl` для скриптов и агентов, `--offline`, чтобы не обращаться к сети, `--no-input`, чтобы никогда не начинать интерактивный вход.",
      "Команда, которая что-то меняет, отмечена в справочнике: «Changes remote Zoom data» меняет данные в Zoom, «Changes local data» меняет только файлы на этом компьютере.",
      "Некоторые команды записи принимают `--dry-run` для предпросмотра изменения и `--yes` для подтверждения заранее.",
      "Справочник заканчивается кодами выхода. `zm commands` перечисляет команды, параметры и примеры, а `--json` выводит тот же список в JSON.",
    ],
    links: { sessions: "Вход", usage: "Работа", configuration: "Настройки" },
  },
  es: {
    shape: "zm [opciones] <recurso> <acción> [argumentos]",
    items: [
      "Primero el recurso, después la acción: `zm meetings list`, `zm meetings show`, `zm recordings list`.",
      "Las opciones globales funcionan con cualquier comando: `--json` o `--jsonl` para scripts y agentes, `--offline` para rechazar peticiones de red, `--no-input` para no iniciar nunca un acceso interactivo.",
      "Un comando que cambia algo está marcado en la referencia: «Changes remote Zoom data» cambia datos en Zoom, «Changes local data» cambia solo archivos en este ordenador.",
      "Algunas escrituras aceptan `--dry-run` para previsualizar el cambio y `--yes` para confirmarlo por adelantado.",
      "La referencia termina con los códigos de salida. `zm commands` enumera comandos, opciones y ejemplos, y `--json` da la misma lista en JSON.",
    ],
    links: { sessions: "Acceso", usage: "Uso", configuration: "Configuración" },
  },
}

const drive: Record<Lang, Rules> = {
  en: {
    shape: "drive <profile> [options] <resource> <action> [arguments]",
    items: [
      "Resource first, then the action: `drive files list`, `drive folders list`, `drive documents show`.",
      "Every account operation needs an explicit profile: `drive personal documents show DOC_ID` or `--profile personal`. Help, discovery, schemas and shell completion need none.",
      "Global options work with every command: `--json` or `--jsonl` for scripts and agents, `--offline` for cached data only, `--read-only` to refuse every change.",
      "`--dry-run` previews a change. `--yes` answers a confirmation, and `--allow-dangerous` is needed for permanent deletion.",
      "The reference ends with the exit codes. `drive commands` lists the command tree, and `drive schema <method>` shows the request schema of one API method.",
    ],
    links: { usage: "Import and storage", recipes: "Recipes", configuration: "Configuration" },
  },
  ru: {
    shape: "drive <профиль> [опции] <ресурс> <действие> [аргументы]",
    items: [
      "Сначала ресурс, потом действие: `drive files list`, `drive folders list`, `drive documents show`.",
      "Каждой операции с аккаунтом нужен явный профиль: `drive personal documents show DOC_ID` или `--profile personal`. Справке, обзору команд, схемам и автодополнению профиль не нужен.",
      "Общие параметры работают с любой командой: `--json` или `--jsonl` для скриптов и агентов, `--offline` только для сохранённых данных, `--read-only`, чтобы запретить любые изменения.",
      "`--dry-run` показывает изменение заранее. `--yes` отвечает на подтверждение, а для безвозвратного удаления нужен `--allow-dangerous`.",
      "Справочник заканчивается кодами выхода. `drive commands` перечисляет дерево команд, а `drive schema <method>` показывает схему запроса одного метода API.",
    ],
    links: { usage: "Импорт и хранение", recipes: "Рецепты", configuration: "Настройки" },
  },
  es: {
    shape: "drive <perfil> [opciones] <recurso> <acción> [argumentos]",
    items: [
      "Primero el recurso, después la acción: `drive files list`, `drive folders list`, `drive documents show`.",
      "Cada operación de cuenta necesita un perfil explícito: `drive personal documents show DOC_ID` o `--profile personal`. La ayuda, el descubrimiento, los esquemas y el autocompletado no lo necesitan.",
      "Las opciones globales funcionan con cualquier comando: `--json` o `--jsonl` para scripts y agentes, `--offline` solo para datos guardados, `--read-only` para rechazar cualquier cambio.",
      "`--dry-run` previsualiza un cambio. `--yes` responde a una confirmación, y `--allow-dangerous` es necesario para el borrado permanente.",
      "La referencia termina con los códigos de salida. `drive commands` enumera el árbol de comandos y `drive schema <method>` muestra el esquema de petición de un método de la API.",
    ],
    links: { usage: "Importación y almacenamiento", recipes: "Recetas", configuration: "Configuración" },
  },
}

export function commandRules(tool: string, lang: string) {
  const language: Lang = lang === "ru" || lang === "es" ? lang : "en"
  const rules =
    tool === "tg" || tool === "max"
      ? messenger(tool)
      : tool === "memo"
        ? memo
        : tool === "zm"
          ? zm
          : tool === "drive"
            ? drive
            : undefined
  return rules && { heading: heading[language], ...rules[language] }
}
