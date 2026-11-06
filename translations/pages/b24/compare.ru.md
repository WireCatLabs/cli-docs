---
title: "Сравнение с другими инструментами"
---

<a id="features" />
<a id="when-another-tool-fits-better" />

`b24` — это командная строка и MCP-сервер для данных продаж портала Битрикс24: сделок, лидов, контактов, компаний,
воронок, товаров и сотрудников. Здесь он стоит рядом с другими инструментами, через которые ИИ-агент читает и меняет
CRM Битрикс24, чтобы вы могли выбрать тот, что подходит для вашей работы. Оценки для `b24` взяты из его выпуска
0.5.0, его команд и исходного кода, проверенных 7 ноября 2026 года; они проверяются заново при каждом выпуске. Оценки
для остальных инструментов взяты из их собственной документации, страниц в каталогах и исходного кода, проверенных
7 ноября 2026 года. Ни в один инструмент не входили и вживую их не проверяли; инструмент может уметь больше, чем
говорят его страницы.

Инструменты:

- **b24** — этот инструмент. Хранит копию сделок, лидов и воронок на вашем компьютере и для каждого действия решает,
  что может агент. Входит через входящий вебхук портала.
- **[Vibecode MCP](https://vibecode.bitrix24.com/docs-content-en/mcp.md)** — собственный MCP-сервер Битрикс24, на
  его Vibecode API, с 53 инструментами для всей платформы (npm `@bitrix24/mcp-vibecode-api`, выпуск 3.4.1 от
  6 ноября 2026 года). Нужен платный тариф Битрикс24.
- **[Zapier MCP](https://zapier.com/mcp/bitrix24-crm-new)** — MCP-сервер Zapier в облаке, с приложением Bitrix24 CRM.
  Каждый вызов инструмента расходует две задачи Zapier.
- **[MCP Bridge](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/)** — облачный
  MCP-коннектор из Маркета Битрикс24, его сделала компания-партнёр (604 установки на 7 ноября 2026 года).
- **[bitrix24-mcp-server](https://github.com/gunnit/bitrix24-mcp-server)** — MCP-сервер с открытым кодом для всей
  CRM с наибольшим числом звёзд (35 звёзд, последнее изменение в июле 2025 года).

✅ да · 🟡 частично · ❌ нет · ➖ нет в документации · n/a неприменимо

## Функции

| Задача | b24 | [Vibecode MCP](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [Zapier MCP](https://zapier.com/mcp/bitrix24-crm-new) | [MCP Bridge](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/) | [bitrix24-mcp-server](https://github.com/gunnit/bitrix24-mcp-server) |
|---|:-:|:-:|:-:|:-:|:-:|
| **Найти и прочитать** | | | | | |
| Открытые сделки одной стадии или воронки | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [🟡](https://zapier.com/mcp/bitrix24-crm-new) | [✅](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/) | [✅](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts#L470-L500) |
| Воронка: сколько сделок дошло до каждой стадии | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | ➖ | ➖ | ➖ |
| Читать сделки и лиды без интернета | ✅ | ➖ | ➖ | ➖ | ➖ |
| Найти сделку или лид по слову из названия | ✅ | [🟡](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [🟡](https://zapier.com/mcp/bitrix24-crm-new) | ➖ | ➖ |
| Один поиск по сделкам и по сообщениям и заметкам из других ваших инструментов | ✅ | ➖ | ➖ | ➖ | ➖ |
| Свои поля портала, с названиями и вариантами | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [🟡](https://www.bitrix24.pl/apps/app/integrations24.zapierbitrix24crm/) | ➖ | ➖ |
| Читать товары и сотрудников | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | ➖ | ➖ | [🟡](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts#L805) |
| **Изменить CRM** | | | | | |
| Создать и изменить сделку или лид | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [✅](https://zapier.com/apps/bitrix24-crm-new/integrations) | [🟡](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/) | [✅](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts#L79-L147) |
| Создать и изменить контакты и компании | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [✅](https://zapier.com/apps/bitrix24-crm-new/integrations) | [🟡](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/) | [✅](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts#L6-L78) |
| Перевести сделку на стадию по её названию | ✅ | [🟡](https://unpkg.com/@bitrix24/mcp-vibecode-api@3.4.1/dist/tools/entities.js) | ➖ | ➖ | [🟡](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts#L142) |
| Закрыть сделку как выигранную или проигранную одним шагом | ✅ | [🟡](https://unpkg.com/@bitrix24/mcp-vibecode-api@3.4.1/dist/tools/entities.js) | ➖ | ➖ | [🟡](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts#L142) |
| Удалить сделку или лид | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | ➖ | [🟡](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/) | [❌](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts) |
| Заполнить пользовательское поле по его названию | 🟡 | ➖ | ➖ | ➖ | ➖ |
| Вызвать любой другой метод Битрикс24 | ✅ | [🟡](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | ➖ | ➖ | ➖ |
| **Агенты и безопасность** | | | | | |
| Оставить агенту только чтение | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/keys-auth/access-mode.md) | [🟡](https://zapier.com/mcp) | ➖ | ➖ |
| Для каждого действия выбрать: разрешить, спросить или запретить | ✅ | [🟡](https://vibecode.bitrix24.com/docs-content-en/keys-auth.md) | [🟡](https://zapier.com/mcp) | ➖ | ➖ |
| Перед удалением спрашивает | 🟡 | [🟡](https://unpkg.com/@bitrix24/mcp-vibecode-api@3.4.1/dist/tools/entities.js) | ➖ | ➖ | n/a |
| Методы, которые пишут людям или запускают бизнес-процессы, запрещены, пока вы их не разрешите | ✅ | [🟡](https://vibecode.bitrix24.com/docs-content-en/keys-auth.md) | ➖ | ➖ | ➖ |
| Передать запись другому сотруднику нельзя, пока вы это не разрешите | ✅ | ➖ | ➖ | ➖ | ➖ |
| Увидеть, что сделает запись, не выполняя её | ✅ | ➖ | ➖ | ➖ | ➖ |
| Запись не отправляется дважды, если ответ потерялся | ✅ | ➖ | ➖ | ➖ | ➖ |
| Вебхук или ключ хранится в системном хранилище ключей | ✅ | [❌](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | n/a | n/a | ➖ |
| **Подготовка** | | | | | |
| Несколько порталов, каждый назван в команде | ✅ | [🟡](https://vibecode.bitrix24.com/docs-content-en/keys-auth.md) | ➖ | ➖ | ➖ |
| Работает из ChatGPT или Claude в браузере | 🟡 | [🟡](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [✅](https://zapier.com/mcp) | [✅](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/) | [🟡](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/server.js#L91) |

| | b24 | Vibecode MCP | Zapier MCP | MCP Bridge | bitrix24-mcp-server |
|---|---|---|---|---|---|
| Установить | npm, Node 22.16+ или 24+ | npm, Node 18+ | не нужно: в облаке | из Маркета Битрикс24 | из исходного кода |
| Лицензия | Apache-2.0 | MIT | закрытый сервис | закрытый сервис | MIT в `package.json`, файла лицензии нет |
| Цена | бесплатно | платный тариф Битрикс24 | две задачи Zapier за вызов | бесплатно, с платными дополнениями | бесплатно |

Пояснения к столбцу `b24`:

- **Только чтение.** `B24_READ_ONLY=1` запрещает любую запись, что бы ни говорили настройки. Уровень `readonly` делает
  то же для одного ключа. Без них новый профиль позволяет агенту создавать, менять, переводить по стадиям и закрывать
  сделки и лиды.
- **Разрешить, спросить или запретить.** У каждой команды свой ключ разрешения, например `deals.delete` или
  `leads.move`, со значением `allow`, `ask`, `readonly` или `deny` в [настройках](./configuration.md#permissions).
  `mcp serve --permission` делает ключ строже только для одного сервера. Агент через MCP не может менять эти
  настройки.
- **Перед удалением спрашивает** в терминале. Через MCP отвечать некому, поэтому `ask` пропускает агента. Чтобы агент
  не мог удалять, поставьте `deals.delete` и `leads.delete` в `deny`. Поэтому эта строка — частично.
- **Сообщения и бизнес-процессы.** `api call` запрещает методы, которые пишут людям, публикуют, запускают
  бизнес-процессы или создают задачи, пока вы их не разрешите. Смена стадии всё равно может запустить роботов
  портала, а они могут написать вашим клиентам: поставьте `deals.move` и `leads.move` в `ask` или `deny`, если на
  вашем портале есть такие роботы. См. [безопасность](./security.md).
- **Другой сотрудник.** Битрикс24 сообщает сотруднику, когда ему передают запись, поэтому `--owner` с другим
  сотрудником запрещён, пока вы не поставите `crm.assign-others` в `allow`.
- **Без интернета.** `sync` копирует воронки, сделки, лиды, контакты и компании в локальное хранилище, а `deals`,
  `leads`, `pipelines` и `stages` читают его, в том числе с `--offline`. `people`, `organizations`, `products` и
  `users` всегда обращаются к порталу.
- **Один поиск.** `search all` находит сделки и лиды по словам названия рядом с сообщениями, заметками и событиями,
  которые сохранили другие инструменты WireCat на том же компьютере, без интернета.
- **Пользовательские поля по названию.** Контакты и компании принимают пользовательское поле по названию или коду.
  Сделки и лиды — по коду, как его печатает `fields list`. Поэтому эта строка — частично.
- **Запись отправляется один раз.** Запись, на которую не пришёл ответ, не отправляется снова: она заканчивается
  `outcome_unknown` со своим `operation_id`, который Битрикс24 получает как `Idempotency-Key`. Проверьте портал,
  прежде чем повторять её.
- **Только один вызов.** `api call` оставлен для вас в терминале; ни один инструмент MCP его не предлагает.
- **ChatGPT или Claude в браузере.** `mcp serve --http` отдаёт инструмент через HTTPS-туннель, который вы
  настраиваете и держите сами, поэтому эта строка — частично. См. [использование](./usage.md#agents).
- **Скорость и стоимость по сравнению с браузерным агентом.** `b24` обращается к REST API портала и читает свою копию;
  браузер он не открывает. Измерений по сравнению с браузерным агентом не опубликовано, поэтому эта страница ничего
  не утверждает.

## Когда другой инструмент подходит лучше

- **Zapier MCP** — вам нужен Битрикс24 в ChatGPT или Claude в браузере, и ничего не запускать на своём компьютере.
- **MCP Bridge** — вашей команде нужен один коннектор из Маркета Битрикс24, для CRM и для задач.
- **Vibecode MCP** — вам нужно больше, чем данные продаж, например задачи, чаты и бизнес-процессы, через собственный
  сервер Битрикс24.

Если `b24` подходит, начните с [установки](./installation.md). Чтобы работать с ним через агента, см.
[использование](./usage.md).
