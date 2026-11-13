---
title: "Подключите Asterisk"
---

`pbx` читает из вашей АТС две вещи: записи о звонках (CDR) и, если они есть, аудиозаписи разговоров. Здесь
написано, где найти и то и другое, какой доступ дать и как настроить профиль. Менять диалплан не нужно, как и заводить
учетную запись Asterisk Manager Interface (AMI) или REST Interface (ARI).

## Что поддерживается

- **Asterisk 1.8 и новее**, а также системы на его основе: FreePBX, Issabel, VitalPBX. Поля CDR такие, как в
  [спецификации CDR](https://docs.asterisk.org/Configuration/Reporting/Call-Detail-Records-CDR/CDR-Specification/).
- **Записи о звонках** из одного источника:
  - `Master.csv`, который пишет модуль `cdr_csv`, обычно `/var/log/asterisk/cdr-csv/Master.csv`;
  - таблица MySQL или MariaDB (`cdr_mysql`, `cdr_adaptive_odbc`; FreePBX хранит ее в `asteriskcdrdb.cdr`);
  - таблица PostgreSQL (`cdr_pgsql`).
- **Аудиозаписи** в папке, которую может читать этот компьютер, в папке, подключенной только для чтения, или в
  собственной папке АТС по SFTP. Находятся файлы WAV, wav49 (`.WAV`), GSM, MP3, Ogg, Opus, FLAC и M4A. Для расшифровки WAV и GSM нужен
  `ffmpeg`.

Пока проверено на выдуманных записях о звонках и аудиозаписях из `examples/`, собранных по спецификации CDR и исходному
коду `cdr_csv`, а на живой АТС еще нет.

## Выберите источник

| У вас | Задайте `cdr_source` | Нужно |
|---|---|---|
| Asterisk без надстроек, включен `cdr_csv` | `csv` (по умолчанию) | право читать `Master.csv` |
| FreePBX, Issabel, VitalPBX | `mysql` | пользователь базы только для чтения |
| CDR в PostgreSQL | `postgres` | пользователь базы только для чтения |

Не уверены? На АТС команда `asterisk -rx "cdr show status"` покажет модули CDR, которые пишут записи.

## Master.csv

```sh
pbx office config set cdr_csv_path /var/log/asterisk/cdr-csv/Master.csv
pbx office config set cdr_timezone Europe/Moscow
```

В `Master.csv` нет строки заголовка. Набор столбцов зависит от `loguniqueid`, `loguserfield` и `newcdrcolumns` в
`cdr.conf` (`[csv]`), и `pbx` различает их по числу полей в каждой строке. Поэтому строки, записанные после
включения одного из них, читаются рядом со старыми. По возможности включите `loguniqueid` и `newcdrcolumns`: без
`uniqueid` аудиозапись нельзя найти по имени, а без `linkedid` и `sequence` плечи переадресованного звонка
различаются только по содержимому. Если столбцы определились неверно, назовите их сами:

```sh
pbx office config set cdr_csv_columns "accountcode,src,dst,dcontext,clid,channel,dstchannel,lastapp,lastdata,start,answer,end,duration,billsec,disposition,amaflags,uniqueid"
```

Время в `Master.csv` записано по местному времени АТС, если только не включено `usegmtime=yes`. Задайте в
`cdr_timezone` часовой пояс АТС или `UTC`, когда `usegmtime` включен. Без этой настройки берется пояс этого
компьютера.

Когда `pbx` работает на другом компьютере, читайте `Master.csv` на АТС по SFTP (см. ниже) или подключите папку
логов АТС только для чтения, например так: `sshfs pbx:/var/log/asterisk/cdr-csv ~/pbx-cdr -o ro`.

## База CDR

Создайте пользователя, которому разрешено только читать таблицу CDR. В MySQL или MariaDB:

```sql
CREATE USER 'wirecat_reader'@'10.0.0.%' IDENTIFIED BY 'a long random password';
GRANT SELECT ON asteriskcdrdb.cdr TO 'wirecat_reader'@'10.0.0.%';
```

В PostgreSQL:

```sql
CREATE ROLE wirecat_reader LOGIN PASSWORD 'a long random password';
GRANT SELECT ON cdr TO wirecat_reader;
```

Затем настройте профиль и войдите. Пароль вводится скрыто и проверяется, прежде чем его сохранить:

```sh
pbx office config set cdr_source mysql
pbx office config set db_host 10.0.0.5
pbx office config set db_name asteriskcdrdb
pbx office config set db_user wirecat_reader
pbx office config set cdr_timezone Europe/Moscow
pbx office session start
```

`db_port` меняет порт (3306 для MySQL, 5432 для PostgreSQL), `db_table` меняет таблицу (`cdr`), а `db_tls true`
требует зашифрованное соединение с проверкой сертификата. Сеанс открывается только для чтения, и в базу уходит только один запрос:
`SELECT` строк, начавшихся после прошлой синхронизации, страницами по 5000.

База FreePBX слушает только на самой АТС. Не открывайте ее в сеть. Подключайтесь через SSH и направьте `db_host` на
туннель:

```sh
ssh -N -L 3306:127.0.0.1:3306 admin@pbx.example.lan &
pbx office config set db_host 127.0.0.1
```

## Аудиозаписи

```sh
pbx office config set recordings_path /var/spool/asterisk/monitor
```

Аудиозапись звонка ищется в таком порядке:

1. столбец CDR `recordingfile`, который заполняет FreePBX, в папке по дате `YYYY/MM/DD` или в самой папке. Имя,
   которое ведет за пределы `recordings_path`, не учитывается;
2. файл, в имени которого есть `uniqueid` звонка, сначала в `{yyyy}/{mm}/{dd}/`, затем в самой папке.

Если диалплан называет файлы по-своему, задайте свой шаблон с `{uniqueid}`, `{linkedid}`, `{yyyy}`, `{mm}`,
`{dd}` и `*`:

```sh
pbx office config set recordings_pattern "calls/{yyyy}-{mm}-{dd}/*{linkedid}*"
```

Файл, измененный в последние две минуты, возможно, еще пишет MixMonitor, поэтому он остается до следующей
синхронизации. Звонок без аудиозаписи импортируется все равно. Аудиозапись связывается по пути: ее никогда не
копируют, не перемещают и не меняют. Если папка находится на АТС, читайте ее по SFTP (см. ниже) или подключите только для
чтения, например
`sshfs pbx:/var/spool/asterisk/monitor ~/pbx-monitor -o ro`, и укажите эту точку подключения в `recordings_path`.

## Файлы на АТС по SFTP

`files_from sftp` читает `Master.csv` и аудиозаписи на самой АТС через ее SSH-сервер. Ничего не копируется в
отдельную папку, и ничего туда не пишется. Создайте пользователя, которому разрешено только читать эти папки,
например в группе `pbx`, затем:

```sh
pbx office config set files_from sftp
pbx office config set sftp_host pbx.example.lan
pbx office config set sftp_user wirecat
pbx office config set sftp_key_path ~/.ssh/wirecat_pbx      # or leave it out to sign in with a password
pbx office session start
```

Первый `session start` подключается только для того, чтобы увидеть ключ сервера, и останавливается. Он печатает
отпечаток ключа и команду, которая его закрепляет. Сравните отпечаток с собственным отпечатком АТС, который там
показывает `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub`, и только потом выполните эту команду
(`config set sftp_host_key SHA256:…`). Пароль или ключ не отправляются серверу, ключ которого не закреплен, а сервер,
у которого ключ изменился, отклоняется. Затем `session start` спрашивает пароль SFTP, если файла ключа нет, проверяет
его, читая самые новые записи о звонках, и сохраняет в связке ключей.

Пути указываются как на АТС: `cdr_csv_path /var/log/asterisk/cdr-csv/Master.csv`, `recordings_path
/var/spool/asterisk/monitor`. Профиль, который читает CDR из базы, хранит пароль этой базы, поэтому для SFTP он
входит по файлу ключа. Оборванное соединение или тайм-аут повторяются, а неверный пароль, изменившийся ключ или
отсутствующий файл нет.

## Номера, направления и люди

- `phone_region` задает страну для номеров без `+`, например `ru` для `89161234567`. Тогда номера хранятся как
  `+79161234567`, в том же виде, что и в других инструментах WireCat, и звонящий оказывается одним человеком в звонках
  и в чатах. Без этой настройки в международный вид переводятся только номера, записанные с `+` или `00`.
- `extension_pattern` задает регулярное выражение для ваших внутренних номеров. Значение по умолчанию, `^\d{2,5}$`,
  берет номера из двух-пяти цифр. Сторона звонка считается внутренней, когда под шаблон подходит ее канал (`PJSIP/101-…`) или номер.
- Звонок **входящий**, когда внешний номер дозвонился до внутреннего или звонок пришел через контекст `from-trunk`,
  `from-pstn` или `from-did`. **Исходящий**, когда внутренний номер позвонил на внешний. **Внутренний** между двумя
  внутренними номерами. Иначе направление остается пустым.
- У каждого звонка два человека: внутренний номер как `manager` и внешний номер как `client`, с именем из Caller ID,
  если АТС его знала. Скрытый номер (`anonymous`, `Restricted`) или имя из диалплана вроде `s` человеком не считается.
- Канал `Local/`, через который работают очереди, группы вызова и follow-me, называет набранный номер, а не того, кто
  на линии. Поэтому эту сторону определяет номер.

## Загрузите историю и держите ее свежей

```sh
pbx office meetings sync --since-time 2024-01-01T00:00:00Z   # once: everything since then
pbx office meetings sync                                     # later: what is new
```

Каждая синхронизация заново читает шесть часов до предыдущей, потому что звонок попадает в CDR только после
завершения. Уже импортированная запись обновляется и никогда не удваивается. Строка, которую не удалось прочитать,
пропускается и учитывается в stderr, остальные импортируются. Запускайте синхронизацию вручную, из cron или из таймера
systemd.

## Расшифровка

```sh
pbx models download gigaam-v3       # Russian; models list shows the others
pbx office meetings transcribe --max-meetings 50
```

Распознавание идет на этом компьютере. Уже расшифрованная аудиозапись не читается заново, если файл не изменился.
`--replace` расшифровывает снова.

## Ищите звонки вместе со всем остальным

Звонки лежат в хранилище WireCat, которое читает каждый инструмент WireCat. Агент с `memo` спрашивает про одного
человека сразу по звонкам, чатам и почте, а `search all` в любом CLI WireCat ищет по всему этому вместе.
