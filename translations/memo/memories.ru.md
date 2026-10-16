---
title: "Память и факты"
---

Эта страница поможет сделать так, чтобы ИИ-агент запоминал то, что узнал, и записывал, что произошло.
При этом решать, что сохранить, будете вы. Memo хранит три вида записей, и у каждой есть источники,
которые её подтверждают:

- **запись памяти** — вывод, например «Kai предпочитает встречи по пятницам»;
- **факт** — то, что произошло, например решение, обещание или вопрос;
- **предложенное действие** — то, что агент хочет сделать, например ответ.

## Проверьте, что предложил агент

```text prompt
Use memo CLI to show the memories, facts and actions waiting for my review, with their evidence.
Do not confirm or approve anything; I will decide.
```

Или сами:

```sh
memo memories list status:proposed
memo facts list status:proposed
memo actions list status:proposed
```

Откройте каждый источник. Затем подтвердите то, что верно, а остальное оставьте или отклоните. Как это
сделать, описано ниже на этой странице.

**Что ждёт вашего решения.** Предложенное действие всегда ждёт одобрения или отклонения. Память или факт ждут, когда их добавляет агент: через [сервер MCP](./mcp.md) или команду `memo` в терминале агента (с `AI_AGENT` или `CLAUDECODE`), где автором записывается агент. Ваша запись подтверждается сразу; в терминале агента `--as-owner` делает запись вашей. Агент тоже может передать `--as-owner`, поэтому запретите ему это.

## Память

Запись памяти — это короткий вывод с **доказательствами**: ссылками на источники — сообщения, заметки
или встречи, которые его подтверждают. У записи есть вид и область:

- вид: `preference` (что человек любит или хочет), `summary` или `digest`;
- область: `personal` или `work`.

```sh
memo memories add 'Kai Sample prefers Friday meetings' --kind preference --scope work --evidence note:12
memo memories list kind:preference scope:work
memo memories show memory:3
memo search memories friday meetings scope:work
memo memories confirm memory:3
memo memories stale memory:3
```

Память, которую вы добавляете командой `memo`, подтверждается сразу. Запись агента остаётся `proposed`, пока вы не проверите основания и не выполните `confirm`. Если основания устарели, например Kai теперь предпочитает понедельники, пометьте запись `stale`. `--subject person:…` задаёт предмет записи. `memories list` фильтруется полями `kind`, `status`, `scope` и `subject` запроса: `subject:"person:42"`.

## Факты

Факт фиксирует произошедшее и его основания. Его вид — `fact`, `statement`, `question`, `decision` или `promise`.

```sh
memo facts add 'We moved the launch to spring' --kind decision --evidence 'msg:telegram/1/77/42'
memo facts list kind:decision project:HRB
memo facts show fact:4
memo facts confirm fact:4
```

Факт, который вы добавляете командой `memo`, принимается сразу. Запись агента остаётся `proposed` до `accept`; `author` и `origin` показывают автора. `facts list` фильтруется полями `kind`, `status`, `project` и `subject` запроса. `--project project:1` относит факт к проекту, а `--occurred-time` задаёт дату события.

Решение может заменить более раннее: добавьте `--supersedes fact:2`. Когда вы примете новое решение,
старое перестанет действовать. Если решение больше не действует и ничем не заменено, выполните
`memo facts reverse fact:4`.

## Предложенные действия

Предложенное действие — это то, что агент хочет сделать в одном из ваших аккаунтов: ответ, приглашение,
бан в группе. Memo никогда не выполняет его.

```sh
memo actions list status:proposed
memo actions show 5
memo actions confirm 5
memo actions reject 5
```

Если одобрить действие, оно станет задачей в том аккаунте, где его нужно выполнить, и появится в
`memo tasks list`. Затем вы выполняете его сами или просите агента сделать это через tg или max. Если
отклонить действие, оно закрывается, и ничего не выполняется.

Агент предлагает действие так:

```sh
memo actions add reply --reason 'Kai asked twice' --provider telegram --target 'msg:telegram/1/77/42' --payload '{"text":"Friday works"}'
```

## Что делали агенты

```sh
memo agents log --limit 20
memo agents log agent:memo-mcp
```

Журнал агентов показывает каждый вызов, который агент сделал через MCP-серверы Memo, tg и max, начиная
с самых новых: какой агент, какой инструмент, результат и время. Журнал никогда не хранит то, что
отправил агент.

## Через MCP-сервер

Приложение без терминала, например Claude Desktop, может добавлять память, факты и предложенные
действия через [MCP-сервер](./mcp.md). Всё, что оно добавляет, всегда ждёт вашего решения: через MCP
агент не может подтверждать, принимать, одобрять или отклонять.

Дальше: [подключите приложение через MCP](./mcp.md).
