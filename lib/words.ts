export type Words = {
  tagline: string
  intro: string
  docs: string
  source: string
  install: string
  inLanguage: (language: string) => string
  agents: string
  navigation: {
    start: string
    installation: string
    agents: string
    firstTasks: string
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
    requirements: string
    windows: string
    login: string
    telegram: string
    timing: string
    prompt: (tool: string, pkg: string, docs: string) => string
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
    agents: "For agents: every page as Markdown in /llms.txt and /llms-full.txt.",
    navigation: {
      start: "Getting started",
      installation: "Installation",
      agents: "Connect your agent",
      firstTasks: "First tasks",
      prompting: "Writing requests",
      mcp: "MCP and documentation",
      messenger: "Choose a messenger",
      language: "Choose a language",
      menu: "Open documentation menu",
      installGuide: "Install with your agent",
      installGuideDescription:
        "A step-by-step guide for Codex, Cursor, Claude Code, Gemini CLI and Hermes, or your terminal.",
      mcpGuideDescription: "What MCP gives your agent, how to connect your client, and how to read these docs.",
    },
    onboarding: {
      terminal: "Install in a terminal",
      paste: "Copy this request into your agent. It will help you install and log in on your computer.",
      copy: "Copy",
      copied: "Copied",
      copyFailed: "Copy failed. Select and copy the text below.",
      browser: "The browser gives you the instructions; your agent or terminal runs the installation on your computer.",
      requirements: "Node.js 22.16+ with npm. After installing Node.js, open a new terminal.",
      windows:
        "Windows: this single PowerShell installer installs the CLI and agent skill, saves user PATH, updates this terminal and verifies the command. No manual PATH edits:",
      login: "Log in",
      telegram:
        "Telegram: auto obtains your app ID and hash. Enter the code from Telegram in your terminal, then scan the QR in Settings → Devices → Link Desktop Device. If auto fails, use session start --app browser.",
      timing: "Allow about 5 minutes for setup. Downloading chat history is a separate step and may take longer.",
      prompt: (tool, pkg, docs) =>
        `Set up ${tool} (${pkg}) on my computer: install the cli. On Windows use the one-call installer at https://wirecat.dev/install.ps1 with -Tool ${tool} -Agent all; ensure user PATH and your shell PATH are updated. Install and verify the skill for your environment before login. Then read ${tool} --help, ${tool} commands --json and ${tool} skill show before logging in. Use guided setup if it is listed by the installed cli; otherwise follow the documented login steps. Connect the skill for your environment. Tell me setup may take about 5 minutes and history downloads are separate. Verify it works and show 5 chats. Guide: ${docs}`,
    },
  },
  ru: {
    tagline: "AI Messaging with CLI tools for agents",
    intro: "Ваши аккаунты Telegram и MAX в терминале — для вас, ваших скриптов и ИИ-агентов.",
    docs: "Документация",
    source: "Исходный код",
    install: "Установка",
    inLanguage: (language) => `Эта страница на ${languageName.ru?.[language] ?? language} языке.`,
    agents: "Для агентов: каждая страница в Markdown — /llms.txt и /llms-full.txt.",
    navigation: {
      start: "Начало работы",
      installation: "Установка",
      agents: "Подключение агента",
      firstTasks: "Первые задачи",
      prompting: "Как формулировать запросы",
      mcp: "MCP и документация",
      messenger: "Выбрать мессенджер",
      language: "Выбрать язык",
      menu: "Открыть меню документации",
      installGuide: "Установить с помощью агента",
      installGuideDescription:
        "Пошаговый путь для Codex, Cursor, Claude Code, Gemini CLI и Hermes или установки в терминале.",
      mcpGuideDescription: "Что MCP даёт агенту, как подключить свой клиент и как читать эти доки.",
    },
    onboarding: {
      terminal: "Установить в терминале",
      paste: "Скопируйте запрос своему агенту. Он поможет установить CLI и войти в аккаунт на вашем компьютере.",
      copy: "Скопировать",
      copied: "Скопировано",
      copyFailed: "Не удалось скопировать. Выделите и скопируйте текст ниже.",
      browser: "Браузер показывает инструкцию; установку на вашем компьютере выполняет агент или терминал.",
      requirements: "Node.js 22.16+ с npm. После установки Node.js откройте новый терминал.",
      windows:
        "Windows: одна команда PowerShell устанавливает CLI и навык агента, сохраняет PATH пользователя, обновляет текущий терминал и проверяет запуск. PATH вручную менять не нужно:",
      login: "Войти в аккаунт",
      telegram:
        "Telegram: auto получает app ID и hash за вас. Введите код из Telegram в терминале, затем отсканируйте QR: Настройки → Устройства → Подключить устройство. Если auto не сработал, используйте session start --app browser.",
      timing:
        "На настройку заложите около 5 минут. Скачивание истории чатов — отдельный шаг, который может занять больше времени.",
      prompt: (tool, pkg, docs) =>
        `Настрой ${tool} (${pkg}) на моём компьютере: установи cli. На Windows используй установщик https://wirecat.dev/install.ps1 с -Tool ${tool} -Agent all; проверь PATH пользователя и своего терминала. До входа установи и проверь навык для своей среды. Затем прочитай ${tool} --help, ${tool} commands --json и ${tool} skill show. Используй пошаговую настройку, если она есть в установленном cli; иначе следуй инструкции входа. Подключи skill для своего окружения. Скажи, что настройка может занять около 5 минут, а скачивание истории — отдельный шаг. Проверь работу и покажи 5 чатов. Инструкция: ${docs}`,
    },
  },
  es: {
    tagline: "AI Messaging with CLI tools for agents",
    intro: "Tus cuentas de Telegram y MAX desde la terminal — para ti, tus scripts y tus agentes de IA.",
    docs: "Documentación",
    source: "Código fuente",
    install: "Instalar",
    inLanguage: (language) => `Esta página está en ${languageName.es?.[language] ?? language}.`,
    agents: "Para agentes: cada página en Markdown en /llms.txt y /llms-full.txt.",
    navigation: {
      start: "Primeros pasos",
      installation: "Instalación",
      agents: "Conectar tu agente",
      firstTasks: "Primeras tareas",
      prompting: "Cómo formular peticiones",
      mcp: "MCP y documentación",
      messenger: "Elegir mensajero",
      language: "Elegir idioma",
      menu: "Abrir el menú de documentación",
      installGuide: "Instalar con tu agente",
      installGuideDescription:
        "Guía paso a paso para Codex, Cursor, Claude Code, Gemini CLI y Hermes, o para la terminal.",
      mcpGuideDescription: "Qué aporta MCP, cómo conectar tu cliente y cómo leer esta documentación.",
    },
    onboarding: {
      terminal: "Instalar en una terminal",
      paste: "Copia esta petición en tu agente. Te ayudará a instalar e iniciar sesión en tu ordenador.",
      copy: "Copiar",
      copied: "Copiado",
      copyFailed: "No se pudo copiar. Selecciona y copia el texto de abajo.",
      browser: "El navegador muestra las instrucciones; tu agente o terminal ejecuta la instalación en tu ordenador.",
      requirements: "Node.js 22.16+ con npm. Tras instalar Node.js, abre una terminal nueva.",
      windows:
        "Windows: usa PowerShell. Si npm está bloqueado, usa npm.cmd. Si no se encuentra el comando instalado, ejecútalo con npm exec sin modificar PATH:",
      login: "Iniciar sesión",
      telegram:
        "Telegram: auto obtiene tu app ID y hash. Introduce el código de Telegram en la terminal y escanea el QR en Ajustes → Dispositivos → Vincular dispositivo. Si auto falla, usa session start --app browser.",
      timing:
        "Reserva unos 5 minutos para la configuración. Descargar el historial es un paso separado y puede tardar más.",
      prompt: (tool, pkg, docs) =>
        `Configura ${tool} (${pkg}) en mi ordenador: instala el cli. En Windows usa https://wirecat.dev/install.ps1 con -Tool ${tool} -Agent all; verifica PATH del usuario y de tu terminal. Instala y verifica el skill antes del inicio de sesión. Después lee ${tool} --help, ${tool} commands --json y ${tool} skill show. Usa la configuración guiada si aparece en el cli instalado; de lo contrario, sigue los pasos de inicio de sesión documentados. Conecta el skill para tu entorno. Dime que la configuración puede tardar unos 5 minutos y la descarga del historial es un paso separado. Verifica que funciona y muestra 5 chats. Guía: ${docs}`,
    },
  },
}

export const wordsFor = (lang: string): Words => words[lang] ?? (words.en as Words)
