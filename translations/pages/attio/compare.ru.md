---
title: "Сравнение с другими инструментами"
---

<a id="features" />
<a id="when-another-tool-fits-better" />
<a id="how-an-agent-answers-through-each" />

`attio` дает доступ к данным продаж пространства Attio из командной строки и через MCP-сервер: к сделкам, людям,
компаниям, воронке сделок и участникам пространства. Здесь он стоит рядом с другими инструментами, через которые
ИИ-агент читает и меняет Attio, чтобы вы могли выбрать тот, что подходит для вашей работы. Оценки для `attio` взяты из
его текущего выпуска, его команд и исходного кода и проверены 19 ноября 2026 года. Его тесты работают с поддельным Attio,
который собран по описанию API Attio, а каждый выпуск еще проходит проверку на живом пространстве. Оценки проверяют
заново при каждом выпуске. Оценки для остальных инструментов взяты из их собственной документации и исходного кода по
ссылкам в таблице и проверены 19 ноября 2026 года. Attio MCP и attio-mcp еще проверили вживую
в [тесте с агентом](#how-an-agent-answers-through-each). В остальные не входили, так что инструмент может уметь
больше, чем говорят его страницы.

Инструменты:

- **attio**, этот инструмент. Хранит на вашем компьютере копию ваших сделок и людей и компаний, которые в них
  названы, и для каждого действия решает, что может агент. Входит с токеном доступа, который создает администратор
  пространства. WireCat Desktop ставит его сам и спрашивает токен.
- **[Attio MCP](https://docs.attio.com/mcp/overview)**, собственный MCP-сервер Attio в облаке Attio, 53 инструмента.
  Вы входите под своим аккаунтом Attio, и сервер действует с вашими правами.
- **[attio-mcp](https://github.com/kesslerio/attio-mcp-server)**, MCP-сервер с открытым кодом для Attio с наибольшим
  числом звезд и загрузок (68 звезд, изменения 10 ноября 2026 года, npm `attio-mcp` 1.7.0, 9326 загрузок за месяц до
  17 ноября 2026 года). В нем 19 универсальных инструментов и еще инструменты для списков, примечаний и участников.
- **[Composio](https://composio.dev/toolkits/attio)**, MCP-сервер Composio в облаке, 105 инструментов для Attio.
- **[Zapier MCP](https://zapier.com/mcp/attio)**, MCP-сервер Zapier в облаке с приложением Attio. Каждый вызов
  инструмента тратит две задачи Zapier.
- **[FroeMic/attio-cli](https://github.com/FroeMic/attio-cli)**, командная строка с открытым кодом для Attio с
  наибольшим числом звезд (21 звезда, изменения 5 февраля 2026 года). Ее команда тоже называется `attio`.

Как выбирали соперников: собственный сервер Attio, MCP-сервер и командная строка с открытым кодом с наибольшим числом
звезд на GitHub и два облачных сервиса, которые показывают свои инструменты для Attio. У следующего MCP-сервера 16
звезд и 257 загрузок в месяц, у следующей командной строки 18 звезд. У Pipedream тоже есть MCP-сервер для
Attio, 9 действий. Его здесь нет, чтобы в таблице осталось пять инструментов.

Собственному MCP-серверу Attio токен не нужен: вы входите под своим аккаунтом Attio, и он видит то же, что и вы.
Токен доступа создает администратор пространства в Workspace settings → Developers. Токен читает все пространство, а с
правами на запись и меняет его, кто бы им ни пользовался. `attio`, attio-mcp и FroeMic/attio-cli входят с таким
токеном. attio-mcp еще принимает токен OAuth через Cloudflare Worker, который вы разворачиваете сами.

✅ да · 🟡 частично · ❌ нет · ➖ нет в документации · n/a неприменимо

## Функции

| Задача | attio | [Attio MCP](https://docs.attio.com/mcp/overview) | [attio-mcp](https://github.com/kesslerio/attio-mcp-server) | [Composio](https://composio.dev/toolkits/attio) | [Zapier MCP](https://zapier.com/mcp/attio) | [FroeMic/attio-cli](https://github.com/FroeMic/attio-cli) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Найти и прочитать** | | | | | | |
| Открытые сделки одного этапа | ✅ | [✅](https://docs.attio.com/mcp/overview) | [✅](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L51) | [🟡](https://composio.dev/toolkits/attio) | [🟡](https://zapier.com/mcp/attio) | [✅](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L408-L431) |
| Найти человека по имени или e-mail | ✅ | [✅](https://docs.attio.com/mcp/overview) | [✅](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L49-L50) | [✅](https://composio.dev/toolkits/attio) | [✅](https://zapier.com/mcp/attio) | [🟡](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L924-L970) |
| Прочитать примечания и задачи по сделке | 🟡 | [✅](https://docs.attio.com/mcp/overview) | [✅](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L52-L54) | [✅](https://composio.dev/toolkits/attio) | ➖ | [✅](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L630-L746) |
| Поиск по письмам и записям звонков, которые хранит Attio | ❌ | [✅](https://docs.attio.com/mcp/overview) | ➖ | ➖ | ➖ | ➖ |
| Читать сделки без интернета | ✅ | [❌](https://docs.attio.com/mcp/overview) | [❌](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/src/api/client-config.ts#L79) | ➖ | ➖ | [❌](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/src/utils/config.ts#L6) |
| Один поиск по сделкам и по сообщениям и заметкам из других ваших инструментов | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Изменить CRM** | | | | | | |
| Создать и изменить людей и компании | 🟡 | [✅](https://docs.attio.com/mcp/overview) | [✅](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L49-L50) | [✅](https://composio.dev/toolkits/attio) | [✅](https://zapier.com/mcp/attio) | [✅](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L408-L431) |
| Перевести сделку на другой этап | 🟡 | [✅](https://docs.attio.com/mcp/overview) | [✅](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L51) | [✅](https://composio.dev/toolkits/attio) | [🟡](https://zapier.com/mcp/attio) | [🟡](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L408-L431) |
| Добавить примечание или задачу к сделке | 🟡 | [✅](https://docs.attio.com/mcp/overview) | [✅](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L52-L54) | [✅](https://composio.dev/toolkits/attio) | [✅](https://zapier.com/mcp/attio) | [✅](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L630-L746) |
| **Сводки и изменения** | | | | | | |
| Сколько сделок на каждом этапе и их сумма | ✅ | [✅](https://docs.attio.com/mcp/overview) | ➖ | ➖ | ➖ | ➖ |
| Доля выигранных сделок за период | ✅ | [🟡](https://docs.attio.com/mcp/overview) | ➖ | ➖ | ➖ | ➖ |
| Что изменилось за день: новые сделки, переходы по этапам, выигрыши и проигрыши | ✅ | ➖ | [🟡](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/docs/universal-tools/api-reference.md#L526-L535) | ➖ | ➖ | ➖ |
| Короткая утренняя сводка изменений | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Агенты и безопасность** | | | | | | |
| Переключатель в самом инструменте, который оставляет агенту только чтение | ✅ | ➖ | [🟡](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/src/config/tool-mode.ts#L1-L28) | ➖ | [🟡](https://zapier.com/mcp) | [❌](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L140-L170) |
| Выбрать для каждого действия: разрешить, спросить или запретить | ✅ | [🟡](https://docs.attio.com/mcp/overview) | [🟡](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L215) | ➖ | [🟡](https://zapier.com/mcp) | [❌](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L140-L170) |
| Запись ждет вашего подтверждения | 🟡 | [✅](https://docs.attio.com/mcp/overview) | [🟡](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L215) | ➖ | ➖ | ➖ |
| Посмотреть, какие разрешения проверяет команда, не запуская ее | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Токен хранится в связке ключей системы | ✅ | n/a | [❌](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L560-L586) | n/a | n/a | [❌](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L140-L170) |
| Вход под своим аккаунтом Attio, без токена от администратора | ❌ | [✅](https://docs.attio.com/mcp/overview) | [🟡](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L446-L450) | [✅](https://composio.dev/toolkits/attio) | ➖ | [❌](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L96-L123) |
| Агент в терминале работает через команды, без MCP | ✅ | n/a | n/a | n/a | n/a | [✅](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md) |
| **Подготовка** | | | | | | |
| Несколько пространств, каждое названо в команде | ✅ | ➖ | ➖ | ➖ | ➖ | [🟡](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L162-L168) |
| Работает из ChatGPT или Claude в браузере | 🟡 | [✅](https://docs.attio.com/mcp/overview) | [🟡](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L446-L450) | [✅](https://composio.dev/toolkits/attio) | [✅](https://zapier.com/mcp) | ➖ |

| | attio | Attio MCP | attio-mcp | Composio | Zapier MCP | FroeMic/attio-cli |
|---|---|---|---|---|---|---|
| Установить | npm, Node 22.16+ или 24+ | не нужно: в облаке Attio | npm, Node 20+ | не нужно: в облаке | не нужно: в облаке | из исходного кода, Node 18+ |
| Лицензия | Apache-2.0 | закрытый сервис | Apache-2.0 | закрытый сервис | закрытый сервис | MIT |
| Цена | бесплатно | цены на его странице нет | бесплатно | 100 000 вызовов в месяц бесплатно, из них до 20 000 через приложения вроде Attio, дальше платно | [две задачи Zapier за вызов](https://docs.zapier.com/mcp/usage) | бесплатно |

Пояснения к столбцу `attio`:

- **Вход.** Токен доступа создает администратор пространства в Workspace settings → Developers. С тремя правами на
  чтение он читает все пространство. `attio` хранит его в связке ключей системы, а на компьютере без нее в закрытом
  файле, и никогда его не выводит. Вход через Attio в браузере есть в [планах](./roadmap.md). См.
  [установку](./installation.md).
- **Только чтение.** `WCATTIO_READ_ONLY=1` запрещает любую запись, что бы ни говорили настройки. `permissions.api` в
  значении `readonly` делает то же для одного профиля. С токеном только с правами на чтение любую запись запрещает сам
  Attio, и так можно с любым инструментом на этой странице, который берет токен.
- **Разрешить, спросить или запретить.** У каждой команды и каждой операции API свой ключ, например `deals.list` или
  `api.notes-create`, со значением `allow`, `ask`, `readonly` или `deny` в [разрешениях](./permissions.md).
  `mcp serve --permission` делает ключ строже только для одного сервера. Агент не может ослабить разрешение.
- **Запись через MCP.** Инструмент `attio_write` выполняет записи группы `api`. С самого начала они в `allow`, а
  удаления в `ask`. Через MCP отвечать в терминале некому, поэтому `ask` пропускает агента, и с токеном с правами на
  запись он может писать и удалять. Поэтому строка про подтверждение отмечена как частично. Поставьте
  `permissions.api` в `readonly` или включите подтверждение для `attio_write` в приложении агента. См. [MCP](./mcp.md).
- **Изменения в CRM.** Команды для сделок, людей и компаний только читают. Создать человека, перевести сделку, добавить
  примечание или задачу можно через операцию `api`, например `api objects-records-update` или `api notes-create`,
  поэтому эти строки отмечены как частично. Команды, чтобы переводить и закрывать сделки и работать с примечаниями и
  задачами, есть в [планах](./roadmap.md).
- **Без интернета.** `sync` копирует сделки и людей и компании, которые в них названы, вместе с этапами воронки
  сделок. `deals`, `pipelines`, `stages`, `changes`, `fields` и `search all` читают эту копию, в том числе с
  `--offline`. `people`, `organizations` и `users` всегда обращаются к Attio. Attio не умеет отдавать только
  изменения, поэтому каждая синхронизация читает все записи.
- **Один поиск.** `search all` находит сделки рядом с сообщениями, заметками и встречами, которые сохранили другие
  инструменты WireCat на том же компьютере, без интернета.
- **Этапы и доля выигранных.** `pipelines show` дает для каждого этапа число сделок и их сумму в каждой валюте, без
  пересчета. С `--since-time` он добавляет долю выигранных. Выигрыш это этап, который Attio празднует, а проигрыш это
  этап, название которого начинается с "Lost". Attio MCP считает число и суммы инструментом `run-basic-report`, а долю
  агент вычисляет из них сам.
- **Что изменилось и сводка.** `changes list` показывает то, что увидели синхронизации: созданные, перемещенные,
  выигранные и проигранные сделки и смену ответственного. Изменение видно только после синхронизации.
  `--format report` превращает окно в короткую утреннюю сводку.
- **Весь API Attio.** `api list` показывает все операции API Attio, и каждая из них это команда со своей справкой, для
  того, у чего пока нет своей команды.
- **ChatGPT или Claude в браузере.** `mcp serve --http` отдает инструмент через туннель, который вы настраиваете и
  держите сами, поэтому эта строка отмечена как частично.
- **Скорость и стоимость по сравнению с браузерным агентом.** `attio` обращается к API Attio, читает свою копию и
  браузер не открывает. Измерений по сравнению с браузерным агентом не опубликовано, поэтому эта страница ничего не
  утверждает.

## Как агент отвечает через каждый из них

Мы задали агенту 30 вопросов продавца о сделках и клиентах в придуманном пространстве Attio: 123 сделки и около 380
человек. Вопросы звучат так, как их задают на самом деле: имя с опечаткой, клиент не назван, деталь запомнилась
неверно. Агент каждый раз один и тот же (Claude Code с Claude Sonnet), меняется только инструмент. Ответы оценивал
отдельный агент, который не знал, какой инструмент их дал. Подготовка, вопросы и скрипты есть в
[результатах теста](https://github.com/WireCatLabs/cli-testing/blob/main/performance/crm/attio-agents/README.md).

| | attio | Attio MCP | attio-mcp |
|---|---|---|---|
| Верных ответов из 30 | 25 и 27 в двух прогонах | 28 | 22,5 |
| Время на 30 вопросов | около 18 минут | 8 минут | 21 минута |
| Стоимость модели на 30 вопросов | от $3,07 до $3,18 | $2,74 | $5,38 |

- **attio и Attio MCP ответили одинаково хорошо** на этих данных. Разница меньше, чем разброс между двумя прогонами
  attio.
- **Attio MCP ответил вдвое быстрее.** Он ищет в примечаниях по смыслу. Через `attio` агент читает примечания
  операциями `api`, и ему нужно больше шагов.
- **Только attio нашел клиента, в имени которого одна буква была неверной.** Оба MCP-сервера его не нашли.
- **attio-mcp не видит срок задачи**, поэтому не ответил на вопросы о просроченных задачах и задачах на неделю.

Composio, Zapier MCP и FroeMic/attio-cli в этом тесте не участвовали.

## Когда другой инструмент подходит лучше

- **Attio MCP**, если вам нужен Attio в Claude, ChatGPT или Cursor без установки, если вы не администратор
  пространства если агент должен читать примечания, письма и записи звонков и писать с вашим подтверждением или если быстрый ответ
  важнее копии на компьютере.
- **Composio** или **Zapier MCP**, если вам нужен Attio рядом со многими другими приложениями в одном облачном
  сервере.
- **attio-mcp**, если агент должен создавать и менять сделки, примечания и задачи готовыми инструментами на вашем
  компьютере.
- **FroeMic/attio-cli**, если скрипт должен управлять объектами, атрибутами, списками и записями списков в терминале,
  без слоя разрешений.

Если `attio` подходит, начните с [установки](./installation.md). Чтобы работать с ним через агента, см.
[использование](./usage.md).
