---
title: "Вход в сервис и соответствие стандартам"
description: "Как инструмент входит к провайдеру и держит секреты вне хранилища и экрана, а также стандарты, проверки и выпуски cli-core, которым он должен следовать."
---

Ваш инструмент работает с сервисом, которому нужен вход, например с Google или Zoom. Эта страница показывает, где живут
ключи и токены, как владелец выбирает аккаунт и чего вход никогда не должен делать. Ещё она показывает общий модуль входа
в cli-core.

## Правила

- **Профиль всегда указан явно.** Владелец называет профиль в каждой команде, например `acme work sync`. Инструмент
  никогда не берёт первый профиль из списка, а пропущенный профиль — это ошибка со списком вариантов
  ([правила аккаунтов](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/accounts.md)).
- **Секреты берутся из окружения, затем из системной связки ключей, затем из закрытого файла**
  ([WC-SECR-4](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md#wc-secr-4--secrets-come-from-the-environment-then-the-os-keyring-then-a-private-file)).
- **Секрет никогда не принимается в командной строке**, потому что он остаётся в истории оболочки
  ([WC-SECR-5](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md#wc-secr-5--a-secret-is-never-taken-on-the-command-line)).
- **Токен остаётся внутри транспорта.** Он никогда не попадает в хранилище, журнал, ошибку или вывод
  ([WC-SECR-7](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md#wc-secr-7--a-token-stays-inside-the-transport)).

## Шаги

1. Спросите у владельца секрет скрытым вводом или откройте страницу входа провайдера в браузере.
2. Сохраните токен через `Credentials` из `@wirecat/cli-base` под именем профиля.
3. Читайте его по тому же профилю, когда он нужен команде, и передавайте только коду, который обращается к сервису.

## Пример

```ts
import { Credentials } from "@wirecat/cli-base"

const credentials = new Credentials({ service: "acme-cli", configDir, envVar: "ACME_TOKEN" })
credentials.write(profile, token)
const saved = credentials.read(profile)
```

`profile` — имя, которое ввёл владелец. `saved.secret` уходит клиенту сервиса и больше никуда; `saved.source` говорит,
откуда он взят: из окружения, связки ключей или файла.

## Вход через браузер с общим модулем

Для сервиса, где вход идёт через его веб-страницу (OAuth), используйте общий модуль входа `@wirecat/cli-core/oauth`.
Он даёт всем инструментам один порядок входа:

- вход через браузер с локальным адресом возврата или вставленным кодом, защищённый `state` и PKCE;
- обмен токена, обновление и выход;
- блокировка на профиль, чтобы две команды не обновляли один токен одновременно;
- провайдера объявляет ваш инструмент; в cli-core нет адресов и идентификаторов провайдеров, любой шаг можно заменить;
- одна схема имён для записей связки ключей; старую запись по-прежнему можно прочитать, и никому не нужно входить
  заново.

```ts
import { credentialStorage, type OAuthProvider, oauthAccount, standardCodec, tokenKeeper } from "@wirecat/cli-core/oauth"

const acme: OAuthProvider = {
  id: "acme",
  name: "Acme",
  authorizeUrl: "https://acme.example/oauth/authorize",
  tokenUrl: "https://acme.example/oauth/token",
  client: { clientId: "your-app-id" },
  redirect: { kind: "loopback" },
}

const keeper = tokenKeeper({
  provider: acme,
  storage: credentialStorage({
    credentials: { service: "acme-cli", configDir, envVar: "ACME_TOKEN" },
    account: oauthAccount(acme.id, profile),
    codec: standardCodec(acme.id),
  }),
  lockDir: configDir,
  fetch,
  signInCommand: `acme ${profile} sign-in`,
})

await keeper.signIn({ scopes: ["meetings:read"], openBrowser })
const accessToken = await keeper.accessToken()
```

`configDir` и `profile` — те же, что выше; `openBrowser` открывает адрес в браузере владельца. `accessToken()`
обновляет токен, когда срок его действия подходит к концу. Токен сохраняется через `Credentials`, так что правила выше
по-прежнему действуют.

## Что сломается, если это пропустить

Профиль по умолчанию читает или пишет не тот аккаунт. Токен в командной строке остаётся в истории оболочки. Токен в
сообщении об ошибке попадает в чат агента и его журналы.

Дальше: [Соответствовать стандартам и обновляться](./build-sign-in.md#соответствовать-стандартам-и-обновляться).

## Соответствовать стандартам и обновляться

Ваш инструмент работает сегодня. Эта страница показывает, как сохранить это, пока меняются cli-core и cli-base: где
лежат правила, какие проверки их подтверждают и что делать, когда выпуск меняет то, чем пользуется ваш инструмент.

### Справочник

Правила, которым следует каждый инструмент WireCat, — в
[справочнике стандартов](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/README.md). Он входит в `@wirecat/cli-base`, поэтому у вашего
инструмента он лежит в `node_modules/@wirecat/cli-base/docs/standards/README.md` той же версии, что и проверки, которые
он запускает. Начните со [списка для нового CLI](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/new-cli.md): каждый шаг называет проверку, которая его
подтверждает.

Страницы, которые инструмент на общем хранилище читает первыми:

- [Модель данных](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md): сущности, записи источников, `external_id`, имена полей, связи;
- [Хранилище](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/store.md): области хранилища, миграции, никакого SQL из инструмента;
- [Архитектура](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/architecture.md): слои и что в каком пакете;
- [Безопасность](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md) и [Аккаунты](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/accounts.md): секреты и явный профиль.

### Проверки

- **`cli-dev lint`** (из cli-base) читает команды, которые печатает ваш инструмент, и проверяет имена, флаги, справку и
  правила вывода. Известные расхождения один раз записываются в `lint/baseline/`; список только сокращается, а
  исключений может быть не больше десяти.
- **`cli-dev audit`** сравнивает ваши команды с другими инструментами: обязательные корневые команды и один контракт
  для одного пути команды.
- **Общая настройка проверки кода** (Biome с плагинами WireCat) проверяет исходники: никаких глубоких импортов во
  внутренности cli-core, никакой оболочки, собранной из строк.
- Правило, которое машина проверить не может, помечено в справочнике как «review only». Прочитайте его, прежде чем
  менять эту часть.

### Версии и ломающие изменения

cli-core и cli-base выходят, как только изменение готово, и выпуск может ломать вызывающий код
([WC-REL-8](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/releases.md#wc-rel-8--any-package-may-release-at-any-time)). До версии 1.0.0 минорная версия может ломать
вызывающий код, и журнал изменений cli-core пишет, как именно, в разделе «Changed — may break callers».

Когда выходит новый cli-core:

1. Прочитайте его раздел журнала изменений, начиная с ломающей части.
2. Поднимите cli-core в своём инструменте в тот же день, что и другие инструменты, чтобы все открывали общее хранилище с
   одной схемой.
3. Запустите тесты и `cli-dev lint`, затем выпускайте.

Общее хранилище движется только вперёд. Новый cli-core может мигрировать файл; старая сборка тогда отказывается его
открывать и говорит обновиться, вместо того чтобы прочитать его неверно
([WC-STORE-10](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/store.md#wc-store-10--an-older-build-refuses-a-store-it-cannot-read-and-says-to-upgrade)).
Поэтому инструмент, оставшийся на старом cli-core, может перестать работать, когда владелец обновит другой инструмент.

Инструмент, созданный из cli-template, получает и последующие изменения шаблона командой
`npx @wirecat/cli-template upgrade`: см. [Обновляйтесь](./build-create-cli.md#обновляйтесь).

### Скоро

- **Проверка исходников на доступ к хранилищу**, чтобы инструмент, который напрямую импортирует драйвер SQLite, не
  проходил проверку.

### Что сломается, если это пропустить

Инструмент, пропустивший обновление, читает хранилище, которое уже не понимает, и отказывается запускаться. Инструмент,
отключивший правило проверки, расходится с остальными, и агенты, выучившие команды одного инструмента, ошибаются в
вашем.

К началу: [Основы за пять минут](./build-concepts.md).
