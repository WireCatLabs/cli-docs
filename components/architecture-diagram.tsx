type Lang = "en" | "ru" | "es"
type Box = { name: string; note: string; tone?: "tool" | "shared" | "core" | "outside" }
type Row = { boxes: Box[]; label?: string }

const tones = {
  tool: "border-fd-primary/50 bg-fd-primary/10",
  shared: "border-fd-border bg-fd-card",
  core: "border-fd-border bg-fd-secondary",
  outside: "border-dashed border-fd-border bg-transparent",
} as const

const diagrams: Record<string, Record<Lang, { title: string; rows: Row[] }>> = {
  packages: {
    en: {
      title: "Packages and who depends on whom",
      rows: [
        {
          boxes: [
            { name: "@leemour/tg-cli", note: "Telegram adapter, login, setup", tone: "tool" },
            { name: "@leemour/max-cli", note: "MAX protocol, session, max serve, Bot API", tone: "tool" },
          ],
        },
        {
          boxes: [
            {
              name: "@leemour/cli-messaging",
              note: "domain, services, store, send guard, commands, MCP",
              tone: "shared",
            },
          ],
        },
        {
          boxes: [
            {
              name: "@leemour/cli-core",
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
            { name: "@leemour/tg-cli", note: "адаптер Telegram, вход, настройка", tone: "tool" },
            { name: "@leemour/max-cli", note: "протокол MAX, сессия, max serve, Bot API", tone: "tool" },
          ],
        },
        {
          boxes: [
            {
              name: "@leemour/cli-messaging",
              note: "модель, сервисы, хранилище, защита отправки, команды, MCP",
              tone: "shared",
            },
          ],
        },
        {
          boxes: [
            {
              name: "@leemour/cli-core",
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
            { name: "@leemour/tg-cli", note: "adaptador de Telegram, acceso, configuración", tone: "tool" },
            { name: "@leemour/max-cli", note: "protocolo MAX, sesión, max serve, Bot API", tone: "tool" },
          ],
        },
        {
          boxes: [
            {
              name: "@leemour/cli-messaging",
              note: "dominio, servicios, almacén, protección de envíos, comandos, MCP",
              tone: "shared",
            },
          ],
        },
        {
          boxes: [
            {
              name: "@leemour/cli-core",
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
  searchPaths: {
    en: {
      title: "One archive, two separate search paths",
      rows: [
        {
          boxes: [
            {
              name: "local SQLite archive",
              note: "provider / account / chat / message, with coverage; search never fetches missing history",
              tone: "core",
            },
          ],
        },
        {
          label: "two separate paths",
          boxes: [
            { name: "search messages", note: "Lucene query → word index + metadata → matching messages", tone: "tool" },
            {
              name: "search conversations",
              note: "graph build → chunks → embeddings → meaning + words",
              tone: "tool",
            },
          ],
        },
        {
          boxes: [
            {
              name: "original messages",
              note: "locators and context; the agent cites them and says what the archive covers",
            },
          ],
        },
      ],
    },
    ru: {
      title: "Один архив, два отдельных пути поиска",
      rows: [
        {
          boxes: [
            {
              name: "локальный архив SQLite",
              note: "provider / account / chat / message и полнота; поиск не докачивает историю",
              tone: "core",
            },
          ],
        },
        {
          label: "два отдельных пути",
          boxes: [
            {
              name: "search messages",
              note: "запрос Lucene → word index + metadata → совпавшие сообщения",
              tone: "tool",
            },
            {
              name: "search conversations",
              note: "построение графа → chunks → embeddings → смысл + слова",
              tone: "tool",
            },
          ],
        },
        {
          boxes: [
            {
              name: "исходные сообщения",
              note: "locators и контекст; агент ссылается на них и говорит, что покрывает архив",
            },
          ],
        },
      ],
    },
    es: {
      title: "Un archivo, dos vías de búsqueda separadas",
      rows: [
        {
          boxes: [
            {
              name: "archivo SQLite local",
              note: "provider / account / chat / message y completitud; la búsqueda no descarga historial",
              tone: "core",
            },
          ],
        },
        {
          label: "dos vías separadas",
          boxes: [
            {
              name: "search messages",
              note: "consulta Lucene → índice de palabras + metadatos → mensajes coincidentes",
              tone: "tool",
            },
            {
              name: "search conversations",
              note: "grafo → fragmentos → embeddings → significado + palabras",
              tone: "tool",
            },
          ],
        },
        {
          boxes: [
            {
              name: "mensajes originales",
              note: "localizadores y contexto; el agente los cita e indica qué cubre el archivo",
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
        { boxes: [{ name: "parse", note: "Lucene text → Boolean syntax tree, with positions for errors" }] },
        { boxes: [{ name: "validate", note: "fields, values and operators against one registry" }] },
        { boxes: [{ name: "resolve", note: "account scope, stored names, calendar days in the timezone" }] },
        {
          label: "compiled to parameterized SQLite",
          boxes: [
            { name: "FTS5 word index", note: "words and phrases over normalized text", tone: "core" },
            { name: "metadata", note: "from, chat, date, kind, has, topic…", tone: "core" },
          ],
        },
        { boxes: [{ name: "expand", note: "wildcards and regex through the vocabulary, within budgets" }] },
        { boxes: [{ name: "rank or order", note: "only messages that match; never widens the result" }] },
        {
          boxes: [{ name: "--context", note: "optional neighbors in the same account and chat", tone: "tool" }],
        },
      ],
    },
    ru: {
      title: "Строгий поиск сообщений по шагам",
      rows: [
        { boxes: [{ name: "разбор", note: "текст Lucene → Boolean AST с позициями для ошибок" }] },
        { boxes: [{ name: "проверка", note: "поля, значения и операторы по одному registry" }] },
        { boxes: [{ name: "область и даты", note: "scope аккаунтов, сохранённые имена, дни в timezone" }] },
        {
          label: "параметризованный SQLite",
          boxes: [
            { name: "FTS5 word index", note: "слова и фразы по нормализованному тексту", tone: "core" },
            { name: "metadata", note: "from, chat, date, kind, has, topic…", tone: "core" },
          ],
        },
        { boxes: [{ name: "раскрытие", note: "wildcard и regex через словарь индекса, в пределах бюджетов" }] },
        { boxes: [{ name: "порядок", note: "только совпавшие сообщения; выдача не расширяется" }] },
        {
          boxes: [{ name: "--context", note: "соседи в том же аккаунте и чате, по желанию", tone: "tool" }],
        },
      ],
    },
    es: {
      title: "Búsqueda estricta de mensajes, paso a paso",
      rows: [
        { boxes: [{ name: "análisis", note: "texto Lucene → AST booleano con posiciones para errores" }] },
        { boxes: [{ name: "validación", note: "campos, valores y operadores con un registro común" }] },
        { boxes: [{ name: "ámbito y fechas", note: "cuentas, nombres guardados, días en la zona horaria" }] },
        {
          label: "SQLite parametrizado",
          boxes: [
            { name: "índice FTS5", note: "palabras y frases sobre texto normalizado", tone: "core" },
            { name: "metadatos", note: "from, chat, date, kind, has, topic…", tone: "core" },
          ],
        },
        { boxes: [{ name: "expansión", note: "comodines y regex con el vocabulario, dentro de presupuestos" }] },
        { boxes: [{ name: "orden", note: "solo mensajes que cumplen; nunca amplía el resultado" }] },
        {
          boxes: [{ name: "--context", note: "vecinos opcionales en la misma cuenta y chat", tone: "tool" }],
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
          boxes: [{ name: "embeddings", note: "e5-small by default, cached by model and content hash", tone: "core" }],
        },
        {
          label: "search conversations",
          boxes: [
            { name: "meaning", note: "question vector against chunk vectors" },
            { name: "words", note: "question words joined with OR" },
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
          boxes: [{ name: "embeddings", note: "по умолчанию e5-small, кеш по модели и хешу текста", tone: "core" }],
        },
        {
          label: "search conversations",
          boxes: [
            { name: "смысл", note: "вектор вопроса против векторов chunks" },
            { name: "слова", note: "слова вопроса, соединённые через OR" },
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
          boxes: [{ name: "embeddings", note: "e5-small por defecto, en caché por modelo y hash", tone: "core" }],
        },
        {
          label: "search conversations",
          boxes: [
            { name: "significado", note: "vector de la pregunta frente a los de los fragmentos" },
            { name: "palabras", note: "palabras de la pregunta unidas con OR" },
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

const Arrow = () => (
  <svg
    className="mx-auto my-1 block text-fd-muted-foreground"
    width="14"
    height="18"
    viewBox="0 0 14 18"
    aria-hidden="true"
  >
    <path d="M7 0v15M2 10l5 6 5-6" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
)

/** A box diagram drawn from data, so its labels follow the page language and its colours the theme. */
export function ArchitectureDiagram({ name, lang = "en" }: { name: keyof typeof diagrams; lang?: Lang }) {
  const diagram = diagrams[name]?.[lang] ?? diagrams[name]?.en
  if (!diagram) return null
  return (
    <figure
      className="not-prose my-6 rounded-xl border border-fd-border bg-fd-background p-4"
      aria-label={diagram.title}
    >
      <figcaption className="mb-3 text-center text-sm font-semibold text-fd-foreground">{diagram.title}</figcaption>
      {diagram.rows.map((row, index) => (
        <div key={row.boxes.map((box) => box.name).join()}>
          {index > 0 && <Arrow />}
          {row.label && (
            <p className="mb-1 text-center text-xs uppercase tracking-wide text-fd-muted-foreground">{row.label}</p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
            {row.boxes.map((box) => (
              <div
                key={box.name}
                className={`flex-1 rounded-lg border px-3 py-2 text-center ${tones[box.tone ?? "shared"]}`}
              >
                <div className="font-mono text-sm font-semibold text-fd-foreground">{box.name}</div>
                <div className="text-xs text-fd-muted-foreground">{box.note}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </figure>
  )
}
