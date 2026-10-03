# Записанные вызовы CLI

Полные argv, stdout, stderr и exit code находятся в [trace.jsonl](trace.jsonl). Это synthetic CLI transcript; внешние shell/tool calls и скрытые рассуждения не записаны.

| № | Команда | Exit |
|---|---|---|
| 1 | `tg --help` | 0 |
| 2 | `tg skill` | 0 |
| 3 | `tg skill show` | 0 |
| 4 | `tg chats --help` | 0 |
| 5 | `tg messages --help` | 0 |
| 6 | `tg commands --json` | 0 |
| 7 | `tg messages search --help` | 0 |
| 8 | `tg store fetch --help` | 0 |
| 9 | `tg chats list --search Atlas --json` | 0 |
| 10 | `tg messages list 101 --limit 20 --json` | 0 |
| 11 | `tg store status --json` | 0 |
| 12 | `tg store fetch 101 --since-time 2026-09-01T00:00:00+02:00 --limit 100 --estimate --json` | 0 |
| 13 | `tg store fetch 101 --since-time 2026-09-01T00:00:00+02:00 --limit 100 --json` | 0 |
| 14 | `tg messages search 'аналит' --chat 101 --regex --newest --limit 20 --context 2 --json` | 0 |
| 15 | `tg messages context 101 201 --before-n 3 --after-n 3 --json` | 0 |
| 16 | `tg store status --json` | 0 |
| 17 | `tg messages list --help` | 0 |
| 18 | `tg store --help` | 0 |
| 19 | `tg messages list 101 --before-id 400 --after-time 2026-09-01T00:00:00+02:00 --limit 100 --json` | 0 |
| 20 | `tg commands --json` | 0 |
| 21 | `tg store fetch 101 --since-time 2026-09-01T00:00:00+02:00 --limit 100 --json` | 0 |
| 22 | `tg messages search 'евро&#124;€&#124;сумм&#124;соглас&#124;НДС' --chat 101 --regex --newest --limit 30 --json` | 0 |
