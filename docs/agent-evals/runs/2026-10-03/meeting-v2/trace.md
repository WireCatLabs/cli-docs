# Записанные вызовы CLI

Полные argv, stdout, stderr и exit code находятся в [trace.jsonl](trace.jsonl). Это synthetic CLI transcript; внешние shell/tool calls и скрытые рассуждения не записаны.

| № | Команда | Exit |
|---|---|---|
| 1 | `tg --help` | 0 |
| 2 | `tg skill` | 0 |
| 3 | `tg commands` | 0 |
| 4 | `tg skill show` | 0 |
| 5 | `tg messages search --help` | 0 |
| 6 | `tg messages list --help` | 0 |
| 7 | `tg store --help` | 0 |
| 8 | `tg chats list --search Atlas --json` | 0 |
| 9 | `tg messages list 101 --limit 50 --json` | 0 |
| 10 | `tg messages list 102 --limit 50 --json` | 0 |
| 11 | `tg contacts show --help` | 0 |
| 12 | `tg chats show 101 --json` | 0 |
| 13 | `tg contacts show 'Анна' --json` | 6 |
| 14 | `tg contacts show 'Том' --json` | 0 |
| 15 | `tg contacts show 'Марко' --json` | 6 |
| 16 | `tg chats list --search 'Анна' --json` | 0 |
| 17 | `tg chats list --search 'Марко' --json` | 0 |
| 18 | `tg messages list 501 --limit 50 --json` | 0 |
| 19 | `tg messages search Atlas --limit 50 --newest --context 2 --json` | 0 |
| 20 | `tg store fetch --help` | 0 |
| 21 | `tg store status --json` | 0 |
