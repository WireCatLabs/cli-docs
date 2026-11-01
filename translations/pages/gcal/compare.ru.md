---
title: "Сравнение с другими инструментами"
---

<a id="features" />
<a id="when-another-tool-fits-better" />

`gcal` — это командная строка и MCP-сервер для Google Календаря вашего собственного аккаунта. Здесь он стоит рядом с
другими командными строками, MCP-серверами и коннекторами ассистентов, которые читают Google Календарь, чтобы вы
могли выбрать тот, что подходит для вашей работы. Оценки для `gcal` взяты из его выпуска 0.12.0, его команд и
исходного кода, проверенных 2 ноября 2026 года; они проверяются заново при каждом выпуске. Оценки для остальных
инструментов взяты из их собственных README, документации и исходного кода, проверенных 27 октября 2026 года. Ни в
один инструмент не выполнялся вход, и ничего не проверялось вживую; инструмент может делать больше, чем говорят его
страницы.

Инструменты:

- **gcal** — этот инструмент. Хранит копию выбранных вами календарей на вашем компьютере, ищет в ней без интернета
  и связывает участников с людьми, которых вы знаете по другим инструментам WireCat. Входит только на чтение; после
  того как вы разрешите запись, он также добавляет, меняет, переносит и удаляет события и отвечает на приглашения.
- **[gcalcli](https://github.com/insanum/gcalcli)** — классическая командная строка для Google Календаря на Python:
  повестка дня, недельный и месячный вид, поиск, добавление и правка (3 778 звёзд, последний выпуск 4 октября 2024 года).
- **[gog](https://github.com/openclaw/gogcli)** — командная строка на Go для всего Google Workspace, сделанная для
  агентов, с 30 командами календаря (8 535 звёзд, выпуск 23 октября 2026 года).
- **[Google Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp)** — MCP-сервер на Python для 12
  сервисов Google, 7 его инструментов — для Календаря (3 417 звёзд, выпуск 23 октября 2026 года).
- **[google-calendar-mcp](https://github.com/nspady/google-calendar-mcp)** — самый популярный MCP-сервер только для
  Google Календаря, 13 инструментов (1 206 звёзд, выпуск 28 сентября 2026 года).
- **[Коннектор Google Календаря в Claude](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)** —
  встроен в Claude; ничего устанавливать не нужно.

✅ да · 🟡 частично · ❌ нет · ➖ нет в документации · n/a неприменимо

## Функции

| Задача | gcal | [gcalcli](https://github.com/insanum/gcalcli) | [gog](https://github.com/openclaw/gogcli) | [Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp) | [google-calendar-mcp](https://github.com/nspady/google-calendar-mcp) | [Claude](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Ваш день и неделя** | | | | | | |
| Встречи на сегодня или на неделю одной командой | ✅ | [✅](https://github.com/insanum/gcalcli/blob/main/gcalcli/argparsers.py) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-calendar-events.md) | [🟡](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/gcalendar/calendar_tools.py) | [🟡](https://github.com/nspady/google-calendar-mcp/blob/main/src/tools/registry.ts) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| Даты словами, например «завтра в 15:00» или «в следующую пятницу» | 🟡 | [✅](https://github.com/insanum/gcalcli/blob/main/gcalcli/utils.py) | [🟡](https://github.com/openclaw/gogcli/blob/main/docs/dates.md) | [❌](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/gcalendar/calendar_tools.py) | n/a | n/a |
| Встречи из всех ваших календарей и аккаунтов в одном списке | ✅ | [🟡](https://github.com/insanum/gcalcli#readme) | [🟡](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-calendar-events.md) | ➖ | [✅](https://github.com/nspady/google-calendar-mcp#readme) | ➖ |
| Что изменилось с какой-то даты: новые, перенесённые и отменённые встречи | ✅ | [✅](https://github.com/insanum/gcalcli/blob/main/gcalcli/argparsers.py) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands.generated.md) | ➖ | ➖ | ➖ |
| Найти встречи, которые пересекаются | ✅ | [✅](https://github.com/insanum/gcalcli/blob/main/gcalcli/argparsers.py) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands.generated.md) | ➖ | [✅](https://github.com/nspady/google-calendar-mcp#readme) | ➖ |
| Убрать из списка дни рождения, время для сосредоточенной работы и блоки места работы | ✅ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-calendar-events.md) | ➖ | ➖ | ➖ |
| **Найти встречу** | | | | | | |
| Найти встречу по смыслу, а не по точным словам | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Искать по встречам без интернета | ✅ | [❌](https://github.com/insanum/gcalcli/blob/main/gcalcli/gcal.py) | [❌](https://github.com/openclaw/gogcli/blob/main/docs/paths.md) | [❌](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/gcalendar/calendar_tools.py) | [❌](https://github.com/nspady/google-calendar-mcp/blob/main/src/handlers/core/SearchEventsHandler.ts) | [❌](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| Один поиск по встречам, чатам, почте и заметкам | 🟡 | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Люди** | | | | | | |
| Узнать, что участник — это человек, с которым вы переписываетесь в Telegram, WhatsApp или почте | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Подготовиться к следующей встрече: кто придёт, что вы обсуждали в прошлый раз, связанные документы | ✅ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/agent-skills.md) | ➖ | ➖ | ➖ |
| Узнать, когда люди свободны | ✅ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands.generated.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/core/tool_tiers.yaml) | [✅](https://github.com/nspady/google-calendar-mcp/blob/main/src/tools/registry.ts) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| **Изменить календарь** | | | | | | |
| Добавить встречу | ✅ | [✅](https://github.com/insanum/gcalcli/blob/main/gcalcli/argparsers.py) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands.generated.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/core/tool_tiers.yaml) | [✅](https://github.com/nspady/google-calendar-mcp/blob/main/src/tools/registry.ts) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| Принять или отклонить приглашение | ✅ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands.generated.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/gcalendar/calendar_tools.py) | [✅](https://github.com/nspady/google-calendar-mcp/blob/main/src/tools/registry.ts) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| Выгрузить встречи в файл .ics и загрузить такой файл | ✅ | [🟡](https://github.com/insanum/gcalcli/blob/main/gcalcli/argparsers.py) | ➖ | ➖ | ➖ | ➖ |
| **Агенты и безопасность** | | | | | | |
| MCP-сервер | ✅ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/mcp.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/nspady/google-calendar-mcp#readme) | n/a |
| Каждая команда календаря доступна и как инструмент MCP | ✅ | n/a | [❌](https://github.com/openclaw/gogcli/blob/main/docs/mcp.md) | [🟡](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/core/tool_tiers.yaml) | [✅](https://github.com/nspady/google-calendar-mcp/blob/main/src/tools/registry.ts) | n/a |
| Агент не может менять ваш календарь, пока вы это не разрешите | ✅ | n/a | [✅](https://github.com/openclaw/gogcli/blob/main/docs/mcp.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [🟡](https://github.com/nspady/google-calendar-mcp#readme) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| Аккаунт вы называете каждый раз; инструмент никогда не выбирает его за вас | ✅ | ➖ | [❌](https://github.com/openclaw/gogcli#readme) | ➖ | [❌](https://github.com/nspady/google-calendar-mcp#readme) | n/a |
| Текст из приглашения помечен для агента как данные, а не указания | ✅ | n/a | [✅](https://github.com/openclaw/gogcli#readme) | ➖ | ➖ | ➖ |
| Инструкции для агентов, работающих в терминале | ✅ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/agent-skills.md) | ➖ | ➖ | n/a |
| **Подготовка** | | | | | | |
| Начать без собственного проекта Google Cloud | ❌ | [❌](https://github.com/insanum/gcalcli#initial-setup) | [❌](https://github.com/openclaw/gogcli#readme) | [❌](https://github.com/taylorwilsdon/google_workspace_mcp#quick-start) | [❌](https://github.com/nspady/google-calendar-mcp#google-cloud-setup) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| Работает из claude.ai в браузере и на телефоне | 🟡 | [❌](https://github.com/insanum/gcalcli#readme) | [❌](https://github.com/openclaw/gogcli/blob/main/docs/mcp.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [🟡](https://github.com/nspady/google-calendar-mcp#readme) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |

| | gcal | gcalcli | gog | Workspace MCP | google-calendar-mcp | Claude |
|---|---|---|---|---|---|---|
| Установить | npm, Node 22.16+ или 24+ | apt, brew или pip | brew или `go install` | `uvx workspace-mcp` | `npx @cocal/google-calendar-mcp` | не нужно: встроен в Claude |
| Лицензия | Apache-2.0 | MIT | MIT | MIT | MIT | закрытый сервис |

Пояснения к столбцу `gcal`:

- **Только чтение, пока вы не разрешите больше.** `gcal session start` просит у Google доступ только на чтение. С
  `--grant write` он также добавляет, меняет, переносит и удаляет события и отвечает на приглашения (`events create`,
  `update`, `move`, `delete`, `respond`), а также импортирует файл `.ics` (`events import`).
  `events create --text "Lunch with Ana tomorrow 1pm"` передаёт одну строку в быстрое добавление Google, которое само
  находит в ней день, время и место. В повторяющемся событии изменение или удаление касается одного повторения,
  всей серии или этого и всех следующих повторений (`--following`). `events move --to-calendar` переносит событие,
  сохраняя его id, в другой календарь того же аккаунта. `--grant sharing` добавляет управление тем, кто видит календарь.
- **Что изменилось.** `events list changed_at>=<date>` показывает встречи, которые впервые сохранились, были
  перенесены или отменены с этой даты, и для каждой перенесённой — её прежнее время. Он читает копию на вашем
  компьютере, поэтому видит то, что принесли синхронизации.
- **Встречи, которые пересекаются.** `events list overlapping:true` оставляет встречи, время которых пересекается с
  другой встречей, и у каждой называет те, с которыми она пересекается. Встреча учитывается, только если занимает ваше
  время: у неё есть время начала и конца, и она не отменена, не отклонена, не отмечена как «свободен» и не является
  блоком места работы. События на весь день и встречи встык никогда не пересекаются. С `--source all` встречи
  сравниваются между вашими аккаунтами Google, так что рабочая встреча, которая совпала с личной, найдётся.
- **Ваше собственное приложение Google.** Сейчас каждый пользователь `gcal` создаёт проект Google Cloud и клиент OAuth
  и передаёт `gcal` файл клиента при входе. [Создайте своё приложение Google](./installation.md#make-your-own-google-app)
  шаг за шагом проводит по Google Cloud Console.
- **Даты словами.** `events list` принимает в условиях по полям дату или время, например
  `ends_at>=today starts_at<=2026-11-06`, слова `today` и `yesterday` и отрезки в прошлое вроде `7d`. «Неделю» и
  «следующую пятницу» он не понимает, и так задумано: даты пишет агент, а точную дату нельзя прочитать неверно.
  Слова принимает только `events create --text`, и читает их Google, а не `gcal`.
- **Подготовка к встрече.** `events prepare` берёт вашу следующую встречу или ту, которую вы назвали, и выдаёт её
  участников с их ответами, её файлы Drive и ваши прошлые события с каждым участником. Ваши последние сообщения и
  письма с каждым приходят из других инструментов WireCat на том же компьютере, например `tg` или `mail`; с одним
  `gcal` эти списки пусты. Команда читает только локальное хранилище и не пишет сводки: навык и
  `gcal guide prepare-meeting` показывают агенту, как написать справку, а `gcal guide digest` — ежедневную или
  еженедельную сводку.
- **Дни рождения и прочий шум.** `events list -event_type:birthday -event_type:working-location` убирает эти виды
  событий, а `event_type:default` оставляет только обычные.
- **Файлы iCalendar.** `events export <query> --output week.ics` записывает в файл `.ics` события, которые показал бы
  список. `events import <calendar> <file.ics>` добавляет события из файла через Google, никому не пишет и сначала
  спрашивает.
- **Все календари.** Один список охватывает календари, которые вы выбрали для синхронизации в одном профиле. Каждый
  аккаунт Google — отдельный профиль; `events list --source all` читает все аккаунты одним списком, называет их в
  `meta.accounts` и сообщает, если синхронизация какого-то из них не закончилась. `calendar:Team` называет один
  календарь по названию.
- **Поиск по смыслу.** Для него нужна модель, которую вы скачиваете один раз. Без неё поиск находит слова и их другие
  формы.
- **Один поиск по всему.** Встречи попадают в хранилище, общее для других инструментов WireCat. `search all` в других
  инструментах WireCat, например в `tg`, читает их рядом с чатами, почтой и заметками. Сам `gcal search events` находит
  только встречи.
- **Когда люди свободны.** `calendars busy` спрашивает у Google, когда заняты ваши календари и другие люди, а с
  `--duration-minutes` выдаёт общие для всех свободные промежутки в рабочее время.
- **Агент не может менять ваш календарь, пока вы это не разрешите.** Без `--grant write` ограничением служит сам
  вход. После него добавление, изменение, перенос и ответы на приглашения выполняются без вопроса; удаление и
  импорт в терминале сначала спрашивают. Через MCP спросить некого, поэтому агент также удаляет и импортирует
  события, а с
  `--grant sharing` открывает доступ к календарю без вопроса. Рассылка писем участникам, удаление всей серии,
  удаление целого календаря и передача его другому аккаунту запрещены, пока вы их не разрешите. Чтобы получать
  вопрос или запретить запись, задайте разрешениям профиля `ask`,
  `deny` или `readonly` (например, `permissions.events.create ask` или `permissions.api.calendar.acl deny`) либо
  запустите сервер с `mcp serve --permission`, чтобы ужесточить один ключ только для этого сервера.
- **Текст из приглашений.** Приглашение может прислать кто угодно, поэтому его название, заметки и место — чужие
  слова. Каждый ответ с событиями перечисляет эти поля в `untrusted`, а MCP-сервер и инструкции для агента говорят
  агенту, что это данные, а не указания. Сам текст не меняется.
- **Коды доступа.** Коды доступа, PIN-коды и пароли удаляются из каждого ответа, включая прямые команды `gcal api`:
  ссылка теряет строку запроса, а строка заметок, где назван код, отбрасывается.
- **Каждая команда — инструмент MCP.** Через три инструмента MCP: `gcal_tools_search`, `gcal_read` и `gcal_write`.
  Две команды оставлены вам в терминале: `api call` и очистка календаря (`calendars.clear`).
- **claude.ai в браузере.** `mcp serve --http` отдаёт инструмент Claude и ChatGPT в браузере через туннель, который вы
  настраиваете сами, например Tailscale Funnel.
- **Скорость и стоимость по сравнению с браузерным агентом.** `gcal` обращается к API Google и читает свою копию;
  браузер он не открывает. Измерений по сравнению с браузерным агентом не опубликовано, поэтому эта страница ничего
  не утверждает.

## Когда другой инструмент подходит лучше

- **gog** — вы работаете со всем Google Workspace из одной командной строки, а не только с календарём.
- **Коннектор Claude** — вам нужна помощь с календарём в Claude в браузере или на телефоне, без установки и без
  проекта Google Cloud.
- **Google Workspace MCP** — вам нужен один MCP-сервер для целой команды в Google Workspace, доступный по HTTP.
- **gcalcli** — вам нужна сетка календаря в терминале, например на неделю или на месяц.

Если `gcal` подходит, начните с [установки](./installation.md). Чтобы работать с ним через агента, см.
[работу с инструментом](./usage.md).
