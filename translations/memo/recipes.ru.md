---
title: "Рецепты"
---

На этой странице собраны готовые задачи для ИИ-агента. Используйте их, когда в Memo уже есть ваши
заметки, почта или сообщения. Скопируйте запрос агенту и замените имена и темы своими. Каждая задача
заканчивается результатом, который можно проверить: источниками, которые можно открыть, или списком,
который ждёт вашего решения. Ни одна из них не отправляет сообщения и не меняет ваши файлы.

## Подготовка к встрече с человеком

```text prompt
Use memo CLI to prepare me for a meeting with Kai Sample tomorrow.
Show our recent messages and mail, my notes about Kai and the open tasks between us.
Give me three points to raise, each with its source.
```

Агент запускает `memo context` для этого человека и читает источники. Сверьте пункты с источниками,
которые он показывает. Если какая-то часть пуста, возможно, чаты не загружены или аккаунты не связаны
([люди](./people.md)).

Если у вас есть архивные встречи той же регулярной серии, попросите агента включить их:

```text prompt
Prepare for my next Harbour meeting. Find the exact meeting series in my selected Zoom account,
then gather its archived discussions, linked people and projects, notes and open tasks.
Also search the stored messages in my personal Telegram profile for Harbour over the last month.
Suggest an agenda with sources. Separate proposals from agreed actions and say what history is missing.
Do not claim that a future time is verified from the local archive.
```

Агент использует `memo meetings prepare <series-id> --source <provider>:<account>` с точным ID серии у провайдера,
который может показать список встреч Zoom. Это не локальный номер встречи. Команда читает только сохранённую
историю: ей не нужно новое разрешение Zoom, и календарь она не проверяет. Чтобы проверить будущую встречу,
используйте календарь провайдера. У незаархивированной серии всё равно может быть выбранный контекст сообщений,
но недостающие расшифровки Memo придумать не может.

Сообщения и почта включаются, только если их выбрали. `--context-source tg.personal` означает сохранённый
профиль `personal` у `tg`; `max.personal` работает так же. `email.work` означает почтовый ящик `work`
в настройках почты Memo. Профиль или ящик уже должен быть сохранён. Повторите флаг для восьми аккаунтов
максимум и укажите `--context-query Harbour`. Должно совпасть каждое буквальное слово; `OR` не объединяет
псевдонимы. Для других названий используйте отдельные запросы. Этот выбор не включает файловые заметки и
документы; читайте их отдельно через [контекст проекта](./people.md#organizations-and-projects) и [поиск](./search.md).

Для фиксированного периода передайте метки времени с часовым поясом через `--context-since-time` и
`--context-before-time` (его граница не входит в период). По умолчанию берутся четырнадцать дней до начала
подготовки; окно переписки не может быть больше девяноста дней. `--history-since-time` отдельно задаёт более
ранние встречи. Добавьте `--json`, чтобы получить доказательства с цитатами, связанный контекст и покрытие.
Каждый источник переписки сообщает состояние своего индекса и, когда возможно, `next_cursor`; продолжайте с
`--context-source tg.personal=<cursor>`, тем же запросом и тем же явным окном. Если `restart_required` равно true,
увеличьте `--bytes` и начните заново; не считайте, что показанные отрывки охватывают все совпадения. Подготовка
ничего не принимает и никому не назначает.

## Проверить решения и поручения со встречи

Используйте это, когда расшифровки ваших встреч заархивированы. Агент может прочитать данные в Memo, предложить,
что важно, и оставить результат на ваше решение:

```text prompt
Review the recent Harbour meetings in my selected Zoom account. Look up the project's existing
aliases and tags first. Search the stored transcripts and read the surrounding passages.
Show observed attendees separately from people merely mentioned. Propose decisions, key statements
and follow-up tasks, citing each exact passage. Leave unknown dates and assignees blank, distinguish
explicit commitments from inferred tasks, and leave everything proposed for my review.
```

Список участников агент берёт из архивных метаданных встречи через `zm meetings show`; одних меток говорящих в
расшифровке для списка присутствующих недостаточно. Агент использует `memo search meetings` и
`memo meetings passage`, затем готовит пакет командой `memo meetings actions add` со ссылками на реплики и
отпечатками. Это создаёт предложение на проверку, а не сразу принятые факты или задачи. Подтверждённые связи
встреч с проектами должны уже существовать для выводов по проекту. Если их нет, агент должен показать возможные
связи на проверку. Используйте существующие теги, а не создавайте синонимы; `memo vocabulary check` может
подсказать похожие названия, но сходство не доказывает, что два тега означают одно и то же.

Просмотрите пакет командами `memo meetings actions list status:proposed` и `memo meetings actions show`.
Сверьте каждое утверждение с источником, прежде чем подтверждать выбранные идентификаторы выводов с текущим
отпечатком пакета. Подтвердить или отклонить пакет выводов по встрече можете только вы; агент не может утвердить
собственную работу. Принятые задачи получают нумерованные ключи проекта. Повтор пакета с тем же ключом повторяет
попытку без дубликата предложения; изменение содержимого требует нового ключа.

Для подготовки попросите агента объединить прежние фрагменты встреч с принятыми фактами и открытыми задачами
проекта (`memo projects context`) и сообщениями, почтой и заметками участников (`memo context`). `memo meetings prepare`
собирает ограниченную сохранённую историю серии и связанный контекст; он не находит предстоящее событие
календаря и не определяет участие в проекте. Ответ должен показывать свои
источники и недостающую историю, прежде чем предлагать повестку.

Если фрагментов нет, проверьте выбранный аккаунт и полноту архива, затем попробуйте псевдонимы проекта без
фильтра по проекту. Границы объясняет [поиск по встречам](./search.md#search-stored-meetings).

## Где было принято решение

```text prompt
Use memo CLI to find where we decided the launch date for the Harbour project.
Search my notes, mail and messages. Quote the text and show the source of each result.
If you find nothing, tell me what you searched.
```

Агент использует `memo search all`, а при необходимости — поиск по одному виду источников. Пустой
ответ означает только то, что в локальном хранилище нет совпадений ([поиск](./search.md)).

## Превратить просьбы в задачи

```text prompt
Use memo CLI to find messages and emails from the last week where someone asked me to do something.
List them with their sources. Create a task only for the ones I choose.
```

Агент ищет, показывает вам просьбы и запускает `memo tasks add` для тех, которые вы выберете. Ваши
задачи покажет `memo tasks list` ([задачи](./tasks.md)).

## Собрать заметки проекта вместе

```text prompt
Use memo CLI to find my notes, emails and messages about the Harbour project.
Tag the ones I confirm with harbour, then show everything tagged harbour.
```

После этого `memo search all 'tag:harbour'` находит их, а тег на папке действует и на новые заметки
([теги](./tags.md)).

## Запомнить предпочтение вместе с источником

```text prompt
Use memo CLI to find what Kai Sample said about meeting times.
Show me the memory you would save and the message it is based on.
Save it with the message as evidence only after I agree.
```

Запись памяти, добавленная командой `memo`, подтверждается сразу. Поэтому в запросе агента просят
сначала показать её. Позже, когда запись перестанет быть верной, отметьте её командой
`memo memories stale` ([память](./memories.md)).

## Записать решение из чата

```text prompt
Use memo CLI to find the decision about the venue in the Harbour chat.
Show me the decision and the message first. After I agree, record it as a decision fact
with the message as evidence, in the Harbour project.
```

Факт, добавленный командой `memo`, принимается сразу. Поэтому в запросе агента просят сначала
показать его. Если решение заменяет более раннее, попросите агента отметить это с помощью
`--supersedes`.

## Обзор за неделю

```text prompt
Use memo CLI to give me a weekly review: open tasks by project, tasks that are ready to start,
and the memories, facts and actions waiting for my review. Do not approve or confirm anything.
```

Агент объединяет `memo tasks list`, `memo tasks list project:HRB ready:true` и списки на проверку со страницы
[Память и факты](./memories.md). Решение по каждому пункту принимайте сами.

## Записать сводку в папку с заметками

```text prompt
Use memo CLI to write a short note about the Harbour project that summarises what I know,
with the sources it is based on. Show me the note, then export it to my vault.
```

Агент пишет заметку командой `memo notes add --subject project:…` и экспортирует её командой
`memo notes export` ([заметки](./notes.md#save-your-notes-as-files)). Memo никогда не перезаписывает
файл, который вы изменили.

## Спросить только по источникам

```text prompt
Use memo CLI to collect the sources about the Harbour budget with memo ask, using the key words
"Harbour budget". Answer only from those sources and cite each one.
```

`memo ask` собирает источники, а отвечает агент. Memo ничего не отправляет провайдеру ИИ, если вы его
не настроили и не разрешили это ([поиск](./search.md#give-your-agent-the-sources)).

## Запуск по расписанию

В Linux `memo auto start` поддерживает ваши заметки и почту в актуальном состоянии. Чтобы выполнять рецепт
каждое утро, используйте собственное расписание агента или планировщик на компьютере, который запускает
агента с этим запросом.
