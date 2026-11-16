---
title: "Сравнение с другими инструментами"
---

<a id="features" />
<a id="when-another-tool-fits-better" />

`notion` дает командную строку и MCP-сервер, которые хранят копию ваших страниц и баз данных Notion на вашем
компьютере, ищут по ней без интернета и дают ее вашему ИИ-агенту. Здесь он стоит рядом с другими инструментами,
через которые агент или скрипт читает и меняет Notion, чтобы вы могли выбрать тот, что подходит для вашей задачи.
Оценки для `notion` взяты из версии 0.2.0, а оценки для остальных инструментов взяты из их собственной документации
и исходного кода. Все проверено 16 ноября 2026 года. Инструмент может делать больше, чем сказано на его страницах.

Инструменты:

- **notion**: этот инструмент. Входит с вашим собственным токеном Notion, копирует выбранные страницы и базы данных
  на ваш компьютер, находит их по словам и по смыслу и отдает их агенту в терминале или через MCP. Он еще в
  разработке: готовых команд для записи страниц, поиска по свойству базы данных и папки Markdown, которая держится в
  согласии с Notion, пока нет.
- **[Notion MCP](https://developers.notion.com/guides/mcp/get-started-with-mcp)**: собственный MCP-сервер Notion,
  который работает у Notion. Ваше ИИ-приложение подключается к нему и входит в ваше рабочее пространство.
- **[ntn](https://developers.notion.com/cli/get-started/overview)**: собственная командная строка Notion, в бета-версии.
  Читает и пишет страницы в Markdown, делает запросы к базам данных, загружает файлы и управляет Notion Workers.
- **[notion-mcp-server](https://github.com/makenotion/notion-mcp-server)**: MCP-сервер Notion с открытым кодом,
  который вы запускаете сами с токеном. В его README сказано, что он
  [больше не поддерживается](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L6-L7).
- **[notion-exporter](https://github.com/yannbolliger/notion-exporter)**: командная строка, которая скачивает страницу
  или базу данных как файлы Markdown или CSV через экспорт веб-приложения Notion (193 звезды, обновлялся 23 октября
  2026 года).

✅ да · 🟡 частично · ❌ нет · ➖ нет в документации · n/a неприменимо

## Функции

| Задача | notion | [Notion MCP](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [ntn](https://developers.notion.com/cli/reference/commands) | [notion-mcp-server](https://github.com/makenotion/notion-mcp-server) | [notion-exporter](https://github.com/yannbolliger/notion-exporter) |
|---|:-:|:-:|:-:|:-:|:-:|
| **Найти страницу** | | | | | |
| Найти страницу по словам внутри нее | ✅ | [✅](https://developers.notion.com/guides/mcp/tools-search-reference) | [🟡](https://developers.notion.com/reference/post-search) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L22) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Найти страницу по смыслу, а не только по точным словам | ✅ | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L11) | [❌](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L22) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Искать по страницам без интернета | ✅ | [❌](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [❌](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L39) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Найти страницу вместе с вашими чатами, почтой и файлами из других сервисов | ✅ | [🟡](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [❌](https://developers.notion.com/cli/reference/commands) | ➖ | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Найти строки базы данных по значению свойства, например Status равен Done | 🟡 | [✅](https://developers.notion.com/guides/mcp/tools-databases-reference) | [✅](https://developers.notion.com/cli/reference/commands) | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L59) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| **Копия и экспорт** | | | | | |
| Держать на компьютере копию выбранных страниц и баз данных, которую обновляет каждая синхронизация | ✅ | ➖ | [❌](https://developers.notion.com/cli/reference/commands) | ➖ | [🟡](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L76) |
| Выгрузить страницу и вложенные в нее страницы в файлы Markdown | 🟡 | ➖ | [🟡](https://developers.notion.com/cli/reference/commands) | ➖ | [✅](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L76) |
| **Запись** | | | | | |
| Создать страницу или изменить ее текст из Markdown | 🟡 | [✅](https://developers.notion.com/guides/mcp/tools-pages) | [✅](https://developers.notion.com/cli/reference/commands) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L24) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| **Агенты и безопасность** | | | | | |
| ИИ-приложение работает с вашими страницами через MCP | ✅ | [✅](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [❌](https://developers.notion.com/cli/reference/commands) | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L333) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Работать из Claude или ChatGPT в браузере | ✅ | [✅](https://www.notion.com/help/notion-mcp) | [❌](https://developers.notion.com/cli/reference/commands) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L345) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Агент с терминалом запускает его, с выводом в JSON и навыком | ✅ | n/a | [🟡](https://developers.notion.com/cli/reference/commands) | n/a | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Агенту можно оставить только чтение | ✅ | [🟡](https://www.notion.com/help/notion-mcp) | ➖ | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L112) | [✅](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/README.md?plain=1#L3-L6) |
| Разрешить или запретить агенту отдельные команды | ✅ | [🟡](https://www.notion.com/help/notion-mcp) | ➖ | ➖ | n/a |
| Посмотреть изменение до того, как оно сделано | ✅ | [🟡](https://developers.notion.com/guides/mcp/tools-faqs) | ➖ | ➖ | n/a |
| Текст страницы доходит до агента как данные, а не как инструкции | 🟡 | ➖ | ➖ | ➖ | ➖ |
| **Установка** | | | | | |
| Работает с агентом без браузера | ✅ | [🟡](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [✅](https://developers.notion.com/cli/get-started/authentication) | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L138) | [🟡](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/README.md?plain=1#L78-L92) |
| Опирается только на то, что Notion описывает и поддерживает | ✅ | [✅](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [✅](https://developers.notion.com/cli/get-started/overview) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L6-L7) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/README.md?plain=1#L119-L125) |

| | notion | Notion MCP | ntn | notion-mcp-server | notion-exporter |
|---|---|---|---|---|---|
| Установка | npm, Node 22.16 или новее 22.x, или Node 24 и новее | ничего: ваше ИИ-приложение подключается к серверу Notion | скрипт установки, WinGet или npm | npx или Docker | npm |
| Лицензия | Apache-2.0 | сервис Notion, на любом тарифе | MIT | MIT | MIT |
| Вход | личный токен доступа или токен подключения, хранится в связке ключей системы | OAuth в браузере или MCP-токен на тарифах Business и Enterprise | в браузере или личный токен доступа | токен подключения | cookie `token_v2` и `file_token` из вашего браузера |

Пояснения к оценкам:

- **Найти страницу по словам.** `notion search` ищет по копии на вашем компьютере, в тексте каждой страницы и
  строки. Поиск API Notion, который вызывают `ntn api v1/search` и notion-mcp-server, находит страницы по
  заголовку. Notion MCP запускает собственный поиск Notion по рабочему пространству.
- **По смыслу.** `notion sync --embed` индексирует текст моделью, уже скачанной на ваш компьютер, и после этого
  `notion search` находит страницу и по смыслу. Notion MCP ищет по смыслу на стороне Notion.
- **Вместе с чатами и почтой.** Копия лежит в локальном хранилище, общем для инструментов WireCat, поэтому `memo search` и `search all` находят
  страницу рядом с вашими сообщениями, почтой и файлами из других инструментов WireCat. Notion MCP ищет в
  подключенных сервисах, таких как Slack и Google Drive, на тарифах Business и Enterprise с Notion AI.
- **Строки базы данных по свойству.** `notion` хранит свойства каждой строки в копии строками вида `Status: Done`,
  поэтому `notion search` находит их как слова, но не как поле. Фильтр по свойству сейчас работает только через
  команду сырого API `notion <profile> api post-database-query`, с телом запроса в JSON. Готовый поиск по свойству,
  например `status:Done`, запланирован. В Notion MCP запросы по свойству расходуют ограниченный лимит рабочего
  пространства, если у вас нет тарифа Business или Enterprise с Notion AI.
- **Копия на компьютере.** `notion sync` копирует выбранные страницы, вложенные в них страницы, базы данных и их
  строки, а каждая следующая синхронизация берет только то, что изменилось. notion-exporter скачивает дерево страниц
  один раз (`-r <folder>`) и не помнит, что изменилось.
- **Экспорт.** `notion documents export` записывает одну страницу из копии в файл Markdown. `ntn pages get` выводит
  одну страницу в Markdown. notion-exporter записывает все дерево страниц, а базу данных в файл CSV. Ни один
  инструмент здесь не держит папку файлов Markdown в согласии с Notion в обе стороны. В `notion` это запланировано.
- **Запись.** Готовой команды для записи страницы в `notion` пока нет. Его команды сырого API, например
  `api post-page` и `api update-page-markdown`, создают страницу и меняют ее Markdown, а тело запроса в JSON агент
  пишет сам. У каждой из них свое разрешение и `--dry-run`. notion-mcp-server пишет так же, через инструменты,
  сделанные из API Notion.
- **Только чтение.** Настройка `permissions` дает команде уровень `readonly` или `deny`, а `WCNOTION_READ_ONLY=1`
  отклоняет любую запись. По умолчанию MCP-сервер предлагает и команды записи, а через MCP уровень `ask` пропускает
  команду. Подробнее в [настройках](./configuration.md#permissions). notion-mcp-server только читает, если у токена
  есть лишь право "Read content". В Notion MCP администратор может выключить редактирование в MCP-клиентах, а на
  тарифе Enterprise закрыть инструменты, которые не одобрены.
- **Просмотр изменения.** `--dry-run` показывает, что сделала бы команда, и ничего не отправляет. Notion MCP может
  предложить правку страницы, которую человек проверяет до того, как она применится.
- **Текст как данные.** MCP-сервер `notion` говорит агенту, что текст страниц, заголовки и названия свойств пишут
  другие люди и это данные, а не инструкции. Сам текст в каждом ответе не помечен.
- **Без браузера.** Notion MCP принимает токен без браузера, только если владелец рабочего пространства на тарифе
  Business или Enterprise его создал. notion-exporter нужны две cookie, которые вы вручную копируете из браузера, где
  вошли в Notion.
- **Что поддерживает Notion.** notion-exporter работает через экспорт веб-приложения Notion, внутренний API, который,
  как сказано в его README, "may break anytime". notion-mcp-server вызывает открытый API, но Notion его больше не
  поддерживает.

## Когда другой инструмент подходит лучше

- **Notion MCP**: вы хотите, чтобы Claude или ChatGPT искал, писал и раскладывал страницы в вашем рабочем
  пространстве без установки, и страницам не нужно быть на вашем компьютере.
- **ntn**: вам уже сейчас нужны готовые команды, которые создают и правят страницы из Markdown в скрипте, или вы
  делаете Notion Workers.
- **notion-exporter**: вам нужно один раз получить дерево страниц или базу данных как файлы Markdown и CSV, например
  для статического сайта или резервной копии.

Если `notion` подходит, начните с [установки](./installation.md).
