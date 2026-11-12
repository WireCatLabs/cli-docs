---
title: "Сравнение с другими инструментами"
---

<a id="features" />
<a id="when-another-tool-fits-better" />

`zm` даёт командную строку и MCP-сервер для встреч Zoom в вашем собственном аккаунте. Здесь он стоит рядом с другими
командными строками, MCP-серверами и скриптами, которые работают с аккаунтом Zoom через API Zoom, чтобы вы могли
выбрать тот, что подходит для вашей работы. Оценки для `zm` взяты из его исходного кода в `main`, проверенного
24 октября 2026 года. Оценки для остальных инструментов взяты из их собственных README и документации, проверенных
24 октября 2026 года. Ни в один инструмент не выполнялся вход, и ничего не проверялось вживую. Инструмент может делать
больше, чем говорят его страницы.

Инструменты:

- **zm**: этот инструмент. Читает и архивирует встречи вашего аккаунта Zoom, ищет по тому, что было сказано, и
  планирует встречи. К звонкам не подключается.
- **[MCP-сервер Zoom](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md)**: MCP-сервер,
  который размещает сам Zoom, с 9 инструментами, из официального репозитория
  [zoom/skills](https://github.com/zoom/skills) (обновлён 20 октября 2026 года).
- **[zoom-cli от rvben](https://github.com/rvben/zoom-cli)**: командная строка на Rust для API Zoom: встречи, записи,
  пользователи, вебинары и отчёты (обновлена 19 октября 2026 года).
- **[zoom-agent-cli](https://github.com/bcharleson/zoom-agent-cli)**: командная строка и MCP-сервер для API Zoom,
  61 команда (обновлена 8 сентября 2026 года).
- **[zoom-recording-downloader](https://github.com/ricardorodrigues-ca/zoom-recording-downloader)**: скрипт на Python,
  который скачивает облачные записи, самый популярный из этих инструментов (161 звезда, обновлён 14 августа 2026 года).
- **[@sweatco/zoom-mcp](https://github.com/sweatco/zoom-mcp)**: MCP-сервер от сообщества для расшифровок встреч и
  ИИ-сводок (обновлён 23 сентября 2026 года).

✅ да · 🟡 частично · ❌ нет · ➖ нет в документации

## Функции

| Задача | zm | [Zoom MCP](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md) | [rvben](https://github.com/rvben/zoom-cli) | [zoom-agent-cli](https://github.com/bcharleson/zoom-agent-cli) | [Downloader](https://github.com/ricardorodrigues-ca/zoom-recording-downloader) | [@sweatco](https://github.com/sweatco/zoom-mcp) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Расшифровки** | | | | | | |
| Прочитать расшифровку встречи, которую проводили вы | ✅ | [✅](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md#get_recording_resource) | [✅](https://github.com/rvben/zoom-cli#recordings) | [✅](https://github.com/bcharleson/zoom-agent-cli#recordings-and-transcripts) | ➖ | [✅](https://github.com/sweatco/zoom-mcp#available-tools) |
| Прочитать расшифровку встречи, которую проводил кто-то другой | 🟡 | ➖ | ➖ | ➖ | ➖ | [🟡](https://github.com/sweatco/zoom-mcp#zoom-api-limitations) |
| **Поиск по сказанному** | | | | | | |
| Найти слова, сказанные на встрече | ✅ | [🟡](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md#search_meetings) | ➖ | [🟡](https://github.com/bcharleson/zoom-agent-cli#recordings-and-transcripts) | ➖ | [🟡](https://github.com/sweatco/zoom-mcp#features) |
| Найти встречу по тому, о чём она была, а не по точным словам | ✅ | [✅](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md#search_meetings) | ➖ | ➖ | ➖ | ➖ |
| Найти другую форму слова на английском, русском и испанском | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Открыть точные строки за найденным местом, по ссылке, которая переживёт исправление расшифровки | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Сохранить поиск и запустить его снова позже | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Найти встречу** | | | | | | |
| Показать список встреч и найти одну по названию | ✅ | [✅](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md#search_meetings) | [✅](https://github.com/rvben/zoom-cli#meetings) | [✅](https://github.com/bcharleson/zoom-agent-cli#recordings-and-transcripts) | ➖ | [✅](https://github.com/sweatco/zoom-mcp#available-tools) |
| Найти встречи с человеком по имени или email | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Сводки** | | | | | | |
| Прочитать ИИ-сводку, которую сделал Zoom | ✅ | [✅](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md#get_meeting_assets) | ➖ | [✅](https://github.com/bcharleson/zoom-agent-cli#meetings) | ➖ | [✅](https://github.com/sweatco/zoom-mcp#available-tools) |
| Увидеть встречи с прошлой недели со следующими шагами и тем, кто сколько говорил | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Планирование встреч** | | | | | | |
| Создать встречу | ✅ | [❌](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md#current-live-tools) | [✅](https://github.com/rvben/zoom-cli#meetings) | [✅](https://github.com/bcharleson/zoom-agent-cli#meetings) | ➖ | [❌](https://github.com/sweatco/zoom-mcp#available-tools) |
| Изменить или отменить встречу | ✅ | [❌](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md#current-live-tools) | [✅](https://github.com/rvben/zoom-cli#meetings) | [✅](https://github.com/bcharleson/zoom-agent-cli#meetings) | ➖ | [❌](https://github.com/sweatco/zoom-mcp#available-tools) |
| **Архив** | | | | | | |
| Скачать облачные записи за период дат за один запуск | ✅ | [🟡](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md#recordings_list) | [🟡](https://github.com/rvben/zoom-cli#recordings) | [🟡](https://github.com/bcharleson/zoom-agent-cli#recordings) | [✅](https://github.com/ricardorodrigues-ca/zoom-recording-downloader#usage-) | ❌ |
| Проверить каждый скачанный файл и продолжить прерванную загрузку | ✅ | ➖ | ➖ | ➖ | [🟡](https://github.com/ricardorodrigues-ca/zoom-recording-downloader#command-line-arguments-) | ➖ |
| Запускать архив каждый день по таймеру | 🟡 | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Агенты и безопасность** | | | | | | |
| MCP-сервер | ✅ | [✅](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md) | ➖ | [✅](https://github.com/bcharleson/zoom-agent-cli#mcp-server) | ➖ | [✅](https://github.com/sweatco/zoom-mcp#available-tools) |
| Каждая команда инструмента также инструмент MCP | 🟡 | ➖ | ➖ | [✅](https://github.com/bcharleson/zoom-agent-cli#mcp-server) | ➖ | ➖ |
| Ограничить агента только чтением | ✅ | [🟡](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md#supported-scope-families-advertised-by-zoom-mcp) | ➖ | [🟡](https://github.com/bcharleson/zoom-agent-cli#add-scopes) | ➖ | ➖ |
| Разрешить или запретить агенту отдельные команды, для каждого профиля | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Спросить или показать заранее, прежде чем встреча изменится | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Вход хранится только в ключнице системы | ✅ | ➖ | [❌](https://github.com/rvben/zoom-cli#config-file) | [❌](https://github.com/bcharleson/zoom-agent-cli#interactive-login-local-cli) | [❌](https://github.com/ricardorodrigues-ca/zoom-recording-downloader#usage-) | [🟡](https://github.com/sweatco/zoom-mcp#privacy--data) |
| Инструкции для агентов, которые работают в терминале | ✅ | [✅](https://github.com/zoom/skills) | ➖ | ➖ | ➖ | ➖ |
| **Настройка** | | | | | | |
| Начать без создания своего приложения Zoom | ❌ | [❌](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/SKILL.md) | [❌](https://github.com/rvben/zoom-cli#config-file) | [❌](https://github.com/bcharleson/zoom-agent-cli#create-the-app) | [❌](https://github.com/ricardorodrigues-ca/zoom-recording-downloader#usage-) | [🟡](https://github.com/sweatco/zoom-mcp#quick-start-basic-setup) |
| Несколько аккаунтов Zoom | ✅ | ➖ | [✅](https://github.com/rvben/zoom-cli#config-file) | ➖ | ➖ | ➖ |

| | zm | Zoom MCP | rvben | zoom-agent-cli | Downloader | @sweatco |
|---|---|---|---|---|---|---|
| Установка | npm, Node 22.16 или новее | не нужна: его размещает Zoom | cargo, pip или файл выпуска | npm или npx | клонировать, затем pip | npx |
| Лицензия | Apache-2.0 | закрытый сервис, репозиторий навыков под MIT | MIT | MIT | MIT | MIT |

Примечания к столбцу `zm`:

- **Своё приложение Zoom.** Сейчас каждый пользователь `zm` создаёт приложение Zoom в Zoom App Marketplace или берёт
  то, которым поделился коллега. Общего приложения, которое работает без настройки, пока нет. Следуйте
  [руководству по приложению](./zoom-app.md). Приложение управляется пользователем: вы входите от своего имени, и
  приложению не нужны учётные данные администратора. README rvben, zoom-agent-cli и загрузчика вместо этого просят
  приложение Server-to-Server OAuth.
- **Встречи, которые проводил кто-то другой.** `zm` читает встречи, которые ваш аккаунт провёл или запланировал. Для
  встречи, на которой вы были только участником, получите файл расшифровки у организатора и запустите
  `meetings import`.
- **Найти встречу по тому, о чём она была.** Для этого нужна модель эмбеддингов, которую вы выбираете сами. Без неё
  поиск сопоставляет слова.
- **Сводки.** `zm` читает ИИ-сводку, которую сделал Zoom. Своей сводки он не делает.
- **Каждая команда также инструмент MCP.** `zm` отдаёт свои команды через три инструмента MCP. Несколько остаются в
  терминале: `watch`, `session start`, `meetings scheduled`, `meetings projects scan` и `upgrade`.
- **Ограничения и вопросы.** Профиль может запретить команду или разрешить только команды, которые ничего не меняют.
  Изменения встреч Zoom в терминале сначала спрашивают. Через MCP ответить некому, поэтому профиль, который не должен
  менять Zoom, задаёт `{"remote-meetings": "readonly"}`. См. [MCP и навыки](./mcp.md).
- **Ежедневный архив.** Таймер ставится только в Linux. В других системах можно посмотреть, что он сделает.
- **Скорость и стоимость по сравнению с браузерным агентом.** `zm` обращается к API Zoom и не открывает браузер.
  Измерений по сравнению с браузерным агентом не опубликовано, поэтому эта страница ничего не утверждает.

## Когда другой инструмент подходит лучше

- **MCP-сервер Zoom**: вы хотите, чтобы ИИ-приложение спрашивало Zoom о встречах, сообщениях Team Chat и Zoom Docs
  вместе, без установки.
- **rvben или zoom-agent-cli**: вы администрируете аккаунт и вам нужны пользователи, вебинары, отчёты или, с
  zoom-agent-cli, Team Chat и панель качества. `zm` этим не управляет.
- **zoom-recording-downloader**: вам нужны записи всех пользователей аккаунта Business или копия в Google Drive.
- **@sweatco/zoom-mcp**: ваша организация запустит его прокси, чтобы люди могли читать встречи, на которых были, а не
  только те, что проводили сами.

Если `zm` подходит, начните с [установки](./installation.md). Чтобы подключить агента, см. [MCP и навыки](./mcp.md).
