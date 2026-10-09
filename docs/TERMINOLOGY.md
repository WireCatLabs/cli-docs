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
