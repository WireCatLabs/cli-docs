---
title: "Люди и проекты"
---

Эта страница поможет ответить на вопрос «что я знаю об этом человеке?» до того, как вы ему ответите или
встретитесь с ним, и следить за компаниями, командами и проектами, к которым он относится. Memo собирает
сообщения человека, его письма и ваши заметки в один ответ, и у каждого пункта есть источник. Memo
никогда не решает, что два аккаунта принадлежат одному человеку, только потому, что совпадают имена:
связываете их вы.

## Всё о человеке

**Проще всего попросить агента.**

```text prompt
Use memo CLI to show what I know about Kai Sample on Telegram: recent messages, mail and my notes.
Tell me what is still open between us, with the source of each point.
```

**Или выполните сами:**

```sh
memo context telegram:'Kai Sample'
memo context email:kai@example.com
memo context max:'Kai Sample' --limit 50
```

Укажите человека через его аккаунт: `telegram:` или `max:` с именем или ID либо `email:` с адресом. В
ответе собрано:

- все аккаунты, которые вы связали с этим человеком;
- последнее сообщение в каждую сторону, недавние сообщения в личных чатах и группах и ваши общие чаты;
- его письма, как только адрес связан с ним;
- главная заметка о нём, заметки, которые ссылаются на него, и заметки, которые вы написали о нём в Memo;
- открытые задачи, которые касаются его или назначены ему.

Заметка, в тексте которой имя только упоминается, не включается; учитываются только ссылки
([почему](./how-it-works.md#links-between-notes-and-people)). Если какая-то часть ничего не дала, ответ
объясняет почему. `--limit` показывает больше 20 пунктов каждого вида, а `--json` передаёт ответ агенту.

Если у вас несколько аккаунтов в одном мессенджере, добавьте `--account`, например
`memo context telegram:101 --account 1`.

## Свяжите аккаунты человека

У одного человека может быть аккаунт Telegram, аккаунт MAX и адрес почты. Свяжите их в tg или max, чтобы
Memo считал их одним человеком:

```sh
tg contacts link 'Kai Sample' email:kai@example.com
```

После этого `memo context` по любому из аккаунтов показывает всё из всех них. Совпадения имени никогда не
достаточно, чтобы связать аккаунты.

Как выбрать главную заметку о человеке, см. в разделе [Главная заметка о человеке](./notes.md#the-note-about-a-person).

## Организации и проекты

Организации и проекты принадлежат вам и не привязаны к одному аккаунту мессенджера.

- **Организация** — это компания, команда, семья или сообщество.
- У **проекта** есть название, короткий ключ, например `HRB` (3 или 4 буквы и цифры), тип и,
  если хотите, организация, к которой он относится.

```sh
memo organizations add 'Synthetic Studio' --kind company
memo projects add 'Harbour' --key HRB --scope work --organization organization:1
memo projects list
memo projects context HRB
```

`--scope` принимает значение `personal` или `work`. `projects context` принимает ключ проекта или его
номер. `projects context` и `organizations context` показывают людей, связанных с проектом или
организацией, заметки о них или со ссылками на них и их теги. Ключ проекта также используется для его
задач, например `HRB-1` ([задачи](./tasks.md#tasks-in-a-project)).

## Ключевые документы проекта

**Ключевой документ** — заметка, файл или сохранённое сообщение, которое стоит прочитать первым по проекту, с краткой причиной. Отметка относится к одному проекту: один файл может быть ключевым для одного проекта и обычным для другого.

```sh
memo projects key-documents add HRB document:3 --reason 'the plan everyone follows'
memo projects key-documents add HRB msg:telegram/1/77/42 --reason 'the agreed budget'
memo projects key-documents list HRB
memo projects key-documents remove HRB document:3
```

`projects context` начинает с них: название, путь и причина. Если файл или сообщение исчезли из хранилища, отметка остаётся с `available: false` до удаления. `memo search all` и `memo search notes` с `--project HRB` ставят ключевые документы первыми, не исключая остальные; `search notes` помечает их `key`. Отметка агента ждёт подтверждения и называет агента, как отношение.

**Начинайте работу над проектом с `memo projects context <key>`** — сами или через агента.

Общий тег вроде `key` (`memo tags add key --note document:3`) не указывает проект. Перенесите его в ключевые документы через `memo projects key-documents add`, затем снимите тег через `memo tags remove key`.

## Кто к чему относится

**Связь** означает, что человек входит в организацию или работает над проектом:

```sh
memo relationships add person:PERSON_UID organization:1 --kind member-of
memo relationships add person:PERSON_UID project:1 --kind related-to --role author
memo relationships list 'about:"project:1"'
memo relationships remove 4
```

Отношения — ваши утверждения. Они не объединяют два аккаунта в одного человека. Отношение, добавленное из терминала агента, ждёт подтверждения; `provenance` называет агента (`agent:claude-code`). Подтвердите через `memo relationships confirm`; `--as-owner` сразу делает запись вашей.

Memo может предложить связи на основе почты: люди, которые пишут вам с одного и того же домена компании.

```sh
memo relationships suggest --provider email --account you@example.com
memo relationships confirm 4
```

Предложения ждут, пока вы их не подтвердите, и до этого не появляются в контексте человека.
Распространённые бесплатные почтовые домены, например Gmail, никогда не используются для предложений.

## Встречи в проекте

Если ваши встречи сохранены в локальном хранилище, встречу можно связать с проектом:

```sh
memo projects meetings link HRB 5 --provider zoom --account ACCOUNT
memo projects meetings list HRB --provider zoom --account ACCOUNT
```

Точно укажите аккаунт встречи. `confirmed:false` показывает связи, которые предложил агент; чтобы подтвердить
одну из них, повторите `link` со значением `--fingerprint` из этого списка.

## Другие названия проектов и тегов

Люди называют один и тот же проект по-разному. Вы можете дать проекту или тегу другие названия, чтобы
поиск или агент находили его по любому из них:

```sh
memo vocabulary list kind:project
memo vocabulary show 'Harbor' --kind project
memo vocabulary aliases add project:1 'Harbor' --fingerprint VALUE
```

`vocabulary list` показывает каждый проект, тег и тему с их другими названиями и проверочным значением.
Передайте это значение в `--fingerprint`, когда добавляете или удаляете название; если список за это время
изменился, Memo откажет, и вам нужно будет посмотреть снова. `memo vocabulary check 'on-boarding'`
показывает похожие существующие теги до того, как вы создадите новый, чтобы у вас не появились и
`onboarding`, и `on-boarding`.

Дальше: [напишите заметку об одном из них](./notes.md#write-your-own-notes).
