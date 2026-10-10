export type Words = {
  tagline: string
  intro: string
  docs: string
  source: string
  install: string
  inLanguage: (language: string) => string
  navigation: {
    start: string
    installation: string
    agents: string
    firstTasks: string
    features: string
    overview: string
    prompting: string
    mcp: string
    messenger: string
    language: string
    menu: string
    installGuide: string
    installGuideDescription: string
    mcpGuideDescription: string
  }
  onboarding: {
    terminal: string
    paste: string
    copy: string
    copied: string
    copyFailed: string
    browser: string
    nodeHelp: string
    nodePrompt: string
    login: string
    timing: string
    prompt: (tool: string, pkg: string) => string
  }
}

const languageName: Record<string, Record<string, string>> = {
  en: { en: "English", ru: "Russian", es: "Spanish" },
  ru: { en: "английском", ru: "русском", es: "испанском" },
  es: { en: "inglés", ru: "ruso", es: "español" },
}

export const words: Record<string, Words> = {
  en: {
    tagline: "AI Messaging with CLI tools for agents",
    intro: "Your Telegram and MAX accounts, from the terminal — for you, your scripts and your AI agents.",
    docs: "Documentation",
    source: "Source",
    install: "Install",
    inLanguage: (language) => `This page is in ${languageName.en?.[language] ?? language}.`,
    navigation: {
      start: "Getting started",
      installation: "Install and log in",
      agents: "Connect your AI agent",
      firstTasks: "First tasks",
      features: "Features",
      overview: "Overview",
      prompting: "Writing requests",
      mcp: "MCP and skills",
      messenger: "Choose a messenger",
      language: "Choose a language",
      menu: "Open documentation menu",
      installGuide: "Install with your agent",
      installGuideDescription:
        "A step-by-step guide for your AI agent, for example Claude Code, Codex, Cursor or Gemini CLI, or your terminal.",
      mcpGuideDescription: "What MCP gives your agent, how to connect your client, and how to read these docs.",
    },
    onboarding: {
      terminal: "Install in a terminal",
      paste: "Copy this request into your agent. It will help you install and log in on your computer.",
      copy: "Copy",
      copied: "Copied",
      copyFailed: "Copy failed. Select and copy the text below.",
      browser: "The browser gives you the instructions; your agent or terminal runs the installation on your computer.",
      nodeHelp: "Need Node.js? Ask your agent to prepare your computer.",
      nodePrompt: `Check whether Node.js and npm are installed.
If needed, install a compatible stable version of Node.js with npm for my operating system: 22.16+ (22.x) or 24+.
Verify node --version and npm --version, then continue setting up the messenger.`,
      login: "Log in",
      timing: "Allow about 5 minutes for setup. Downloading chat history is a separate step and may take longer.",
      prompt: (tool, pkg) =>
        `Install ${tool} with npm install -g ${pkg}.
Read ${tool} setup --help, explain the setup steps and allow about five minutes, then help me run ${tool} setup.
Run ${tool} doctor and suggest next steps.
Before installation, check Node.js 22.16+ (22.x) or 24+ and npm; help me install them if needed.
At the end, offer to install the ${tool} skill for my agent.`,
    },
  },
  ru: {
    tagline: "AI Messaging with CLI tools for agents",
    intro: "Ваши аккаунты Telegram и MAX в терминале — для вас, ваших скриптов и ИИ-агентов.",
    docs: "Документация",
    source: "Исходный код",
    install: "Установка",
    inLanguage: (language) => `Эта страница на ${languageName.ru?.[language] ?? language} языке.`,
    navigation: {
      start: "Начало работы",
      installation: "Установка и вход",
      agents: "Подключение ИИ-агента",
      firstTasks: "Первые задачи",
      features: "Возможности",
      overview: "Обзор",
      prompting: "Как формулировать запросы",
      mcp: "MCP и навыки",
      messenger: "Выбрать мессенджер",
      language: "Выбрать язык",
      menu: "Открыть меню документации",
      installGuide: "Установить с помощью агента",
      installGuideDescription:
        "Пошаговый путь для вашего ИИ-агента, например Claude Code, Codex, Cursor или Gemini CLI, или установки в терминале.",
      mcpGuideDescription: "Что MCP даёт агенту, как подключить свой клиент и как читать эти доки.",
    },
    onboarding: {
      terminal: "Установить в терминале",
      paste: "Скопируйте запрос своему агенту. Он поможет установить инструмент и войти в аккаунт на вашем компьютере.",
      copy: "Скопировать",
      copied: "Скопировано",
      copyFailed: "Не удалось скопировать. Выделите и скопируйте текст ниже.",
      browser: "Браузер показывает инструкцию; установку на вашем компьютере выполняет агент или терминал.",
      nodeHelp: "Если Node.js ещё нет, попросите агента подготовить компьютер.",
      nodePrompt: `Проверь, установлены ли Node.js и npm.
Если нужно, установи подходящую стабильную версию Node.js с npm для моей операционной системы: 22.16+ (ветка 22.x) или 24+.
Проверь node --version и npm --version, затем продолжи настройку мессенджера.`,
      login: "Войти в аккаунт",
      timing:
        "На настройку заложите около 5 минут. Скачивание истории чатов — отдельный шаг, который может занять больше времени.",
      prompt: (tool, pkg) =>
        `Установи ${tool} через npm install -g ${pkg}.
Прочитай ${tool} setup --help, предупреди о шагах настройки и что понадобится около пяти минут, затем помоги выполнить ${tool} setup.
Выполни ${tool} doctor и предложи следующие шаги.
Перед установкой проверь Node.js 22.16+ (ветка 22.x) или 24+ и npm; если нужно, помоги их установить.
В конце предложи установить ${tool} skill для моего агента.`,
    },
  },
  es: {
    tagline: "AI Messaging with CLI tools for agents",
    intro: "Tus cuentas de Telegram y MAX desde la terminal — para ti, tus scripts y tus agentes de IA.",
    docs: "Documentación",
    source: "Código fuente",
    install: "Instalar",
    inLanguage: (language) => `Esta página está en ${languageName.es?.[language] ?? language}.`,
    navigation: {
      start: "Primeros pasos",
      installation: "Instalar e iniciar sesión",
      agents: "Conectar tu agente de IA",
      firstTasks: "Primeras tareas",
      features: "Funciones",
      overview: "Resumen",
      prompting: "Cómo formular peticiones",
      mcp: "MCP y skills",
      messenger: "Elegir servicio de mensajería",
      language: "Elegir idioma",
      menu: "Abrir el menú de documentación",
      installGuide: "Instalar con tu agente",
      installGuideDescription:
        "Guía paso a paso para tu agente de IA, por ejemplo Claude Code, Codex, Cursor o Gemini CLI, o para la terminal.",
      mcpGuideDescription: "Qué aporta MCP, cómo conectar tu cliente y cómo leer esta documentación.",
    },
    onboarding: {
      terminal: "Instalar en una terminal",
      paste: "Copia esta petición en tu agente. Te ayudará a instalar e iniciar sesión en tu ordenador.",
      copy: "Copiar",
      copied: "Copiado",
      copyFailed: "No se pudo copiar. Selecciona y copia el texto de abajo.",
      browser: "El navegador muestra las instrucciones; tu agente o terminal ejecuta la instalación en tu ordenador.",
      nodeHelp: "¿Falta Node.js? Pide al agente que prepare tu ordenador.",
      nodePrompt: `Comprueba si Node.js y npm están instalados.
Si hace falta, instala una versión estable compatible de Node.js con npm para mi sistema operativo: 22.16+ (rama 22.x) o 24+.
Verifica node --version y npm --version y continúa con la configuración del servicio de mensajería.`,
      login: "Iniciar sesión",
      timing:
        "Reserva unos 5 minutos para la configuración. Descargar el historial es un paso separado y puede tardar más.",
      prompt: (tool, pkg) =>
        `Instala ${tool} con npm install -g ${pkg}.
Lee ${tool} setup --help, explica los pasos y que harán falta unos cinco minutos, y ayúdame a ejecutar ${tool} setup.
Ejecuta ${tool} doctor y propone los siguientes pasos.
Antes de instalar, comprueba Node.js 22.16+ (rama 22.x) o 24+ y npm; ayúdame a instalarlos si hace falta.
Al terminar, ofrece instalar el skill de ${tool} para mi agente.`,
    },
  },
}

export const wordsFor = (lang: string): Words => words[lang] ?? (words.en as Words)
