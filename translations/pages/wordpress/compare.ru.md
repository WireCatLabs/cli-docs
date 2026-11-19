---
title: "Сравнение с другими инструментами"
---

<a id="features" />
<a id="when-another-tool-fits-better" />

`wordpress` дает доступ к своему сайту на WordPress из командной строки и через MCP-сервер: к постам и страницам,
меткам и рубрикам и к пользователям, которые пишут. Здесь он стоит рядом с другими инструментами, через которые
ИИ-агент читает и пишет в WordPress, чтобы вы могли выбрать тот, что подходит для вашей работы. Оценки для
`wordpress` взяты из его первого выпуска, его команд и исходного кода и проверены 19 ноября 2026 года на WordPress
6.9.4 в Docker, а не на живом сайте. Их проверяют заново при каждом выпуске. Оценки для других инструментов взяты из
их собственной документации и исходного кода, ссылки на них есть в таблице, и проверены 19 ноября 2026 года. Ни в
один инструмент не выполняли вход и ничего не проверяли вживую, а инструмент может уметь больше, чем говорят его
страницы.

Инструменты:

- **wordpress**: этот инструмент. Хранит копию ваших постов и страниц на вашем компьютере, пишет черновики на вашем
  сайте и для каждого действия решает, что может агент. Входит по паролю приложения.
- **[WP-CLI](https://github.com/wp-cli/wp-cli)**: официальная командная строка WordPress, команда `wp` (5 182
  звезды). Работает на сервере или на вашем компьютере с сервером по SSH.
- **[MCP Adapter](https://github.com/WordPress/mcp-adapter)**: официальный плагин WordPress, который превращает
  возможности сайта в инструменты MCP (1 926 звезд). Ему нужен WordPress 6.9 или новее, где Abilities API входит в
  WordPress. Что может агент, зависит от возможностей, которые открывают ваши плагины.
- **[WordPress.com MCP](https://developer.wordpress.com/docs/mcp/)**: MCP-сервер, встроенный в WordPress.com. Он
  также обслуживает свои сайты, подключенные через Jetpack.
- **[claudeus-wp-mcp](https://github.com/deus-h/claudeus-wp-mcp)**: MCP-сервер с открытым кодом и больше всего звезд
  из тех, что вызывают REST API сайта по паролю приложения (161 звезда, изменен 16 марта 2026 года), со 145
  инструментами.
- **[mcp-wp](https://github.com/InstaWP/mcp-wp)**: MCP-сервер InstaWP поверх REST API с паролями приложений (100
  звезд, изменен 10 сентября 2026 года), в npm как `@instawp/mcp-wp`.

WordPress пускает программу по
[паролю приложения](https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/), который
создают в профиле пользователя на сайте, открытом по https. Он действует с правами этого пользователя. Так входит
каждый инструмент на этой странице, кроме WP-CLI и WordPress.com MCP. Прежний плагин Automattic,
[wordpress-mcp](https://github.com/Automattic/wordpress-mcp/blob/7510accc8460b1b8f568c00860e1cc29e87f1b4f/Readme.md?plain=1#L1-L12),
отправлен в архив и отсылает к MCP Adapter и WordPress.com MCP, поэтому его нет в таблице. Нет в ней и плагинов,
которые добавляют на сайт свой MCP-сервер, например EMCP Tools for Elementor.

✅ да · 🟡 частично · ❌ нет · ➖ нет в документации · n/a неприменимо

## Функции

| Задача | wordpress | [WP-CLI](https://github.com/wp-cli/wp-cli) | [MCP Adapter](https://github.com/WordPress/mcp-adapter) | [WordPress.com MCP](https://developer.wordpress.com/docs/mcp/) | [claudeus-wp-mcp](https://github.com/deus-h/claudeus-wp-mcp) | [mcp-wp](https://github.com/InstaWP/mcp-wp) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Найти и прочитать** | | | | | | |
| Читать посты и черновики без интернета | ✅ | [🟡](https://github.com/wp-cli/wp-cli/blob/5ec3c05d8b46bb50a6179bc722b97ede35fbd86f/php/config-spec.php#L16-L20) | [❌](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L11) | [❌](https://developer.wordpress.com/docs/mcp/) | [❌](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/config/site-config.ts#L30-L39) | [❌](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/README.md?plain=1#L353-L361) |
| Найти пост по словам заголовка и текста | ✅ | [✅](https://github.com/wp-cli/entity-command/blob/794bc5bbd36e68c36448ab6e6b0aad531bbc358f/src/Post_Command.php#L797-L798) | ➖ | [✅](https://developer.wordpress.com/docs/mcp/tools-reference/) | [✅](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/tools/search/index.ts#L4-L8) | [✅](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/src/tools/unified-content.ts#L701-L706) |
| Один поиск по постам и сообщениям и заметкам других ваших инструментов | 🟡 | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Писать и публиковать** | | | | | | |
| Написать черновик из файла Markdown | ✅ | [🟡](https://github.com/wp-cli/entity-command/blob/794bc5bbd36e68c36448ab6e6b0aad531bbc358f/src/Post_Command.php#L137-L142) | [🟡](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L12) | [🟡](https://developer.wordpress.com/docs/mcp/tools-reference/) | [❌](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/tools/content/index.ts#L18-L31) | [✅](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/src/tools/unified-content.ts#L728-L742) |
| Опубликовать черновик или вернуть пост в черновики | ✅ | [✅](https://github.com/wp-cli/entity-command/blob/794bc5bbd36e68c36448ab6e6b0aad531bbc358f/src/Post_Command.php#L395-L396) | [🟡](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L12) | [✅](https://developer.wordpress.com/docs/mcp/tools-reference/) | [✅](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/tools/content/index.ts#L33-L45) | [✅](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/src/tools/unified-content.ts#L676-L681) |
| Запланировать пост на более позднее время | ✅ | [✅](https://github.com/wp-cli/entity-command/blob/794bc5bbd36e68c36448ab6e6b0aad531bbc358f/src/Post_Command.php#L159-L161) | ➖ | ➖ | ➖ | ➖ |
| Изменить пост и сохранить блоки, которые Markdown не удержит | ✅ | n/a | ➖ | ➖ | n/a | [🟡](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/src/tools/unified-content.ts#L756-L775) |
| Изменение останавливается, если пост поменяли на сайте после того, как вы его прочитали | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Загрузить картинку или файл | ❌ | [✅](https://github.com/wp-cli/media-command/blob/136c6ea8a5939c2c6760c62554ff07a931340ce1/src/Media_Command.php#L377-L385) | ➖ | [✅](https://developer.wordpress.com/docs/mcp/tools-reference/) | [✅](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/tools/media/index.ts#L19-L38) | [✅](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/README.md?plain=1#L58-L66) |
| **Агенты и безопасность** | | | | | | |
| Дать агенту только чтение | ✅ | [🟡](https://github.com/wp-cli/wp-cli/blob/5ec3c05d8b46bb50a6179bc722b97ede35fbd86f/php/config-spec.php#L97-L102) | ➖ | [✅](https://developer.wordpress.com/docs/mcp/) | ➖ | ➖ |
| Дать агенту писать черновики, но не публиковать | ✅ | ➖ | [🟡](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L12-L13) | ➖ | [❌](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/tools/content/index.ts#L33-L45) | [❌](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/src/tools/unified-content.ts#L676-L681) |
| Выбрать для каждого действия: разрешить, спросить или запретить | ✅ | [🟡](https://github.com/wp-cli/wp-cli/blob/5ec3c05d8b46bb50a6179bc722b97ede35fbd86f/php/config-spec.php#L97-L102) | ➖ | [🟡](https://developer.wordpress.com/docs/mcp/) | ➖ | ➖ |
| Изменение ждет вашего подтверждения | 🟡 | n/a | ➖ | [🟡](https://developer.wordpress.com/docs/mcp/tools-reference/) | [❌](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/security/UserConsentManager.ts#L33-L36) | ➖ |
| Пароль хранится в связке ключей системы | ✅ | n/a | [❌](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L41-L57) | n/a | [❌](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/readme.md?plain=1#L240-L257) | [❌](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/README.md?plain=1#L353-L361) |
| Агент в терминале работает через команды, без MCP | ✅ | [✅](https://github.com/wp-cli/entity-command/blob/794bc5bbd36e68c36448ab6e6b0aad531bbc358f/src/Post_Command.php#L1000-L1002) | n/a | n/a | n/a | n/a |
| **Подготовка** | | | | | | |
| Работает, когда на сайте ничего не установлено | ✅ | [🟡](https://github.com/wp-cli/wp-cli/blob/5ec3c05d8b46bb50a6179bc722b97ede35fbd86f/php/config-spec.php#L16-L20) | [❌](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L21) | [🟡](https://developer.wordpress.com/docs/mcp/) | [✅](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/readme.md?plain=1#L240-L257) | [✅](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/README.md?plain=1#L13) |
| Работает с сайтом на WordPress.com | ❌ | [🟡](https://developer.wordpress.com/docs/developer-tools/wp-cli/) | ➖ | [✅](https://developer.wordpress.com/docs/mcp/) | ➖ | ➖ |
| Несколько сайтов, каждый назван в команде | ✅ | [✅](https://github.com/wp-cli/wp-cli/blob/5ec3c05d8b46bb50a6179bc722b97ede35fbd86f/php/config-spec.php#L147-L152) | [🟡](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L41-L57) | [✅](https://developer.wordpress.com/docs/mcp/) | [🟡](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/tools/schemas/common.ts#L10-L14) | [🟡](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/README.md?plain=1#L390-L399) |
| Работает из ChatGPT или Claude в браузере | 🟡 | n/a | [❌](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L81-L83) | [✅](https://wordpress.com/support/mcp/connect-claude/) | [🟡](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/index.ts#L109-L120) | [❌](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/src/server.ts#L69-L72) |

| | wordpress | WP-CLI | MCP Adapter | WordPress.com MCP | claudeus-wp-mcp | mcp-wp |
|---|---|---|---|---|---|---|
| Установить | npm, Node 22.16+ или 24+ | PHP-файл на сервере | плагин на WordPress 6.9+ и `npx` на вашем компьютере для большинства приложений | не нужно: встроен в WordPress.com | npm или `npx`, Node 22+ | `npx`, Node 18+ |
| Лицензия | Apache-2.0 | MIT | GPL-2.0-or-later | закрытый сервис | MIT | GPL-3.0-or-later |
| Цена | бесплатно | бесплатно | бесплатно | в любом платном тарифе WordPress.com. Бесплатные сайты и сайты Jetpack без тарифа Jetpack AI или Complete только до 30 ноября 2026 года | бесплатно | бесплатно |

Заметки к столбцу `wordpress`:

- **Вход.** Пароль приложения действует с правами пользователя WordPress, который его создал. `session start` читает
  его из stdin или из скрытого запроса, никогда из аргумента. Он хранится вместе с сайтом в связке ключей системы, а на
  компьютере без нее в закрытом файле. Смотрите [установку](./installation.md).
- **Без интернета.** `sync` копирует посты и страницы с любым статусом, корзину тоже, вместе с их метками, рубриками и
  пользователями, в локальное хранилище WireCat. Текст хранится в Markdown. `posts list`, `posts search` и
  `posts show` читают эту копию, в том числе с `--offline`. Сколько копируется, решает ваша роль в WordPress.
  Администратор получает все. Редактор получает все посты и страницы, но не пользователей. Автор или участник
  получает только свои посты и ни одной страницы, а участник только свои черновики и посты на проверке.
- **Один поиск.** Посты лежат в том же локальном хранилище, что и сообщения, заметки и встречи других инструментов
  WireCat на том же компьютере. Сам `posts search` находит только посты, поэтому в этой строке частично.
- **Черновики и публикация.** `posts create` всегда создает черновик, из файла Markdown или из stdin. `posts publish`
  публикует сейчас или позже с `--at-time`. `posts unpublish` возвращает пост в черновики. `posts delete` отправляет
  пост в корзину, а `--allow-delete` удаляет его навсегда. Эти команды пишут посты. Страница читается из копии и
  меняется только через группу `api`.
- **Только чтение.** `WCWP_READ_ONLY=1` отклоняет любое изменение, что бы ни говорили настройки. Уровень `readonly`
  делает то же для одного ключа, например `posts` или `api`.
- **Разрешить, спросить или запретить.** У каждой команды и каждой операции API есть свой ключ, например
  `posts.publish` или `api.media-delete`, со значением `allow`, `ask`, `readonly` или `deny` в
  [настройках](./permissions.md). `mcp serve --permission` делает ключ строже только для одного сервера. Агент не может
  ослабить эти настройки.
- **Подтверждение и публикация через MCP.** Каждое изменение `posts` по умолчанию стоит на `ask`, и `ask` спрашивает в
  терминале. Через MCP некому ответить, поэтому `ask` пропускает агента, и в этой строке частично. Значит, по умолчанию
  агент через MCP может публиковать. `config set permissions.posts.publish deny` оставляет публикацию за вами, а
  черновики агент по-прежнему пишет. `runs list` показывает каждое изменение, которое сделал агент.
- **Пост поменяли на сайте.** Перед изменением `wordpress` сравнивает пост с копией. Если кто-то поменял его на сайте
  после последней синхронизации, изменение останавливается с `content.conflict`.
- **Блоки.** Галереи, колонки, встраивания и iframe не переживают перевод в Markdown. `posts update` меняет заголовок,
  отрывок, метки и статус такого поста и сохраняет его текст. Только `--replace-body` все равно записывает текст.
- **Загрузить файл.** Группа `api` показывает медиафайлы через `api media-list` и меняет их описание через
  `api media-update`. Тело запроса она принимает только в JSON, поэтому сам файл отправить не может.
- **Группа api.** `wordpress blog api` выполняет любую из 147 операций `wp/v2` WordPress 6.9.4, с теми же ключами
  публикации и удаления. Установка плагина, изменения настроек сайта, пользователей и комментариев, а также изменения
  шаблонов, виджетов, меню и навигации по умолчанию спрашивают. Пакетный маршрут WordPress никогда не предлагается,
  потому что один пакетный вызов выполнил бы изменения в обход их ключей. Создание пароля приложения тоже не
  предлагается, потому что WordPress отвечает новым паролем открытым текстом.
- **WordPress.com.** Только свой WordPress 5.7 или новее по https. Сайты на WordPress.com входят через OAuth и не
  поддерживаются. Команда называется `wordpress`, а не `wp`, поэтому она уживается с WP-CLI на одном компьютере.
- **ChatGPT или Claude в браузере.** `mcp serve --http` отдает инструмент через туннель, который вы сами настраиваете и
  держите запущенным, поэтому в этой строке частично.

## Когда другой инструмент подходит лучше

- **WP-CLI**: у вас есть доступ к оболочке на сервере, и вы управляете самим сайтом: плагинами, темами,
  пользователями, базой данных, импортом медиафайлов. Он также работает на сайте WordPress.com с платным тарифом.
- **MCP Adapter**: ваши плагины открывают возможности, которыми должен пользоваться агент, и вы хотите, чтобы
  подключение жило на сайте. Claude Code достает до него по HTTP без отдельной программы на вашем компьютере.
- **WordPress.com MCP**: ваш сайт на WordPress.com, или вам нужны ChatGPT или Claude в браузере, и запускать на
  компьютере ничего не надо.
- **mcp-wp** или **claudeus-wp-mcp**: агент должен через MCP загружать картинки, отвечать на комментарии или менять
  меню и плагины, с отдельным инструментом для каждой задачи.

Если `wordpress` подходит, начните с [установки](./installation.md). Чтобы работать с ним через агента, смотрите
[работу с инструментом](./usage.md).
