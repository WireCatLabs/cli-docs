---
title: "Настройки"
---

Настройки хранятся в одном файле, `config.json`, в папке, которую показывает `pbx doctor`. У каждого профиля своя
часть, а `defaults` действуют для всех профилей.

```sh
pbx office config show
pbx office config set cdr_csv_path /var/log/asterisk/cdr-csv/Master.csv
pbx office config unset cdr_csv_path
```

`config show` перечисляет все настройки и откуда взято каждое значение: из файла, из переменной или по умолчанию.

## Источник

Что значит каждая настройка, описано на странице [подключите Asterisk](./asterisk.md).

| Настройка | По умолчанию | Что это |
| --- | --- | --- |
| `cdr_source` | `csv` | `csv`, `mysql` или `postgres` |
| `cdr_csv_path` | — | путь к `Master.csv` |
| `cdr_csv_columns` | по числу полей | имена столбцов CSV через запятую |
| `db_host`, `db_port`, `db_name`, `db_user` | —, 3306 или 5432 | база CDR; пароль сохраняет `session start` |
| `db_table` | `cdr` | таблица CDR |
| `db_tls` | `false` | зашифрованное соединение с проверкой сертификата |
| `recordings_path` | — | папка с аудиозаписями |
| `recordings_pattern` | как в FreePBX, затем `*{uniqueid}*` | как по имени аудиозаписи найти звонок |
| `cdr_timezone` | пояс этого компьютера | часовой пояс времени в CDR |
| `phone_region` | — | страна для номеров без `+`, например `ru` |
| `extension_pattern` | `^\d{2,5}$` | какие номера считаются внутренними |
| `files_from` | `local` | `local` или `sftp`, чтобы читать `Master.csv` и аудиозаписи на АТС |
| `sftp_host`, `sftp_port`, `sftp_user` | —, 22, — | SSH-сервер АТС для `files_from sftp` |
| `sftp_key_path` | — | файл закрытого ключа; без него `session start` спрашивает пароль SFTP |
| `sftp_host_key` | — | проверенный вами отпечаток ключа сервера, `SHA256:…`; пока он не задан, подключения нет |

## Разрешения

`permissions` решает, что команде можно делать в этом профиле: `allow`, `ask`, `readonly` или `deny`, для каждого
пути команды (`meetings.sync`, `meetings.transcribe`). Через MCP спросить некого, поэтому `ask` пропускает команду.
`PBX_READ_ONLY=1` отклоняет каждую команду, которая меняет ваш вход или настройки.

```sh
pbx office config set permissions.meetings.transcribe deny
```

## Записи запусков

Команда, которая завершилась ошибкой, сохраняется как запуск для `pbx runs list` и `runs show`. `meetings sync`, `meetings
transcribe` и `session status --check` работают внутри запуска, поэтому `--record` сохраняет и успешные запуски.
`record_input` решает, хранит ли запуск слова, которые вы набрали. Секреты скрываются в любом случае, см.
[Безопасность](./security.md).
