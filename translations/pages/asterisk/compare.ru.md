---
title: "Сравнение с другими инструментами"
---

<a id="features" />
<a id="when-another-tool-fits-better" />

`asterisk` дает командную строку и MCP-сервер, которые копируют звонки АТС Asterisk на ваш компьютер, расшифровывают
их аудиозаписи там же и дают их прочитать вашему ИИ-агенту. Здесь он стоит рядом с другими инструментами, которыми
читают, расшифровывают и ищут звонки Asterisk или FreePBX, чтобы вы могли выбрать тот, что подходит для вашей задачи.
Оценки для `asterisk` взяты из его исходного кода, проверенного 13 ноября 2026 года. Оценки для остальных
инструментов взяты из их собственных README и документации, проверенных 13 ноября 2026 года. Для этой страницы ни один
инструмент не подключался к живой АТС. Инструмент может делать больше, чем сказано на его страницах.

Инструменты:

- **asterisk**: этот инструмент. Читает записи о звонках и аудиозаписи любой АТС Asterisk, расшифровывает их на вашем
  компьютере и отдает звонки агенту. Он только читает и никогда не меняет АТС.
- **[Собственные инструменты FreePBX](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe)**: страница CDR Reports в админке FreePBX, GraphQL API для CDR и Scribe,
  платный модуль FreePBX от Sangoma, который расшифровывает аудиозаписи и делает по ним краткое содержание.
- **[Frogman](https://github.com/mwtcmi/frogman)**: модуль FreePBX с MCP-сервером, HTTP API и командной строкой, 257
  инструментов, которые читают и меняют АТС (34 звезды, обновлялся 11 сентября 2026 года).
- **[asterisk-ai-call-notes](https://github.com/taka-1128/asterisk-ai-call-notes)**: программа на Python, которая
  расшифровывает каждую новую аудиозапись и пишет к ней краткое содержание, следующий шаг и метку (обновлялась
  18 сентября 2026 года).

✅ да · 🟡 частично · ❌ нет · ➖ нет в документации

## Функции

| Задача | asterisk | [FreePBX](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | [Frogman](https://github.com/mwtcmi/frogman) | [ai-call-notes](https://github.com/taka-1128/asterisk-ai-call-notes) |
|---|:-:|:-:|:-:|:-:|
| **Найти звонки** | | | | |
| Список звонков за период | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26083384/PBX+GUI+-+CDR+Module+GraphQL+APIs) | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L155) | [❌](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L20) |
| Все звонки с одним номером | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26542152/PBX+GUI+-+CDR+Reports+Module) | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L187) | [❌](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L20) |
| Статистика звонков: самые загруженные внутренние номера, часы пик, несостоявшиеся звонки | ❌ | ➖ | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L438) | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L103) |
| Один и тот же человек в звонках, чатах, почте и CRM | ✅ | ➖ | ➖ | ➖ |
| **Аудиозаписи и расшифровки** | | | | |
| Найти аудиозапись звонка | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26083384/PBX+GUI+-+CDR+Module+GraphQL+APIs) | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L187) | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L73) |
| Прослушать аудиозапись по ссылке | ❌ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L187) | ➖ |
| Расшифровать записанные звонки в текст | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [✅](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L6) |
| Аудиозаписи не покидают ваших компьютеров | ✅ | [❌](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L75) |
| Расшифровать уже накопленные аудиозаписи за один запуск | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L39) |
| Краткое содержание каждого звонка | ❌ | [🟡](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [✅](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L6) |
| Поиск по тому, что было сказано | 🟡 | [🟡](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L10) |
| Отметить звонки, где звучат выбранные вами слова | ❌ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L8) |
| Сохранить расшифровку в файл | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | ➖ | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L20) |
| **Агенты и безопасность** | | | | |
| ИИ-приложение читает звонки через MCP | ✅ | ➖ | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L549) | ➖ |
| Агент с терминалом запускает его сам, с выводом в JSON и навыком | ✅ | ➖ | [🟡](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L465) | ➖ |
| Агент читает звонки, но никогда не меняет АТС | ✅ | [🟡](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26050564/PBX+GUI+-+API+Access+Tokens) | [🟡](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L113) | ➖ |
| Разрешить или запретить агенту отдельные команды | ✅ | [🟡](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26050564/PBX+GUI+-+API+Access+Tokens) | [🟡](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L412) | ➖ |
| Текст звонка доходит до агента как данные, а не как инструкции | ✅ | ➖ | ➖ | ➖ |
| Запись того, что запускал агент | 🟡 | [🟡](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26050564/PBX+GUI+-+API+Access+Tokens) | [✅](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L114) | ➖ |
| Агенту не нужен вход под root на АТС | ✅ | [✅](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26050564/PBX+GUI+-+API+Access+Tokens) | [🟡](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L562) | ➖ |
| **Установка** | | | | |
| Работает с Asterisk без FreePBX | ✅ | [❌](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/26542152/PBX+GUI+-+CDR+Reports+Module) | [❌](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L13) | [✅](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L3) |
| Ничего не нужно ставить на АТС | ✅ | [🟡](https://sangomakb.atlassian.net/wiki/spaces/PG/pages/488898594/PBX+GUI+-+Scribe) | [❌](https://github.com/mwtcmi/frogman/blob/357b9ce/README.md?plain=1#L22) | [🟡](https://github.com/taka-1128/asterisk-ai-call-notes/blob/8f35284/README.md?plain=1#L77) |

| | asterisk | FreePBX | Frogman | ai-call-notes |
|---|---|---|---|---|
| Установка | npm, Node 22.16 или новее | встроен в FreePBX, Scribe через Module Admin | модуль FreePBX | клонировать, затем Python |
| Лицензия | Apache-2.0 | для Scribe нужна платная лицензия | AGPL-3.0 | MIT |
| Распознавание речи | модель на вашем компьютере | Deepgram, партнер Sangoma | Scribe, только для голосовой почты | faster-whisper на вашем сервере или OpenAI |

Пояснения к оценкам:

- **Поиск по тому, что было сказано.** У `asterisk` нет своей команды поиска. Звонки лежат в хранилище WireCat,
  поэтому `memo` и поиск других инструментов WireCat находят их рядом с вашими чатами и почтой. FreePBX ищет
  расшифровки по меткам, которые вы настроили. ai-call-notes пишет текст в таблицу SQLite, а поиск оставляет вам.
- **Краткое содержание.** `asterisk` сам его не делает. Ваш агент читает расшифровку и пишет его. Scribe делает
  краткое содержание только на английском. ai-call-notes отправляет текст расшифровки в Anthropic или OpenAI.
- **Аудиозаписи остаются у вас.** `asterisk` распознает речь на вашем компьютере. Scribe отправляет аудиозаписи в
  Deepgram. ai-call-notes оставляет звук на вашем сервере с faster-whisper, а текст отправляет облачной модели.
- **Расшифровать то, что уже есть.** Scribe Rewind расшифровывает выбранные прошлые аудиозаписи. ai-call-notes берет
  по одному файлу через свой параметр для файла или следит за папкой.
- **Агент может только читать.** `asterisk` открывает базу CDR в сеансе только для чтения, а файлы только для
  чтения, и у него нет команды, которая пишет в АТС. Токен доступа FreePBX ограничен тем, что выдано его приложению.
  Frogman дает каждому пользователю уровень прав и спрашивает подтверждение перед изменением.
- **Отдельные команды.** В `asterisk` каждой команде в профиле можно задать allow, ask, readonly или deny. Через MCP
  отвечать некому, поэтому ask пропускает команду. См. [настройки](./configuration.md#permissions).
- **Запись того, что запускалось.** `asterisk` хранит неудачные запуски, а синхронизацию или расшифровку, если вы
  попросите. Frogman ведет журнал аудита каждого вызова инструмента. FreePBX показывает, когда и откуда последний раз
  использовался каждый токен.
- **Вход под root.** MCP-настройка Frogman подключается к АТС по SSH под root. `asterisk` работает на вашем
  компьютере, и ему нужен пользователь базы только для чтения или папка, подключенная только для чтения.
- **Установка на АТС.** Для `asterisk` на АТС ничего ставить не нужно. CDR Reports входит в FreePBX, а Scribe
  ставится туда модулем. ai-call-notes работает там, где может читать папку с аудиозаписями, часто на самой АТС.
- **Статистика звонков.** ai-call-notes считает долю сброшенных звонков, причины отбоя по часам и итоги звонков
  только для VICIdial, в своем отчете о проверке системы.
- **Аудиозапись по ссылке.** `asterisk` связывает звонок с файлом аудиозаписи по пути и не отдает его потоком.

## Когда другой инструмент подходит лучше

- **FreePBX со Scribe**: у вас FreePBX, вам нужны краткое содержание, тональность и метки в пользовательском портале
  и в приложении для телефона, и отправлять аудиозаписи в облачный сервис можно.
- **Frogman**: вы хотите, чтобы агент менял АТС (внутренние номера, группы вызова, маршруты, текущие звонки), а не
  только читал звонки. Статистику звонков он тоже уже показывает.
- **asterisk-ai-call-notes**: исходящему колл-центру нужны краткое содержание, следующий шаг и время перезвона рядом
  с каждым звонком сразу после его окончания.

Если `asterisk` подходит, начните с [установки](./installation.md), затем [подключите Asterisk](./asterisk.md).
