# Записанные вызовы CLI

Полные argv, stdout, stderr и exit code находятся в [trace.jsonl](trace.jsonl). Это synthetic CLI transcript; внешние shell/tool calls и скрытые рассуждения не записаны.

| № | Команда | Exit |
|---|---|---|
| 1 | `tg --help` | 0 |
| 2 | `tg skill` | 0 |
| 3 | `tg commands` | 0 |
| 4 | `tg skill show` | 0 |
| 5 | `tg messages search --help` | 0 |
| 6 | `tg messages get --help` | 0 |
| 7 | `tg chats list --search 'фриланс' --json` | 0 |
| 8 | `tg chats list --search 'бизнес' --json` | 0 |
| 9 | `tg messages search 'бухгалтер' --chat 301 --limit 20 --json` | 0 |
| 10 | `tg messages search 'бухгалтер' --chat 303 --limit 20 --json` | 0 |
| 11 | `tg messages search 'бухгалтер' --chat 302 --limit 20 --json` | 0 |
| 12 | `tg messages context 303 640 --before-n 3 --after-n 5 --json` | 0 |
| 13 | `tg messages context 301 600 --before-n 3 --after-n 5 --json` | 0 |
| 14 | `tg messages list 302 --limit 30 --json` | 0 |
| 15 | `tg messages list 303 --limit 30 --json` | 0 |
| 16 | `tg messages list 301 --limit 30 --json` | 0 |
