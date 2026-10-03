# Записанные вызовы CLI

Полные argv, stdout, stderr и exit code находятся в [trace.jsonl](trace.jsonl). Это synthetic CLI transcript; внешние shell/tool calls и скрытые рассуждения не записаны.

| № | Команда | Exit |
|---|---|---|
| 1 | `tg --help` | 0 |
| 2 | `tg skill` | 2 |
| 3 | `tg messages --help` | 0 |
| 4 | `tg chats --help` | 0 |
| 5 | `tg commands` | 0 |
| 6 | `tg skill show` | 0 |
| 7 | `tg messages search --help` | 0 |
| 8 | `tg messages show --help` | 0 |
| 9 | `tg store --help` | 0 |
| 10 | `tg chats list --search 'фриланс' --json` | 0 |
| 11 | `tg chats list --search 'бизнес' --json` | 0 |
| 12 | `tg messages search 'бухгалтер' --chat 301 --json` | 0 |
| 13 | `tg messages search 'бухгалтер' --chat 302 --json` | 0 |
| 14 | `tg messages search 'бухгалтер' --chat 303 --json` | 0 |
| 15 | `tg messages context --help` | 0 |
| 16 | `tg messages list --help` | 0 |
| 17 | `tg messages context 301 600 --before-n 3 --after-n 5 --json` | 0 |
| 18 | `tg messages context 303 640 --before-n 3 --after-n 5 --json` | 0 |
| 19 | `tg messages list 302 --limit 30 --json` | 0 |
| 20 | `tg contacts show --help` | 0 |
| 21 | `tg contacts show @elena_demo --json` | 0 |
| 22 | `tg contacts show @olga_demo --json` | 0 |
