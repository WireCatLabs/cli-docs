# Записанные вызовы CLI

Полные argv, stdout, stderr и exit code находятся в [trace.jsonl](trace.jsonl). Это synthetic CLI transcript; внешние shell/tool calls и скрытые рассуждения не записаны.

| № | Команда | Exit |
|---|---|---|
| 1 | `tg --help` | 0 |
| 2 | `tg skill` | 2 |
| 3 | `tg chats --help` | 0 |
| 4 | `tg messages --help` | 0 |
| 5 | `tg commands` | 0 |
| 6 | `tg commands` | 0 |
| 7 | `tg skill show` | 0 |
| 8 | `tg chats list --search Atlas --json` | 0 |
| 9 | `tg messages evidence 102 --limit 30 --json` | 2 |
| 10 | `tg messages evidence 101 --limit 30 --json` | 2 |
| 11 | `tg messages list 101 --limit 40 --json` | 0 |
| 12 | `tg messages list 102 --limit 40 --json` | 0 |
| 13 | `tg chats show 101 --json` | 0 |
| 14 | `tg contacts list --limit 20 --json` | 0 |
| 15 | `tg chats list --kind dialog --limit 20 --json` | 0 |
| 16 | `tg messages list 501 --limit 40 --json` | 0 |
| 17 | `tg messages search Atlas --limit 30 --json` | 0 |
| 18 | `tg store status 101 --json` | 0 |
| 19 | `tg store fetch 101 --limit 60 --since-time 2026-09-01T00:00:00+02:00 --json` | 0 |
| 20 | `tg messages list 101 --limit 60 --json` | 0 |
