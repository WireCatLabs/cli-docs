const terms = {
  vault: {
    en: {
      title: "Obsidian vault",
      description:
        "A folder of notes that Obsidian opens as one workspace. The notes are Markdown files on your computer, often organised in subfolders. Memo reads these files; it does not need Obsidian to be open.",
      page: "memo",
    },
    ru: {
      title: "Хранилище Obsidian",
      description:
        "Папка заметок, которую Obsidian открывает как одно рабочее пространство. Заметки — это файлы Markdown на компьютере, часто разложенные по подпапкам. Memo читает эти файлы; держать Obsidian открытым не нужно.",
      page: "memo",
    },
    es: {
      title: "Bóveda de Obsidian",
      description:
        "Una carpeta de notas que Obsidian abre como un espacio de trabajo. Las notas son archivos Markdown en tu ordenador, a menudo organizados en subcarpetas. Memo lee esos archivos; no necesita que Obsidian esté abierto.",
      page: "memo",
    },
  },
  markdown: {
    en: {
      title: "Markdown",
      description:
        "Plain-text files, usually ending in .md or .markdown, with simple marks for headings, lists and links. You can open them in a text editor. Obsidian stores its notes in this format.",
      page: "memo",
    },
    ru: {
      title: "Markdown",
      description:
        "Текстовые файлы, обычно с расширением .md или .markdown, с простыми обозначениями заголовков, списков и ссылок. Их можно открыть в текстовом редакторе. Obsidian хранит заметки в этом формате.",
      page: "memo",
    },
    es: {
      title: "Markdown",
      description:
        "Archivos de texto, normalmente con extensión .md o .markdown, con marcas sencillas para títulos, listas y enlaces. Puedes abrirlos en un editor de texto. Obsidian guarda sus notas en este formato.",
      page: "memo",
    },
  },

  agent: {
    en: {
      title: "AI agent",
      description:
        "An AI agent you give tasks to in everyday language, such as Claude Code, Codex or Cursor. It can use connected tools to find messages, summarise conversations and prepare replies. It gets access to your conversations after you connect your account.",
      page: "agents",
    },
    ru: {
      title: "ИИ-агент",
      description:
        "ИИ-агент, которому вы задаёте задачи обычным языком: например, Claude Code, Codex или Cursor. Он может пользоваться подключёнными инструментами, чтобы искать сообщения, разбирать переписки и готовить ответы. Доступ к переписке появляется после подключения вашего аккаунта.",
      page: "agents",
    },
    es: {
      title: "Agente de IA",
      description:
        "Un agente de IA al que pides tareas con tus propias palabras, como Claude Code, Codex o Cursor. Usa herramientas conectadas para buscar mensajes, resumir conversaciones y preparar respuestas. Accede a tus conversaciones después de que conectes tu cuenta.",
      page: "agents",
    },
  },
  cli: {
    en: {
      title: "CLI",
      description:
        "A program that runs through text commands, such as tg, max or memo. Your agent runs the commands for your task; you do not need to memorise them to get started.",
      page: "installation",
    },
    ru: {
      title: "CLI",
      description:
        "Программа, которую запускают текстовыми командами, например tg, max или memo. Агент выполняет команды для вашей задачи; чтобы начать, вам не нужно запоминать их.",
      page: "installation",
    },
    es: {
      title: "CLI",
      description:
        "Un programa que se ejecuta con comandos de texto, como tg, max o memo. El agente ejecuta los comandos necesarios para tu tarea; no tienes que aprenderlos de memoria para empezar.",
      page: "installation",
    },
  },
  mcp: {
    en: {
      title: "MCP",
      description:
        "A way to connect tools to an AI agent. The agent can then request chats or messages through that connection. This works with clients such as Claude Desktop, where the agent does not run terminal commands directly.",
      page: "mcp",
    },
    ru: {
      title: "MCP",
      description:
        "Способ подключить инструменты к ИИ-агенту. После подключения агент может запрашивать чаты и сообщения через это соединение. Такой вариант подходит, например, для Claude Desktop, где агент не запускает команды терминала напрямую.",
      page: "mcp",
    },
    es: {
      title: "MCP",
      description:
        "Una forma de conectar herramientas a un agente de IA. Después, el agente puede solicitar chats o mensajes mediante esa conexión. Sirve para clientes como Claude Desktop, donde el agente no ejecuta comandos de terminal directamente.",
      page: "mcp",
    },
  },
  "local-agent": {
    en: {
      title: "Local agent",
      description:
        "An AI agent that can run commands on your computer, for example Claude Code, Codex, Cursor or Gemini CLI. A chat in the browser without terminal access cannot install the cli for you.",
      page: "agents",
    },
    ru: {
      title: "Локальный агент",
      description:
        "ИИ-агент, который может запускать команды на вашем компьютере, например Claude Code, Codex, Cursor или Gemini CLI. Чат в браузере без доступа к терминалу не сможет установить cli за вас.",
      page: "agents",
    },
    es: {
      title: "Agente local",
      description:
        "Un agente de IA que puede ejecutar comandos en tu ordenador, por ejemplo Claude Code, Codex, Cursor o Gemini CLI. Un chat en el navegador sin acceso a la terminal no puede instalar el cli por ti.",
      page: "agents",
    },
  },
  skill: {
    en: {
      title: "Agent skill",
      description:
        "An instruction file that teaches your agent how to use tg or max. It contains command guidance, not your login details. Installation may already have added it; you can check with tg skill show or max skill show.",
      page: "agents",
    },
    ru: {
      title: "Skill — навык агента",
      description:
        "Файл инструкции, который учит вашего агента пользоваться tg или max. В нём описаны команды, а не данные входа в аккаунт. Установка могла уже добавить его; проверить можно через tg skill show или max skill show.",
      page: "agents",
    },
    es: {
      title: "Skill del agente",
      description:
        "Un archivo de instrucciones que enseña al agente a usar tg o max. Describe comandos, no tus datos de acceso. Puede haberse añadido durante la instalación; compruébalo con tg skill show o max skill show.",
      page: "agents",
    },
  },
  nodejs: {
    en: {
      title: "Node.js",
      description:
        "The program that runs tools such as tg, max and memo on your computer. Your agent can check whether it is installed and help set it up.",
      page: "installation#nodejs",
    },
    ru: {
      title: "Node.js",
      description:
        "Программа для запуска инструментов tg, max и memo на вашем компьютере. Агент может проверить, установлена ли она, и помочь с настройкой.",
      page: "installation#nodejs",
    },
    es: {
      title: "Node.js",
      description:
        "El programa que ejecuta herramientas como tg, max y memo en tu ordenador. Tu agente puede comprobar si está instalado y ayudarte a configurarlo.",
      page: "installation#nodejs",
    },
  },
  npm: {
    en: {
      title: "npm",
      description:
        "A package installer that comes with Node.js. Your agent uses it to download and install tools such as tg, max and memo, and to update it later.",
      page: "installation#nodejs",
    },
    ru: {
      title: "npm",
      description:
        "Установщик программ, который входит в Node.js. С его помощью агент скачает и установит инструменты tg, max и memo, а позже сможет обновить его.",
      page: "installation#nodejs",
    },
    es: {
      title: "npm",
      description:
        "Un instalador de paquetes que viene con Node.js. El agente lo usa para descargar e instalar herramientas como tg, max y memo y actualizarla más adelante.",
      page: "installation#nodejs",
    },
  },
  "telegram-app": {
    en: {
      title: "Telegram application",
      description:
        "An application is a program that works with Telegram, such as the app on your phone or the tool your agent uses. Telegram requires this program to be registered before it can request your messages and contacts. Setup obtains that registration for you; you approve account access when you log in.",
      page: "tg/sessions",
    },
    ru: {
      title: "Приложение Telegram",
      description:
        "Приложение — это программа для работы с Telegram: например, клиент на телефоне или инструмент вашего агента. Telegram просит зарегистрировать программу, которая будет запрашивать ваши сообщения и контакты. При настройке мы получим данные этой регистрации; доступ к аккаунту вы подтверждаете при входе.",
      page: "tg/sessions",
    },
    es: {
      title: "Aplicación de Telegram",
      description:
        "Una aplicación es un programa que trabaja con Telegram, como la app del teléfono o la herramienta de tu agente. Telegram pide registrar el programa que va a solicitar tus mensajes y contactos. La configuración obtiene ese registro; tú autorizas el acceso a la cuenta al iniciar sesión.",
      page: "tg/sessions",
    },
  },
  tunnel: {
    en: {
      title: "Tunnel",
      description:
        "A service that gives a program on your computer a public https address, so apps on the internet can reach it while your computer stays behind your home router. Nothing else on your computer becomes reachable. We use Tailscale Funnel; it closes when you stop it.",
      page: "browser-apps",
    },
    ru: {
      title: "Туннель",
      description:
        "Сервис, который даёт программе на вашем компьютере публичный адрес https, чтобы приложения из интернета могли до неё достучаться, хотя компьютер остаётся за домашним роутером. Больше ничего на компьютере доступным не становится. Мы используем Tailscale Funnel; он закрывается, когда вы его останавливаете.",
      page: "browser-apps",
    },
    es: {
      title: "Túnel",
      description:
        "Un servicio que da a un programa de tu ordenador una dirección https pública, para que las apps de internet lleguen a él aunque tu ordenador siga detrás del router. Nada más de tu ordenador queda accesible. Usamos Tailscale Funnel; se cierra cuando lo detienes.",
      page: "browser-apps",
    },
  },
  tailscale: {
    en: {
      title: "Tailscale",
      description:
        "A free service that connects your devices into a private network. Its Funnel feature publishes one port of your computer at an address like https://laptop.tail1234.ts.net, with a certificate, so no domain or router setup is needed.",
      page: "browser-apps",
    },
    ru: {
      title: "Tailscale",
      description:
        "Бесплатный сервис, который объединяет ваши устройства в частную сеть. Его функция Funnel открывает один порт компьютера по адресу вида https://laptop.tail1234.ts.net, с сертификатом, поэтому ни домен, ни настройка роутера не нужны.",
      page: "browser-apps",
    },
    es: {
      title: "Tailscale",
      description:
        "Un servicio gratuito que une tus dispositivos en una red privada. Su función Funnel publica un puerto de tu ordenador en una dirección como https://laptop.tail1234.ts.net, con certificado, así que no hace falta dominio ni configurar el router.",
      page: "browser-apps",
    },
  },
  connector: {
    en: {
      title: "Connector",
      description:
        "What Claude and ChatGPT call a tool you add from outside: you give the app an address, sign in once, and the agent can then call that tool in your chats. The name may be plugin, app or connector, depending on the AI client.",
      page: "browser-apps",
    },
    ru: {
      title: "Коннектор",
      description:
        "Так Claude и ChatGPT называют инструмент, который вы добавляете извне: даёте приложению адрес, один раз входите, и ассистент может пользоваться этим инструментом в ваших чатах. Название зависит от приложения: плагин, приложение или коннектор.",
      page: "browser-apps",
    },
    es: {
      title: "Conector",
      description:
        "Así llaman Claude y ChatGPT a una herramienta que añades desde fuera: le das a la app una dirección, inicias sesión una vez y el agente puede usarla en tus chats. El nombre puede ser plugin, aplicación o conector según el cliente de IA.",
      page: "browser-apps",
    },
  },
  "supported-agents": {
    en: {
      title: "Compatible agents",
      description:
        "Guides cover Claude Code, Codex, Cursor, Gemini CLI, Hermes and OpenClaw. Other agents can use these tools too if they can run commands or connect through MCP. The agent guide explains both routes.",
      page: "agents",
    },
    ru: {
      title: "Подходящие агенты",
      description:
        "Есть инструкции для Claude Code, Codex, Cursor, Gemini CLI, Hermes и OpenClaw. Другие ассистенты тоже могут работать с инструментами, если умеют выполнять команды или подключаться через MCP. Оба варианта описаны на странице агентов.",
      page: "agents",
    },
    es: {
      title: "Agentes compatibles",
      description:
        "Hay guías para Claude Code, Codex, Cursor, Gemini CLI, Hermes y OpenClaw. Otros agentes también pueden usar las herramientas si ejecutan comandos o se conectan mediante MCP. La guía explica ambas opciones.",
      page: "agents",
    },
  },
  terminal: {
    en: {
      title: "Terminal",
      description:
        "An app where you paste text commands and see their results. Use PowerShell on Windows or Terminal on macOS; on Linux, open your terminal app.",
      page: "installation",
    },
    ru: {
      title: "Терминал",
      description:
        "Приложение, куда вставляют текстовые команды и где виден результат их выполнения. В Windows используйте PowerShell, в macOS — Terminal, в Linux — приложение терминала.",
      page: "installation",
    },
    es: {
      title: "Terminal",
      description:
        "Una aplicación donde pegas comandos de texto y ves el resultado. En Windows usa PowerShell; en macOS, Terminal; en Linux, tu aplicación de terminal.",
      page: "installation",
    },
  },
  "public-address": {
    en: {
      title: "Public HTTPS address",
      description:
        "An internet address your AI app can reach, even when your messenger tool runs on your computer. The messenger server still requires sign-in; knowing the address alone does not grant account access.",
      page: "browser-apps",
    },
    ru: {
      title: "Публичный HTTPS-адрес",
      description:
        "Адрес в интернете, по которому ИИ-приложение может обратиться к программе на вашем компьютере. Сервер мессенджера по-прежнему требует входа: одного знания адреса недостаточно для доступа к аккаунту.",
      page: "browser-apps",
    },
    es: {
      title: "Dirección HTTPS pública",
      description:
        "Una dirección de internet desde la que la aplicación de IA llega al programa de tu ordenador. El servidor del mensajero sigue exigiendo autenticación; conocer la dirección no da acceso a la cuenta.",
      page: "browser-apps",
    },
  },
  oauth: {
    en: {
      title: "OAuth",
      description:
        "A way to sign into this connection and approve access for the named AI app. Here you use the one-time code from your messenger server, not your Telegram or MAX login code.",
      page: "browser-apps",
    },
    ru: {
      title: "OAuth",
      description:
        "Способ войти в подключение и разрешить доступ указанному ИИ-приложению. Здесь используется одноразовый код сервера мессенджера, а не код входа в Telegram или MAX.",
      page: "browser-apps",
    },
    es: {
      title: "OAuth",
      description:
        "Una forma de autenticar la conexión y autorizar a la aplicación de IA indicada. Aquí usas el código de un solo uso del servidor, no el código de acceso de Telegram o MAX.",
      page: "browser-apps",
    },
  },
  profile: {
    en: {
      title: "Profile",
      description:
        "A name for a particular account or bot and its settings, such as work. It helps you choose the right account and permissions when you have several.",
      page: "profiles",
    },
    ru: {
      title: "Профиль",
      description:
        "Имя для определённого аккаунта или бота и его настроек, например work. Помогает выбрать нужный аккаунт и права, когда их несколько.",
      page: "profiles",
    },
    es: {
      title: "Perfil",
      description:
        "Un nombre para una cuenta o bot y sus ajustes, por ejemplo work. Permite elegir la cuenta y los permisos adecuados cuando tienes varios.",
      page: "profiles",
    },
  },
  "local-archive": {
    en: {
      title: "Local archive",
      description:
        "Messages saved on the computer running the tool. Search uses this copy; only downloaded chats and periods can be checked.",
      page: "search",
    },
    ru: {
      title: "Локальный архив",
      description:
        "Сообщения, сохранённые на компьютере с инструментом. Поиск работает по этой копии: проверить можно только скачанные чаты и периоды.",
      page: "search",
    },
    es: {
      title: "Archivo local",
      description:
        "Mensajes guardados en el ordenador que ejecuta la herramienta. La búsqueda usa esta copia y solo comprueba los chats y periodos descargados.",
      page: "search",
    },
  },
  "speech-model": {
    en: {
      title: "Speech model",
      description:
        "A downloaded program component that turns recordings into text on your computer. It needs disk space and time to run; names and numbers can be misrecognised.",
      page: "prompting#files-and-voice",
    },
    ru: {
      title: "Речевая модель",
      description:
        "Скачиваемый компонент программы, который превращает запись в текст на вашем компьютере. Ему нужны место на диске и время на обработку; имена и числа могут распознаваться с ошибками.",
      page: "prompting#files-and-voice",
    },
    es: {
      title: "Modelo de voz",
      description:
        "Un componente que se descarga para convertir grabaciones en texto en tu ordenador. Necesita espacio y tiempo de procesamiento; puede interpretar mal nombres y cifras.",
      page: "prompting#files-and-voice",
    },
  },
  flag: {
    en: {
      title: "Command option",
      description:
        "An extra instruction such as --limit 5, added to a command to change that run. Supported options are listed in --help.",
      page: "configuration",
    },
    ru: {
      title: "Параметр команды",
      description:
        "Дополнительное указание вроде --limit 5, которое добавляют к команде, чтобы изменить этот запуск. Доступные параметры перечислены в --help.",
      page: "configuration",
    },
    es: {
      title: "Opción del comando",
      description:
        "Una indicación adicional como --limit 5 que cambia esa ejecución. Las opciones disponibles aparecen en --help.",
      page: "configuration",
    },
  },
  "bot-token": {
    en: {
      title: "Bot token",
      description:
        "A secret issued for your bot that authorises programs to act as that bot. It is separate from your personal-account login; store it through the bot setup command.",
      page: "bot-api",
    },
    ru: {
      title: "Токен бота",
      description:
        "Секретный ключ вашего бота, с которым программа может действовать от его имени. Он не связан со входом в личный аккаунт; сохраните его через команду подключения бота.",
      page: "bot-api",
    },
    es: {
      title: "Token del bot",
      description:
        "Una clave secreta que permite al programa actuar como tu bot. Es independiente del acceso a tu cuenta personal; guárdala con el comando de configuración del bot.",
      page: "bot-api",
    },
  },
  evals: {
    en: {
      title: "Agent evaluations",
      description:
        "Test tasks used to observe how an agent handles sources, permissions and missing data. Passing examples does not guarantee the same result on every real conversation.",
      page: "security",
    },
    ru: {
      title: "Проверки поведения агента",
      description:
        "Тестовые задачи, на которых проверяют работу ассистента с источниками, правами и неполными данными. Успешные примеры не гарантируют тот же результат в любой реальной переписке.",
      page: "security",
    },
    es: {
      title: "Evaluaciones del agente",
      description:
        "Tareas de prueba que observan cómo usa el agente las fuentes, permisos y datos incompletos. Superarlas no garantiza el mismo resultado en toda conversación real.",
      page: "security",
    },
  },
}

export type DocTermId = keyof typeof terms

export function docTerm(term: DocTermId, lang: string) {
  const entry = terms[term]
  if (!entry) throw new Error(`Unknown documentation term: ${term}`)
  return entry[lang as keyof typeof entry] ?? entry.en
}
