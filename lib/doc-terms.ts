const terms = {
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
}

export type DocTermId = keyof typeof terms

export function docTerm(term: DocTermId, lang: string) {
  const entry = terms[term]
  if (!entry) throw new Error(`Unknown documentation term: ${term}`)
  return entry[lang as keyof typeof entry] ?? entry.en
}
