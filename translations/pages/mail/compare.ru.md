---
title: "Сравнение с другими инструментами"
---

<a id="features" />
<a id="when-another-tool-fits-better" />

`mail` — это командная строка и MCP-сервер, который копирует ваш почтовый ящик по IMAP в общее хранилище WireCat на
вашем компьютере, ищет в нём и наводит порядок в ящике на сервере. Здесь он стоит рядом с другими командными строками
и MCP-серверами для почты, чтобы вы могли выбрать подходящий для вашей работы. Оценки для `mail` взяты из его
документации и исходного кода для выпуска 0.10.0, проверенных 2 ноября 2026 года. Оценки для остальных инструментов
взяты из их собственных README и документации, проверенных 28 октября 2026 года. Вход, синхронизация и отправка
`mail` также проверены на настоящем ящике Outlook.com 2 ноября 2026 года. Больше ни в один настоящий ящик вход не
выполнялся и ничего не проверялось, а инструмент может делать больше, чем говорят его страницы.

Инструменты:

- **mail** — этот инструмент. Копирует ящик по IMAP в общее хранилище, ищет и читает письма, наводит порядок в ящике
  на сервере (флаги, перемещение, корзина, папки, черновики) и отправляет почту по SMTP.
  [memo](../memo/mail.md) ищет по той же почте вместе с вашими чатами и заметками.
- **[Himalaya](https://github.com/pimalaya/himalaya)** — командная строка на Rust для почты по IMAP, SMTP, JMAP, Gmail,
  Microsoft Graph, Maildir и mbox (v2.2.1, 2 октября 2026).
- **[mu](https://github.com/djcb/mu)** — индексирует Maildir в поисковую базу и даёт быструю командную строку поиска
  (v1.14.4, 14 октября 2026).
- **[gog](https://github.com/openclaw/gogcli)** — одна командная строка для Gmail, Календаря, Диска и другого, созданная
  для агентов, с MCP-сервером (v0.47.1, 27 октября 2026).
- **[Google Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp)** — MCP-сервер для 12 сервисов Google,
  15 его инструментов относятся к Gmail (v2.2.1, 27 октября 2026).
- **[Microsoft 365 MCP](https://github.com/Softeria/ms-365-mcp-server)** — MCP-сервер для Microsoft Graph, где почта
  Outlook — один из 300 с лишним инструментов (v0.176.0, 28 октября 2026).

[NeoMutt](https://github.com/neomutt/neomutt) в таблице нет: это почтовая программа для человека в терминале, а её
страницы мало говорят об агентах. Он назван ниже.

✅ да · 🟡 частично · ❌ нет · ➖ нет в его документации · n/a не применимо

## Функции


| Задача | mail | [Himalaya](https://github.com/pimalaya/himalaya#usage) | [mu](https://github.com/djcb/mu#readme) | [gog](https://github.com/openclaw/gogcli#readme) | [Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [Microsoft 365 MCP](https://github.com/Softeria/ms-365-mcp-server#readme) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Чтение и поиск** | | | | | | |
| Искать по отправителю, дате и словам в одном запросе | ✅ | [✅](https://github.com/pimalaya/himalaya#usage) | [✅](https://github.com/djcb/mu/blob/master/man/mu-query.7.org) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | ➖ |
| Искать на почтовом сервере письма, которых ещё нет в копии | ✅¹ | [✅](https://github.com/pimalaya/himalaya#usage) | [❌](https://github.com/djcb/mu#readme) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | ➖ |
| Прочитать всю переписку сразу | ✅ | ➖ | [✅](https://github.com/djcb/mu/blob/master/man/mu-find.1.org) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | ➖ |
| Читать и искать без интернета | ✅ | [🟡](https://github.com/pimalaya/himalaya#features) | [✅](https://github.com/djcb/mu#readme) | ➖ | ➖ | ➖ |
| Найти письмо с вложением и сохранить файл | ✅² | [✅](https://github.com/pimalaya/himalaya#usage) | [✅](https://github.com/djcb/mu/blob/master/man/mu-extract.1.org) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| **Копия** | | | | | | |
| Хранить почту в одном хранилище с чатами, встречами и заметками и искать по всему сразу | ✅³ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Порядок** | | | | | | |
| Переместить, архивировать, пометить или удалить письмо | ✅⁴ | [✅](https://github.com/pimalaya/himalaya#usage) | [✅](https://github.com/djcb/mu/blob/master/man/mu-move.1.org) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| Отменить изменение, сделанное инструментом | ✅⁴ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Создавать, переименовывать и удалять папки | ✅ | [✅](https://github.com/pimalaya/himalaya#usage) | ➖ | ➖ | ➖ | ➖ |
| Ставить на письма теги или метки | 🟡⁵ | [🟡](https://github.com/pimalaya/himalaya#usage) | [✅](https://github.com/djcb/mu/blob/master/man/mu-labels.1.org) | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://workspacemcp.com/gmail) | ➖ |
| Сортировать новую почту правилами, которые можно выгрузить и проверить | ✅ | [🟡](https://github.com/pimalaya/himalaya#features) | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| **Ответ и отправка** | | | | | | |
| Хранить черновик, не отправляя его | ✅⁶ | [✅](https://github.com/pimalaya/himalaya#usage) | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| Отправить, ответить или переслать | ✅⁷ | [✅](https://github.com/pimalaya/himalaya#features) | [🟡](https://github.com/djcb/mu#readme) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| **Ящики и провайдеры** | | | | | | |
| Любой IMAP-ящик с паролями приложений (Яндекс, iCloud, Fastmail, собственный сервер) | ✅ | [✅](https://github.com/pimalaya/himalaya#features) | [❌](https://github.com/djcb/mu#readme) | [❌](https://github.com/openclaw/gogcli#readme) | [❌](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [❌](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Gmail с его метками | ✅⁸ | [✅](https://github.com/pimalaya/himalaya#configuration) | [🟡](https://github.com/djcb/mu#readme) | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | n/a |
| Outlook и Microsoft 365 | ✅⁹ | [🟡](https://github.com/pimalaya/himalaya#outlook) | ➖ | n/a | n/a | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Использовать JMAP или Microsoft Graph вместо IMAP | ❌¹² | [✅](https://github.com/pimalaya/himalaya#features) | ➖ | n/a | n/a | n/a |
| **Агенты и безопасность** | | | | | | |
| Агент может читать почту, но не отправлять и не менять её | ✅¹⁰ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/safety-profiles.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Разрешать или запрещать агенту отдельные команды | ✅ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Показать, что заденет удаление или крупное изменение, и спросить перед выполнением | ✅¹¹ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | ➖ | ➖ |
| Сообщить агенту, что текст письма — это данные, а не указания | ✅ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | ➖ | ➖ |
| MCP-сервер | ✅ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/mcp.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| **Настройка** | | | | | | |
| Начать только с адреса, без предварительной регистрации облачного приложения | ✅⁹ | [✅](https://github.com/pimalaya/himalaya#features) | ➖ | [❌](https://github.com/openclaw/gogcli#readme) | [❌](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Войти через OAuth | ✅⁹ | [🟡](https://github.com/pimalaya/himalaya#faq) | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |

| | mail | Himalaya | mu | gog | Workspace MCP | Microsoft 365 MCP |
|---|---|---|---|---|---|---|
| Установка | npm, Node 22.16 или новее | [brew, cargo или готовый файл выпуска](https://github.com/pimalaya/himalaya#installation) | [пакет дистрибутива или сборка meson](https://github.com/djcb/mu#readme) | [brew или go install](https://github.com/openclaw/gogcli#readme) | [uvx](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [npx](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Лицензия | Apache-2.0 | Apache-2.0 | GPL-3.0 | MIT | MIT | MIT |

¹ `search messages` спрашивает и почтовый сервер (`--backend archive|server|both`, по умолчанию `both`). Gmail ищется в
«Вся почта» на собственном синтаксисе Gmail. Остальные серверы ищутся через IMAP `SEARCH` во «Входящих», «Отправленных»
и «Архиве» или в папках профиля. Найденное на сервере сохраняется, и каждый результат говорит, где он найден.
`--offline` оставляет поиск в хранилище.

² `attachments list` и `attachments download` читают файлы одного письма с сервера и сохраняют их с доступом только
для вас. `mail` также находит письма по тексту внутри вложений.

³ Хранилище общее с другими инструментами WireCat. `mail` ищет в своём ящике; [memo](../memo/mail.md) ищет по всем
ящикам вместе с чатами и заметками.

⁴ Флаги, перемещения, копирование и папки меняют ящик на сервере. Удаление переносит письма в корзину и никогда не
стирает их окончательно. `messages restore --run <id>` отменяет запуск, начиная с последнего шага, пока провайдер не
очистил корзину; `mail doctor` предупреждает, когда это близко, в Gmail. Удаление, изменение по запросу и изменение
более чем 20 писем сначала показываются как предпросмотр и выполняются только с `--yes`.

⁵ `mail` ставит на сохранённые письма и переписки ваши собственные теги. Они остаются в локальном хранилище и никогда
не попадают на сервер. Флаги и ключевые слова на сервере меняются через `messages update --flag`, а метки Gmail — через
`messages move` и `copy`.

⁶ Черновики сохраняются в собственной папке «Черновики» ящика, поэтому вы можете проверить и отправить черновик из
любой почтовой программы. Шаблонов нет. `drafts send` отправляет сохранённый черновик.

⁷ `messages send`, `messages forward` и `--reply-to` отправляют через SMTP-сервер провайдера с тем же входом. Письмо
кому-либо, кроме вас, сначала спрашивает разрешение, каждый получатель идёт в почасовой лимит (по умолчанию 30), а копия
попадает в «Отправленные» и в хранилище. `--file` отказывается брать папки с учётными данными и папки WireCat, если
владелец не передаст `--allow-any-file`.

⁸ По умолчанию `mail` входит в Gmail с паролем приложения и читает «Всю почту». Домен Google Workspace, который
отключил пароли приложений, или аккаунт без двухэтапной аутентификации входит через OAuth в приложении Google, которое
вы создаёте сами ([шаги](https://github.com/WireCatLabs/mail-cli/blob/main/docs/oauth-google.md)); собственного
приложения Google для почты у `mail` нет.

⁹ Outlook.com и Microsoft 365 принимают для IMAP и SMTP только OAuth. `mail session start` открывает браузер, вы
входите и разрешаете доступ, пароль не вводится. Приложение Microsoft от WireCat встроено, регистрировать ничего не
нужно ([шаги](https://github.com/WireCatLabs/mail-cli/blob/main/docs/outlook.md)). Вход, синхронизация и отправка
проверены на настоящем ящике Outlook.com. Рабочую учётную запись Microsoft 365 не пробовали: её администратору, возможно,
придётся разрешить приложение, а для отправки нужна включённая «Authenticated SMTP» для ящика. Для Outlook.com ещё нужно
включить IMAP в его настройках. Для Gmail через OAuth нужно собственное приложение Google.

¹⁰ Через MCP `mail` меняет ящик, только если сервер запущен с `--allow-writes`, и то лишь в рамках прав профиля. Агент
через MCP пишет только вам, пока владелец не задаст `permissions.messages.send.others`, и он не может менять почтовые
серверы, вход и этот ключ. `MAIL_READ_ONLY=1` отказывает в любом изменении.

¹¹ Удаление, удаление папки с письмами и изменение многих писем по умолчанию спрашивают, а `deny` их запрещает. Без
`--yes` они отвечают предпросмотром и командой для повтора. Через MCP отвечать на `ask` некому, поэтому `ask` позволяет
команде выполниться; `deny` по-прежнему отказывает. `--dry-run` показывает любую команду заранее.

¹² `mail` читает только IMAP: ни JMAP, ни Microsoft Graph, ни фильтров Sieve на сервере, ни PGP.

Заметки о столбце Himalaya: его оценки взяты из README и из `--help` только для чтения версии v2.2.1. Ничего не
запускалось на ящике. Собственного входа через OAuth у него нет: README говорит, что v2 «ships no OAuth flow», и отсылает
к отдельному помощнику токенов (ortie), который выдаёт токен для Outlook, Microsoft Graph и Gmail, поэтому эти оценки —
🟡. Его страницы не называют ни режима только для чтения, ни списка разрешённых команд, ни MCP-сервера. Поддержка mbox
и Maildir — это бэкенд; его страницы не называют команды, которая выгружала бы ящик в них.

Заметки о столбце `mail`:

- **Изменения.** Каждый запуск с изменениями хранит в закрытом файле то, что нужно для отмены: папку, UID, флаги, метки
  Gmail и Message-ID каждого письма, но никогда тему или тело. Каждая попытка попадает в журнал отправки.
- **Синхронизация по расписанию.** `schedule command <name> --every 5m -- sync` держит хранилище свежим по таймеру
  системы. `sync` по умолчанию читает INBOX и Sent.
- **Экспорт.** `messages export` записывает оригиналы писем, подходящих под запрос, в файлы mbox или в дерево Maildir —
  для резервной копии или для mu и notmuch.
- **Права.** Каждый профиль задаёт `allow`, `ask`, `readonly` или `deny` для каждой команды. `--permission` у
  `mcp serve` может только ужесточить профиль. См. [настройки](./configuration.md#permissions).
- **Скорость и стоимость по сравнению с браузерным агентом.** `mail` читает почтовый сервер по IMAP и не открывает
  браузер. Измерений против браузерного агента не опубликовано, поэтому страница ничего об этом не утверждает.

## Когда другой инструмент подходит лучше

- **Himalaya**: вы пользуетесь провайдером не по IMAP, например JMAP или Microsoft Graph, либо вам нужны фильтры Sieve
  на сервере.
- **gog**: вы пользуетесь только Gmail и хотите команды, вшитые при сборке, чтобы агент не мог их расширить, либо вам
  нужны его команды Календаря и Диска рядом с Gmail.
- **Microsoft 365 MCP**: ваша организация отключила для вашего ящика IMAP или Authenticated SMTP, либо вам нужен
  Microsoft Graph помимо почты. `mail` работает с Outlook и Microsoft 365 только по IMAP и SMTP.
- **mu**: у вас уже есть Maildir, и вам нужен быстрый поиск по нему с вложениями и цепочками.

Если `mail` подходит, начните с [установки](./installation.md). Чтобы подключить агента, см. [использование](./usage.md).
