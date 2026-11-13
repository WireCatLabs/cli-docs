---
title: "Подключите Asterisk"
---

`asterisk` читает из вашей АТС две вещи: записи о звонках (CDR) и, если они есть, аудиозаписи разговоров. Здесь
написано, где найти и то и другое, какой доступ дать и как настроить профиль. Менять диалплан не нужно, как и заводить
учетную запись Asterisk Manager Interface (AMI) или REST Interface (ARI).

## Что поддерживается

- **Asterisk 1.8 и новее**, а также системы на его основе: FreePBX, Issabel, VitalPBX. Поля CDR такие, как в
  [спецификации CDR](https://docs.asterisk.org/Configuration/Reporting/Call-Detail-Records-CDR/CDR-Specification/).
- **Записи о звонках** из одного источника:
  - `Master.csv`, который пишет модуль `cdr_csv`, обычно `/var/log/asterisk/cdr-csv/Master.csv`;
  - таблица MySQL или MariaDB (`cdr_mysql`, `cdr_adaptive_odbc`; FreePBX хранит ее в `asteriskcdrdb.cdr`);
  - таблица PostgreSQL (`cdr_pgsql`).
- **Аудиозаписи** в папке, которую может читать этот компьютер: локальная папка или папка АТС, подключенная только
  для чтения. Находятся файлы WAV, wav49 (`.WAV`), GSM, MP3, Ogg, Opus, FLAC и M4A. Для расшифровки WAV и GSM нужен
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
asterisk office config set cdr_csv_path /var/log/asterisk/cdr-csv/Master.csv
asterisk office config set cdr_timezone Europe/Moscow
```

В `Master.csv` нет строки заголовка. Набор столбцов зависит от `loguniqueid`, `loguserfield` и `newcdrcolumns` в
`cdr.conf` (`[csv]`), и `asterisk` различает их по числу полей в каждой строке. Поэтому строки, записанные после
включения одного из них, читаются рядом со старыми. По возможности включите `loguniqueid` и `newcdrcolumns`: без
`uniqueid` аудиозапись нельзя найти по имени, а без `linkedid` и `sequence` плечи переадресованного звонка
различаются только по содержимому. Если столбцы определились неверно, назовите их сами:

```sh
asterisk office config set cdr_csv_columns "accountcode,src,dst,dcontext,clid,channel,dstchannel,lastapp,lastdata,start,answer,end,duration,billsec,disposition,amaflags,uniqueid"
```

Время в `Master.csv` записано по местному времени АТС, если только не включено `usegmtime=yes`. Задайте в
`cdr_timezone` часовой пояс АТС или `UTC`, когда `usegmtime` включен. Без этой настройки берется пояс этого
компьютера.

Когда `asterisk` работает на другом компьютере, копируйте туда `Master.csv` по расписанию или подключите папку логов
АТС только для чтения, например так: `sshfs pbx:/var/log/asterisk/cdr-csv ~/pbx-cdr -o ro`.

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
asterisk office config set cdr_source mysql
asterisk office config set db_host 10.0.0.5
asterisk office config set db_name asteriskcdrdb
asterisk office config set db_user wirecat_reader
asterisk office config set cdr_timezone Europe/Moscow
asterisk office session start
```

`db_port` меняет порт (3306 для MySQL, 5432 для PostgreSQL), `db_table` меняет таблицу (`cdr`), а `db_tls true`
требует зашифрованное соединение с проверкой сертификата. Сеанс открывается только для чтения, и в базу уходит только один запрос:
`SELECT` строк, начавшихся после прошлой синхронизации, страницами по 5000.

База FreePBX слушает только на самой АТС. Не открывайте ее в сеть. Подключайтесь через SSH и направьте `db_host` на
туннель:

```sh
ssh -N -L 3306:127.0.0.1:3306 admin@pbx.example.lan &
asterisk office config set db_host 127.0.0.1
```

## Аудиозаписи

```sh
asterisk office config set recordings_path /var/spool/asterisk/monitor
```

Аудиозапись звонка ищется в таком порядке:

1. столбец CDR `recordingfile`, который заполняет FreePBX, в папке по дате `YYYY/MM/DD` или в самой папке. Имя,
   которое ведет за пределы `recordings_path`, не учитывается;
2. файл, в имени которого есть `uniqueid` звонка, сначала в `{yyyy}/{mm}/{dd}/`, затем в самой папке.

Если диалплан называет файлы по-своему, задайте свой шаблон с `{uniqueid}`, `{linkedid}`, `{yyyy}`, `{mm}`,
`{dd}` и `*`:

```sh
asterisk office config set recordings_pattern "calls/{yyyy}-{mm}-{dd}/*{linkedid}*"
```

Файл, измененный в последние две минуты, возможно, еще пишет MixMonitor, поэтому он остается до следующей
синхронизации. Звонок без аудиозаписи импортируется все равно. Аудиозапись связывается по пути: ее никогда не
копируют, не перемещают и не меняют. Если папка находится на АТС, подключите ее только для чтения, например
`sshfs pbx:/var/spool/asterisk/monitor ~/pbx-monitor -o ro`, и укажите эту точку подключения в `recordings_path`.

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
asterisk office meetings sync --since-time 2024-01-01T00:00:00Z   # once: everything since then
asterisk office meetings sync                                     # later: what is new
```

Каждая синхронизация заново читает шесть часов до предыдущей, потому что звонок попадает в CDR только после
завершения. Уже импортированная запись обновляется и никогда не удваивается. Строка, которую не удалось прочитать,
пропускается и учитывается в stderr, остальные импортируются. Запускайте синхронизацию вручную, из cron или из таймера
systemd.

## Расшифровка

```sh
asterisk models download gigaam-v3       # Russian; models list shows the others
asterisk office meetings transcribe --max-meetings 50
```

Распознавание идет на этом компьютере. Уже расшифрованная аудиозапись не читается заново, если файл не изменился.
`--replace` расшифровывает снова.

## Ищите звонки вместе со всем остальным

Звонки лежат в хранилище WireCat, которое читает каждый инструмент WireCat. Агент с `memo` спрашивает про одного
человека сразу по звонкам, чатам и почте, а `search all` в любом CLI WireCat ищет по всему этому вместе.
