export const aboutCopy = {
  en: {
    title: "About WireCat",
    nav: "About",
    back: "Home",
    docs: "Documentation",
    intro:
      "WireCat connects the AI agent you already use — Claude, ChatGPT, Codex and others — to your chats, mail, meetings, documents, calendar and notes, and keeps all of it on your computer.",
    sections: [
      {
        title: "Why WireCat exists",
        paragraphs: [
          "A document in one chat, a customer's question in another, a promise you made last week. Finding the right message takes time, and it's easy to miss something that needs your attention.",
          "Messengers came first: they hold most of what people agree on, and nothing gave an AI agent easy access to them. From there WireCat grew to the rest of your personal context: mail, meetings, documents, calendar and notes.",
        ],
      },
      {
        title: "What WireCat is today",
        paragraphs: [
          "A set of command-line tools, one for each source. Each works with your own account, keeps a searchable copy on your computer and lets an AI agent read, search and prepare replies. WireCat Desktop installs, updates and checks them for you, signs you in and gives your agents the instructions to use them, with no terminal needed.",
          "You choose the agent and what it may do. Any agent that runs terminal commands can use the tools: Claude Code, Codex, Cursor, Gemini CLI, Hermes and others. Apps without a terminal, such as ChatGPT or Claude, connect through MCP, a standard for linking AI apps to tools.",
        ],
      },
      {
        title: "What's next",
        paragraphs: [
          "More sources, and closer links between them, so your agent can follow a person or a project across chats, mail, meetings and notes.",
          "The goal stays the same: you own your data and put it to work. Gather the right context, turn agreements into tasks and keep your projects moving, with the tools and the agent you choose.",
        ],
      },
      {
        title: "How we fund the project",
        paragraphs: [
          "We develop custom AI workflows, assistants and bots built with LangGraph, and integrations for people and organisations. These projects support the ongoing development and maintenance of our open-source tools.",
          "If you are exploring an integration for your own workflow, we would be happy to discuss it. You can reach us by email or Telegram.",
        ],
      },
    ],
    principles: {
      title: "How it is built",
      items: [
        {
          title: "Your data stays on your computer.",
          text: "Messages, mail and documents are kept in a local store. WireCat has no servers to send them to; your agent receives only what a task needs.",
        },
        {
          title: "Your accounts, your limits.",
          text: "Every command names the profile it uses, and a profile can be read-only or limited to chosen chats. Nothing is sent, marked read or deleted unless you asked for it.",
        },
        {
          title: "Built for agents.",
          text: "One operation per call, one JSON result and a fixed exit code for each failure. Every tool ships an MCP server and a skill that teaches your agent its commands.",
        },
        {
          title: "Open source.",
          text: "Every tool and the desktop app are on GitHub under the Apache 2.0 licence. Read the code, report a problem or contribute.",
        },
      ],
    },
    project: {
      title: "The project at a glance",
      description: "Open-source tools that connect your AI agent to your chats, mail, meetings, documents and notes.",
      tools: "Available today",
      license: "Licence",
      source: "Source code",
      maintainer: "Maintainer",
      contribute: "Ideas and contributions",
      contributeText: "Suggest an integration, report a problem or help improve the tools.",
      issues: "Discuss the project on GitHub",
      contact: "Get in touch",
    },
    toolDescriptions: {
      tg: "Your Telegram account, bots and groups.",
      wa: "Your linked WhatsApp account and business bots.",
      max: "Your MAX account, bots and groups.",
      zm: "Your Zoom transcripts and recordings, searchable.",
      drive: "Chosen Google Drive folders, searched on your computer.",
      gcal: "Your Google calendars, searchable offline.",
      mail: "Your mailbox, synced over IMAP and searchable offline.",
      memo: "Notes, mail and messages in one place.",
      desktop: "Installs, updates and checks the tools, and connects your agents.",
    },
    names: { mail: "Mail", desktop: "WireCat Desktop" },
    download: "Download the desktop app",
    downloadShort: "Download",
    blog: "Blog",
    contactText: "Share an idea, ask about the tools or discuss an integration.",
    agentGuide: "Connect your AI agent",
    openSource: "WireCat is an open-source project under the Apache 2.0 licence.",
    contactTitle: "Get in touch",
    emailButton: "Email us",
    telegramButton: "Telegram",
  },
  ru: {
    title: "О WireCat",
    nav: "О проекте",
    back: "Главная",
    docs: "Документация",
    intro:
      "WireCat подключает ИИ-агента, которым вы уже пользуетесь, — Claude, ChatGPT, Codex и другие — к вашим чатам, почте, встречам, документам, календарю и заметкам. Всё это хранится на вашем компьютере.",
    sections: [
      {
        title: "Зачем нужен WireCat",
        paragraphs: [
          "Документ в одном чате, вопрос клиента в другом, обещание, которое вы дали на прошлой неделе. Поиск нужного сообщения занимает время, а среди новых сообщений легко пропустить важное.",
          "Начали с мессенджеров: в них большая часть договорённостей, а простого доступа к ним у ИИ-агента не было. Дальше WireCat охватил остальной ваш личный контекст: почту, встречи, документы, календарь и заметки.",
        ],
      },
      {
        title: "Что такое WireCat сейчас",
        paragraphs: [
          "Набор инструментов командной строки, по одному на каждый источник. Каждый работает с вашим собственным аккаунтом, хранит копию для поиска на вашем компьютере и позволяет ИИ-агенту читать, искать и готовить ответы. WireCat Desktop устанавливает, обновляет и проверяет их, помогает войти в аккаунты и даёт агентам инструкции, как ими пользоваться. Терминал не нужен.",
          "Вы выбираете агента и то, что ему можно делать. Инструментами пользуется любой агент, который выполняет команды в терминале: Claude Code, Codex, Cursor, Gemini CLI, Hermes и другие. Приложения без терминала, например ChatGPT или Claude, подключаются через MCP — стандарт для подключения ИИ-приложений к инструментам.",
        ],
      },
      {
        title: "Что дальше",
        paragraphs: [
          "Новые источники и более тесные связи между ними, чтобы агент мог проследить человека или проект через чаты, почту, встречи и заметки.",
          "Цель прежняя: вы владеете своими данными и используете их в работе. Собирайте нужный контекст, превращайте договорённости в задачи и продвигайте проекты — с теми инструментами и тем агентом, которые выбрали сами.",
        ],
      },
      {
        title: "Как мы поддерживаем проект",
        paragraphs: [
          "Мы разрабатываем AI workflows, ассистентов и ботов на LangGraph, а также интеграции на заказ для людей и организаций. Такие проекты поддерживают развитие и сопровождение наших инструментов с открытым кодом.",
          "Если вы рассматриваете интеграцию для своей работы, будем рады обсудить её. С нами можно связаться по почте или в Telegram.",
        ],
      },
    ],
    principles: {
      title: "Как это устроено",
      items: [
        {
          title: "Данные остаются на вашем компьютере.",
          text: "Сообщения, письма и документы хранятся локально. У WireCat нет серверов, куда бы они отправлялись; агент получает только то, что нужно для задачи.",
        },
        {
          title: "Ваши аккаунты, ваши ограничения.",
          text: "Каждая команда называет профиль, с которым работает, а профиль можно сделать только для чтения или ограничить выбранными чатами. Ничего не отправляется, не помечается прочитанным и не удаляется, пока вы об этом не попросили.",
        },
        {
          title: "Сделано для агентов.",
          text: "Одна операция за вызов, один результат в JSON и свой код завершения для каждой ошибки. В каждом инструменте есть MCP-сервер и навык, который учит агента его командам.",
        },
        {
          title: "Открытый код.",
          text: "Все инструменты и приложение для компьютера лежат на GitHub под лицензией Apache 2.0. Читайте код, сообщайте о проблемах и участвуйте в разработке.",
        },
      ],
    },
    project: {
      title: "Коротко о проекте",
      description:
        "Инструменты с открытым кодом, которые подключают ИИ-агента к чатам, почте, встречам, документам и заметкам.",
      tools: "Уже доступны",
      license: "Лицензия",
      source: "Исходный код",
      maintainer: "Автор",
      contribute: "Идеи и участие",
      contributeText: "Предложите интеграцию, сообщите о проблеме или помогите улучшить инструменты.",
      issues: "Обсудить проект на GitHub",
      contact: "Связаться с нами",
    },
    toolDescriptions: {
      tg: "Ваш аккаунт Telegram, боты и группы.",
      wa: "Ваш привязанный аккаунт WhatsApp и бизнес-боты.",
      max: "Ваш аккаунт MAX, боты и группы.",
      zm: "Расшифровки и записи встреч Zoom с поиском.",
      drive: "Выбранные папки Google Drive, поиск на компьютере.",
      gcal: "Ваши календари Google, поиск без интернета.",
      mail: "Почтовый ящик по IMAP, поиск без интернета.",
      memo: "Заметки, почта и сообщения в одном месте.",
      desktop: "Устанавливает, обновляет и проверяет инструменты, подключает агентов.",
    },
    names: { mail: "Почта", desktop: "WireCat Desktop" },
    download: "Скачать приложение для компьютера",
    downloadShort: "Скачать",
    blog: "Блог",
    contactText: "Поделитесь идеей, задайте вопрос об инструментах или обсудите интеграцию.",
    agentGuide: "Подключить ИИ-агента",
    openSource: "WireCat — проект с открытым кодом под лицензией Apache 2.0.",
    contactTitle: "Связаться с нами",
    emailButton: "Написать по почте",
    telegramButton: "Telegram",
  },
  es: {
    title: "Acerca de WireCat",
    nav: "Acerca de",
    back: "Inicio",
    docs: "Documentación",
    intro:
      "WireCat conecta el agente de IA que ya usas —Claude, ChatGPT, Codex y otros— con tus chats, correo, reuniones, documentos, calendario y notas, y lo guarda todo en tu ordenador.",
    sections: [
      {
        title: "Por qué existe WireCat",
        paragraphs: [
          "Un documento en un chat, una pregunta de un cliente en otro, algo que prometiste la semana pasada. Encontrar el mensaje correcto lleva tiempo y es fácil pasar por alto algo importante.",
          "Empezamos por la mensajería: ahí está casi todo lo que la gente acuerda, y ningún agente de IA tenía un acceso sencillo a ella. Desde ahí, WireCat se extendió al resto de tu contexto personal: correo, reuniones, documentos, calendario y notas.",
        ],
      },
      {
        title: "Qué es WireCat hoy",
        paragraphs: [
          "Un conjunto de herramientas de línea de comandos, una por cada fuente. Cada una trabaja con tu propia cuenta, guarda una copia consultable en tu ordenador y permite que un agente de IA lea, busque y prepare respuestas. WireCat Desktop las instala, actualiza y revisa por ti, te ayuda a iniciar sesión y da a tus agentes las instrucciones para usarlas, sin terminal.",
          "Tú eliges el agente y lo que puede hacer. Cualquier agente que ejecute comandos en la terminal puede usar las herramientas: Claude Code, Codex, Cursor, Gemini CLI, Hermes y otros. Las apps sin terminal, como ChatGPT o Claude, se conectan mediante MCP, un estándar que conecta aplicaciones de IA con herramientas.",
        ],
      },
      {
        title: "Lo que viene después",
        paragraphs: [
          "Más fuentes y vínculos más estrechos entre ellas, para que tu agente pueda seguir a una persona o un proyecto a través de chats, correo, reuniones y notas.",
          "El objetivo sigue siendo el mismo: que tus datos sean tuyos y te sirvan. Reúne el contexto adecuado, convierte acuerdos en tareas y haz avanzar tus proyectos, con las herramientas y el agente que elijas.",
        ],
      },
      {
        title: "Cómo financiamos el proyecto",
        paragraphs: [
          "Desarrollamos flujos de trabajo de IA, asistentes y bots con LangGraph, e integraciones a medida para personas y organizaciones. Estos proyectos sostienen el desarrollo y mantenimiento de nuestras herramientas de código abierto.",
          "Si estás valorando una integración para tu trabajo, nos encantará hablar de ella. Puedes contactarnos por correo electrónico o Telegram.",
        ],
      },
    ],
    principles: {
      title: "Cómo está hecho",
      items: [
        {
          title: "Tus datos se quedan en tu ordenador.",
          text: "Mensajes, correos y documentos se guardan en un almacén local. WireCat no tiene servidores a los que enviarlos; tu agente recibe solo lo que necesita para la tarea.",
        },
        {
          title: "Tus cuentas, tus límites.",
          text: "Cada comando indica el perfil que usa, y un perfil puede ser de solo lectura o limitarse a los chats que elijas. No se envía, marca como leído ni borra nada que no hayas pedido.",
        },
        {
          title: "Pensado para agentes.",
          text: "Una operación por llamada, un resultado en JSON y un código de salida fijo para cada error. Cada herramienta incluye un servidor MCP y una skill que enseña sus comandos a tu agente.",
        },
        {
          title: "Código abierto.",
          text: "Todas las herramientas y la app de escritorio están en GitHub con licencia Apache 2.0. Lee el código, informa de un problema o contribuye.",
        },
      ],
    },
    project: {
      title: "El proyecto de un vistazo",
      description:
        "Herramientas de código abierto que conectan tu agente de IA con tus chats, correo, reuniones, documentos y notas.",
      tools: "Disponible hoy",
      license: "Licencia",
      source: "Código fuente",
      maintainer: "Responsable",
      contribute: "Ideas y contribuciones",
      contributeText: "Propón una integración, informa de un problema o ayuda a mejorar las herramientas.",
      issues: "Hablar del proyecto en GitHub",
      contact: "Contacta con nosotros",
    },
    toolDescriptions: {
      tg: "Tu cuenta de Telegram, bots y grupos.",
      wa: "Tu cuenta vinculada de WhatsApp y bots de empresa.",
      max: "Tu cuenta de MAX, bots y grupos.",
      zm: "Transcripciones y grabaciones de Zoom, con búsqueda.",
      drive: "Carpetas elegidas de Google Drive, con búsqueda local.",
      gcal: "Tus calendarios de Google, con búsqueda sin conexión.",
      mail: "Tu buzón sincronizado por IMAP, con búsqueda sin conexión.",
      memo: "Notas, correo y mensajes en un solo lugar.",
      desktop: "Instala, actualiza y revisa las herramientas, y conecta tus agentes.",
    },
    names: { mail: "Correo", desktop: "WireCat Desktop" },
    download: "Descargar la aplicación de escritorio",
    downloadShort: "Descargar",
    blog: "Blog",
    contactText: "Comparte una idea, pregunta por las herramientas o cuéntanos una integración.",
    agentGuide: "Conectar tu agente de IA",
    openSource: "WireCat es un proyecto de código abierto con licencia Apache 2.0.",
    contactTitle: "Contacta con nosotros",
    emailButton: "Escríbenos",
    telegramButton: "Telegram",
  },
}
