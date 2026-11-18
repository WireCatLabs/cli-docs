---
title: "Сравнение с другими инструментами"
---

<!-- cspell:words Composio PKCE baryhuang -->

`hubspot` дает доступ к данным продаж аккаунта HubSpot из командной строки и через MCP-сервер: к сделкам, контактам,
компаниям, воронкам, лидам, активностям и ответственным. Здесь он стоит рядом с другими инструментами, через которые
ИИ-агент читает и меняет CRM HubSpot, чтобы вы могли выбрать тот, что подходит для вашей работы. Оценки для `hubspot`
взяты из его текущего выпуска, его команд и исходного кода, проверенных 18 ноября 2026 года, и проверяются заново при
каждом выпуске. Оценки для остальных инструментов взяты из их собственной документации и исходного кода, ссылки на
которые есть в таблице, проверенных 18 ноября 2026 года. Ни в один инструмент не входили и вживую их не проверяли,
так что инструмент может уметь больше, чем говорят его страницы.

Инструменты:

- **hubspot**: этот инструмент. Хранит на вашем компьютере копию ваших сделок с их контактами и компаниями и для
  каждого действия решает, что может агент. Входит с сервисным ключом или токеном старого приватного приложения
  аккаунта.
- **[HubSpot MCP](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server)**:
  собственный облачный MCP-сервер HubSpot, общедоступный с 13 апреля 2026 года, с 36 инструментами для CRM,
  маркетинга и контента.
- **[HubSpot Agent CLI](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide)**:
  собственная командная строка HubSpot для агентов, в бета-версии. Ее команда тоже называется `hubspot`, поэтому под
  одним именем в одном `PATH` эти два инструмента не уживутся.
- **[mcp-hubspot](https://github.com/baryhuang/mcp-hubspot)**: MCP-сервер для HubSpot с открытым кодом и наибольшим
  числом звезд (129 звезд, последнее изменение 11 ноября 2025 года), с 16 инструментами для контактов, компаний,
  тикетов и переписки. Инструментов для сделок и воронок у него нет.
- **[Composio](https://composio.dev/toolkits/hubspot)**: облачный MCP-сервер Composio с 354 инструментами для HubSpot.

Собственный MCP-сервер HubSpot
[читает и пишет](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#supported-data-and-permissions)
контакты, компании, сделки, тикеты, лиды и активности. Он действует от имени пользователя HubSpot, который входит
через OAuth 2.1 и PKCE, через MCP auth app, которое кто-то сначала создает в аккаунте. Ни один из его инструментов не
удаляет запись CRM. Для аккаунта с включенными Sensitive Data текущая страница говорит, что он закрывает данные
переписки, а [объявление](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)
от апреля 2026 года говорило, что он закрывает звонки, письма, встречи, заметки и задачи. Сервисный ключ, с которым
работает `hubspot`, действует за весь аккаунт, а не за одного человека
([HubSpot](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/account-service-keys)).

✅ да · 🟡 частично · ❌ нет · ➖ нет в документации · n/a неприменимо

## Функции

| Задача | hubspot | [HubSpot MCP](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server) | [HubSpot Agent CLI](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide) | [mcp-hubspot](https://github.com/baryhuang/mcp-hubspot) | [Composio](https://composio.dev/toolkits/hubspot) |
|---|:-:|:-:|:-:|:-:|:-:|
| **Найти и прочитать** | | | | | |
| Список открытых сделок стадии или воронки | ✅ | [✅](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#available-tools) | [✅](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#filter-and-search) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | [🟡](https://composio.dev/toolkits/hubspot) |
| Найти контакт по имени, телефону или почте | ✅ | [✅](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#available-tools) | [✅](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#filter-and-search) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L218-L238) | [🟡](https://composio.dev/toolkits/hubspot) |
| Список открытых и просроченных задач | ✅ | [🟡](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#read-access) | [🟡](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#core-commands) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | [🟡](https://composio.dev/toolkits/hubspot) |
| Читать сделки без интернета | ✅ | [❌](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#implementation-overview) | ➖ | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | [❌](https://composio.dev/toolkits/hubspot) |
| Один поиск по сделкам и сообщениям и заметкам других ваших инструментов | ✅ | ➖ | ➖ | ➖ | ➖ |
| Читать и менять тикеты | 🟡 | [✅](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#write-access) | [✅](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#core-commands) | [🟡](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L247-L258) | [✅](https://composio.dev/toolkits/hubspot) |
| **Менять CRM** | | | | | |
| Создавать и менять контакты и компании | ✅ | [✅](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#write-access) | [✅](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#core-commands) | [✅](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L191-L238) | [✅](https://composio.dev/toolkits/hubspot) |
| Перенести сделку на стадию по названию стадии | ✅ | [🟡](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#write-access) | [🟡](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#properties) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | [🟡](https://composio.dev/toolkits/hubspot) |
| Закрыть сделку проигранной с причиной за один шаг | ✅ | [🟡](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#write-access) | [🟡](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#properties) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | [🟡](https://composio.dev/toolkits/hubspot) |
| Поставить задачу или добавить заметку к сделке | 🟡 | [✅](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#write-access) | [✅](https://developers.hubspot.com/docs/build-with-ai/agent-cli#when-to-use-the-agent-cli) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | [✅](https://composio.dev/toolkits/hubspot) |
| Вызвать любую другую операцию CRM API HubSpot | ✅ | [🟡](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#available-tools) | [🟡](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#core-commands) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | [🟡](https://composio.dev/toolkits/hubspot) |
| **Сводки и изменения** | | | | | |
| Воронка: сколько сделок дошло до каждой стадии | ✅ | ➖ | ➖ | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | ➖ |
| Доля выигранных сделок за период | ✅ | [🟡](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#available-tools) | [🟡](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#core-commands) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | ➖ |
| Открытые сделки без изменений дольше N дней | ✅ | [🟡](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#available-tools) | [🟡](https://developers.hubspot.com/docs/build-with-ai/agent-cli#when-to-use-the-agent-cli) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | ➖ |
| Что изменилось за день: новые сделки, переходы между стадиями, выигрыши и проигрыши | ✅ | ➖ | ➖ | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | [🟡](https://composio.dev/toolkits/hubspot) |
| Утренняя сводка по CRM по расписанию в Telegram или на почту | ✅ | ➖ | ➖ | ➖ | ➖ |
| **Агенты и безопасность** | | | | | |
| Разрешить агенту только чтение | ✅ | ➖ | ➖ | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | ➖ |
| Выбрать для каждого действия: разрешить, спросить или запретить | ✅ | ➖ | ➖ | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | ➖ |
| Запись ждет вашего подтверждения | 🟡 | [✅](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#available-tools) | [🟡](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#auth-sensitive-commands) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | ➖ |
| Передача записи другому ответственному запрещена, пока вы ее не разрешите | ✅ | ➖ | ➖ | ➖ | ➖ |
| Посмотреть, что сделает запись, не выполняя ее | 🟡 | ➖ | [✅](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#using-the-dry-run-flag) | ➖ | ➖ |
| Запись не отправляется дважды, если ее ответ потерялся | ✅ | ➖ | ➖ | [🟡](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/handlers/contact_handler.py#L110-L146) | ➖ |
| Ключ хранится в связке ключей системы | ✅ | n/a | ➖ | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/hubspot_client.py#L62-L65) | n/a |
| Агент в терминале работает через команды, без MCP | ✅ | n/a | [✅](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#run-commands) | n/a | n/a |
| **Настройка** | | | | | |
| Вход под своим именем, с правами вашего пользователя HubSpot | ❌ | [✅](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#supported-data-and-permissions) | [✅](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#standard-mode-via-oauth-login) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/hubspot_client.py#L62-L65) | [✅](https://composio.dev/toolkits/hubspot) |
| Несколько аккаунтов, каждый назван в команде | ✅ | ➖ | ➖ | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/hubspot_client.py#L62-L65) | [✅](https://composio.dev/toolkits/hubspot) |
| Работает из ChatGPT или Claude в браузере | 🟡 | [✅](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#available-tools) | ➖ | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L62-L63) | [✅](https://composio.dev/toolkits/hubspot) |

| | hubspot | HubSpot MCP | HubSpot Agent CLI | mcp-hubspot | Composio |
|---|---|---|---|---|---|
| Установка | npm, Node 22.16+ или 24+ | не нужна: работает в облаке, после того как в аккаунте создано MCP auth app | скрипт установки HubSpot, который обновляет сам себя | Docker или Smithery | не нужна: работает в облаке |
| Лицензия | Apache-2.0 | закрытый сервис | [условия Developer Beta HubSpot](https://legal.hubspot.com/developerbetaterms) | MIT | закрытый сервис |
| Цена | бесплатно | ➖, доступен любому аккаунту HubSpot | ➖ | бесплатно | 100 000 вызовов в месяц бесплатно, из них 20 000 через приложения вроде HubSpot, сверх этого платно |

Заметки к столбцу `hubspot`:

- **Вход.** Сервисный ключ или токен старого приватного приложения принадлежит аккаунту, а не человеку, и читает и
  меняет то, что разрешают его scope. `hubspot` проверяет, какому аккаунту принадлежит ключ, и хранит его в связке
  ключей системы, а на компьютере без нее в закрытом файле. Входа через браузер у него пока нет, поэтому в этой строке
  нет. См. [вход](./installation.md#sign-in).
- **Только чтение.** `WCHUBSPOT_READ_ONLY=1` отклоняет каждую запись, что бы ни говорили настройки. Уровень `readonly`
  делает то же для одного ключа. Без них новый профиль разрешает агенту создавать, менять, переносить и закрывать
  сделки и создавать и менять контакты и компании, насколько позволяют scope ключа.
- **Разрешить, спросить или запретить.** У каждой команды и каждой операции API свой ключ, например `deals.update`
  или `api.deals-search`, и в [настройках](./permissions.md) ему ставится `allow`, `ask`, `readonly` или `deny`.
  `mcp serve --permission` делает ключ строже только для одного сервера. Агент через MCP может сделать их строже, но не мягче.
- **Подтверждение.** `ask` спрашивает в терминале. Через MCP отвечать некому, поэтому `ask` пропускает агента, и в
  этой строке частично. Чтобы агент не писал, поставьте ключ на `deny` или `readonly`.
- **Другой ответственный.** Ключ не называет человека, поэтому `hubspot` не может отличить ваши записи от записей
  коллеги. Назначение ответственного у любой записи, командой или через `api`, запрещено, пока вы не поставите
  `crm.assign-others` на `allow`.
- **Задачи, заметки и тикеты.** Своей команды для них нет. Они записываются через `api`, например
  `api notes-create` или `api tasks-create`, с телом в JSON, поэтому в этих строках частично. Запись через API в
  терминале сначала спрашивает, а через MCP `ask` ее пропускает. Заметки, звонки, письма, встречи и задачи по вашим
  сделкам читаются через `activities list`, когда вы включите настройку активностей.
- **Весь API.** `api list` показывает все операции CRM API HubSpot, всего 157, каждая это
  команда со своим ключом разрешения. Агенту через MCP они тоже доступны.
- **Без интернета.** `sync` копирует воронки, сделки с их контактами и компаниями и лиды, а потом спрашивает только
  изменения. `deals`, `pipelines`, `stages`, `activities` и `changes` читают эту копию,
  в том числе с `--offline`. `people`, `organizations` и `users` всегда спрашивают HubSpot.
- **Один поиск.** `search all` находит сделки рядом с сообщениями, заметками и встречами, которые сохранили другие
  инструменты WireCat на том же компьютере, без интернета.
- **Воронка.** `pipelines show` показывает одну воронку как доску и как воронку: сколько сделок стоит на каждой
  стадии, сколько до нее дошло и пошло дальше, и долю выигранных за период.
- **Что изменилось и сводка.** `changes list` показывает новые сделки, переходы между стадиями, выигрыши, проигрыши,
  новых ответственных, добавленные и выполненные активности и новые контакты.
  `schedule command … changes list --format report --deliver-to` отправляет утреннюю
  сводку в Telegram или на почту через инструменты WireCat `tg` или `mail`.
- **Предпросмотр.** `--dry-run` показывает, как команда поняла ваши слова и какие ключи разрешений проверяет, и
  ничего не отправляет. Значений, которые изменит запись, он не показывает, поэтому в этой строке частично.
- **Запись отправляется один раз.** Запись, которая не получила ответа, снова не отправляется. Она заканчивается
  `outcome_unknown` со своим `operation_id`. Проверьте HubSpot, прежде чем записывать снова, потому что у HubSpot нет
  ключа, который отбросил бы повтор.
- **Темп.** `hubspot` отправляет не больше 4 запросов в секунду на аккаунт, в пределах собственных лимитов HubSpot.
- **ChatGPT или Claude в браузере.** `mcp serve --http` отдает инструмент через туннель, который вы сами настраиваете
  и держите запущенным, поэтому в этой строке частично. См. [MCP](./mcp.md).
- **Скорость и стоимость по сравнению с браузерным агентом.** `hubspot` вызывает API HubSpot, читает свою копию и не
  открывает браузер. Замеров против браузерного агента не опубликовано, поэтому эта страница ничего не утверждает.

## Когда лучше подойдет другой инструмент

- **HubSpot MCP**: вам нужен HubSpot в ChatGPT или Claude в браузере, со входом под своим именем и своими правами, и
  чтобы каждую запись вам показывали на подтверждение. Он также работает с маркетингом, контентом и постами в соцсетях.
- **HubSpot Agent CLI**: агент в терминале должен работать от вашего имени, с предпросмотром записей и значений,
  которые затронет массовое изменение, или с объектами за пределами CRM, например рабочими процессами, отчетами и
  сохраненными видами.
- **Composio**: вы уже пользуетесь Composio для других приложений и хотите HubSpot рядом с ними, ничего не запуская
  на своем компьютере.

Если `hubspot` подходит, начните с [установки](./installation.md). Как работать с ним через агента, показывает
[страница использования](./usage.md).
