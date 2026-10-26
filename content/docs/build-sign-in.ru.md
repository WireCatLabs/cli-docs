---
title: "Вход в сервис"
description: "Как инструмент входит к провайдеру, держит ключи и токены вне хранилища и экрана и всегда называет профиль."
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

Дальше: [Соответствовать стандартам и обновляться](./build-stay-compliant.md).
