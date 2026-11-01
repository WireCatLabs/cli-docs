---
title: "Установка"
---

Установите `mail` один раз на каждом компьютере, где им пользуетесь вы или агент. Нужен Node.js 22.16 или более поздний 22.x, либо 24 и новее; Node 23 не поддерживается.

```sh
npm install -g @wirecat/mail-cli
mail --version
```

Проверьте установку:

```sh
mail doctor
```

`doctor` не требует сети и не открывает связку ключей. Он показывает версию, где лежат настройки, какие профили
существуют и могут ли другие пользователи компьютера читать настройки.

Затем подключите почтовый ящик. Имя профиля выбираете вы: это первое слово каждой команды:

```sh
mail ya session start --address me@example.com
mail ya account check
```

## Поиск по почте

После `sync` почта лежит в общем хранилище. `mail` наполняет хранилище. [memo](https://github.com/WireCatLabs/cli-memo)
ищет в нём и показывает его содержимое:

```sh
memo search mail "invoice"
```

Слова запроса описаны в [memo search](https://github.com/WireCatLabs/cli-memo/blob/main/docs/search.md).

Дальше: [работа с инструментом](./usage.md).
