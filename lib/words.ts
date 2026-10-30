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
    communityTools: string
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
    expand: string
    collapse: string
    browser: string
    nodeHelp: string
    nodePrompt: string
    login: string
    timing: string
    prompt: (tool: string, pkg: string) => string
  }
}

// From each pinned release's `engines.node`; every tool also accepts 24+.
export const nodeMinimum = (tool: string) => (tool === "tg" ? "22.19" : "22.16")

// drive, memo and zm have no `setup`; each request follows that tool's own first steps.
const toolPrompts: Record<string, Record<string, (pkg: string) => string>> = {
  en: {
    wa: (pkg) => `Install wa with npm install -g ${pkg}. First check Node.js 22.16+ (22.x) or 24+ and npm.
Read https://wirecat.dev/en/docs/wa/installation and wa personal setup --help. Explain device linking and help me choose an account and profile name before running setup; personal is an example.
I will scan the QR code from WhatsApp on my phone under Linked devices. Allow about five minutes for recent history to arrive.
After linking, run wa personal doctor with the profile I chose and offer to install the wa skill for my agent. Do not send messages.`,
    drive: (pkg) => `Install drive with npm install -g ${pkg}. Before that, check Node.js 22.16+ (22.x) or 24+ and npm.
Read drive personal session start --help (personal is a profile name; any name works), then help me run it.
Warn me first: Google may show an "unverified app" screen. Read https://wirecat.dev/en/docs/drive/installation for what to do.
Check that the profile was saved with drive session list --json.
Then help me choose a first folder (drive personal folders --help) and import it with drive personal sync.`,
    memo: (pkg) => `Install memo with npm install -g ${pkg}. Before that, check Node.js 22.16+ (22.x) or 24+ and npm.
Run memo doctor: it lists what needs attention and the command that fixes each. Help me work through it.
Read memo --help and suggest next steps for my notes and mail.
At the end, offer to install the memo skill for my agent: memo skill install --for all.`,
    zm: (pkg) => `Install zm with npm install -g ${pkg}. Before that, check Node.js 22.16+ (22.x) or 24+ and npm.
Run zm doctor. Read https://wirecat.dev/en/docs/zm/installation and zm personal session start --help, then help me log in with zm personal session start (personal is the profile name; ask me if I want another).
At the end, offer to install the zm skill for my agent: zm skill install --for all.`,
  },
  ru: {
    wa: (pkg) => `Установи wa через npm install -g ${pkg}. Сначала проверь Node.js 22.16+ (ветка 22.x) или 24+ и npm.
Прочитай https://wirecat.dev/ru/docs/wa/installation и wa personal setup --help. Объясни привязку устройства и помоги выбрать аккаунт и имя профиля до запуска настройки; personal — пример.
Я отсканирую QR-код в WhatsApp на телефоне, в разделе связанных устройств. На получение недавней истории отведи около пяти минут.
После подключения выполни wa personal doctor с выбранным мной профилем и предложи установить навык wa для моего агента. Ничего не отправляй.`,
    drive: (
      pkg,
    ) => `Установи drive через npm install -g ${pkg}. Перед этим проверь Node.js 22.16+ (ветка 22.x) или 24+ и npm.
Прочитай drive personal session start --help (personal — имя профиля, подойдёт любое), затем помоги выполнить эту команду.
Сначала предупреди: Google может показать экран «непроверенное приложение». Что делать — на https://wirecat.dev/ru/docs/drive/installation.
Проверь, что профиль сохранён: drive session list --json.
Затем помоги выбрать первую папку (drive personal folders --help) и импортировать её командой drive personal sync.`,
    memo: (
      pkg,
    ) => `Установи memo через npm install -g ${pkg}. Перед этим проверь Node.js 22.16+ (ветка 22.x) или 24+ и npm.
Выполни memo doctor: он перечисляет, что требует внимания, и команду, которая это исправляет. Помоги пройти по списку.
Прочитай memo --help и предложи следующие шаги для моих заметок и почты.
В конце предложи установить memo skill для моего агента: memo skill install --for all.`,
    zm: (pkg) => `Установи zm через npm install -g ${pkg}. Перед этим проверь Node.js 22.16+ (ветка 22.x) или 24+ и npm.
Выполни zm doctor. Прочитай https://wirecat.dev/ru/docs/zm/installation и zm personal session start --help, затем помоги войти командой zm personal session start (personal — имя профиля; спроси, нужно ли другое).
В конце предложи установить zm skill для моего агента: zm skill install --for all.`,
  },
  es: {
    wa: (pkg) => `Instala wa con npm install -g ${pkg}. Primero comprueba Node.js 22.16+ (rama 22.x) o 24+ y npm.
Lee https://wirecat.dev/es/docs/wa/installation y wa personal setup --help. Explica la vinculación del dispositivo y ayúdame a elegir cuenta y nombre de perfil antes de configurar; personal es un ejemplo.
Escanearé el QR desde Dispositivos vinculados en WhatsApp en mi teléfono. Deja unos cinco minutos para recibir el historial reciente.
Después ejecuta wa personal doctor con el perfil que elegí y ofrece instalar el skill de wa para mi agente. No envíes mensajes.`,
    drive: (pkg) => `Instala drive con npm install -g ${pkg}. Antes, comprueba Node.js 22.16+ (rama 22.x) o 24+ y npm.
Lee drive personal session start --help (personal es un nombre de perfil; sirve cualquiera) y ayúdame a ejecutarlo.
Avísame antes: Google puede mostrar una pantalla de «aplicación no verificada». Qué hacer: https://wirecat.dev/es/docs/drive/installation.
Comprueba que el perfil se guardó con drive session list --json.
Después ayúdame a elegir una primera carpeta (drive personal folders --help) e importarla con drive personal sync.`,
    memo: (pkg) => `Instala memo con npm install -g ${pkg}. Antes, comprueba Node.js 22.16+ (rama 22.x) o 24+ y npm.
Ejecuta memo doctor: indica lo que necesita atención y el comando que lo arregla. Ayúdame a recorrer la lista.
Lee memo --help y propone los siguientes pasos para mis notas y mi correo.
Al terminar, ofrece instalar el skill de memo para mi agente: memo skill install --for all.`,
    zm: (pkg) => `Instala zm con npm install -g ${pkg}. Antes, comprueba Node.js 22.16+ (rama 22.x) o 24+ y npm.
Ejecuta zm doctor. Lee https://wirecat.dev/es/docs/zm/installation y zm personal session start --help, y ayúdame a iniciar sesión con zm personal session start (personal es el nombre del perfil; pregúntame si quiero otro).
Al terminar, ofrece instalar el skill de zm para mi agente: zm skill install --for all.`,
  },
}

const languageName: Record<string, Record<string, string>> = {
  en: { en: "English", ru: "Russian", es: "Spanish" },
  ru: { en: "английском", ru: "русском", es: "испанском" },
  es: { en: "inglés", ru: "ruso", es: "español" },
}

export const words: Record<string, Words> = {
  en: {
    tagline: "AI Messaging with CLI tools for agents",
    intro:
      "Your Telegram, MAX and WhatsApp accounts, Zoom meetings, Google Drive documents, your Google Calendar and notes, from the terminal — for you, your scripts and your AI agents.",
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
      communityTools: "Community tools",
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
      expand: "Show the whole request",
      collapse: "Collapse",
      browser: "The browser gives you the instructions; your agent or terminal runs the installation on your computer.",
      nodeHelp: "Need Node.js? Ask your agent to prepare your computer.",
      nodePrompt: `Check whether Node.js and npm are installed.
If needed, install a compatible stable version of Node.js with npm for my operating system: 22.19+ (22.x) or 24+.
Verify node --version and npm --version, then continue setting up the messenger.`,
      login: "Log in",
      timing: "Allow about 5 minutes for setup. Downloading chat history is a separate step and may take longer.",
      prompt: (tool, pkg) =>
        toolPrompts.en[tool]?.(pkg) ??
        `Install ${tool} with npm install -g ${pkg}.
Read ${tool} setup --help, explain the steps and allow about five minutes, then help me run ${tool} personal setup (personal is a profile name; any name works).
Run ${tool} personal doctor and suggest next steps.
Before installation, check Node.js ${nodeMinimum(tool)}+ (22.x) or 24+ and npm; help me install them if needed.
At the end, offer to install the ${tool} skill for my agent.`,
    },
  },
  ru: {
    tagline: "AI Messaging with CLI tools for agents",
    intro:
      "Ваши аккаунты Telegram, MAX и WhatsApp, встречи Zoom, документы Google Drive, Google Calendar и заметки в терминале — для вас, ваших скриптов и ИИ-агентов.",
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
      communityTools: "Инструменты сообщества",
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
      expand: "Показать запрос целиком",
      collapse: "Свернуть",
      browser: "Браузер показывает инструкцию; установку на вашем компьютере выполняет агент или терминал.",
      nodeHelp: "Если Node.js ещё нет, попросите агента подготовить компьютер.",
      nodePrompt: `Проверь, установлены ли Node.js и npm.
Если нужно, установи подходящую стабильную версию Node.js с npm для моей операционной системы: 22.19+ (ветка 22.x) или 24+.
Проверь node --version и npm --version, затем продолжи настройку мессенджера.`,
      login: "Войти в аккаунт",
      timing:
        "На настройку заложите около 5 минут. Скачивание истории чатов — отдельный шаг, который может занять больше времени.",
      prompt: (tool, pkg) =>
        toolPrompts.ru[tool]?.(pkg) ??
        `Установи ${tool} через npm install -g ${pkg}.
Прочитай ${tool} setup --help, предупреди о шагах и что понадобится около пяти минут, затем помоги выполнить ${tool} personal setup (personal — имя профиля, подойдёт любое).
Выполни ${tool} personal doctor и предложи следующие шаги.
Перед установкой проверь Node.js ${nodeMinimum(tool)}+ (ветка 22.x) или 24+ и npm; если нужно, помоги их установить.
В конце предложи установить ${tool} skill для моего агента.`,
    },
  },
  es: {
    tagline: "AI Messaging with CLI tools for agents",
    intro:
      "Tus cuentas de Telegram, MAX y WhatsApp, reuniones de Zoom, documentos de Google Drive, tu Google Calendar y notas desde la terminal — para ti, tus scripts y tus agentes de IA.",
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
      communityTools: "Herramientas de la comunidad",
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
      expand: "Ver la petición completa",
      collapse: "Contraer",
      browser: "El navegador muestra las instrucciones; tu agente o terminal ejecuta la instalación en tu ordenador.",
      nodeHelp: "¿Falta Node.js? Pide al agente que prepare tu ordenador.",
      nodePrompt: `Comprueba si Node.js y npm están instalados.
Si hace falta, instala una versión estable compatible de Node.js con npm para mi sistema operativo: 22.19+ (rama 22.x) o 24+.
Verifica node --version y npm --version y continúa con la configuración del servicio de mensajería.`,
      login: "Iniciar sesión",
      timing:
        "Reserva unos 5 minutos para la configuración. Descargar el historial es un paso separado y puede tardar más.",
      prompt: (tool, pkg) =>
        toolPrompts.es[tool]?.(pkg) ??
        `Instala ${tool} con npm install -g ${pkg}.
Lee ${tool} setup --help, explica los pasos y que harán falta unos cinco minutos, y ayúdame a ejecutar ${tool} personal setup (personal es un nombre de perfil; sirve cualquiera).
Ejecuta ${tool} personal doctor y propone los siguientes pasos.
Antes de instalar, comprueba Node.js ${nodeMinimum(tool)}+ (rama 22.x) o 24+ y npm; ayúdame a instalarlos si hace falta.
Al terminar, ofrece instalar el skill de ${tool} para mi agente.`,
    },
  },
}

export const wordsFor = (lang: string): Words => words[lang] ?? (words.en as Words)
