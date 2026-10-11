---
title: "Найти документ"
---

Найдите решение в импортированных документах, не открывая каждый файл. Поиск использует локальную
копию: синхронизируйте её для свежих изменений и проверьте ссылку на источник перед действием.

```text prompt
Use drive CLI to find the budget decision in my imported project documents.
Show the matching passage and original Google link. Tell me which selected sources were skipped.
```

Для ручной работы:

```sh
drive search 'budget decision' --exact --json
drive search 'budget AND tag:follow-up' --exact --json
drive documents show DOC_ID --json
drive tags list DOC_ID --json
```

Замените `DOC_ID` на Google ID результата. `--exact` выполняет поиск по словам. Детали документа
содержат ID, названия и текст вкладок. Таблицы и сноски включены; колонтитулы, комментарии,
изображения и предложенные правки не входят в индексируемый текст. Ищите локальные метки через `tag:follow-up`, отдельно или вместе со словами.
У `drive search` нет флага `--tag`; поля, относящиеся только к сообщениям, не поддерживаются.

## Искать по смыслу

Drive использует общий локальный кеш поискового компонента. Если вы также используете Telegram
или MAX, подготовьте его через этот инструмент, затем создайте векторы импортированного текста:

```sh
tg models text download e5-small
drive sync --embed
drive search 'what did we agree to spend?' --json
```

Скачивание использует сеть; создание векторов выполняется локально. Drive не скачивает отсутствующий
компонент автоматически. Поиск по словам работает без него. Пустой результат означает отсутствие
совпадения среди импортированных источников, а не отсутствие документа в Google Drive.
Проверьте [ошибки синхронизации](./troubleshooting.md).
