---
title: "Сравнение с другими инструментами"
---

<a id="features" />
<a id="when-another-tool-fits-better" />

`amo` дает доступ к данным продаж аккаунта amoCRM или Kommo из командной строки и через MCP-сервер: к сделкам,
контактам, компаниям, воронкам, задачам и сотрудникам. Здесь он стоит рядом с другими инструментами, через которые
ИИ-агент читает и меняет amoCRM, чтобы вы могли выбрать тот, что подходит для вашей работы.
Оценки для `amo` взяты из его первого выпуска, его команд и исходного кода и проверены 16 ноября 2026 года на
тестовом аккаунте, который собран по справочнику Kommo OpenAPI, а не на живом аккаунте. Их проверяют заново при
каждом выпуске. Оценки для остальных инструментов взяты из их собственной документации и исходного кода по ссылкам в
таблице и проверены 16 ноября 2026 года. Ни в один инструмент не входили и вживую их не проверяли, так что
инструмент может уметь больше, чем говорят его страницы.

Инструменты:

- **amo**, этот инструмент. Хранит на вашем компьютере копию ваших сделок и их клиентов и для каждого действия
  решает, что может агент. Входит с долгосрочным токеном приватной интеграции или через вашу интеграцию в браузере.
- **[Kommo-MCP](https://github.com/Miguelgbastos/Kommo-MCP)**, MCP-сервер с открытым кодом для Kommo с наибольшим
  числом звезд (16 звезд, изменения 16 ноября 2026 года), 23 инструмента.
- **[amocrm-kommo-mcp](https://github.com/penmadebykisss/amocrm-kommo-mcp)**, MCP-сервер для amoCRM и Kommo с отчетами
  для руководителя: воронка, зависшие сделки, рейтинг менеджеров. Есть платная облачная версия.
- **[amocrm-mcp](https://github.com/theYahia/WWmcp/tree/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm)**,
  MCP-сервер из npm (`@theyahia/amocrm-mcp` 2.0.2), 19 инструментов. Его называет обзор MCP-серверов для российских
  сервисов на [sostav.ru](https://www.sostav.ru/blogs/289407/104725).
- **[Composio](https://composio.dev/toolkits/kommo)**, MCP-сервер Composio в облаке, 53 инструмента для Kommo.
- **[amocrm-cli](https://github.com/polza-ai/amocrm-cli)**, другая командная строка для amoCRM и Kommo, для людей и
  агентов (npm `@polza-ai/amocrm-cli` 0.1.0 от 27 июня 2026 года).

Своего MCP-сервера для данных CRM у amoCRM и Kommo нет. Их
[AI API](https://developers.kommo.com/reference/ai-api-methods) наполняет их собственного ИИ-помощника, а сделки
агенту не отдает. Долгосрочный токен создает администратор аккаунта в приватной интеграции, и токен действует с его
правами ([Kommo](https://developers.kommo.com/docs/long-lived-token)). Все инструменты на этой странице, кроме Composio, входят
так же или через OAuth.

✅ да · 🟡 частично · ❌ нет · ➖ нет в документации · n/a неприменимо

## Функции

| Задача | amo | [Kommo-MCP](https://github.com/Miguelgbastos/Kommo-MCP) | [amocrm-kommo-mcp](https://github.com/penmadebykisss/amocrm-kommo-mcp) | [amocrm-mcp](https://github.com/theYahia/WWmcp/tree/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm) | [Composio](https://composio.dev/toolkits/kommo) | [amocrm-cli](https://github.com/polza-ai/amocrm-cli) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Найти и прочитать** | | | | | | |
| Открытые сделки одного этапа или воронки | ✅ | [✅](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L22-L50) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L79-L106) | [✅](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/tools/leads.ts#L9-L13) | [🟡](https://composio.dev/toolkits/kommo) | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/leads.ts#L46-L62) |
| Найти контакт по имени, телефону или e-mail | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L154-L162) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L195-L200) | [✅](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/tools/contacts.ts#L6) | ➖ | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/contacts.ts#L39) |
| Открытые и просроченные задачи | ✅ | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L174-L182) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L224-L228) | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/tools/tasks.ts#L13) | [🟡](https://composio.dev/toolkits/kommo) | [🟡](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/tasks.ts#L27-L28) |
| Читать сделки без интернета | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/kommo-api.ts) | [❌](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/api.js#L59-L67) | [❌](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/client.ts#L155) | ➖ | [❌](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/client/http.ts#L11) |
| Один поиск по сделкам и по сообщениям и заметкам из других ваших инструментов | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Изменить CRM** | | | | | | |
| Создать и изменить контакты и компании | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L154-L173) | [🟡](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L135-L160) | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/index.ts#L93-L122) | [✅](https://composio.dev/toolkits/kommo) | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/contacts.ts#L95-L131) |
| Перевести сделку на этап по его названию | ✅ | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L105-L117) | [🟡](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L169-L178) | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/index.ts#L64-L73) | ➖ | [🟡](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/leads.ts#L162) |
| Закрыть сделку как проигранную с причиной отказа одним шагом | ✅ | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L87-L117) | [🟡](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L169-L178) | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/index.ts#L64-L73) | ➖ | [🟡](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/leads.ts#L162) |
| Поставить задачу или добавить примечание к сделке | 🟡 | [✅](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L184-L257) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L209-L290) | [✅](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/index.ts#L144-L194) | [🟡](https://composio.dev/toolkits/kommo) | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/tasks.ts#L80-L120) |
| **Сводки и изменения** | | | | | | |
| Воронка: сколько сделок дошло до каждого этапа | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/kommo-api.ts#L687-L800) | [🟡](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L310-L318) | ➖ | ➖ | ➖ |
| Доля выигранных сделок за период | ✅ | [✅](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/kommo-api.ts#L687-L760) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L332) | ➖ | ➖ | ➖ |
| Открытые сделки без изменений больше N дней | ✅ | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L22-L50) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L341) | ➖ | ➖ | ➖ |
| Что изменилось за день: новые сделки, переходы по этапам, выигрыши и проигрыши | ✅ | ➖ | ➖ | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/index.ts#L206) | [🟡](https://composio.dev/toolkits/kommo) | [🟡](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/README.md) |
| Утренняя сводка по CRM в Telegram или на почту по расписанию | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Агенты и безопасность** | | | | | | |
| Оставить агенту только чтение | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/server.ts#L22-L23) | [❌](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L26-L27) | ➖ | ➖ | ➖ |
| Для каждого действия выбрать: разрешить, спросить или запретить | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/server.ts#L22-L23) | [❌](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L26-L27) | ➖ | ➖ | ➖ |
| Запись ждет подтверждения | 🟡 | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/server.ts#L84-L95) | [❌](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L17-L27) | ➖ | ➖ | ➖ |
| Действия, которые пишут клиентам или запускают Salesbot, запрещены, пока вы их не разрешите | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L286-L315) | n/a | n/a | n/a | n/a |
| Увидеть, что сделает запись, не выполняя ее | ✅ | ➖ | ➖ | ➖ | ➖ | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/leads.ts#L120-L140) |
| Запись не отправляется дважды, если ответ потерялся | ✅ | [✅](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/kommo-api.ts#L397-L411) | [❌](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/api.js#L79-L82) | ➖ | ➖ | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/client/http.ts#L20-L22) |
| Токен хранится в системном хранилище ключей | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/stdio.ts#L10-L23) | [❌](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/api.js#L22) | [❌](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/client.ts#L12-L18) | n/a | [❌](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/config/config.ts#L76) |
| Агент в терминале работает командами, без MCP | ✅ | n/a | n/a | n/a | n/a | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/README.md) |
| **Подготовка** | | | | | | |
| Несколько аккаунтов, каждый назван в команде | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/stdio.ts#L10-L23) | [🟡](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/http.js#L5-L18) | [❌](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/client.ts#L12-L18) | [✅](https://composio.dev/toolkits/kommo) | [🟡](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/config/config.ts#L76-L79) |
| Работает из ChatGPT или Claude в браузере | 🟡 | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/http-streamable.ts#L111-L113) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/README.md) | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/index.ts#L10) | [✅](https://composio.dev/toolkits/kommo) | ➖ |
| Работает и с amoCRM.ru, и с Kommo | ✅ | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/README.md) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/api.js#L22-L30) | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/client.ts#L155) | [🟡](https://composio.dev/toolkits/kommo) | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/config/config.ts#L77) |

| | amo | Kommo-MCP | amocrm-kommo-mcp | amocrm-mcp | Composio | amocrm-cli |
|---|---|---|---|---|---|---|
| Установить | npm, Node 22.16+ или 24+ | из исходного кода, Node 22.13+ | `npx` из GitHub, Node 18+ | npm | не нужно: в облаке | npm |
| Лицензия | Apache-2.0 | MIT | MIT | MIT | закрытый сервис | MIT |
| Цена | бесплатно | бесплатно | бесплатно, облако по подписке | бесплатно | 100 000 вызовов в месяц бесплатно, дальше платно | бесплатно |

Пояснения к столбцу `amo`:

- **Вход.** Долгосрочный токен приватной интеграции действует с правами администратора, который его создал. Вход
  через вашу интеграцию в браузере действует от имени сотрудника, который входит, и `amo` сам обновляет его токены.
  И то и другое хранится в связке ключей системы, а на компьютере без нее в закрытом файле. См.
  [использование](./usage.md#sign-in).
- **Только чтение.** `AMO_READ_ONLY=1` запрещает любую запись, что бы ни говорили настройки. Уровень `readonly` делает
  то же для одного ключа. Без них новый профиль дает агенту создавать, менять, переводить по этапам и закрывать
  сделки, а еще создавать и менять контакты и компании.
- **Разрешить, спросить или запретить.** У каждой команды и каждой операции API свой ключ, например `deals.update`
  или `api.leads.patch`, со значением `allow`, `ask`, `readonly` или `deny` в [настройках](./permissions.md).
  `mcp serve --permission` делает ключ строже только для одного сервера. Агент через MCP не может менять эти
  настройки.
- **Подтверждение.** `ask` спрашивает в терминале. Через MCP отвечать некому, поэтому `ask` пропускает агента, и эта
  строка отмечена как частично. Чтобы агент не мог писать, поставьте нужный ключ в `deny` или `readonly`.
- **Сообщения и Salesbot.** Беседы, чаты, Salesbot, вебхуки, виджеты и включение пользователей запрещены, даже на
  чтение, пока вы их не разрешите. Запись задач, ролей и источников тоже. Передать сделку, задачу или контакт другому
  сотруднику нельзя, пока вы не поставите `crm.assign-others` в `allow`.
- **Задачи и примечания.** Своей команды для них нет. Задачу или примечание можно записать только через
  `api call` в терминале, после того как вы разрешите этот ключ, поэтому строка отмечена как частично. Ни один
  инструмент MCP `api call` не предлагает. Читать задачи, комментарии и звонки по вашим сделкам за последние 90 дней
  можно через `activities list`, когда вы включите это настройкой `activities`.
- **Без интернета.** `sync` копирует воронки и сделки, назначенные на вас и на выбранных вами коллег, вместе с их
  контактами и компаниями. `deals`, `pipelines`, `stages`, `activities` и `changes` читают эту копию, в том числе с
  `--offline`. `people`, `organizations` и `users` всегда обращаются к amoCRM. Всю CRM синхронизация не копирует
  никогда.
- **Один поиск.** `search all` находит сделки рядом с сообщениями, заметками и встречами, которые сохранили другие
  инструменты WireCat на том же компьютере, без интернета.
- **Контакт по телефону или e-mail.** `people list` передает ваши слова в поиск самой amoCRM. Сотрудник, который не
  администратор и вошел через свою интеграцию, видит телефоны и e-mail только своих клиентов и не больше 100 чужих
  карточек в день.
- **Воронка.** `pipelines show` считает, сколько сделок дошло до каждого этапа и пошло дальше, по истории переходов,
  которую `sync` берет из событий amoCRM, и долю выигранных за период. Разбивки по менеджерам нет.
- **Что изменилось и сводка.** `changes list` показывает новые сделки, переходы, выигрыши, проигрыши, смену
  ответственного, новые и закрытые задачи. `schedule command … changes list --format report --deliver-to` отправляет
  утреннюю сводку в Telegram или на почту через инструменты WireCat `tg` или `mail`. Телефоны и e-mail в ней скрыты,
  текст примечаний не попадает.
- **Запись отправляется один раз.** Запись, на которую не пришел ответ, не отправляется снова. Она заканчивается
  `outcome_unknown` со своим `operation_id`. Проверьте amoCRM, прежде чем повторять, потому что у amoCRM нет ключа,
  который отсеял бы повтор.
- **ChatGPT или Claude в браузере.** `mcp serve --http` отдает инструмент через туннель, который вы настраиваете и
  держите сами, поэтому эта строка отмечена как частично.
- **Скорость и стоимость по сравнению с браузерным агентом.** `amo` обращается к API amoCRM, читает свою копию и
  браузер не открывает. Измерений по сравнению с браузерным агентом не опубликовано, поэтому эта страница ничего
  не утверждает.

## Когда другой инструмент подходит лучше

- **Composio**, если вам нужен Kommo в ChatGPT или Claude в браузере и ничего не нужно запускать на своем
  компьютере.
- **amocrm-kommo-mcp**, если руководителю нужен один отчет с рейтингом менеджеров, средним чеком и длиной цикла
  сделки или готовое облако без установки.
- **amocrm-mcp** или **amocrm-cli**, если агент должен сам ставить задачи и писать примечания без отдельных
  разрешений.

Если `amo` подходит, начните с [установки](./installation.md). Чтобы работать с ним через агента, см.
[использование](./usage.md).
