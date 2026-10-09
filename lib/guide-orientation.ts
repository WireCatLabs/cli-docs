const purpose = {
  en: {
    installation:
      "This guide covers installing the messenger tool and connecting your account. You will be able to run it yourself or ask an agent to use your chats, then verify the account and first results.",
    "query-language":
      "This is the reference for writing message-search queries. You will be able to combine words, people, chats, dates and file conditions, check the query syntax and interpret the returned matches.",
    "from-tgcli":
      "This guide helps you move from tgcli to tg. You will find equivalent commands, understand the differences and choose what to run for your existing tasks.",
    "commands-personal":
      "This reference covers personal-account commands. Use it to find the exact command, arguments and options for login, reading, searching, files and sending.",
    "commands-bot":
      "This reference covers bot commands and the Bot API. Use it to look up authentication, messages, events and method parameters for the bot you control.",
    "commands-admin":
      "This reference covers group administration commands. Use it to look up member, invitation, permission and moderation options before making a change.",

    people:
      "Identify a person and recover what you have discussed before replying. This guide explains the available context, account signals and the limits of incomplete history.",
    remote:
      "Connect your messenger tools to a chat in a browser or an agent on another device. This page gives the messenger-specific startup and file-transfer details; use the shared guide below for your first connection.",
    mcp: "This is the technical reference for connecting a client to this messenger through MCP. Use it to check tools, settings and permissions; the shared guide below helps you choose and set up a connection first.",
    configuration:
      "Keep settings you would otherwise repeat on every command. This guide explains their locations and priority so you can change a value and check which setting takes effect.",
    "configuration-reference":
      "Use this reference to look up an exact setting name, default or environment variable. For a first change, start with the settings guide below.",
    permissions:
      "Choose which actions your agent may perform for this account or bot. Check the access level, recipient restrictions and confirmation behavior before enabling changes.",
    profiles:
      "Choose the right account or bot when you have more than one. This guide explains named profiles and their settings so a task runs with the intended account.",
    rankings:
      "Use saved history to understand activity and find discussions needing attention. This page explains reports, sources and missing data; a low count in an incomplete archive is not a verdict about a person.",
    "cli-contract":
      "This reference is for script authors and agents: output formats, errors, permissions and command discovery. For ordinary messenger tasks, begin with the shared task guide below.",
    limits:
      "Understand why the messenger asks a command to wait and what you can check before retrying. This guide distinguishes messenger rate limits from your own sending limits.",
    replies:
      "Configure and test rules for replying to test accounts. This is a limited automatic-response workflow; the guide explains the allowed audience, permissions and how to stop it.",
    sessions:
      "Connect the tool to your messenger account so your agent can read the chats you choose and help with replies. This guide explains login, checking the connection and managing or ending a session. Login adds an authorised device; it does not download all your chat history.",
    usage:
      "Use your connected account to read conversations, find the context you need and prepare or send a reply. Start with a reading task, check the result, then use the relevant section for files, groups or sending.",
    archive:
      "Save the history of the chats you need so your agent can search older messages and recall agreements. This guide helps you choose the period to download, check what was saved and export a copy when needed.",
    search:
      "Find an older message, agreement, link or file in the conversation you have saved. This guide shows the search options and how to check sources. Fetch the relevant history first if it is not on your computer yet.",
    bot: "Use a bot's separate account to answer requests, publish updates or help with a group. This guide takes you through connecting a bot, finding the chat and checking its access; your personal conversations stay separate.",
    groups:
      "Manage a group you participate in: inspect its members and settings, then choose the action you need. This guide explains the supported operations and required rights so you can check the target before changing anything.",
    security:
      "Choose what your agent may do and understand where login data and messages are stored. This guide explains the protections, their limits and the settings you can check before granting sending or other changes.",
    recipes:
      "Give your agent a useful task without writing a command sequence yourself. These examples show requests you can adapt to your chats, the expected result and where to find the exact command details.",
    troubleshooting:
      "Find the symptom you are seeing and follow its recovery steps. The aim is to get the tool working again and check the result; keep the error text if you need help reporting a problem.",
    changelog:
      "See what changed in releases: new capabilities, fixes and changes that may affect your commands. Start with your installed version, then use the linked guide for the feature you want to try.",
    roadmap:
      "See what is planned and what is still unavailable. These are development priorities rather than promised dates; the changelog records what has actually shipped.",
  },
  ru: {
    installation:
      "Это руководство по установке инструмента и подключению аккаунта мессенджера. Вы сможете запускать его сами или поручать агенту работу с чатами, затем проверите аккаунт и первые результаты.",
    "query-language":
      "Здесь собран синтаксис запросов для поиска сообщений. Вы сможете сочетать слова, людей, чаты, даты и условия по файлам, проверять запрос и понимать найденные совпадения.",
    "from-tgcli":
      "Это руководство по переходу с tgcli на tg. Вы найдёте соответствующие команды, разберётесь в различиях и выберете команды для своих привычных задач.",
    "commands-personal":
      "Здесь собраны команды личного аккаунта. Вы найдёте точную команду, аргументы и параметры для входа, чтения, поиска, файлов и отправки.",
    "commands-bot":
      "Здесь собраны команды бота и методы Bot API. Вы сможете найти параметры подключения, сообщений, событий и нужного метода для своего бота.",
    "commands-admin":
      "Здесь собраны команды администрирования групп. Вы сможете найти параметры участников, приглашений, прав и модерации перед изменением.",

    people:
      "Вспомните, кто вам написал и что вы обсуждали, прежде чем отвечать. Здесь описаны доступный контекст, признаки аккаунта и ограничения неполной истории.",
    remote:
      "Подключите инструменты мессенджера к чату в браузере или агенту на другом устройстве. Здесь — особенности запуска и передачи файлов для этого мессенджера; для первого подключения начните с пошаговой инструкции ниже.",
    mcp: "Это техническая справка по подключению клиента к этому мессенджеру через MCP. Здесь можно проверить инструменты, настройки и права; выбрать и настроить первое подключение поможет общая инструкция ниже.",
    configuration:
      "Сохраните настройки, которые иначе пришлось бы повторять в каждой команде. Здесь описаны их расположение и приоритет, чтобы изменить значение и проверить, какая настройка действует.",
    "configuration-reference":
      "В этом справочнике можно найти точное имя настройки, значение по умолчанию или переменную окружения. Для первого изменения начните с руководства по настройкам ниже.",
    permissions:
      "Выберите действия, разрешённые агенту для этого аккаунта или бота. Перед изменениями проверьте уровень доступа, ограничения получателей и порядок подтверждений.",
    profiles:
      "Выберите нужный аккаунт или бота, если их несколько. Здесь описаны именованные профили и их настройки, чтобы задача выполнялась от нужного аккаунта.",
    rankings:
      "По сохранённой истории оцените активность и найдите обсуждения, которым нужно внимание. Здесь объясняются отчёты, источники и пропуски данных; малое число сообщений в неполном архиве не является оценкой человека.",
    "cli-contract":
      "Этот справочник предназначен для авторов скриптов и агентов: форматы ответа, ошибки, права и поиск команд. Для обычных задач с мессенджером начните с руководства ниже.",
    limits:
      "Разберитесь, почему мессенджер просит команду подождать и что проверить перед повтором. Здесь объясняется разница между ограничениями мессенджера и вашими лимитами отправки.",
    replies:
      "Настройте и проверьте правила ответа тестовым аккаунтам. Это ограниченный сценарий автоответов; здесь описаны допустимые получатели, права и способ остановить работу.",
    sessions:
      "Подключите инструмент к своему аккаунту мессенджера, чтобы агент мог читать выбранные чаты и помогать с ответами. Здесь вы пройдёте вход, проверите подключение и узнаете, как управлять сессией или завершить её. Вход добавляет разрешённое устройство; всю историю чатов он не скачивает.",
    usage:
      "Используйте подключённый аккаунт, чтобы читать переписку, собирать нужный контекст и готовить или отправлять ответы. Начните с чтения, проверьте результат, затем выберите раздел про файлы, группы или отправку.",
    archive:
      "Сохраните историю нужных чатов, чтобы агент мог найти старые сообщения и вспомнить договорённости. Здесь вы выберете период загрузки, проверите, что сохранено, и при необходимости выгрузите копию переписки.",
    search:
      "Найдите старое сообщение, договорённость, ссылку или файл в сохранённой переписке. Здесь описаны способы поиска и проверка исходных сообщений. Если нужной истории ещё нет на компьютере, сначала загрузите её.",
    bot: "Используйте отдельный аккаунт бота для ответов, публикаций и помощи в группе. Здесь вы подключите бота, найдёте нужный чат и проверите его доступ; ваша личная переписка остаётся отдельной.",
    groups:
      "Управляйте группой, в которой участвуете: посмотрите участников и настройки, затем выберите нужное действие. Здесь описаны доступные операции и необходимые права, чтобы вы могли проверить цель перед изменением.",
    security:
      "Выберите, что разрешено агенту, и узнайте, где хранятся данные входа и сообщения. Здесь объясняются защита, её ограничения и настройки, которые стоит проверить перед разрешением отправки и других изменений.",
    recipes:
      "Поручите агенту полезную задачу, не составляя последовательность команд самостоятельно. В примерах есть запросы для ваших чатов, ожидаемый результат и ссылки на точные инструкции.",
    troubleshooting:
      "Найдите свою ошибку или симптом и выполните шаги восстановления. Цель — вернуть инструмент в рабочее состояние и проверить результат; сохраните текст ошибки, если потребуется помощь с отчётом о проблеме.",
    changelog:
      "Узнайте, что изменилось в выпусках: новые возможности, исправления и изменения, влияющие на команды. Начните со своей установленной версии, затем откройте инструкцию для функции, которую хотите попробовать.",
    roadmap:
      "Посмотрите, что планируется и чего пока нет. Это приоритеты разработки, а не обещанные даты; уже выпущенные изменения перечислены в истории версий.",
  },
  es: {
    installation:
      "Esta guía explica cómo instalar la herramienta y conectar la cuenta. Podrás ejecutarla o pedir al agente trabajar con tus chats y comprobar la cuenta y los primeros resultados.",
    "query-language":
      "Esta referencia explica la sintaxis de búsqueda. Podrás combinar palabras, personas, chats, fechas y archivos, comprobar consultas e interpretar resultados.",
    "from-tgcli":
      "Esta guía explica la migración de tgcli a tg. Encontrarás comandos equivalentes, diferencias y opciones para tus tareas habituales.",
    "commands-personal":
      "Esta referencia reúne comandos de cuenta personal. Consulta argumentos y opciones de acceso, lectura, búsqueda, archivos y envío.",
    "commands-bot":
      "Esta referencia reúne comandos del bot y métodos Bot API. Consulta parámetros de autenticación, mensajes, eventos y métodos para tu bot.",
    "commands-admin":
      "Esta referencia reúne comandos administrativos. Consulta opciones de miembros, invitaciones, permisos y moderación antes de cambiar algo.",

    people:
      "Identifica a una persona y recupera lo hablado antes de responder. Esta guía explica el contexto disponible, las señales de la cuenta y los límites de un historial incompleto.",
    remote:
      "Conecta las herramientas a un chat del navegador o un agente en otro dispositivo. Aquí están los detalles de arranque y transferencia del mensajero; para la primera conexión empieza por la guía paso a paso enlazada.",
    mcp: "Esta es la referencia técnica de MCP para este mensajero. Consulta herramientas, ajustes y permisos; la guía común enlazada te ayuda a elegir y configurar la primera conexión.",
    configuration:
      "Guarda ajustes que repetirías en cada comando. Esta guía explica su ubicación y prioridad para cambiar un valor y comprobar cuál se aplica.",
    "configuration-reference":
      "Consulta aquí el nombre exacto de un ajuste, su valor predeterminado o variable de entorno. Para el primer cambio empieza por la guía enlazada.",
    permissions:
      "Elige qué acciones puede realizar el agente con esta cuenta o bot. Comprueba nivel de acceso, destinatarios y confirmaciones antes de permitir cambios.",
    profiles:
      "Elige la cuenta o bot correcto cuando tengas varios. Esta guía explica perfiles y ajustes para que la tarea use la cuenta prevista.",
    rankings:
      "Usa el historial guardado para entender la actividad y encontrar conversaciones que necesitan atención. Aquí se explican informes, fuentes y datos ausentes; un recuento bajo en un archivo incompleto no es un juicio sobre una persona.",
    "cli-contract":
      "Esta referencia es para autores de scripts y agentes: formatos de salida, errores, permisos y consulta de comandos. Para tareas habituales empieza por la guía enlazada.",
    limits:
      "Entiende por qué el mensajero pide esperar y qué comprobar antes de reintentar. Esta guía distingue los límites del mensajero de tus propios límites de envío.",
    replies:
      "Configura y prueba reglas de respuesta a cuentas de prueba. Es un flujo limitado de respuestas automáticas; aquí se explica la audiencia, los permisos y cómo detenerlo.",
    sessions:
      "Conecta la herramienta a tu cuenta para que el agente pueda leer los chats que elijas y ayudarte a responder. Esta guía explica el acceso, su comprobación y cómo gestionar o cerrar una sesión. Iniciar sesión añade un dispositivo autorizado; no descarga todo el historial.",
    usage:
      "Usa tu cuenta conectada para leer conversaciones, reunir contexto y preparar o enviar respuestas. Empieza por leer, comprueba el resultado y elige después la sección de archivos, grupos o envío.",
    archive:
      "Guarda el historial de los chats que necesitas para encontrar mensajes antiguos y recordar acuerdos. Esta guía te ayuda a elegir el periodo, comprobar lo guardado y exportar una copia cuando haga falta.",
    search:
      "Encuentra un mensaje antiguo, acuerdo, enlace o archivo en las conversaciones guardadas. Aquí se explican las opciones de búsqueda y cómo comprobar los mensajes de origen. Descarga primero el historial pertinente si aún no está en tu ordenador.",
    bot: "Usa la cuenta independiente de un bot para responder, publicar o ayudar en un grupo. Aquí conectarás el bot, encontrarás el chat y comprobarás su acceso; tus conversaciones personales siguen separadas.",
    groups:
      "Gestiona un grupo en el que participas: consulta miembros y ajustes, y elige la acción que necesitas. Aquí se explican las operaciones y derechos necesarios para comprobar el destino antes de cambiar algo.",
    security:
      "Elige lo que puede hacer tu agente y conoce dónde se guardan los datos de acceso y mensajes. Aquí se explican las protecciones, sus límites y los ajustes que puedes comprobar antes de permitir envíos u otros cambios.",
    recipes:
      "Da una tarea útil al agente sin escribir tú la secuencia de comandos. Los ejemplos incluyen peticiones para tus chats, el resultado esperado y enlaces a las instrucciones exactas.",
    troubleshooting:
      "Encuentra tu error o síntoma y sigue los pasos de recuperación. El objetivo es volver a usar la herramienta y comprobar el resultado; conserva el texto del error si necesitas ayuda para informar del problema.",
    changelog:
      "Consulta lo que cambió en las versiones: capacidades, correcciones y cambios que afectan a comandos. Empieza por tu versión instalada y abre la guía de la función que quieras probar.",
    roadmap:
      "Consulta lo previsto y lo que aún falta. Son prioridades de desarrollo, no fechas prometidas; el historial de versiones registra lo que ya se publicó.",
  },
}
export function guideOrientation(slugs: string[], lang: string): string | undefined {
  if (slugs.length !== 2 || !["tg", "max"].includes(slugs[0])) return
  const text = purpose[lang === "ru" || lang === "es" ? lang : "en"]
  return text[slugs[1] as keyof typeof text]
}

/** A beginner task entry beside native details, shared by HTML and Markdown exports. */
export function guideStartLink(slugs: string[], lang: string) {
  if (slugs.length !== 2 || !["tg", "max"].includes(slugs[0])) return
  const destinations: Record<string, string> = {
    remote: "browser-apps",
    mcp: "mcp",
    people: "people",
    rankings: "group-admins",
    "cli-contract": "first-tasks",
    configuration: "configuration",
    "configuration-reference": "configuration",
    permissions: "permissions",
    profiles: "profiles",
    limits: `${slugs[0]}/troubleshooting`,
    replies: "drafts-and-templates",
    "audio-recognition": "prompting#files-and-voice",
    "external-models": "security",
    "topic-search": "search",
  }
  const page = destinations[slugs[1]]
  if (!page) return
  const labels: Record<string, [string, string, string]> = {
    "browser-apps": ["Connect ChatGPT or Claude", "Подключить ChatGPT или Claude", "Conectar ChatGPT o Claude"],
    mcp: ["Choose a connection method", "Выбрать способ подключения", "Elegir cómo conectar"],
    people: ["Recover your conversation context", "Вспомнить контекст общения", "Recuperar el contexto"],
    "group-admins": [
      "Review questions and group activity",
      "Проверить вопросы и активность группы",
      "Revisar preguntas y actividad",
    ],
    "first-tasks": ["Try your first task", "Попробовать первую задачу", "Probar una primera tarea"],
    configuration: ["Change and check settings", "Изменить и проверить настройки", "Cambiar y comprobar ajustes"],
    permissions: ["Choose agent permissions", "Выбрать права агента", "Elegir permisos del agente"],
    profiles: ["Choose an account or bot", "Выбрать аккаунт или бота", "Elegir cuenta o bot"],
    "max/troubleshooting": ["Restore the MAX connection", "Восстановить подключение MAX", "Restablecer MAX"],
    "tg/troubleshooting": [
      "Restore the Telegram connection",
      "Восстановить подключение Telegram",
      "Restablecer Telegram",
    ],
    "drafts-and-templates": [
      "Choose drafts or auto-replies",
      "Выбрать черновики или автоответы",
      "Elegir borradores o respuestas automáticas",
    ],
    "prompting#files-and-voice": [
      "Work with files and voice",
      "Работать с файлами и голосовыми",
      "Trabajar con archivos y voz",
    ],
    security: ["Check where your data goes", "Проверить, куда попадают данные", "Comprobar dónde van tus datos"],
    search: ["Find a message or discussion", "Найти сообщение или обсуждение", "Encontrar mensajes o conversaciones"],
  }
  const label = labels[page][lang === "ru" ? 1 : lang === "es" ? 2 : 0]
  return { href: `/${lang}/docs/${page}`, label }
}
