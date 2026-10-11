---
title: "Найти документ"
---

Найдите решение без открытия каждого файла. Поиск использует локальную копию: сначала
синхронизируйте для свежих изменений и проверьте исходную ссылку, прежде чем действовать.

```text prompt
Use drive CLI with profile personal to find the budget decision in my imported project documents.
Show the matching passage and original Google link. Tell me which selected sources were skipped.
```

Для ручного использования:

```sh
drive personal search 'budget decision' --exact --json
drive personal search 'budget AND tag:follow-up' --exact --json
drive personal documents show DOC_ID --json
drive personal tags list DOC_ID --json
```

Замените `DOC_ID` идентификатором Google из результата. `--exact` ищет слова. Документ содержит
ID, заголовки и текст вкладок, таблицы и сноски. Колонтитулы, комментарии, изображения
и предлагаемые правки не индексируются. `tag:follow-up` ищет локальные метки отдельно либо со
словами. У `drive personal search` нет флага `--tag`; поля только для сообщений не поддерживаются.

## Искать по смыслу

Drive использует общий кеш локальной поисковой модели. Если используете Telegram или MAX,
подготовьте модель этим инструментом и создайте векторы импортированного текста:

```sh
tg personal models text download e5-small
drive personal sync --embed
drive personal search 'what did we agree to spend?' --json
```

Модель скачивается через сеть; векторы создаются локально. Drive не скачивает отсутствующую
модель автоматически. Поиск по словам работает без неё. Пустой результат означает отсутствие
совпадения среди импортированного, а не отсутствие документа в Google Drive.
См. [проблемы синхронизации](./troubleshooting.md).

## Проверить, что участвовало в поиске

`--limit` ограничивает число результатов, `--offset` пропускает указанное количество;
охват источников не расширяется. Поиск не загружает файлы из Google. Для свежего ответа
выполните `drive personal sync` и проверьте `drive personal status --json`. Для чтения кеша без сети:

```sh
drive personal --offline search 'budget' --exact --limit 10 --offset 0 --json
drive personal --offline documents show DOC_ID --json
```

Прочитайте фрагмент и источник, прежде чем считать их решением. Если есть `meaningSkipped`,
проверьте объяснение: не предполагается, что смысловой поиск выполнился. PDF, Sheets
и другие неподдерживаемые форматы исключены из точного и смыслового поиска.
См. [охват форматов](./usage.md#which-document-types-are-searchable) и
[сценарии](./recipes.md#refresh-a-project-and-prepare-a-meeting-brief).
