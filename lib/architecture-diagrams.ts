export type Lang = "en" | "ru" | "es"
type Box = { name: string; note: string; tone?: "tool" | "shared" | "core" | "outside" }
type Row = { boxes: Box[]; label?: string }

export const diagrams: Record<string, Record<Lang, { title: string; rows: Row[] }>> = {
  packages: {
    en: {
      title: "Packages and who depends on whom",
      rows: [
        {
          boxes: [
            { name: "@wirecat/tg-cli", note: "Telegram adapter, login, setup", tone: "tool" },
            { name: "@wirecat/max-cli", note: "MAX protocol, session, max serve, Bot API", tone: "tool" },
          ],
        },
        {
          boxes: [
            {
              name: "@wirecat/cli-messaging",
              note: "domain, services, store, send guard, commands, MCP",
              tone: "shared",
            },
          ],
        },
        {
          boxes: [
            {
              name: "@wirecat/cli-core",
              note: "output, errors and exit codes, keyring, config, codegen",
              tone: "core",
            },
            { name: "cli-messaging-sqlite · -onnx", note: "pinned SQLite and ONNX Runtime builds", tone: "core" },
          ],
        },
        {
          label: "outside",
          boxes: [
            { name: "@mtcute/node", note: "Telegram MTProto, used only by tg", tone: "outside" },
            { name: "ws · msgpack", note: "MAX WebSocket, used only by max", tone: "outside" },
          ],
        },
      ],
    },
    ru: {
      title: "Пакеты и зависимости между ними",
      rows: [
        {
          boxes: [
            { name: "@wirecat/tg-cli", note: "адаптер Telegram, вход, настройка", tone: "tool" },
            { name: "@wirecat/max-cli", note: "протокол MAX, сессия, max serve, Bot API", tone: "tool" },
          ],
        },
        {
          boxes: [
            {
              name: "@wirecat/cli-messaging",
              note: "модель, сервисы, хранилище, защита отправки, команды, MCP",
              tone: "shared",
            },
          ],
        },
        {
          boxes: [
            {
              name: "@wirecat/cli-core",
              note: "вывод, ошибки и коды выхода, ключница, настройки, генератор",
              tone: "core",
            },
            { name: "cli-messaging-sqlite · -onnx", note: "закреплённые сборки SQLite и ONNX Runtime", tone: "core" },
          ],
        },
        {
          label: "снаружи",
          boxes: [
            { name: "@mtcute/node", note: "MTProto Telegram, только в tg", tone: "outside" },
            { name: "ws · msgpack", note: "WebSocket MAX, только в max", tone: "outside" },
          ],
        },
      ],
    },
    es: {
      title: "Paquetes y quién depende de quién",
      rows: [
        {
          boxes: [
            { name: "@wirecat/tg-cli", note: "adaptador de Telegram, acceso, configuración", tone: "tool" },
            { name: "@wirecat/max-cli", note: "protocolo MAX, sesión, max serve, Bot API", tone: "tool" },
          ],
        },
        {
          boxes: [
            {
              name: "@wirecat/cli-messaging",
              note: "dominio, servicios, almacén, protección de envíos, comandos, MCP",
              tone: "shared",
            },
          ],
        },
        {
          boxes: [
            {
              name: "@wirecat/cli-core",
              note: "salida, errores y códigos de salida, llavero, configuración, codegen",
              tone: "core",
            },
            { name: "cli-messaging-sqlite · -onnx", note: "builds fijados de SQLite y ONNX Runtime", tone: "core" },
          ],
        },
        {
          label: "fuera",
          boxes: [
            { name: "@mtcute/node", note: "MTProto de Telegram, solo en tg", tone: "outside" },
            { name: "ws · msgpack", note: "WebSocket de MAX, solo en max", tone: "outside" },
          ],
        },
      ],
    },
  },
  command: {
    en: {
      title: "One command, start to finish",
      rows: [
        { boxes: [{ name: "argv", note: 'tg work messages send "Book club" …' }] },
        { boxes: [{ name: "run()", note: "profile, settings, deadline, run record; never throws" }] },
        { boxes: [{ name: "command", note: "parses its options, asks for services" }] },
        { boxes: [{ name: "send guard", note: "permissions → recipients → hourly limit; writes only" }] },
        { boxes: [{ name: "service", note: "the use case, shared with the MCP tool" }] },
        {
          boxes: [
            { name: "adapter + decorators", note: "times each call, saves what was read" },
            { name: "local store", note: "SQLite, one transaction per call", tone: "core" },
          ],
        },
        { boxes: [{ name: "messenger", note: "Telegram or MAX", tone: "outside" }] },
        {
          boxes: [
            { name: "stdout · exit code", note: "data on stdout, notes on stderr, everything closed", tone: "tool" },
          ],
        },
      ],
    },
    ru: {
      title: "Одна команда от начала до конца",
      rows: [
        { boxes: [{ name: "argv", note: 'tg work messages send "Book club" …' }] },
        { boxes: [{ name: "run()", note: "профиль, настройки, тайм-аут, запись запуска; не бросает исключений" }] },
        { boxes: [{ name: "команда", note: "разбирает свои параметры, просит сервисы" }] },
        { boxes: [{ name: "защита отправки", note: "права → получатели → лимит в час; только для записи" }] },
        { boxes: [{ name: "сервис", note: "сценарий, общий с MCP-инструментом" }] },
        {
          boxes: [
            { name: "адаптер + обёртки", note: "замеряют каждый вызов, сохраняют прочитанное" },
            { name: "локальная копия", note: "SQLite, одна транзакция на вызов", tone: "core" },
          ],
        },
        { boxes: [{ name: "мессенджер", note: "Telegram или MAX", tone: "outside" }] },
        {
          boxes: [
            { name: "stdout · код выхода", note: "данные в stdout, заметки в stderr, всё закрыто", tone: "tool" },
          ],
        },
      ],
    },
    es: {
      title: "Un comando, de principio a fin",
      rows: [
        { boxes: [{ name: "argv", note: 'tg work messages send "Book club" …' }] },
        { boxes: [{ name: "run()", note: "perfil, ajustes, plazo, registro de ejecución; nunca lanza" }] },
        { boxes: [{ name: "comando", note: "analiza sus opciones, pide servicios" }] },
        {
          boxes: [
            { name: "protección de envíos", note: "permisos → destinatarios → límite por hora; solo escrituras" },
          ],
        },
        { boxes: [{ name: "servicio", note: "el caso de uso, compartido con la herramienta MCP" }] },
        {
          boxes: [
            { name: "adaptador + decoradores", note: "miden cada llamada, guardan lo leído" },
            { name: "almacén local", note: "SQLite, una transacción por llamada", tone: "core" },
          ],
        },
        { boxes: [{ name: "mensajero", note: "Telegram o MAX", tone: "outside" }] },
        {
          boxes: [
            { name: "stdout · código de salida", note: "datos en stdout, notas en stderr, todo cerrado", tone: "tool" },
          ],
        },
      ],
    },
  },
  remote: {
    en: {
      title: "From ChatGPT or Claude to your messages",
      rows: [
        {
          boxes: [
            { name: "ChatGPT · Claude", note: "in your browser; their servers make the request", tone: "outside" },
          ],
        },
        { boxes: [{ name: "Tailscale Funnel", note: "a public https address for one port of your computer" }] },
        {
          boxes: [
            {
              name: "tg / max mcp --http",
              note: "on your computer; asks for the login code, then a form before each change",
              tone: "tool",
            },
          ],
        },
        { boxes: [{ name: "Telegram · MAX", note: "your own account", tone: "outside" }] },
      ],
    },
    ru: {
      title: "От ChatGPT или Claude до вашей переписки",
      rows: [
        { boxes: [{ name: "ChatGPT · Claude", note: "в браузере; запрос делают их серверы", tone: "outside" }] },
        { boxes: [{ name: "Tailscale Funnel", note: "публичный адрес https для одного порта компьютера" }] },
        {
          boxes: [
            {
              name: "tg / max mcp --http",
              note: "на вашем компьютере; просит код входа, а перед каждым изменением — форму",
              tone: "tool",
            },
          ],
        },
        { boxes: [{ name: "Telegram · MAX", note: "ваш собственный аккаунт", tone: "outside" }] },
      ],
    },
    es: {
      title: "De ChatGPT o Claude a tus mensajes",
      rows: [
        {
          boxes: [
            { name: "ChatGPT · Claude", note: "en tu navegador; la petición la hacen sus servidores", tone: "outside" },
          ],
        },
        { boxes: [{ name: "Tailscale Funnel", note: "una dirección https pública para un puerto de tu ordenador" }] },
        {
          boxes: [
            {
              name: "tg / max mcp --http",
              note: "en tu ordenador; pide el código de acceso y un formulario antes de cada cambio",
              tone: "tool",
            },
          ],
        },
        { boxes: [{ name: "Telegram · MAX", note: "tu propia cuenta", tone: "outside" }] },
      ],
    },
  },
  layers: {
    en: {
      title: "Layers: each calls only the ones below",
      rows: [
        {
          boxes: [{ name: "interface", note: "CLI commands · MCP tools", tone: "tool" }],
        },
        { boxes: [{ name: "services", note: "messages, chats, people, inbox, archive, conversations…" }] },
        { boxes: [{ name: "ports", note: "MessengerAdapter · MessageStore" }] },
        {
          boxes: [
            { name: "adapters", note: "TelegramAdapter (tg) · maxAdapter (max)", tone: "outside" },
            { name: "SQLite store", note: "Node and Bun drivers", tone: "core" },
          ],
        },
        { boxes: [{ name: "domain", note: "Chat, Message, Person, Page… types only", tone: "core" }] },
      ],
    },
    ru: {
      title: "Слои: каждый вызывает только нижние",
      rows: [
        { boxes: [{ name: "интерфейс", note: "команды CLI · MCP-инструменты", tone: "tool" }] },
        { boxes: [{ name: "сервисы", note: "messages, chats, people, inbox, archive, conversations…" }] },
        { boxes: [{ name: "порты", note: "MessengerAdapter · MessageStore" }] },
        {
          boxes: [
            { name: "адаптеры", note: "TelegramAdapter (tg) · maxAdapter (max)", tone: "outside" },
            { name: "хранилище SQLite", note: "драйверы Node и Bun", tone: "core" },
          ],
        },
        { boxes: [{ name: "модель", note: "Chat, Message, Person, Page… только типы", tone: "core" }] },
      ],
    },
    es: {
      title: "Capas: cada una llama solo a las de abajo",
      rows: [
        { boxes: [{ name: "interfaz", note: "comandos CLI · herramientas MCP", tone: "tool" }] },
        { boxes: [{ name: "servicios", note: "messages, chats, people, inbox, archive, conversations…" }] },
        { boxes: [{ name: "puertos", note: "MessengerAdapter · MessageStore" }] },
        {
          boxes: [
            { name: "adaptadores", note: "TelegramAdapter (tg) · maxAdapter (max)", tone: "outside" },
            { name: "almacén SQLite", note: "drivers de Node y Bun", tone: "core" },
          ],
        },
        { boxes: [{ name: "dominio", note: "Chat, Message, Person, Page… solo tipos", tone: "core" }] },
      ],
    },
  },
  searchIndexing: {
    en: {
      title: "From saved content to searchable indexes",
      rows: [
        {
          boxes: [
            {
              name: "Saved content",
              note: "messages, notes, extracted file text and transcripts",
              tone: "shared",
            },
          ],
        },
        {
          boxes: [
            {
              name: "Local storage",
              note: "original text, source references and metadata; indexes differ by content type",
              tone: "core",
            },
          ],
        },
        {
          boxes: [
            {
              name: "Words and stems",
              note: "word indexes plus Snowball word forms",
              tone: "core",
            },
            {
              name: "Similar spelling",
              note: "message vocabulary trigrams → typo candidates",
              tone: "core",
            },
            {
              name: "Parts of text",
              note: "message substring index; separate from word matching",
              tone: "core",
            },
          ],
        },
      ],
    },
    ru: {
      title: "От сохранённого текста к поисковым индексам",
      rows: [
        {
          boxes: [
            {
              name: "Сохранённые данные",
              note: "сообщения, заметки, извлечённый текст файлов и расшифровки",
              tone: "shared",
            },
          ],
        },
        {
          boxes: [
            {
              name: "Локальное хранилище",
              note: "исходный текст, ссылки на источники и метаданные; индексы зависят от типа данных",
              tone: "core",
            },
          ],
        },
        {
          boxes: [
            {
              name: "Слова и основы",
              note: "индексы слов и формы слов по Snowball",
              tone: "core",
            },
            {
              name: "Похожее написание",
              note: "триграммы словаря сообщений → варианты исправления опечаток",
              tone: "core",
            },
            {
              name: "Части текста",
              note: "индекс подстрок сообщений; отдельно от поиска слов",
              tone: "core",
            },
          ],
        },
      ],
    },
    es: {
      title: "Del contenido guardado a los índices de búsqueda",
      rows: [
        {
          boxes: [
            {
              name: "Contenido guardado",
              note: "mensajes, notas, texto extraído de archivos y transcripciones",
              tone: "shared",
            },
          ],
        },
        {
          boxes: [
            {
              name: "Almacenamiento local",
              note: "texto original, referencias y metadatos; los índices dependen del tipo de contenido",
              tone: "core",
            },
          ],
        },
        {
          boxes: [
            {
              name: "Palabras y raíces",
              note: "índices de palabras y formas de palabras con Snowball",
              tone: "core",
            },
            {
              name: "Escritura similar",
              note: "trigramas del vocabulario de mensajes → posibles correcciones",
              tone: "core",
            },
            {
              name: "Partes del texto",
              note: "índice de subcadenas de mensajes; separado de las palabras",
              tone: "core",
            },
          ],
        },
      ],
    },
  },
  searchPaths: {
    en: {
      title: "Three paths through the message archive",
      rows: [
        {
          boxes: [
            {
              name: "Message archive",
              note: "saved messages, metadata and direct reply links",
              tone: "core",
            },
          ],
        },
        {
          boxes: [
            {
              name: "Strict search",
              note: "words + stems + filters → BM25 or newest first",
              tone: "tool",
            },
            {
              name: "Discovery",
              note: "partial word matches + direct replies → coverage and rank fusion",
              tone: "tool",
            },
            {
              name: "Topic search",
              note: "built conversations → words + optional meaning vectors",
              tone: "tool",
            },
          ],
        },
        {
          boxes: [
            {
              name: "Original sources",
              note: "message references and context; ranking is not proof of an answer",
              tone: "shared",
            },
          ],
        },
      ],
    },
    ru: {
      title: "Три пути поиска в архиве сообщений",
      rows: [
        {
          boxes: [
            {
              name: "Архив сообщений",
              note: "сохранённые сообщения, метаданные и прямые связи ответов",
              tone: "core",
            },
          ],
        },
        {
          boxes: [
            {
              name: "Строгий поиск",
              note: "слова + основы + фильтры → BM25 или сначала новые",
              tone: "tool",
            },
            {
              name: "Discovery",
              note: "частичные совпадения слов + прямые ответы → охват слов и слияние рангов",
              tone: "tool",
            },
            {
              name: "Поиск по темам",
              note: "построенные разговоры → слова + необязательные векторы смысла",
              tone: "tool",
            },
          ],
        },
        {
          boxes: [
            {
              name: "Исходные данные",
              note: "адреса сообщений и контекст; ранг не доказывает наличие ответа",
              tone: "shared",
            },
          ],
        },
      ],
    },
    es: {
      title: "Tres vías por el archivo de mensajes",
      rows: [
        {
          boxes: [
            {
              name: "Archivo de mensajes",
              note: "mensajes guardados, metadatos y enlaces de respuesta directa",
              tone: "core",
            },
          ],
        },
        {
          boxes: [
            {
              name: "Búsqueda estricta",
              note: "palabras + raíces + filtros → BM25 o más recientes primero",
              tone: "tool",
            },
            {
              name: "Discovery",
              note: "coincidencias parciales + respuestas directas → cobertura de palabras y fusión de rangos",
              tone: "tool",
            },
            {
              name: "Búsqueda por temas",
              note: "conversaciones construidas → palabras + vectores de significado opcionales",
              tone: "tool",
            },
          ],
        },
        {
          boxes: [
            {
              name: "Fuentes originales",
              note: "referencias y contexto; el puesto no demuestra que haya una respuesta",
              tone: "shared",
            },
          ],
        },
      ],
    },
  },
  strictSearch: {
    en: {
      title: "Strict message search, step by step",
      rows: [
        {
          boxes: [
            {
              name: "Query and scope",
              note: "parse and validate; resolve accounts, chats, people and dates",
              tone: "shared",
            },
          ],
        },
        {
          boxes: [
            {
              name: "Words and word forms",
              note: "FTS5 words and Snowball stems; exact: keeps literal forms",
              tone: "core",
            },
            {
              name: "Other conditions",
              note: "metadata, attachment content and requested text patterns",
              tone: "core",
            },
          ],
        },
        {
          boxes: [
            {
              name: "Rank matching messages",
              note: "BM25, exact forms first; newest for queries without required words or --newest",
              tone: "shared",
            },
          ],
        },
        {
          boxes: [
            {
              name: "--context",
              note: "optional neighbors in the same account and chat",
              tone: "tool",
            },
          ],
        },
      ],
    },
    ru: {
      title: "Строгий поиск сообщений по шагам",
      rows: [
        {
          boxes: [
            {
              name: "Запрос и охват",
              note: "разбор и проверка; аккаунты, чаты, люди и даты",
              tone: "shared",
            },
          ],
        },
        {
          boxes: [
            {
              name: "Слова и формы слов",
              note: "FTS5 и основы Snowball; exact: оставляет точные формы",
              tone: "core",
            },
            {
              name: "Другие условия",
              note: "метаданные, текст вложений и заданные шаблоны текста",
              tone: "core",
            },
          ],
        },
        {
          boxes: [
            {
              name: "Порядок совпадений",
              note: "BM25, точные формы первыми; новые первыми без обязательных слов или с --newest",
              tone: "shared",
            },
          ],
        },
        {
          boxes: [
            {
              name: "--context",
              note: "соседние сообщения в том же аккаунте и чате, по желанию",
              tone: "tool",
            },
          ],
        },
      ],
    },
    es: {
      title: "Búsqueda estricta de mensajes, paso a paso",
      rows: [
        {
          boxes: [
            {
              name: "Consulta y alcance",
              note: "analizar y validar; resolver cuentas, chats, personas y fechas",
              tone: "shared",
            },
          ],
        },
        {
          boxes: [
            {
              name: "Palabras y sus formas",
              note: "FTS5 y raíces Snowball; exact: conserva las formas literales",
              tone: "core",
            },
            {
              name: "Otras condiciones",
              note: "metadatos, texto de adjuntos y patrones de texto solicitados",
              tone: "core",
            },
          ],
        },
        {
          boxes: [
            {
              name: "Ordenar coincidencias",
              note: "BM25, formas exactas primero; más recientes sin palabras obligatorias o con --newest",
              tone: "shared",
            },
          ],
        },
        {
          boxes: [
            {
              name: "--context",
              note: "vecinos opcionales en la misma cuenta y chat",
              tone: "tool",
            },
          ],
        },
      ],
    },
  },
  conversationSearch: {
    en: {
      title: "Conversation search, from build to evidence",
      rows: [
        { boxes: [{ name: "conversations build", note: "per-chat graph: reply → agent answer → rules" }] },
        { boxes: [{ name: "chunks", note: "about 1,200 characters at message boundaries, with a content hash" }] },
        {
          label: "search conversations",
          boxes: [
            { name: "meaning", note: "optional: embed the question and compare prepared chunk vectors" },
            { name: "words", note: "OR word matches → built conversations" },
          ],
        },
        { boxes: [{ name: "rank fusion", note: "each list adds 1 / (60 + rank) to a conversation" }] },
        { boxes: [{ name: "evidence", note: "open the original messages; a candidate is not proof", tone: "tool" }] },
      ],
    },
    ru: {
      title: "Поиск разговоров: от построения до доказательств",
      rows: [
        { boxes: [{ name: "conversations build", note: "граф внутри чата: reply → ответ агента → правила" }] },
        { boxes: [{ name: "chunks", note: "около 1 200 символов по границам сообщений, с хешем текста" }] },
        {
          label: "search conversations",
          boxes: [
            { name: "смысл", note: "по желанию: вектор вопроса сравнивается с готовыми векторами кусков" },
            { name: "слова", note: "совпадения слов через OR → построенные разговоры" },
          ],
        },
        { boxes: [{ name: "слияние рангов", note: "каждый список даёт разговору 1 / (60 + rank)" }] },
        {
          boxes: [
            { name: "доказательства", note: "откройте исходные сообщения; кандидат — не доказательство", tone: "tool" },
          ],
        },
      ],
    },
    es: {
      title: "Búsqueda de conversaciones, de la construcción a las fuentes",
      rows: [
        { boxes: [{ name: "conversations build", note: "grafo por chat: respuesta → agente → reglas" }] },
        {
          boxes: [{ name: "fragmentos", note: "unos 1.200 caracteres en límites de mensaje, con hash del contenido" }],
        },
        {
          label: "search conversations",
          boxes: [
            { name: "significado", note: "opcional: vector de la pregunta frente a vectores preparados" },
            { name: "palabras", note: "palabras con OR → conversaciones construidas" },
          ],
        },
        { boxes: [{ name: "fusión de rangos", note: "cada lista suma 1 / (60 + rango) a una conversación" }] },
        {
          boxes: [
            { name: "fuentes", note: "abre los mensajes originales; un candidato no es una prueba", tone: "tool" },
          ],
        },
      ],
    },
  },
}

/** Plain-text equivalent uses the same localized rows as the rendered diagrams. */
export function architectureDiagramMarkdown(name: string, lang: string = "en"): string {
  const diagram = diagrams[name]?.[lang as Lang] ?? diagrams[name]?.en
  if (!diagram) throw new Error(`Unknown architecture diagram: ${name}`)
  return `**${diagram.title}**\n\n${diagram.rows
    .map(
      (row, index) =>
        `${index + 1}. ${row.label ? `${row.label}: ` : ""}${row.boxes.map((box) => `**${box.name}** — ${box.note}`).join("; ")}`,
    )
    .join("\n")}\n`
}
