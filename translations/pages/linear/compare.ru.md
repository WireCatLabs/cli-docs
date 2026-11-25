---
title: "Сравнение с другими инструментами"
---

<a id="features" />
<a id="when-another-tool-fits-better" />

`linear` дает доступ к Linear из командной строки и через MCP-сервер: к тикетам, проектам, командам, статусам, меткам
и комментариям. Здесь он стоит рядом с другими инструментами, через которые ИИ-агент читает и меняет Linear, чтобы вы
могли выбрать тот, что подходит для вашей работы. Оценки для `linear` взяты из его выпуска, его команд и
документации и проверены 25 ноября 2026 года на linear-cli 0.4.1, а не на живом рабочем пространстве. Их проверяют
заново при каждом выпуске. Оценки для других инструментов взяты из их собственной документации и исходного кода,
ссылки на них есть в таблице, и проверены 19 ноября 2026 года. Ни в один инструмент не выполняли вход и ничего не
проверяли вживую, а инструмент может уметь больше, чем говорят его страницы.

Инструменты:

- **linear**: этот инструмент. Хранит копию вашего рабочего пространства Linear на вашем компьютере, достает до каждой
  операции API Linear и для каждого действия решает, что может агент. Входит по персональному API-ключу.
- **[Linear MCP](https://linear.app/docs/mcp)**: официальный MCP-сервер Linear, его запускает сам Linear на
  `mcp.linear.app`. Вы подключаете к нему ИИ-приложение и входите в Linear в браузере.
- **[schpet/linear-cli](https://github.com/schpet/linear-cli)**: командная строка для Linear с открытым кодом и
  больше всего звезд (1 051 звезда, изменена 17 ноября 2026 года). Ее команда тоже называется `linear`. Она работает
  вместе с git и jj: начинает тикет в новой ветке и открывает для него пул-реквест. Оценки для нее взяты из основной
  ветки, то есть из будущего выпуска 4.0.
- **[linearis](https://github.com/linearis-oss/linearis)**: командная строка для Linear, сделанная для ИИ-агентов,
  с выводом только в JSON (267 звезд, изменена 28 октября 2026 года). Она покрывает операции повседневной работы, а
  не весь API.
- **[mcp-linear](https://github.com/tacticlaunch/mcp-linear)**: MCP-сервер для Linear с открытым кодом и больше
  всего звезд из тех, что еще поддерживают (151 звезда, изменен 13 ноября 2026 года), с 240 инструментами, в npm как
  `@tacticlaunch/mcp-linear`.

Linear пускает программу по
[персональному API-ключу](https://linear.app/docs/api-and-webhooks), который создают в настройках безопасности
аккаунта. Он действует с правами этого пользователя. Ключ можно ограничить частью разрешений, например только
чтением, и частью команд. Такой ключ принимает каждый инструмент на этой странице, а Linear MCP еще умеет вход через
OAuth. Прежний сервер сообщества
[linear-mcp-server](https://github.com/jerhadf/linear-mcp-server/blob/5e2cb621c52762618eb015b4a8d6bf884021b29e/README.md?plain=1#L5)
(348 звезд) больше не поддерживают, и он отсылает к Linear MCP, поэтому его нет в таблице. Нет в ней и SDK и
GraphQL API самого Linear: они для программистов, которые пишут свой код.

✅ да · 🟡 частично · ❌ нет · ➖ нет в документации · n/a неприменимо

## Функции

| Задача | linear | [Linear MCP](https://linear.app/docs/mcp) | [schpet/linear-cli](https://github.com/schpet/linear-cli) | [linearis](https://github.com/linearis-oss/linearis) | [mcp-linear](https://github.com/tacticlaunch/mcp-linear) |
|---|:-:|:-:|:-:|:-:|:-:|
| **Найти и прочитать** | | | | | |
| Читать тикеты без интернета | ✅ | [❌](https://linear.app/docs/mcp) | [❌](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/crates/linear-cli/src/config/options.rs#L20) | [❌](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/src/client/graphql-client.ts#L7) | [❌](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/src/index.ts#L43-L46) |
| Найти тикет по словам | ✅ | [✅](https://linear.app/docs/mcp) | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/README.md?plain=1#L157-L158) | [✅](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L80-L82) | [✅](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/TOOLS.md?plain=1#L129) |
| Список тикетов по статусу или исполнителю | ✅ | ➖ | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/README.md?plain=1#L153-L159) | [✅](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/src/commands/issues.ts#L693-L703) | [✅](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/src/tools/definitions/issue-tools.ts#L276-L300) |
| Список проектов, команд, пользователей, статусов и меток | ✅ | [🟡](https://linear.app/docs/mcp) | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/crates/linear-cli/src/cli/mod.rs#L130-L168) | [✅](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L162-L170) | [✅](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/TOOLS.md?plain=1#L47-L76) |
| **Изменить** | | | | | |
| Создать и изменить тикет | ✅ | [✅](https://linear.app/docs/mcp) | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/README.md?plain=1#L166-L173) | [✅](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L84-L85) | [✅](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/TOOLS.md?plain=1#L130-L131) |
| Прокомментировать тикет | ✅ | [✅](https://linear.app/docs/mcp) | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/README.md?plain=1#L177-L181) | [✅](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L97-L108) | [✅](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/TOOLS.md?plain=1#L132) |
| Каждый запрос и каждая мутация API Linear | ✅ | [🟡](https://linear.app/docs/mcp) | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/crates/linear-cli/src/cli/mod.rs#L180-L184) | [🟡](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L146-L152) | [🟡](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/README.md?plain=1#L16-L30) |
| Сделать тикет своей задачей | ✅ | ➖ | ➖ | ➖ | ➖ |
| **Агенты и безопасность** | | | | | |
| Дать агенту только читать | ✅ | [✅](https://linear.app/docs/mcp) | [🟡](https://linear.app/docs/api-and-webhooks) | [🟡](https://linear.app/docs/api-and-webhooks) | [🟡](https://linear.app/docs/api-and-webhooks) |
| Выбрать для каждого действия: разрешить, спросить или запретить | ✅ | ➖ | ➖ | ➖ | ➖ |
| Для удаления или архивации нужно отдельное разрешение | ✅ | ➖ | [🟡](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/crates/linear-cli/src/cli/mod.rs#L218-L222) | [❌](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L160) | [❌](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/TOOLS.md?plain=1#L170) |
| Увидеть, что отправит изменение, ничего не отправляя | ✅ | ➖ | ➖ | ➖ | ➖ |
| Ключ хранится в системном хранилище ключей | ✅ | n/a | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/docs/authentication.md?plain=1#L13-L15) | [❌](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/src/common/encryption.ts#L11-L14) | [❌](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/README.md?plain=1#L152-L168) |
| Агент в терминале работает через команды, без MCP | ✅ | n/a | [✅](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/README.md?plain=1#L414-L419) | [✅](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L223-L231) | n/a |
| **Подготовка** | | | | | |
| MCP-сервер | ✅ | [✅](https://linear.app/docs/mcp) | [❌](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/crates/linear-cli/src/cli/mod.rs#L129-L184) | [❌](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/README.md?plain=1#L233-L242) | [✅](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/README.md?plain=1#L5-L7) |
| Работает из ChatGPT или Claude в браузере | 🟡 | [✅](https://linear.app/docs/mcp) | n/a | n/a | [❌](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/src/mcp-server.ts#L127-L128) |
| Несколько рабочих пространств, каждое названо в команде | ✅ | [🟡](https://linear.app/docs/mcp) | [🟡](https://github.com/schpet/linear-cli/blob/aa4cc2b60d5c0068028872ce25a4a34340cf053e/docs/authentication.md?plain=1#L3-L11) | [❌](https://github.com/linearis-oss/linearis/blob/fdfa73c44cf5db46c872da5e93c952e324f8d576/src/common/auth.ts#L19-L41) | [🟡](https://github.com/tacticlaunch/mcp-linear/blob/2f1d1803e3dfb1eb891278439b776ae62ad7d6a3/README.md?plain=1#L86) |

| | linear | Linear MCP | schpet/linear-cli | linearis | mcp-linear |
|---|---|---|---|---|---|
| Установить | npm, Node 22.16+ или 24+ | не нужно: его запускает Linear, вы добавляете его адрес в свое ИИ-приложение | Homebrew, npm, готовый файл или cargo | npm, Node 22+ | npm или `npx`, Node 20+ |
| Вход | персональный API-ключ | OAuth в браузере или API-ключ в заголовке | персональный API-ключ | персональный API-ключ | персональный API-ключ или OAuth-токен своего OAuth-приложения Linear |
| Лицензия | Apache-2.0 | закрытый сервис | ISC | MIT | MIT |
| Цена | бесплатно | не указана на его странице | бесплатно | бесплатно | бесплатно |

Заметки к столбцу `linear`:

- **Вход.** Персональный API-ключ действует с правами пользователя Linear, который его создал. `session start` читает
  его из stdin или скрытого запроса, никогда из аргумента, и до сохранения проверяет его в Linear. Он хранится в
  системном хранилище ключей, а на компьютере без него в закрытом файле. Смотрите [установку](./installation.md).
- **Без интернета.** `sync` копирует команды, пользователей, статусы, метки, проекты, спринты (циклы Linear), тикеты и
  комментарии в локальное хранилище WireCat. Архивные тоже попадают в копию, с пометкой. После первого запуска он
  читает только изменения, а раз в день находит то, что в Linear удалили или перенесли в корзину. `issues list`,
  `issues show` и `issues search` читают эту копию, в том числе с `--offline`. Копия принадлежит пользователю, чей
  ключ выполнил вход, потому что Linear показывает разным участникам разные команды.
- **Изменения.** `issues create`, `issues update` и `issues comments create` создают, меняют и комментируют тикет
  обычными параметрами, например `--title`, `--status` и `--text`. Каждая запись проверяет свой ключ разрешения, а
  `--dry-run` показывает, что она отправила бы.
- **Группа api.** В `linear <профиль> api` есть по команде на каждый запрос и каждую мутацию GraphQL-схемы Linear, у
  каждой свои флаги и справка. `api list` перечисляет их все.
- **Ваша задача.** После каждого `sync` каждый открытый тикет, назначенный на вас, становится задачей WireCat с ключом
  и названием тикета и закрывается, когда тикет выполнен, отменен или перешел к другому. `issues assign ENG-12` делает
  вашей задачей любой другой тикет. Ни то, ни другое ничего не меняет в Linear и никому там тикет не назначает.
- **Только чтение.** `WCLINEAR_READ_ONLY=1` отклоняет любое изменение, что бы ни говорили настройки. Уровень
  `readonly` делает то же для одного ключа, например `api`.
- **Разрешить, спросить или запретить.** У каждой команды и каждой операции API есть свой ключ со значением `allow`,
  `ask`, `readonly` или `deny` для каждого профиля в [настройках](./configuration.md#permissions). Изменение
  спрашивает свой ключ, а удалению или архивации нужен еще и `linear.delete`. `mcp serve --permission` делает ключ
  строже только для одного сервера.
- **Через MCP.** Ответить на `ask` некому, поэтому `ask` пропускает агента. Каждое изменение, которое сделал агент,
  остается в `runs list`. Чтобы запретить изменения, поставьте `permissions.api` на `readonly` или одну операцию на
  `deny`.
- **Пробный запуск.** `--dry-run` показывает, что изменение отправило бы в Linear, и ничего не отправляет.
- **Несколько рабочих пространств.** Каждая команда начинается с профиля, имени, которое вы выбираете для одного
  аккаунта. Профиль никогда не подставляется сам, даже единственный. Смотрите [работу с инструментом](./usage.md).
- **ChatGPT или Claude в браузере.** `mcp serve --http` отдает инструмент через туннель, который вы сами
  настраиваете и держите запущенным, поэтому в этой строке частично.

## Когда другой инструмент подходит лучше

- **Linear MCP**: вам нужны ChatGPT или Claude в браузере, и запускать на компьютере ничего не надо, или вы хотите
  входить через OAuth и не создавать API-ключ.
- **schpet/linear-cli**: вы работаете в git или jj и хотите из терминала начинать тикет в его ветке и открывать его
  пул-реквест. Еще она прикрепляет файлы к тикетам и комментариям.
- **linearis**: агент должен создавать или менять много тикетов одним пакетом или загружать и скачивать файлы, и
  держать в контексте короткую справку по командам.
- **mcp-linear**: агент работает только через MCP и должен доставать до вебхуков, клиентов, шаблонов и обновлений
  проектов через инструменты с отдельными именами.

Если `linear` подходит, начните с [установки](./installation.md). Чтобы работать с ним через агента, смотрите
[работу с инструментом](./usage.md).
