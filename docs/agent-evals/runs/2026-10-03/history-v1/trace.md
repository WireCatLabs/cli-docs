# Записанные вызовы CLI

Полные argv, stdout, stderr и exit code находятся в [trace.jsonl](trace.jsonl). Это synthetic CLI transcript; внешние shell/tool calls и скрытые рассуждения не записаны.

| № | Команда | Exit |
|---|---|---|
| 1 | `tg --help` | 0 |
| 2 | `tg skill` | 2 |
| 3 | `tg chats --help` | 0 |
| 4 | `tg messages --help` | 0 |
| 5 | `tg commands` | 0 |
| 6 | `tg skill show` | 0 |
| 7 | `tg messages search --help` | 0 |
| 8 | `tg --json chats list --search Atlas --limit 20` | 0 |
| 9 | `tg messages list --help` | 0 |
| 10 | `tg --json messages search 'аналит' --chat 101 --regex --newest --limit 30` | 0 |
| 11 | `tg --json messages list 101 --after-time 2026-09-01T00:00:00+02:00 --before-time 2026-10-01T00:00:00+02:00 --limit 100` | 0 |
| 12 | `tg store status --help` | 0 |
| 13 | `tg store fetch --help` | 0 |
| 14 | `tg --json store status` | 0 |
| 15 | `tg --json store fetch 101 --since-time 2026-09-01T00:00:00+02:00 --limit 200 --estimate` | 0 |
| 16 | `tg --json store fetch 101 --since-time 2026-09-01T00:00:00+02:00 --limit 200 --page-size 100` | 0 |
| 17 | `tg --json messages list 101 --after-time 2026-09-01T00:00:00+02:00 --before-time 2026-10-01T00:00:00+02:00 --limit 100` | 0 |
| 18 | `tg --json store status 101` | 0 |
| 19 | `tg --json messages search 'аналит&#124;евро&#124;НДС&#124;соглас' --chat 101 --regex --newest --limit 30 --context 2` | 0 |
| 20 | `tg messages evidence --help` | 0 |
| 21 | `tg --json messages evidence 101 --limit 20` | 2 |
| 22 | `tg --offline --json messages list 101 --limit 20` | 0 |
| 23 | `tg --json messages list 101 --before-id 400 --limit 100` | 0 |
