---
title: "Разрешения"
---

Пусть ИИ-агент работает в вашей CRM HubSpot через `hubspot`, а решение о том, что он меняет, остается за вами. Ключ
несет scope, которые вы дали ему в HubSpot, на весь аккаунт, поэтому без ваших собственных ограничений агент мог бы
изменить любую сделку, контакт или компанию, до которых дотягиваются эти scope.

Для каждого профиля, то есть имени, которое вы дали входу в один аккаунт, вы решаете, что агент может только читать,
что сначала спрашивает вас и что выполняется сразу. Вы можете запретить агенту удалять сделки или обращаться к API
HubSpot напрямую и знаете, какие проверки действуют, что бы ни говорили настройки.

У каждой команды есть ключ разрешения, ее имя, например `deals.move`, или группа, например `deals`, и более длинный
ключ побеждает. У каждой операции API HubSpot ключ тоже есть, `api.` и ее команда, например `api.deals-search`, а
`api` покрывает их все. У каждого ключа есть уровень: `deny`, `readonly`, `ask` или `allow`. Уровни задаются через
`hubspot work config set`, а `--dry-run` показывает, какие ключи проверяет команда.

**На этой странице:**

1. [Уровни](#the-levels)
2. [Что задано до того, как вы что-то поменяете](#what-is-set-before-you-change-anything)
3. [Одна команда может проверять несколько ключей](#one-command-can-check-several-keys)
4. [Агенты и MCP](#agents-and-mcp)
5. [Проверки, которые действуют независимо от разрешений](#checks-that-hold-whatever-the-permissions-say)

## Уровни

| Уровень | Что происходит |
|---|---|
| `deny` | Команда отклоняется, чтение тоже. |
| `readonly` | Чтение работает. Запись отклоняется. |
| `ask` | Запись сначала спрашивает в терминале. **Через MCP она выполняется.** |
| `allow` | Команда выполняется без вопроса. |

```sh
hubspot work config set permissions.people deny        # this profile reads no contacts
hubspot work config set permissions.api readonly       # the API reads, never writes
hubspot work config set permissions.notes.write allow  # let an agent add notes without a question
hubspot work config show                               # each key with its level and where it came from
```

Отказ это `permission_error` (код выхода 5), и он называет ключ. Он не значит, что вход сломан.

Агент не может ослабить разрешение: `config set` или `config unset`, который снял бы ограничение, отклоняется, если
вы не выполните его сами в терминале.

## Что задано до того, как вы что-то поменяете

| Что | Ключи | Встроенный уровень |
| --- | --- | --- |
| `deals create`, `update`, `move` и `close`, `people` и `organizations` `create` и `update` | свой, например `deals.update`. Смена стадии проверяет еще `deals.move`, а стадия выигрыша или проигрыша `deals.close` | `allow` |
| `deals delete` | `deals.delete` | `ask` |
| Запись через `api`, например `api deals-update` | `api.deals-update`, ключ `.write` своей группы (`deals.write`, `notes.write`) и ключ команды, которая делает то же самое. Стадия сделки проверяет еще `deals.move` и `deals.close` | `ask` |
| Удаление, архивирование или слияние через `api` | свой ключ `api.` и ключ `.delete` своей группы | `ask` |
| Назначение ответственного у записи, любым путем | `crm.assign-others` | `deny` |
| `api contacts-gdpr-delete`, который стирает контакт навсегда | еще `people.erase`, чтобы можно было запретить только его | `ask` |
| Любая другая команда | свой | `allow` |

Ключ HubSpot принадлежит аккаунту, а не человеку. `hubspot` не может отличить ваши записи от записей коллеги, поэтому
любой ответственный считается кем-то другим, и `crm.assign-others` остается на `deny`, пока вы его не разрешите.

## Одна команда может проверять несколько ключей

Одно и то же изменение может прийти двумя путями: командой вроде `deals update` или операцией API `api deals-update`.
Каждый путь проверяет и ключи другого, поэтому одна настройка действует на обоих:

```sh
hubspot work config set permissions.deals.update deny   # no deal updates, by deals update or api deals-update
```

`--dry-run` показывает каждый ключ, который проверяет запись, и ничего не отправляет:

```sh
hubspot work deals move deal:12 "Contract sent" --dry-run
hubspot work api notes-create --body-file note.json --dry-run
```

## Агенты и MCP

Через MCP отвечать на вопрос некому, поэтому `ask` пропускает команду. Чтобы остановить агента, поставьте ключ на
`readonly` или `deny`:

```sh
hubspot work config set permissions.deals.delete deny
hubspot work config set permissions.api readonly
```

`hubspot work mcp serve --permission people.list=deny` делает ключ строже только для одного сервера и никогда не
ослабляет его. Остальное показывает [MCP](./mcp.md#keep-writes-yours).

## Проверки, которые действуют независимо от разрешений

- **Scope ключа.** Ключ без scope на запись ничего не может изменить в HubSpot, какой бы уровень вы ни поставили
  ([установка](./installation.md#make-a-key)).
- **Только чтение для всего.** `WCHUBSPOT_READ_ONLY=1` отклоняет каждую запись, что бы ни говорили разрешения.
- **Запись отправляется один раз.** Запись, которая не получила ответа, снова не отправляется. Она заканчивается
  `outcome_unknown`, и вы проверяете запись в HubSpot, прежде чем отправить ее снова.
- **Вход остается за вами.** `session start` и `session end` через MCP не предлагаются, а ключ читается скрытно или из
  stdin, но никогда не как аргумент.
