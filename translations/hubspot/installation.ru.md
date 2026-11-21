---
title: "Установка"
---

Установите `hubspot` один раз на каждый компьютер, где им пользуетесь вы или агент. Нужен Node.js 22.16 или более
поздний 22.x, либо 24 или новее. Node 23 не поддерживается.

```sh
npm install -g @wirecat/hubspot-cli
hubspot --version
hubspot doctor
```

`doctor` не нужна сеть, и он не открывает связку ключей. Он показывает версию, где лежат настройки, какие профили
есть и могут ли другие пользователи компьютера читать настройки.

## Создайте ключ

`hubspot` входит с ключом, который принадлежит одному аккаунту HubSpot. Создает его один раз суперадминистратор или
пользователь с разрешением HubSpot **Developer tools access**
([руководство HubSpot](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/account-service-keys)):

1. Откройте **Development**, затем **Keys → Service keys** в левом меню. В некоторых аккаунтах это находится в
   **Settings → Integrations → Service keys**.
2. Нажмите **Create service key** и назовите ключ *WireCat*.
3. Нажмите **Add new scope**, отметьте каждый scope из таблицы и нажмите **Update**. Ключ получает только те scope,
   которые есть у его создателя.
4. Нажмите **Create** и подтвердите.
5. Нажмите на имя ключа, затем **Show** и **Copy**. Ключ начинается с `pat-`.

HubSpot перестал создавать новые приватные приложения 26 октября 2026 года
([объявление HubSpot](https://developers.hubspot.com/changelog/legacy-private-app-creation-sunset)). Токен доступа
существующего приватного приложения по-прежнему работает: дайте приложению те же scope и скопируйте токен на его
вкладке **Auth**.

Дайте ключу эти scope на чтение ([список scope HubSpot](https://developers.hubspot.com/docs/apps/legacy-apps/authentication/scopes)):

| Scope | Что он читает |
| --- | --- |
| `crm.objects.contacts.read`, `crm.objects.companies.read`, `crm.objects.deals.read` | контакты, компании и сделки |
| `crm.objects.owners.read` | ответственных за сделки |
| `crm.schemas.contacts.read`, `crm.schemas.companies.read`, `crm.schemas.deals.read` | свойства каждого из них |
| `sales-email-read` | записанные письма. Заметкам, звонкам, встречам и задачам свой scope не нужен: их читает scope контактов |
| `crm.objects.leads.read` | лиды, только в Sales Hub Professional или Enterprise |
| `tickets` | тикеты, только через `api` |

Запись необязательна. Добавьте эти scope, только если `hubspot` может менять записи. Без них ключ только читает:

| Scope | Что он меняет |
| --- | --- |
| `crm.objects.deals.write` | сделки: создание, изменение, перенос, закрытие и удаление |
| `crm.objects.contacts.write` | контакты. Заметки, звонки, встречи и задачи, которые пишутся через `api`, могут потребовать свой scope: ошибка его назовет |
| `crm.objects.companies.write` | компании |

Scope, который вы не выбрали, ломает только команды, которым он нужен, и ошибка называет этот scope.

## Войдите

Выберите имя профиля для аккаунта, например `work`, и вставьте ключ, когда его попросят:

```sh
hubspot work session start
```

Ключ читается скрытно или из stdin (`hubspot work session start < key.txt`), но никогда не как аргумент. `hubspot`
спрашивает HubSpot, какому аккаунту принадлежит ключ, и хранит ключ вместе с id аккаунта в связке ключей системы или,
с `--credential-storage file`, в файле, который можете читать только вы. Второй профиль на тот же аккаунт
отклоняется.

`hubspot work setup` задает те же вопросы по шагам. WireCat Desktop показывает те же шаги: он берет их из одного
JSON-документа, который печатает CLI, `hubspot work setup show --json`, на английском, испанском или русском.

`WCHUBSPOT_TOKEN` в окружении заменяет сохраненный ключ для каждого профиля, как в CI. Рядом задайте
`WCHUBSPOT_ACCOUNT`, id аккаунта: `hubspot work session status --check` с одним токеном печатает его как `account`.
Каждая команда, которая обращается к HubSpot, сначала сверяет id с токеном. Команде, которая читает только локальную
копию, нужно, чтобы одна такая команда, например `sync`, уже запускалась. `api` так не узнает часовой пояс аккаунта,
поэтому при исчерпанном дневном лимите он предлагает повторить после времени в UTC, самого раннего, когда лимит может
вернуться.

Дальше: [как пользоваться](./usage.md).
