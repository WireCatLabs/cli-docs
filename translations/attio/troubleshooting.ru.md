---
title: "Если что-то не работает"
---

Верните `attio` в рабочее состояние по симптому, который вы видите. Большинство сбоев идет от токена, от права,
которого у него нет, или от разрешений профиля, и для каждого есть проверка, которая называет причину.

Найдите свой симптом в таблице, выполните проверку, которую она дает, и повторите команду. Если не помогло, у вас уже
готовы код ошибки и имя профиля для обращения в поддержку.

**На этой странице:**

1. [Первые проверки](#first-checks)
2. [Симптомы и что делать](#symptoms-and-what-to-do)
3. [Как попросить помощи](#ask-for-help)

## Первые проверки

```sh
attio doctor                         # the version, the settings, the profiles, without the network
attio work session status --check    # asks Attio which workspace the token belongs to
```

## Симптомы и что делать

| Симптом | Что делать |
| --- | --- |
| Непонятно, что настроено | Запустите `attio doctor`. Он не читает связку ключей и не ходит в сеть. |
| `attio` не находится | Откройте новый терминал и проверьте, что глобальная папка npm есть в `PATH`. |
| "name a profile" | Поставьте профиль первым словом, как в `attio work config show`, или задайте `WCATTIO_PROFILE`. |
| "not signed in" | Запустите `attio work session start` и вставьте токен, как показано в разделе [вход](./installation.md#sign-in). |
| Токен отклонен или "not active" | Его удалили в Attio или ввели с ошибкой. Создайте новый ([как](./installation.md#make-an-access-token-in-attio)) и снова запустите `session start`. |
| В Attio нет вкладки **Developers** | Ее видит только администратор пространства. Попросите администратора создать токен. |
| Команда падает с 403 или "missing scope" | У токена нет нужного права. Измените токен в Workspace settings → Developers или создайте новый, с `record_permission:read`, `object_configuration:read` и `user_management:read`. |
| `rate_limited` | Attio указывает лимит 100 чтений и 25 записей в секунду ([страница Attio](https://docs.attio.com/rest-api/guides/rate-limiting)). Подождите немного и запустите снова. |
| `deals list` пустой | Сначала запустите `attio work sync`. Сделки читаются из копии, которую она делает. |
| `sync` падает с `not_found` | В вашем пространстве выключен объект Deal. Администратор включает его в настройках объектов Attio ([документация Attio](https://docs.attio.com/docs/standard-objects/standard-objects-deals)). |
| Выигранная или проигранная сделка показана открытой | Этап выигрыша должен быть тем, который Attio празднует, а название этапа проигрыша должно начинаться с "Lost". См. [сделки](./usage.md#deals). |
| Человека или компании нет в `search all` | `sync` копирует только людей и компании из сделок: добавьте их к сделке и запустите `attio work sync`. `attio work people list anna` читает сам Attio и находит любого сразу. |
| `people list assigned_to:…` отклоняется | Живой список принимает слова (`attio work people list anna`), а не другие поля. |
| Файл настроек не читается | `doctor` перечисляет все проблемы файла в `config.issues`. Выполните `config unset`, который дан для каждой, или исправьте файл вручную. |
| `doctor` показывает `files.problems` | Другие пользователи компьютера могут читать `config.json` или заходить в его папку. Выполните каждую команду `chmod`, которую `doctor` печатает после "to make it private:". Сам `doctor` права файлов не меняет. |
| "the OS keyring did not answer" | На компьютере не запущена связка ключей. Войдите через `attio work session start --credential-storage file`. |
| Запись отклоняется | Ее останавливают разрешения профиля, `WCATTIO_READ_ONLY` или права токена. См. [разрешения](./permissions.md). |

## Как попросить помощи

Спросите в [Discord](https://discord.gg/DebENqbRrJ) или откройте [issue](https://github.com/WireCatLabs/attio-cli/issues)
с кодом ошибки, именем профиля и командой. Никогда не вставляйте в обращение токен, пароль или личное содержимое.
