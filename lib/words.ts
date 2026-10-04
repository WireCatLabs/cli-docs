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
    maxSetup: string
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
      requirements: "Node.js 22.16+ (22.x) or 24+ with npm. After installing Node.js, open a new terminal.",
      windows:
        "Windows: this single PowerShell installer installs the CLI and agent skill, saves user PATH, updates this terminal and verifies the command. No manual PATH edits:",
      login: "Log in",
      maxSetup:
        "MAX setup guides QR login, checks your account and five chats, and installs agent skills. It reuses an existing session. It does not download all history or start the background service.",
      telegram:
        "Telegram setup checks your account and five chats and installs agent skills; history downloads are separate. The auto mode obtains your app ID and hash. Enter the code from Telegram in your terminal, then scan the QR in Settings → Devices → Link Desktop Device. If auto fails, use session start --app browser.",
      timing: "Allow about 5 minutes for setup. Downloading chat history is a separate step and may take longer.",
      prompt: (tool, pkg, docs) =>
        `Set up ${tool} on my computer. First read the guide: ${docs}

Check that Node.js 22.16+ (22.x) or 24+ and npm are installed.

Install with npm install -g ${pkg} (use npm.cmd in Windows PowerShell). Make sure ${tool} runs by name in your current shell and in future terminals. On Windows, find the installation folder with npm.cmd prefix -g; add it to user PATH if missing, preserve existing entries, and refresh your own shell PATH. Do not assume npm updated your running shell. On macOS/Linux, check npm prefix -g and its bin folder when resolving the command; preserve existing shell configuration. If PowerShell blocks the generated script, use the .cmd launcher and follow the documented package repair without changing the permanent execution policy.

Before login, run ${tool} skill install --for all. Read ${tool} --help, ${tool} commands --json and ${tool} skill show, then load and verify the installed skill for your agent.

Use guided setup if the installed cli supports it; otherwise follow the login guide. Tell me setup takes about five minutes and chat history downloads are a separate step. Have me enter login codes and passwords locally or scan the QR code.

Verify ${tool} --version, run ${tool} doctor, check the logged-in account and show the first five chats.`,
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
      requirements: "Node.js 22.16+ (ветка 22.x) или 24+ с npm. После установки Node.js откройте новый терминал.",
      windows:
        "Windows: одна команда PowerShell устанавливает CLI и навык агента, сохраняет PATH пользователя, обновляет текущий терминал и проверяет запуск. PATH вручную менять не нужно:",
      login: "Войти в аккаунт",
      maxSetup:
        "Настройка MAX проведёт через QR-вход, проверит аккаунт и пять чатов, установит навыки агентов. Существующий вход используется повторно. История целиком не скачивается, фоновый сервис не запускается.",
      telegram:
        "Настройка Telegram проверяет аккаунт и пять чатов, устанавливает навыки агентов; история скачивается отдельно. Режим auto получает app ID и hash за вас. Введите код из Telegram в терминале, затем отсканируйте QR: Настройки → Устройства → Подключить устройство. Если auto не сработал, используйте session start --app browser.",
      timing:
        "На настройку заложите около 5 минут. Скачивание истории чатов — отдельный шаг, который может занять больше времени.",
      prompt: (tool, pkg, docs) =>
        `Настрой ${tool} на моём компьютере. Сначала прочитай инструкцию: ${docs}

Проверь, что установлены Node.js 22.16+ (ветка 22.x) или 24+ и npm.

Установи через npm install -g ${pkg} (в Windows PowerShell используй npm.cmd). Проверь, что ${tool} запускается по имени в твоём терминале и будет доступен в новых терминалах. На Windows узнай папку установки через npm.cmd prefix -g; добавь её в PATH пользователя, если её там нет, сохрани прежние записи и обнови PATH своего терминала. Не предполагай, что npm обновил уже работающий терминал. На macOS/Linux проверь npm prefix -g и подпапку bin; сохрани существующие настройки терминала. Если PowerShell блокирует созданный скрипт, используй запуск через .cmd и восстановление из инструкции без изменения постоянной политики выполнения.

До входа выполни ${tool} skill install --for all. Прочитай ${tool} --help, ${tool} commands --json и ${tool} skill show, затем загрузи и проверь установленный skill для своего агента.

Используй пошаговую настройку, если она есть в установленном cli; иначе следуй инструкции входа. Скажи, что настройка займёт около пяти минут, а скачивание истории чатов — отдельный шаг. Коды и пароли я введу локально или отсканирую QR-код.

Проверь ${tool} --version, выполни ${tool} doctor, проверь аккаунт после входа и покажи первые пять чатов.`,
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
      requirements: "Node.js 22.16+ (rama 22.x) o 24+ con npm. Tras instalar Node.js, abre una terminal nueva.",
      windows:
        "Windows: usa PowerShell. Si npm está bloqueado, usa npm.cmd. Si no se encuentra el comando instalado, ejecútalo con npm exec sin modificar PATH:",
      login: "Iniciar sesión",
      maxSetup:
        "La configuración de MAX guía el acceso por QR, comprueba tu cuenta y cinco chats e instala los skills. Reutiliza una sesión existente. No descarga todo el historial ni inicia el servicio en segundo plano.",
      telegram:
        "La configuración de Telegram comprueba tu cuenta y cinco chats e instala los skills; el historial se descarga aparte. El modo auto obtiene tu app ID y hash. Introduce el código de Telegram en la terminal y escanea el QR en Ajustes → Dispositivos → Vincular dispositivo. Si auto falla, usa session start --app browser.",
      timing:
        "Reserva unos 5 minutos para la configuración. Descargar el historial es un paso separado y puede tardar más.",
      prompt: (tool, pkg, docs) =>
        `Configura ${tool} en mi ordenador. Primero lee la guía: ${docs}

Comprueba que tienes Node.js 22.16+ (rama 22.x) o 24+ y npm.

Instala con npm install -g ${pkg} (usa npm.cmd en Windows PowerShell). Comprueba que ${tool} funciona por su nombre en tu terminal actual y en terminales nuevas. En Windows, consulta la carpeta de instalación con npm.cmd prefix -g; añádela al PATH del usuario si falta, conserva las entradas existentes y actualiza el PATH de tu propia terminal. No supongas que npm ha actualizado una terminal que ya estaba abierta. En macOS/Linux, comprueba npm prefix -g y su carpeta bin sin sobrescribir la configuración del shell. Si PowerShell bloquea el script generado, usa el ejecutable .cmd y la recuperación documentada sin cambiar la política de ejecución permanente.

Antes de iniciar sesión, ejecuta ${tool} skill install --for all. Lee ${tool} --help, ${tool} commands --json y ${tool} skill show; carga el skill instalado y verifica que tu agente lo utiliza.

Usa la configuración guiada si el cli instalado la admite; si no, sigue la guía de inicio de sesión. Dime que la configuración tarda unos cinco minutos y que descargar el historial es un paso separado. Introduciré los códigos y contraseñas localmente o escanearé el QR.

Comprueba ${tool} --version, ejecuta ${tool} doctor, verifica la cuenta conectada y muestra los primeros cinco chats.`,
    },
  },
}

export const wordsFor = (lang: string): Words => words[lang] ?? (words.en as Words)
