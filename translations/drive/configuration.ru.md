---
title: "Настройки"
---

Выберите хранение и разрешённые действия под свои задачи Drive. По умолчанию база отделена
от архива мессенджера; совместное хранение выбирается явно.

```sh
drive personal config show --json
drive work config show --json
drive personal config set readOnly true --defaults
```

| Настройка | Назначение |
| --- | --- |
| `drive NAME …` или `--profile NAME` | Нужен явный выбор аккаунта. `DRIVE_PROFILE` и прежний `defaultProfile` не выбирают его. |
| `DRIVE_CONFIG_DIR`, `DRIVE_STATE_DIR`, `DRIVE_CACHE_DIR` | Каталоги настроек, снимков/состояния и кеша инструмента. |
| `CLI_COMMON_CACHE_DIR` | Общий кеш поисковой модели; используйте тот же путь при скачивании и создании векторов. |
| `DRIVE_STORE` | Явный путь базы. Сделайте резервную копию и проверьте совместимость общих пакетов перед открытием другим инструментом. |
| `--read-only` | Запрет локальных и удалённых изменений в этом запуске. |
| `--offline` | Только кешированные чтения; запрещает sync, Google и извлечение ИИ. |
| `--json`, `--agent-json` | Структурированный вывод; агентский режим показывает управляющие символы явно. |

Для общих людей/проектов/сообщений укажите выбранную совместимую базу. Drive не ищет и не
открывает базы других инструментов автоматически. Общая база не объединяет входы, разрешения
Google и выбранные папки.

## Необязательное извлечение ИИ

Общие настройки определяют провайдера и модель извлечения памяти:

```sh
drive personal config set models.memories.provider '"openai"' --defaults
drive personal config set models.memories.model '"YOUR_MODEL_ID"' --defaults
drive personal config show --json
```

Замените `YOUR_MODEL_ID` идентификатором провайдера. Передавайте ключ через документированную
переменную, например `DRIVE_OPENAI_API_KEY`; не сохраняйте его в обычных настройках или чате.
Anthropic и совместимые OpenAI-сервисы используют общий шлюз. См.
[настройку ИИ](https://github.com/WireCatLabs/drive-cli/blob/2ec12e20c9a2dc192076287c56f2e84de41cf8e5/docs/dev/KNOWLEDGE_AND_API.md#memories-and-ai-extraction) и
[справочник](./commands.md). Продолжите с [извлечением памяти](./recipes.md#remember-a-source-backed-decision).
