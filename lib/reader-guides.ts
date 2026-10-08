type TaskSection = { id: string; title: string; prompt: string; result: string; page: string; link: string }
const copy = {
  en: {
    intro:
      "Your account is connected. Choose a task below, ask your assistant and check the result. Replace the example chat and person with your own. Exact commands remain available in the reference at the end.",
    reference: "Exact commands and advanced details",
    usage: [
      [
        "read",
        "Catch up on a conversation",
        "In {messenger}, read yesterday’s messages in my project group. Give me the decisions, questions for me and sources. Only read; do not send or mark anything as read.",
        "Expect a short summary with source messages and the period checked. Voice messages that could not be transcribed should be identified.",
        "first-tasks",
        "First tasks",
      ],
      [
        "search",
        "Find an older agreement",
        "In {messenger}, find the project deadline we agreed last month. Show the agreement and any later change. Tell me which history you checked; do not send anything.",
        "Expect the agreed date and supporting messages. If the period is missing, download the relevant history before treating an empty search as an answer.",
        "search",
        "Search and history",
      ],
      [
        "files",
        "Collect the right documents",
        "In {messenger}, find the agreed contract and presentation in my project group. Show each version and the message approving it. Do not download or send anything yet.",
        "Check the list, then specify which files to save and the folder. Downloading a file, reading its contents and extracting searchable text are separate steps.",
        "prompting#files-and-voice",
        "Files and voice",
      ],
      [
        "reply",
        "Prepare a reply for review",
        "In {messenger}, read my conversation with Anna from today and draft a short answer to her latest question. Use confirmed facts; show the draft without sending it.",
        "Expect a ready-to-review draft. Check the recipient and wording, then give a separate instruction to send that exact message.",
        "prompting",
        "Writing requests",
      ],
    ],
    rankingintro:
      "Find discussions needing attention and check the messages behind a report. This page starts with a task and an example of missing history. Metric definitions, selection syntax and evidence commands are in the reference below.",
    rankingsection: [
      "report",
      "Ask for a report you can check",
      "In {messenger}, review my project group for 1–7 October 2026. Show questions without an observed answer, the source messages and gaps in the available history. Do not rank people or change anything.",
      "Check the chats, dates and sources before acting. A report describes saved observations; unknown counts and missing messages must remain unknown.",
      "group-admins",
      "Group administration",
    ],
    fixturetitle: "Example: history is incomplete",
    fixtureintro:
      "This synthetic example has three stored messages from 1–3 October. The request covers 1–7 October; messages for 4–7 October are not present.",
    headers: ["Date", "Message", "Connection"],
    fixture: [
      ["1 October", "When is the presentation ready?", "Question 101"],
      ["2 October", "It is ready.", "The selected participant replies to 101"],
      ["3 October", "Which version should we use?", "Question 103"],
    ],
    fixtureoutcome:
      "The checked report observes two questions and one answer. Question 103 has no observed answer in the saved data. That does not prove nobody answered later: 4–7 October is missing. The useful next step is to fetch that history and rerun the report, not label someone unresponsive.",
    fixturelimit:
      "Different reports expose different quality information: archive scope, reply relationships, join observations or counter freshness. Check the fields for the metric you chose; there is no single completeness score for every report.",
    next: "Download and check history",
  },
  ru: {
    intro:
      "Аккаунт подключён. Выберите задачу ниже, задайте её ассистенту и проверьте результат. Замените название чата и человека из примера на свои. Точные команды остаются в справке в конце страницы.",
    reference: "Точные команды и дополнительные настройки",
    usage: [
      [
        "read",
        "Разобрать переписку",
        "В {messenger} прочитай вчерашние сообщения в моей проектной группе. Покажи решения, вопросы ко мне и источники. Только читай: не отправляй ничего и не отмечай сообщения прочитанными.",
        "Ожидайте короткую сводку с исходными сообщениями и проверенным периодом. Голосовые, которые не удалось распознать, должны быть отмечены.",
        "first-tasks",
        "Первые задачи",
      ],
      [
        "search",
        "Найти старую договорённость",
        "В {messenger} найди, какой срок проекта мы согласовали в прошлом месяце. Покажи договорённость и более поздние изменения. Укажи, какую историю проверил; ничего не отправляй.",
        "Ожидайте согласованную дату и подтверждающие сообщения. Если периода нет в архиве, сначала загрузите нужную историю, прежде чем считать пустой поиск ответом.",
        "search",
        "Поиск и история",
      ],
      [
        "files",
        "Собрать нужные документы",
        "В {messenger} найди согласованный договор и презентацию в моей проектной группе. Покажи версии и сообщение с согласованием каждой. Пока не скачивай и не отправляй.",
        "Проверьте список, затем укажите, какие файлы сохранить и в какую папку. Скачать файл, прочитать содержимое и сохранить текст для поиска — разные шаги.",
        "prompting#files-and-voice",
        "Файлы и голосовые",
      ],
      [
        "reply",
        "Подготовить ответ для проверки",
        "В {messenger} прочитай мою переписку с Анной за сегодня и подготовь короткий ответ на её последний вопрос. Используй подтверждённые факты, покажи черновик без отправки.",
        "Ожидайте готовый черновик. Проверьте адресата и текст, затем отдельно разрешите отправку именно этого сообщения.",
        "prompting",
        "Как формулировать запросы",
      ],
    ],
    rankingintro:
      "Найдите обсуждения, которым нужно внимание, и проверьте сообщения, на которых основан отчёт. Здесь сначала идут запрос и пример неполной истории. Определения метрик, точные запросы и команды проверки источников — в справке ниже.",
    rankingsection: [
      "report",
      "Попросить проверяемый отчёт",
      "В {messenger} проверь мою проектную группу за 1–7 октября 2026. Покажи вопросы без наблюдаемого ответа, исходные сообщения и пробелы доступной истории. Не оценивай людей и ничего не меняй.",
      "Проверьте чаты, даты и источники перед действиями. Отчёт описывает сохранённые наблюдения; неизвестные счётчики и отсутствующие сообщения должны оставаться неизвестными.",
      "group-admins",
      "Администрирование групп",
    ],
    fixturetitle: "Пример: история неполная",
    fixtureintro:
      "В этом искусственном примере сохранены три сообщения за 1–3 октября. Запрос охватывает 1–7 октября, но сообщений за 4–7 октября в копии нет.",
    headers: ["Дата", "Сообщение", "Связь"],
    fixture: [
      ["1 октября", "Когда будет готова презентация?", "Вопрос 101"],
      ["2 октября", "Она готова.", "Выбранный участник отвечает на 101"],
      ["3 октября", "Какую версию использовать?", "Вопрос 103"],
    ],
    fixtureoutcome:
      "Проверенный отчёт видит два вопроса и один ответ. У вопроса 103 нет наблюдаемого ответа в сохранённых данных. Это не доказывает, что позже никто не ответил: история за 4–7 октября отсутствует. Полезный следующий шаг — загрузить её и повторить отчёт, а не считать человека неотзывчивым.",
    fixturelimit:
      "У разных отчётов разные сведения о качестве: охват архива, связи ответов, наблюдения вступлений или свежесть счётчиков. Проверяйте поля выбранной метрики; единого показателя полноты для всех отчётов нет.",
    next: "Загрузить и проверить историю",
  },
  es: {
    intro:
      "La cuenta está conectada. Elige una tarea, pídela al asistente y comprueba el resultado. Sustituye el chat y la persona de ejemplo por los tuyos. Los comandos exactos siguen disponibles al final.",
    reference: "Comandos exactos y detalles avanzados",
    usage: [
      [
        "read",
        "Ponerte al día",
        "En {messenger}, lee los mensajes de ayer en mi grupo del proyecto. Muestra decisiones, preguntas para mí y fuentes. Solo lee: no envíes ni marques mensajes como leídos.",
        "Espera un resumen breve con mensajes de origen y el periodo revisado. Debe indicar las grabaciones que no pudo transcribir.",
        "first-tasks",
        "Primeras tareas",
      ],
      [
        "search",
        "Encontrar un acuerdo antiguo",
        "En {messenger}, busca el plazo del proyecto que acordamos el mes pasado. Muestra el acuerdo y los cambios posteriores. Indica qué historial revisaste y no envíes nada.",
        "Espera la fecha acordada y mensajes que la respalden. Si falta el periodo, descarga el historial necesario antes de interpretar una búsqueda vacía.",
        "search",
        "Búsqueda e historial",
      ],
      [
        "files",
        "Reunir documentos",
        "En {messenger}, encuentra el contrato y la presentación aprobados en mi grupo del proyecto. Muestra las versiones y el mensaje de aprobación de cada una. No descargues ni envíes todavía.",
        "Revisa la lista y especifica archivos y carpeta. Descargar, leer contenido y guardar texto para buscar son pasos distintos.",
        "prompting#files-and-voice",
        "Archivos y voz",
      ],
      [
        "reply",
        "Preparar una respuesta",
        "En {messenger}, lee mi conversación con Anna de hoy y prepara una respuesta breve a su última pregunta. Usa hechos confirmados y muestra el borrador sin enviarlo.",
        "Espera un borrador para revisar. Comprueba destinatario y texto, y autoriza después el envío de ese mensaje exacto.",
        "prompting",
        "Cómo formular peticiones",
      ],
    ],
    rankingintro:
      "Encuentra conversaciones que necesitan atención y comprueba las fuentes del informe. Aquí empiezas por una petición y un ejemplo de historial incompleto. Las métricas, consultas y comandos de fuentes están en la referencia inferior.",
    rankingsection: [
      "report",
      "Pedir un informe comprobable",
      "En {messenger}, revisa mi grupo del proyecto del 1 al 7 de octubre de 2026. Muestra preguntas sin respuesta observada, mensajes de origen y lagunas del historial. No evalúes a personas ni cambies nada.",
      "Comprueba chats, fechas y fuentes antes de actuar. El informe describe observaciones guardadas; datos ausentes y contadores desconocidos deben seguir siendo desconocidos.",
      "group-admins",
      "Administración de grupos",
    ],
    fixturetitle: "Ejemplo: falta historial",
    fixtureintro:
      "Este ejemplo sintético guarda tres mensajes del 1 al 3 de octubre. La consulta abarca del 1 al 7, pero faltan los mensajes del 4 al 7.",
    headers: ["Fecha", "Mensaje", "Relación"],
    fixture: [
      ["1 de octubre", "¿Cuándo estará lista la presentación?", "Pregunta 101"],
      ["2 de octubre", "Ya está lista.", "El participante elegido responde a 101"],
      ["3 de octubre", "¿Qué versión debemos usar?", "Pregunta 103"],
    ],
    fixtureoutcome:
      "El informe comprobado observa dos preguntas y una respuesta. La pregunta 103 no tiene respuesta observada en los datos guardados. No demuestra que nadie respondiera después: faltan los días 4–7. Descarga ese historial y repite el informe antes de juzgar la participación.",
    fixturelimit:
      "Cada informe expone información de calidad distinta: archivo disponible, relaciones de respuesta, entradas observadas o frescura de contadores. Comprueba los campos de tu métrica; no existe una única puntuación de completitud.",
    next: "Descargar y comprobar el historial",
  },
}

export function readerGuide(slugs: string[], lang: string) {
  if (slugs.length !== 2 || !["tg", "max"].includes(slugs[0]) || !["usage", "rankings"].includes(slugs[1])) return
  const words = copy[lang === "ru" || lang === "es" ? lang : "en"]
  const rankings = slugs[1] === "rankings"
  const sections: TaskSection[] = (rankings ? [words.rankingsection] : words.usage).map(
    ([id, title, prompt, result, page, link]) => ({
      id: `task-${id}`,
      title,
      prompt: prompt.replace("{messenger}", slugs[0] === "tg" ? "Telegram" : "MAX"),
      result,
      page,
      link,
    }),
  )
  const locale = lang === "ru" || lang === "es" ? lang : "en"
  const titles = {
    en: ["Everyday tasks", "Conversation reports"],
    ru: ["Повседневные задачи", "Отчёты по переписке"],
    es: ["Tareas cotidianas", "Informes de conversaciones"],
  }
  const descriptions = {
    en: [
      "Read conversations, find agreements, collect documents and prepare replies with your connected messenger.",
      "Find questions needing attention and check the report’s sources and missing history before drawing conclusions.",
    ],
    ru: [
      "Читайте переписку, находите договорённости, собирайте документы и готовьте ответы с подключённым мессенджером.",
      "Найдите вопросы, которым нужно внимание, и проверьте источники отчёта и пробелы истории перед выводами.",
    ],
    es: [
      "Lee conversaciones, encuentra acuerdos, reúne documentos y prepara respuestas con tu mensajero conectado.",
      "Encuentra preguntas pendientes y comprueba fuentes e historial ausente antes de sacar conclusiones.",
    ],
  }
  return {
    title: titles[locale][rankings ? 1 : 0],
    description: `${slugs[0] === "tg" ? "Telegram" : "MAX"}: ${descriptions[locale][rankings ? 1 : 0]}`,
    intro: rankings ? words.rankingintro : words.intro,
    sections,
    reference: words.reference,
    fixture: rankings
      ? {
          title: words.fixturetitle,
          intro: words.fixtureintro,
          headers: words.headers,
          rows: words.fixture,
          outcome: words.fixtureoutcome,
          limit: words.fixturelimit,
          next: words.next,
        }
      : undefined,
  }
}
export function readerGuideMarkdown(slugs: string[], lang: string) {
  const guide = readerGuide(slugs, lang)
  if (!guide) return ""
  let text = `${guide.intro}\n\n`
  for (const section of guide.sections)
    text += `## ${section.title}\n\n\`\`\`text prompt\n${section.prompt}\n\`\`\`\n\n${section.result}\n\n[${section.link}](/${lang}/docs/${section.page})\n\n`
  if (guide.fixture) {
    const fixture = guide.fixture
    text += `## ${fixture.title}\n\n${fixture.intro}\n\n| ${fixture.headers.join(" | ")} |\n| --- | --- | --- |\n${fixture.rows.map((row) => `| ${row.join(" | ")} |`).join("\n")}\n\n${fixture.outcome}\n\n${fixture.limit}\n\n[${fixture.next}](/${lang}/docs/search)\n\n`
  }
  return `${text}## ${guide.reference}\n\n`
}
