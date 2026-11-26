---
title: "Сравнение с другими инструментами"
---

Держите страницы Notion на своем компьютере, и ваш ИИ-агент найдет их по смыслу без интернета, рядом с вашими
чатами и почтой. Собственные инструменты Notion для агентов работают онлайн, внутри Notion, и не хранят копию на вашем
компьютере. `notion` хранит такую копию, а агент еще и оставит комментарий на странице или добавит к ней файл.
Каждое из этих действий можно запретить.

Агент скажет, кто написал страницу, и покажет рядом сообщения и письма этого человека. Он найдет страницу, даже если в
ней нет ваших слов. Вы увидите рядом, что дают `notion` и еще четыре инструмента, и выберете тот, что подходит для
вашей задачи.

`notion` копирует выбранные страницы в локальное хранилище, общее для всех инструментов WireCat, а `memo` ищет по этому
хранилищу и показывает все, что у вас есть о человеке. Понадобится одно: токен Notion, личный токен доступа или токен
подключения. Инструменты в сравнении:

- **notion**: этот инструмент. Копирует ваши страницы и базы данных на компьютер, ищет по ним без интернета и отдает
  их агенту в терминале или через MCP. Что будет дальше, сказано в его [планах](./roadmap.md).
- **[Notion MCP](https://developers.notion.com/guides/mcp/get-started-with-mcp)**: собственный MCP-сервер Notion,
  который работает у Notion. В него входит ваше ИИ-приложение.
- **[ntn](https://developers.notion.com/cli/get-started/overview)**: собственная командная строка Notion для страниц
  в Markdown и для Notion Workers.
- **[notion-mcp-server](https://github.com/makenotion/notion-mcp-server)**: MCP-сервер Notion с открытым кодом,
  который вы запускаете сами с токеном. В его README сказано, что он
  [больше не поддерживается](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L6-L7).
- **[notion-exporter](https://github.com/yannbolliger/notion-exporter)**: командная строка, которая скачивает страницу
  или базу данных как файлы Markdown или CSV через экспорт веб-приложения Notion (193 звезды, обновлялся 23 октября
  2026 года).

Оценки для `notion` взяты из его кода и проверены 17 ноября 2026 года. Оценки для остальных инструментов взяты из их
собственной документации и исходного кода и проверены 16 ноября 2026 года, а для комментариев, файлов и людей
17 ноября 2026 года. Инструмент может делать больше, чем сказано на его страницах.

**На этой странице:**

1. [Функции](#features)
2. [Пояснения к оценкам](#notes-on-the-marks)
3. [Когда другой инструмент подходит лучше](#when-another-tool-fits-better)

✅ да · 🟡 частично · ❌ нет · ➖ нет в документации · n/a неприменимо

<a id="features" />

## Функции

| Задача | notion | [Notion MCP](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [ntn](https://developers.notion.com/cli/reference/commands) | [notion-mcp-server](https://github.com/makenotion/notion-mcp-server) | [notion-exporter](https://github.com/yannbolliger/notion-exporter) |
|---|:-:|:-:|:-:|:-:|:-:|
| **Найти страницу** | | | | | |
| Найти страницу по словам внутри нее | ✅ | [✅](https://developers.notion.com/guides/mcp/tools-search-reference) | [❌](https://developers.notion.com/reference/post-search) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L22) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Найти страницу по смыслу, а не только по точным словам | ✅ | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L11) | [❌](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L22) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Искать по страницам без интернета | ✅ | [❌](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [❌](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L39) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Найти страницу вместе с вашими чатами, почтой и файлами из других сервисов | ✅ | [🟡](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [❌](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L23) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Увидеть страницы, которые человек написал или изменил последним, рядом с его чатами и почтой | ✅ | [🟡](https://developers.notion.com/guides/mcp/tools-search-reference) | [❌](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L23) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Найти строки базы данных по значению свойства, например Status равен Done | 🟡 | [✅](https://developers.notion.com/guides/mcp/tools-databases-reference) | [✅](https://developers.notion.com/cli/reference/commands) | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L59) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| **Копия и экспорт** | | | | | |
| Держать на компьютере копию выбранных страниц и баз данных, которую обновляет каждая синхронизация | ✅ | ➖ | [❌](https://developers.notion.com/cli/reference/commands) | ➖ | [🟡](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L76) |
| Выгрузить страницу и вложенные в нее страницы в файлы Markdown | ✅ | ➖ | [🟡](https://developers.notion.com/cli/reference/commands) | ➖ | [✅](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L76) |
| **Запись** | | | | | |
| Создать страницу или изменить ее текст из Markdown | ✅ | [✅](https://developers.notion.com/guides/mcp/tools-pages-reference) | [✅](https://developers.notion.com/cli/reference/commands) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L24) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Читать комментарии к странице и отвечать на них | ✅ | [✅](https://developers.notion.com/guides/mcp/tools-comments-reference) | [🟡](https://developers.notion.com/cli/reference/commands) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/scripts/notion-openapi.json?plain=1#L1512-L1565) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Добавить на страницу файл с вашего компьютера | ✅ | [🟡](https://developers.notion.com/guides/mcp/tools-files-reference) | [🟡](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/scripts/notion-openapi.json) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| **Агенты и безопасность** | | | | | |
| ИИ-приложение работает с вашими страницами через MCP | ✅ | [✅](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [❌](https://developers.notion.com/cli/reference/commands) | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L333) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Работать из Claude или ChatGPT в браузере | ✅ | [✅](https://www.notion.com/help/notion-mcp) | [❌](https://developers.notion.com/cli/reference/commands) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L345) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Агент с терминалом запускает его, с выводом в JSON и навыком | ✅ | n/a | [🟡](https://developers.notion.com/cli/reference/commands) | n/a | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Агенту можно оставить только чтение | ✅ | [🟡](https://www.notion.com/help/notion-mcp) | ➖ | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L112) | [✅](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/README.md?plain=1#L3-L6) |
| Разрешить или запретить агенту отдельные команды | ✅ | ➖ | ➖ | ➖ | n/a |
| Посмотреть изменение до того, как оно сделано | ✅ | [🟡](https://developers.notion.com/guides/mcp/tools-faqs) | ➖ | ➖ | n/a |
| Текст страницы доходит до агента как данные, а не как инструкции | 🟡 | ➖ | ➖ | ➖ | ➖ |
| **Установка** | | | | | |
| Работает с агентом без браузера | ✅ | [🟡](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [✅](https://developers.notion.com/cli/get-started/authentication) | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L138) | [🟡](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/README.md?plain=1#L78-L92) |
| Опирается только на то, что Notion описывает и поддерживает | ✅ | [✅](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [✅](https://developers.notion.com/cli/get-started/overview) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L6-L7) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/README.md?plain=1#L119-L125) |

| | notion | Notion MCP | ntn | notion-mcp-server | notion-exporter |
|---|---|---|---|---|---|
| Установка | npm, Node 22.16 или новее 22.x, или Node 24 и новее | ничего: ваше ИИ-приложение подключается к серверу Notion | скрипт установки, WinGet или npm | npx или Docker | npm |
| Лицензия | Apache-2.0 | сервис Notion, на любом тарифе | [MIT](https://www.npmjs.com/package/ntn) | MIT | MIT |
| Вход | личный токен доступа или токен подключения, хранится в связке ключей системы | OAuth в браузере или MCP-токен на тарифах Business и Enterprise | в браузере или личный токен доступа | токен подключения | cookie `token_v2` и `file_token` из вашего браузера |

<a id="notes-on-the-marks" />

## Пояснения к оценкам

- **Найти страницу по словам.** `notion search` ищет по копии на вашем компьютере, в тексте каждой страницы и
  строки. Поиск API Notion, который вызывают `ntn api v1/search` и notion-mcp-server, находит страницы по
  заголовку.
  Notion MCP запускает собственный поиск Notion по рабочему пространству. Базы данных и само рабочее пространство в
  результатах поиска `notion` не появляются, только страницы и строки.
- **По смыслу.** `notion sync --embed` индексирует текст моделью, уже скачанной на ваш компьютер, и после этого
  `notion search` находит страницу и по смыслу. Notion MCP ищет по смыслу на стороне Notion.
- **Вместе с чатами и почтой.** Копия лежит в локальном хранилище, общем для инструментов WireCat, поэтому
  `memo search` и `memo search all` находят страницу рядом с вашими сообщениями, почтой и файлами из других
  инструментов WireCat. Каждый результат называет `notion` и профиль, из которого он пришел. Notion MCP ищет в
  подключенных сервисах, таких как Slack и Google Drive, на тарифах Business и Enterprise с Notion AI.
- **Страницы человека.** Каждая синхронизация сохраняет автора страницы и того, кто менял ее последним, как людей в
  локальном хранилище, с именами и адресами почты из Notion. По адресу почты они объединяются с тем же человеком из
  вашей почты, чатов или других инструментов, поэтому `memo context` показывает страницы Notion среди файлов этого
  человека. Адреса почты Notion отдает, только если подключению разрешено читать сведения о пользователях вместе с
  адресами почты. Без адресов авторы ни с кем не объединяются, и `notion sync` и `notion doctor` об этом говорят.
  Связь, которую ваш агент добавил к странице, ждет вашего подтверждения. Notion MCP находит страницы, которые
  пользователь создал в Notion, но не объединяет его ни с кем из ваших других сервисов.
- **Строки базы данных по свойству.** `notion` хранит свойства каждой строки в копии строками вида `Status: Done`,
  поэтому `notion search` находит их как слова, но не как поле. Фильтр по свойству сейчас работает только через
  команду сырого API `notion <profile> api post-database-query`, с телом запроса в JSON. Готовый поиск по свойству,
  например `status:Done`, запланирован. В Notion MCP запросы по свойству расходуют ограниченный лимит рабочего
  пространства, если у вас нет тарифа Business или Enterprise с Notion AI.
- **Копия на компьютере.** `notion sync` копирует выбранные страницы, вложенные в них страницы, базы данных и их
  строки, а каждая следующая синхронизация берет только то, что изменилось. notion-exporter скачивает дерево страниц
  один раз (`-r <folder>`) и не помнит, что изменилось.
- **Экспорт.** `notion documents export` записывает одну страницу из копии в файл Markdown. `ntn pages get` выводит
  одну страницу в Markdown. notion-exporter записывает все дерево страниц, а базу данных в файл CSV. Кроме того,
  `notion mirrors` держит папку файлов Markdown и дерево страниц Notion одинаковыми в обе стороны; другие инструменты
  здесь этого не делают.
- **Запись.** `notion documents create` создает страницу из Markdown внутри другой страницы, а
  `notion documents update` заменяет текст страницы. У каждой записи свое разрешение и `--dry-run`. Изменение, которое
  удалило бы вложенную страницу или базу, отклоняется, пока вы его не разрешите. notion-mcp-server пишет через
  инструменты, сделанные из API Notion, а тело запроса в JSON агент пишет сам.
- **Комментарии.** `notion comments list` читает открытые комментарии к странице прямо из Notion: закрытые API
  Notion не отдает. `notion comments create` начинает обсуждение, а `notion comments reply` отвечает в нем. Notion MCP
  читает и закрытые обсуждения. У ntn нет команды для комментариев, поэтому скрипт вызывает API комментариев Notion
  через `ntn api`. notion-mcp-server читает открытые комментарии и добавляет новые через инструменты, сделанные из API
  Notion, но ответить в обсуждении не может.
- **Файлы.** `notion files upload` добавляет файл с вашего компьютера в конец страницы как изображение, видео, аудио,
  PDF или файл, а файл больше 20 МБ отправляет частями. Notion MCP дает ИИ-приложению адрес для загрузки, и файл
  приложение отправляет само, одной частью до 20 МиБ. `ntn files create` загружает файл в Notion, но в справочнике его
  команд нет команды, которая добавляет файл на страницу. У notion-mcp-server нет инструмента для загрузки.
- **Только чтение.** Настройка `permissions` дает команде уровень `readonly` или `deny`, а `WCNOTION_READ_ONLY=1`
  отклоняет любую запись. По умолчанию MCP-сервер предлагает и команды записи, а через MCP уровень `ask` пропускает
  команду. Подробнее в [настройках](./configuration.md#permissions). notion-mcp-server только читает, если у токена
  есть лишь право "Read content". В Notion MCP выключить редактирование в MCP-клиентах и закрыть ИИ-приложения,
  которые не одобрены, может только администратор, через MCP Governance на тарифе Enterprise.
- **Просмотр изменения.** `--dry-run` показывает, что сделала бы команда, и ничего не отправляет. Notion MCP может
  предложить правку страницы, которую человек проверяет до того, как она применится, на тарифах Business и Enterprise.
- **Текст как данные.** MCP-сервер `notion` говорит агенту, что текст страниц, заголовки и названия свойств пишут
  другие люди и это данные, а не инструкции. В запуске агента по расписанию в режиме
  только для чтения сам текст тоже помечен в каждом ответе.
- **Без браузера.** Notion MCP принимает токен без браузера, только если владелец рабочего пространства на тарифе
  Business или Enterprise его создал. notion-exporter нужны две cookie, которые вы вручную копируете из браузера, где
  вошли в Notion.
- **Что поддерживает Notion.** notion-exporter работает через экспорт веб-приложения Notion, внутренний API, который,
  как сказано в его README, "may break anytime". notion-mcp-server вызывает открытый API, но Notion его больше не
  поддерживает.

<a id="when-another-tool-fits-better" />

## Когда другой инструмент подходит лучше

- **Notion MCP**: вы хотите, чтобы Claude или ChatGPT искал, писал и раскладывал страницы в вашем рабочем
  пространстве без установки, и страницам не нужно быть на вашем компьютере.
- **ntn**: вы делаете Notion Workers или хотите собственную командную строку Notion со входом через браузер.
- **notion-exporter**: вам нужно один раз получить дерево страниц или базу данных как файлы Markdown и CSV, например
  для статического сайта или резервной копии.

Если `notion` подходит, начните с [установки](./installation.md).
