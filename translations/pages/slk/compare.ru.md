---
title: "Сравнение с другими инструментами"
---

`slk` работает как командная строка и MCP-сервер для Slack: каналы, личные и групповые сообщения, ветки, люди и файлы. Здесь он
стоит рядом с другими инструментами, через которые ИИ-агент читает Slack, чтобы вы увидели, какой подходит вашей
задаче. Оценки для `slk` взяты из его команд и документации и проверены 24 ноября 2026 года, без живого
пространства. Их проверяют снова к каждому выпуску. Оценки для других инструментов взяты из их собственной
документации и кода, ссылки стоят в таблице, проверены 24 ноября 2026 года. Ни в один инструмент не входили и вживую
его не проверяли, и инструмент может уметь больше, чем написано на его страницах.

Инструменты:

- **slk**: этот инструмент. Читает Slack от вашего имени, собственным поиском Slack и по копии на вашем компьютере, и
  для каждого действия решает, что может агент. Входит с токеном приложения Slack, которое вы создаете в своем
  пространстве.
- **[Slack MCP server](https://docs.slack.dev/ai/slack-mcp-server/)**: официальный MCP-сервер Slack, его запускает
  сам Slack на `mcp.slack.com`. ИИ-приложение подключается к нему через OAuth, а администратор пространства одобряет
  это приложение.
- **[korotovsky/slack-mcp-server](https://github.com/korotovsky/slack-mcp-server)**: MCP-сервер для Slack с открытым
  кодом и больше всего звезд (1 901 звезда, изменен 16 июля 2026 года). Входит с токеном пользователя, токеном бота
  или токеном и cookie, скопированными из браузера, где вы вошли в Slack.
- **[slackdump](https://github.com/rusq/slackdump)**: архиватор, который сохраняет сообщения, файлы и пользователей
  пространства на ваш компьютер (2 875 звезд, изменен 22 ноября 2026 года). Его MCP-сервер читает этот архив и
  никогда не пишет.

Slack дает программе читать сообщения только через приложение, установленное в пространстве, или через токен сеанса
в браузере. С мая 2025 года приложение, которое другая компания публикует вне Slack Marketplace, читает историю канала
[по одному запросу из 15 сообщений в минуту](https://docs.slack.dev/changelog/2025/05/29/rate-limit-changes-for-non-marketplace-apps).
Приложение, которое клиент делает для своего пространства, сохраняет обычные лимиты. Поэтому `slk` просит вас создать
свое приложение. [Старый эталонный MCP-сервер](https://github.com/modelcontextprotocol/servers-archived) для Slack
отправили в архив в мае 2025 года, поэтому его нет в таблице.

✅ да · 🟡 частично · ❌ нет · ➖ нет в его документации · n/a неприменимо

## Возможности

| Задача | slk | [Slack MCP server](https://docs.slack.dev/ai/slack-mcp-server/) | [korotovsky/slack-mcp-server](https://github.com/korotovsky/slack-mcp-server) | [slackdump](https://github.com/rusq/slackdump) |
|---|:-:|:-:|:-:|:-:|
| **Найти и прочитать** | | | | |
| Читать каналы и личные сообщения | ✅ | [✅](https://docs.slack.dev/ai/slack-mcp-server/) | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L34-L40) | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/README.md?plain=1#L3-L4) |
| Прочитать ветку целиком | ✅ | [✅](https://docs.slack.dev/ai/slack-mcp-server/) | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L42-L49) | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/README.md?plain=1#L186-L199) |
| Искать собственным поиском Slack | ✅ | [✅](https://docs.slack.dev/ai/slack-mcp-server/) | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L62-L78) | [🟡](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/cmd/slackdump/internal/archive/assets/search.md?plain=1#L8-L20) |
| Читать и искать без интернета | 🟡 | ❌ | [❌](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L296-L310) | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/cmd/slackdump/internal/mcp/assets/mcp.md?plain=1#L7-L18) |
| Все непрочитанное одним ответом | 🟡 | ➖ | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L189-L199) | ➖ |
| Скачивать файлы | ✅ | [✅](https://docs.slack.dev/ai/slack-mcp-server/) | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L294) | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/README.md?plain=1#L3-L4) |
| **Писать** | | | | |
| Отправить сообщение от вашего имени | ✅ | [✅](https://docs.slack.dev/ai/slack-mcp-server/) | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L51-L54) | [❌](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/cmd/slackdump/internal/mcp/assets/mcp.md?plain=1#L7) |
| Править, удалять и ставить реакции | ✅ | [🟡](https://docs.slack.dev/ai/slack-mcp-server/) | [🟡](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L88-L101) | [❌](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/cmd/slackdump/internal/mcp/assets/mcp.md?plain=1#L7) |
| Каждый метод Slack Web API | ✅ | ➖ | ➖ | n/a |
| **Агенты и безопасность** | | | | |
| Дать агенту только читать | ✅ | ➖ | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L290) | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/cmd/slackdump/internal/mcp/assets/mcp.md?plain=1#L7) |
| Для каждого действия выбрать: разрешить, спросить или запретить | ✅ | ➖ | [🟡](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/docs/03-configuration-and-usage.md?plain=1#L286-L294) | n/a |
| Увидеть, что отправит запись, ничего не отправляя | ✅ | ➖ | ➖ | n/a |
| Токен хранится в связке ключей системы | ✅ | n/a | [❌](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L277-L302) | [❌](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/internal/cache/auth.go#L181-L186) |
| Агент в терминале работает через команды, без MCP | ✅ | n/a | n/a | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/README.md?plain=1#L56-L70) |
| **Настройка** | | | | |
| MCP-сервер | ✅ | [✅](https://docs.slack.dev/ai/slack-mcp-server/) | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L22) | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/cmd/slackdump/internal/mcp/assets/mcp.md?plain=1#L7-L18) |
| Работает из ChatGPT или Claude в браузере | 🟡 | [✅](https://slack.com/help/articles/48855576908307-Guide-to-MCP-in-Slack) | [🟡](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L282-L283) | ➖ |
| Несколько пространств, каждое названо в команде | ✅ | ➖ | ➖ | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/internal/cache/manager.go#L43-L47) |

| | slk | Slack MCP server | korotovsky/slack-mcp-server | slackdump |
|---|---|---|---|---|
| Установка | npm, Node 22.16+ или 24+ | не нужна: его запускает Slack, вы подключаете одобренное ИИ-приложение | npx, Docker или расширение Claude Desktop | Homebrew или готовый файл |
| Вход | User OAuth Token вашего собственного приложения Slack | OAuth, через приложение из Slack Marketplace или созданное внутри пространства | токен пользователя или бота, либо токен и cookie из браузера | вход через браузер или токен |
| Лицензия | Apache-2.0 | закрытый сервис | MIT | AGPL-3.0 |
| Цена | бесплатно | на его странице не указана | бесплатно | бесплатно |

Пояснения к столбцу `slk`:

- **Вход.** User OAuth Token (`xoxp-`) действует с правами человека, который установил приложение, поэтому `slk`
  видит только разговоры, где этот человек участвует. `session start` читает его скрытым вводом или из stdin, никогда
  из аргумента, и проверяет в Slack, прежде чем сохранить. Токен бота не принимается. См. [установку](./installation.md).
- **Без интернета.** `messages sync` сохраняет историю чата в локальном хранилище WireCat вместе с новыми ответами в
  ветках не старше 14 дней, а `search messages --backend archive` читает только эту копию. Там есть только чаты,
  которые вы синхронизировали, поэтому строка частичная.
- **Непрочитанное.** `inbox` охватывает все личные и групповые сообщения, каналы из `inbox_channels` и другие каналы,
  только где вас упомянули или написали @here, @channel или @everyone. Ответы внутри веток не читаются, поэтому
  строка частичная.
- **Группа api.** `slk <profile> api` содержит по команде на каждый метод Slack Web API, у каждой свои флаги и
  справка. `slk api list` называет их все.
- **Разрешить, спросить или запретить.** У каждой команды и каждого метода API есть свой ключ со значением `allow`,
  `ask`, `readonly` или `deny` для профиля в [настройках](./configuration.md#permissions). `SLACK_READ_ONLY=1`
  запрещает любую запись.
- **Через MCP.** Отвечать на `ask` некому, поэтому `ask` пропускает агента. Каждая запись агента сохраняется в
  `runs list`. Чтобы остановить запись, поставьте `permissions.api` в `readonly` или один метод в `deny`.
- **Пробный запуск.** `--dry-run` показывает, что запись отправила бы в Slack, и ничего не отправляет.
- **Несколько пространств.** Каждая команда начинается с профиля, имени, которое вы выбираете для одного
  пространства. Профиль никогда не подставляется сам, даже единственный. См. [как пользоваться](./usage.md).
- **ChatGPT или Claude в браузере.** `mcp serve --http` отдает инструмент через туннель, который вы настраиваете и
  держите запущенным сами, поэтому строка частичная.

Пояснения к другим столбцам:

- **Slack MCP server.** Slack пускает к нему только приложения из своего Marketplace и приложения, созданные внутри
  пространства, и каждое одобряет администратор пространства. На его странице есть инструменты, чтобы отправлять и
  планировать сообщения и ставить реакции, но нет инструментов, чтобы править или удалять.
- **korotovsky/slack-mcp-server.** Отправка, реакции и скачивание файлов выключены, пока вы не включите каждое, для
  всех каналов или для списка. Настройки, которая спрашивает перед записью, нет. Непрочитанное лучше всего работает с
  токеном из браузера.
- **slackdump.** Его команда `search` спрашивает поиск Slack из командной строки, а MCP-сервер читает только
  сохраненный архив. Он сохраняет пространства без приложения и без прав администратора, а его README предупреждает,
  что пространство Enterprise может оповестить своих администраторов.

## Когда лучше подойдет другой инструмент

- **Slack MCP server**: вам нужны ChatGPT или Claude, без всего, что надо запускать на компьютере, и администратор
  одобряет ИИ-приложение, которым вы пользуетесь.
- **korotovsky/slack-mcp-server**: вам нельзя устанавливать приложения в пространстве, и вас устраивает токен сеанса
  в браузере, или вам нужен список непрочитанного по всем каналам.
- **slackdump**: вам нужен полный архив пространства на компьютере, чтобы хранить его или читать без интернета, а
  агент только читает.

Если `slk` подходит, начните с [установки](./installation.md). Как пользоваться им вместе с агентом, описано в разделе
[как пользоваться](./usage.md).
