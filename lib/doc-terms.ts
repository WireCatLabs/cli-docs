const terms = {
  agent: {
    en: {
      title: "AI agent",
      description:
        "An AI assistant you give tasks to in everyday language, such as Claude Code, Codex or Cursor. It can use connected tools to find messages, summarise conversations and prepare replies. It gets access to your conversations after you connect your account.",
      page: "agents",
    },
    ru: {
      title: "ИИ-агент",
      description:
        "ИИ-помощник, которому вы задаёте задачи обычным языком: например, Claude Code, Codex или Cursor. Он может пользоваться подключёнными инструментами, чтобы искать сообщения, разбирать переписки и готовить ответы. Доступ к переписке появляется после подключения вашего аккаунта.",
      page: "agents",
    },
    es: {
      title: "Agente de IA",
      description:
        "Un asistente de IA al que pides tareas con tus propias palabras, como Claude Code, Codex o Cursor. Usa herramientas conectadas para buscar mensajes, resumir conversaciones y preparar respuestas. Accede a tus conversaciones después de que conectes tu cuenta.",
      page: "agents",
    },
  },
  cli: {
    en: {
      title: "CLI",
      description:
        "A program that runs through text commands. Here, tg connects to Telegram and max connects to MAX. Your agent runs the commands for your task; you do not need to memorise them to get started.",
      page: "installation",
    },
    ru: {
      title: "CLI",
      description:
        "Программа, которую запускают текстовыми командами. Здесь tg подключается к Telegram, а max — к MAX. Агент выполняет команды для вашей задачи; чтобы начать, вам не нужно запоминать их.",
      page: "installation",
    },
    es: {
      title: "CLI",
      description:
        "Un programa que se ejecuta con comandos de texto. Aquí tg conecta con Telegram y max con MAX. El agente ejecuta los comandos necesarios para tu tarea; no tienes que aprenderlos de memoria para empezar.",
      page: "installation",
    },
  },
  mcp: {
    en: {
      title: "MCP",
      description:
        "A way to connect tools to an AI assistant. The agent can then request chats or messages through that connection. This works with clients such as Claude Desktop, where the agent does not run terminal commands directly.",
      page: "mcp",
    },
    ru: {
      title: "MCP",
      description:
        "Способ подключить инструменты к ИИ-помощнику. После подключения агент может запрашивать чаты и сообщения через это соединение. Такой вариант подходит, например, для Claude Desktop, где агент не запускает команды терминала напрямую.",
      page: "mcp",
    },
    es: {
      title: "MCP",
      description:
        "Una forma de conectar herramientas a un asistente de IA. Después, el agente puede solicitar chats o mensajes mediante esa conexión. Sirve para clientes como Claude Desktop, donde el agente no ejecuta comandos de terminal directamente.",
      page: "mcp",
    },
  },
  "local-agent": {
    en: {
      title: "Local agent",
      description:
        "An AI assistant that can run commands on your computer: Claude Code, Codex, Cursor, Gemini CLI or Hermes. A chat in the browser without terminal access cannot install the cli for you.",
      page: "agents",
    },
    ru: {
      title: "Локальный агент",
      description:
        "ИИ-помощник, который может запускать команды на вашем компьютере: Claude Code, Codex, Cursor, Gemini CLI или Hermes. Чат в браузере без доступа к терминалу не сможет установить cli за вас.",
      page: "agents",
    },
    es: {
      title: "Agente local",
      description:
        "Un asistente de IA que puede ejecutar comandos en tu ordenador: Claude Code, Codex, Cursor, Gemini CLI o Hermes. Un chat en el navegador sin acceso a la terminal no puede instalar el cli por ti.",
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
        "The program that runs the Telegram and MAX tools on your computer. The numbers beside its name are the supported versions. Your agent can check what is installed and install a suitable version.",
      page: "installation#nodejs",
    },
    ru: {
      title: "Node.js",
      description:
        "Программа, которая нужна для запуска инструментов Telegram и MAX на вашем компьютере. Числа рядом с названием — подходящие версии. Агент может проверить, что уже установлено, и поставить нужную версию.",
      page: "installation#nodejs",
    },
    es: {
      title: "Node.js",
      description:
        "El programa que ejecuta las herramientas de Telegram y MAX en tu ordenador. Los números junto al nombre indican las versiones compatibles. Tu agente puede comprobar qué está instalado e instalar una versión adecuada.",
      page: "installation#nodejs",
    },
  },
  npm: {
    en: {
      title: "npm",
      description:
        "A package installer that comes with Node.js. Your agent uses it to download and install the tool for your messenger, and to update it later.",
      page: "installation#nodejs",
    },
    ru: {
      title: "npm",
      description:
        "Установщик программ, который входит в Node.js. С его помощью агент скачает и установит инструмент для выбранного мессенджера, а позже сможет обновить его.",
      page: "installation#nodejs",
    },
    es: {
      title: "npm",
      description:
        "Un instalador de paquetes que viene con Node.js. El agente lo usa para descargar e instalar la herramienta de tu mensajero y actualizarla más adelante.",
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
        "What Claude and ChatGPT call a tool you add from outside: you give the app an address, sign in once, and the assistant can then call that tool in your chats. ChatGPT calls it an app in developer mode.",
      page: "browser-apps",
    },
    ru: {
      title: "Коннектор",
      description:
        "Так Claude и ChatGPT называют инструмент, который вы добавляете извне: даёте приложению адрес, один раз входите, и ассистент может пользоваться этим инструментом в ваших чатах. В ChatGPT это приложение в режиме разработчика.",
      page: "browser-apps",
    },
    es: {
      title: "Conector",
      description:
        "Así llaman Claude y ChatGPT a una herramienta que añades desde fuera: le das a la app una dirección, inicias sesión una vez y el asistente puede usarla en tus chats. En ChatGPT es una app del modo desarrollador.",
      page: "browser-apps",
    },
  },
}

export type DocTermId = keyof typeof terms

export function docTerm(term: DocTermId, lang: string) {
  const entry = terms[term]
  if (!entry) throw new Error(`Unknown documentation term: ${term}`)
  return entry[lang as keyof typeof entry] ?? entry.en
}
