# Documentation terminology

Use these terms in reader-facing documentation, navigation, screenshots and examples. Give each
concept one name. Use the same concept in every language; preserve commands, settings, IDs and
actual product UI labels exactly. [AUTHORING.md](AUTHORING.md) covers page structure;
[REVIEWING.md](REVIEWING.md) covers PR and release review.

## People, tools and places

| Concept | English | Russian | Spanish | Meaning and usage |
| --- | --- | --- | --- | --- |
| AI doing the reader's task | AI agent; then agent | ИИ-агент; затем агент | agente de IA; después agente | The AI that follows the reader's request, prepares text or uses connected tools. Do not switch to assistant, model, bot or AI app as alternative names for this actor. |
| Messenger service | messenger | мессенджер | servicio de mensajería | Use the generic term for shared behavior. Name a messenger for its commands, supported differences, filters, screenshots or guide links. Do not imply support for a future messenger. |
| App the reader opens | messaging app | приложение мессенджера | aplicación de mensajería | The interface where the reader sees chats, reviews the message box and sends a message. An app is a place to act, not a synonym for an agent. |
| Place the reader talks to an agent | agent chat | чат с агентом | chat con el agente | Use this when the reader reviews text or gives an instruction to their agent. Distinguish it from a chat in the messaging app. |
| Messenger identity | account | аккаунт | cuenta | An account in a messenger. Connecting an account gives the tool access to it; it does not mean every chat has been downloaded. |
| Messenger message container | chat | чат | chat | A direct chat, group or channel. Use chat when referring to the named place containing messages; do not keep changing it to conversation, room or thread. |
| One sent or received item | message | сообщение | mensaje | Text and any attached content in a chat. Use message consistently, rather than switching to post or item. |
| Content attached to a message | attachment | вложение | adjunto | A file or media attached to a message. A link in the message text is distinct; preserve that difference in search examples. |
| A person represented in history | person | человек | persona | Someone observed in chats. A person need not be saved as a contact. |
| Address-book entry | contact | контакт | contacto | A contact saved in a messenger's address book. Do not use contact as a synonym for every person. |
| Separate automated messenger account | bot | бот | bot | A messenger bot and its account/API. Do not call an AI agent a bot merely because it automates a task. |
| Program the agent runs | command-line tool; CLI where already introduced | инструмент командной строки; CLI | herramienta de línea de comandos; CLI | The messenger tool used through commands. Introduce CLI during setup; task guides can assume the reader knows it. Keep actual command names. |
| Instructions for one tool | skill | навык | skill | The `SKILL.md` file that teaches an agent a tool's commands. It holds no login. Keep the file and command names. |
| Place that lists skills from many authors | skill directory | каталог навыков | directorio de skills | ClawHub, skills.sh, a Hermes source or a plugin marketplace. Name the directory; do not call it a store. |
| Reader's instruction | request | запрос | petición | What the reader asks their agent to do. Prompt may remain in API names or technical references; use request in ordinary task instructions. |

## Search, replies and access

| Concept | English | Russian | Spanish | Meaning and usage |
| --- | --- | --- | --- | --- |
| Finding messages | search | поиск | búsqueda | Finds messages matching the chosen conditions. State the scope and available history when it affects the result. |
| Nearby evidence | context; surrounding messages | контекст; соседние сообщения | contexto; mensajes cercanos | The messages around a result that explain what was said. The second form explains the meaning; it does not introduce a separate feature. |
| Messages over a period | chat history | история чата | historial del chat | Messages in a chat over time. Do not imply history is complete unless coverage has been checked. |
| Saved local copy | local archive | локальный архив | archivo local | The chat history stored on the computer. Keep this distinct from the messenger account and from live/server search. |
| Text awaiting a sending decision | draft | черновик | borrador | An unsent reply the reader can review and edit. Say where it is: text returned by an agent or a draft in the messaging app. Do not say the tool saved it in the app unless that capability is verified. |
| Reusable auto-reply text | template | шаблон | plantilla | Text an auto-reply rule fills in. A template is not a saved personal-message draft. |
| Conditions plus action | auto-reply rule; then rule | правило автоответа; затем правило | regla de respuesta automática; después regla | Defines when to answer and which template and limits apply. Do not describe a rule as another agent. |
| Reply sent by a matching rule | auto-reply | автоответ | respuesta automática | Sending is automatic within the rule's audience, permissions and limits; it is not approval of a draft. |
| Who may receive auto-replies | audience | аудитория | audiencia | The rule file's recipient controls. Link the audience setup at the point the reader must choose recipients. Do not assume an explicit allowlist is always required. |
| Allowed actions | permissions | разрешения | permisos | Controls what the tool may do. Keep permissions distinct from an agent's instructions and from permission to send data to an AI provider. |
| Named account and settings | profile | профиль | perfil | A named tool configuration for an account or bot. Do not use profile and account interchangeably. |
| Service processing AI requests | AI provider | провайдер ИИ | proveedor de IA | The configured service that receives data for AI processing. Explain this term when external data sharing matters; a provider is not another name for the agent. |
| Configured text-generation component | model identifier (technical setting) | идентификатор модели (техническая настройка) | identificador del modelo (ajuste técnico) | The name used by an AI provider to select a text-generating component. This is a configuration value, not the agent the reader chats with. Preserve `models.replies.model` and other actual keys. |

## Sources and organization

| Concept | English | Russian | Spanish | Meaning |
| --- | --- | --- | --- | --- |
| Evidence item | source | источник | fuente | An original document, message or other stored item; retain its location. |
| Labeled item | tag | тег | etiqueta | A local label; not an access permission or project. |
| Owner-written context | note | заметка | nota | What the user writes about sources or people. |
| Reusable source-backed conclusion | memory | память; запись памяти, где иначе непонятно | recuerdo | A fact/summary/preference with evidence and a review status; source changes can make it stale. |
| Group of work records | project | проект | proyecto | Existing work record connecting tasks and evidence, distinct from a folder or tag. |
| Action to track | task | задача | tarea | An action with its own state, distinct from a note or tag. |
| Tie between two tasks | task relation; relation | отношение между задачами; отношение | vínculo entre tareas; vínculo | `blocked-by`, `follow-up-of`, `related-to` between tasks. Not a relationship (person and organization) and not a link inside a note. |
| What a task is about | category | категория | categoría | One name from a fixed list in the settings. Distinct from a tag and from a task's type. |
| Who should do a task | assignee | исполнитель | responsable | The person a task waits on. An open task with an assignee other than the owner is what that person owes the owner. A task may have none. |
| Temporary hold on a task | claim | бронь | reserva | Marks who works on a task now; it ends by itself after a set time. |
| Second task for the same thing | duplicate; merge | дубликат; объединить | duplicado; fusionar | A merge moves messages to the kept task and closes the duplicate; it can be undone and deletes nothing. |
| Source collection | folder | папка | carpeta | Explain whether it is a local file folder, Google folder or messenger chat folder. |
| Shared local file of the CLIs | local store | локальное хранилище | almacén local | The one file on the computer (`wirecat.db`) where tg, max and memo keep messages, mail, notes and records. A messenger's own pages may call its chat copy the local archive. |
| The real thing a record is about | entity | сущность | entidad | A person, an event or a document as the owner means it, with no provider id. Used on technical and developer pages; task guides say person, event or document. |
| One source's copy of an entity | source record | запись источника | registro de origen | What one source says about an entity: a Telegram user, a Zoom meeting, a calendar entry, a Drive file. It keeps the provider's id in `external_id`. Not a synonym for source (the evidence item). |
| Pointer to one stored item | reference | ссылка на источник | referencia | The typed identifier a result returns, such as `note:12` or `msg:telegram/1/77/42`. Distinct from a link written inside a note. |
| Link inside a note | link | ссылка | enlace | A note's link to another note, a person or a message. A name in plain text is not a link. |
| Sources behind a record | evidence | доказательство | evidencia | The references that show a memory or fact. |
| Record of what happened | fact | факт | hecho | A statement, question, decision or promise with evidence; proposed until accepted when an agent adds it through MCP. |
| Action an agent suggests | proposed action | предложенное действие | acción propuesta | A reply, invitation or similar an agent suggests in one account. Approving it creates a task; nothing is sent. |
| Scheduled local prompt for a task | reminder | напоминание | recordatorio | Kept on the computer and handed to a program that asks for it; never sent to a messenger or mailbox. |
| Company, team, family or community | organization | организация | organización | The owner's record, not tied to one messenger account. |
| Stated tie between records | relationship | связь | relación | A person belongs to or relates to an organization or project. It never joins two accounts into one person. |
| Version number of a note | revision | ревизия | revisión | Increases with each edit; an edit names the current revision so a newer change is not lost. |

## Diagnostics and the desktop app

| Concept | English | Russian | Spanish | Meaning |
| --- | --- | --- | --- | --- |
| The WireCat app on the computer | WireCat Desktop | WireCat Desktop | WireCat Desktop | The desktop app that installs the tools and shows their settings and logs. The name is not translated; its on-screen labels stay in English. |
| One start of a tool | run | запуск | ejecución | One command of a tool, from start to exit. |
| What a tool kept about a run | run record | запись запуска | registro de ejecución | The run's command line, profile, outcome, timing and codes. Secrets such as tokens are always hidden. A tool on cli-core 0.439.0 or later keeps the words typed on the command line unless `record_input` is off; an earlier one hides every typed value that may be text. |
| One step inside a run | event | событие | evento | A request the tool made to the service, or a notable step, with its time and outcome. |
| Value counts beside the logs | facet | фасет | faceta | A list of one field's values with the number of runs for each; clicking a value filters the list. |

## Technical words and protected text

Use **AI agent** or **agent** for the AI actor in ordinary prose. Do not introduce model as a
synonym. In a technical reference that actually requires a model identifier, explain what the
identifier selects and preserve literal names such as `--model` and `models.replies.model`.
For speech transcription and search by meaning, explain the task before the implementation;
do not rename a speech-recognition or embedding component to agent.

Keep code, configuration keys, API field names, provider IDs, command output, quoted source text
and real product labels intact. An old heading anchor may contain an older term and still needs
to survive for incoming links. Generated command references and upstream API descriptions have
an owning generator or repository; change them there, not by replacing words in sync output.

Use the existing `agent` entry in `lib/doc-terms.ts` for a term hint. Add a new concept to this
list before introducing it in a public guide; add a term hint when it helps the reader. A new word for an
existing concept needs an explicit terminology decision, not a silent editorial variation.

## Assumptions after onboarding

Task guides assume an account and an agent are already connected. Do not begin every page with
“You need a connected account and an agent.” Keep that setup on the overview, installation,
agent-connection, first-task and messenger onboarding pages. Mention it elsewhere only when the
page's task is actually to connect or repair the connection.

A task-specific prerequisite still belongs beside the action that needs it: an administrator
right, a separate permission, a missing part of history, an optional parser or consent to share
data. A fictional playground can explain that no account is needed because that changes how the
reader can try it. Keep getting-started links in their own navigation block instead of repeating
another Start here group in the task navigation.
