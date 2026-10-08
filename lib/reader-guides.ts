import { botOnboarding } from "./bot-onboarding.ts"
import { type ReportTask, reportTasks } from "./report-tasks.ts"
import { roleGuide, roleLabels } from "./role-guides.ts"

type TaskSection = ReportTask
const copy = {
  en: {
    intro:
      "Gather context for a decision: what changed, which materials you need and whom to answer. Choose a task, substitute your chats and send the request to your agent. First tasks offers a short starting request; these tasks combine several messages.",
    reference: "Exact commands and advanced details",
    usage: [
      [
        "changes",
        "What changed while I was away?",
        "Use {cli} CLI. I missed three days in my work group. Compare the latest agreements with those before I left: deadlines, scope and owners. Show only changes, disagreements and source messages. Do not send anything.",
        "Expect a before → after list. For example: Friday’s deadline became Monday; the new date was confirmed, but the new owner was only proposed.",
        "search",
        "Find and check agreements",
      ],
      [
        "materials",
        "Gather meeting materials",
        "Use {cli} CLI. Find tomorrow’s meeting materials in my work group and conversation with Anna: the current presentation, cost estimate and open questions. Show the latest approval message for each file. List them first; do not download or send anything.",
        "Expect approved versions and questions for the agenda. Then ask to save selected files to a folder you specify.",
        "prompting#files-and-voice",
        "Working with files",
      ],
      [
        "context",
        "Make sense of a long discussion",
        "Use {cli} CLI. Find last month’s trip discussion in the parents group. Gather the date, meeting place, cost and things to bring. Separate confirmed decisions from proposals and show source messages. Do not send anything.",
        "Expect a practical checklist instead of dozens of messages. If the meeting place was discussed but never chosen, it should remain an open question.",
        "search",
        "Search by topic",
      ],
      [
        "followup",
        "Check commitments before replying",
        "Use {cli} CLI. Before replying to the contractor, check our private conversation and renovation group for the last two weeks. What did we promise, what is done and what needs clarification? Prepare a reply with supporting agreements. Show the draft without sending.",
        "Expect a checkable list of commitments and a draft informed by both conversations. Unconfirmed dates and promises should remain questions.",
        "prompting",
        "Refine your request",
      ],
    ],
    rankingintro:
      "See which groups are active, where questions remain and which discussions need attention. Ask for a report over a chosen period: your agent gathers metrics and helps you move from numbers to messages. Below is a weekly overview of three groups.",
    rankingsection: [
      "report",
      "Compare groups over a week",
      "Use {cli} CLI. Review the Project, Parents and Renovation groups for 1–7 October: message counts, active participants, daily activity and questions without a found answer. Compare groups and show messages worth following up. State the history coverage. Do not send anything.",
      "Expect an activity overview and a short action list. The largest count is not the only priority: a smaller group can also hold a question needing your decision.",
      "group-admins",
      "More group tasks",
    ],
    fixturetitle: "A week in three groups",
    fixtureintro:
      "For example, an overview for 1–7 October helps you understand the workload and choose where to start. Read the totals first, then daily activity and questions to check.",
    headers: ["Group", "Messages", "Active participants", "Questions without answers"],
    fixture: [
      ["Project", "420", "24", "3"],
      ["Parents", "180", "12", "0"],
      ["Renovation", "84", "8", "1"],
    ],
    fixtureoutcome:
      "Start with Project: the busiest group has three questions to revisit. Renovation has fewer messages, but the delivery date still needs clarification. Parents has answers for all identified questions. Ask: “Show these four questions with subsequent messages and suggest whom to answer first.”",
    fixturelimit:
      "“Question without an answer” means no answer was found in the checked history. Open the context: someone may have answered elsewhere or later. If only part of the week was checked, download the missing history and refresh the overview. Participants are counted per group; one person may appear in several.",
    next: "Download the history you need",
  },
  ru: {
    intro:
      "Соберите контекст для конкретного решения: что изменилось, какие материалы нужны и кому ответить. Выберите задачу, подставьте свои чаты и отправьте запрос агенту. Для первого короткого запроса откройте «Первые задачи»; здесь — задачи, в которых нужно сопоставить несколько сообщений.",
    reference: "Точные команды и дополнительные настройки",
    usage: [
      [
        "changes",
        "Что изменилось, пока меня не было",
        "Используй {cli} CLI. Я не читал рабочую группу три дня. Сравни последние договорённости с теми, что были до моего отсутствия: сроки, объём работы и ответственные. Покажи только изменения, спорные места и сообщения-источники. Ничего не отправляй.",
        "Вы получите список «было → стало», а не пересказ всех сообщений. Например: срок перенесли с пятницы на понедельник; новый срок подтвердили, а нового ответственного пока только предложили.",
        "search",
        "Найти и проверить договорённости",
      ],
      [
        "materials",
        "Собрать пакет материалов для встречи",
        "Используй {cli} CLI. Найди в рабочей группе и переписке с Анной материалы для завтрашней встречи: актуальную презентацию, расчёт стоимости и список открытых вопросов. Для каждого файла покажи сообщение с последним согласованием. Сначала покажи список, не скачивай и ничего не отправляй.",
        "Вы получите список нужных файлов с объяснением, какая версия согласована, и вопросы для повестки. Потом попросите сохранить выбранные файлы в указанную папку.",
        "prompting#files-and-voice",
        "Работа с файлами",
      ],
      [
        "context",
        "Разобраться в долгом обсуждении",
        "Используй {cli} CLI. В группе родителей найди обсуждение поездки за последний месяц. Собери в одном ответе дату, место встречи, стоимость и что нужно взять. Отдели подтверждённые решения от предложений, приложи исходные сообщения. Ничего не отправляй.",
        "Вместо десятков сообщений получите памятку. Если место встречи обсуждали, но не выбрали, агент оставит этот вопрос открытым.",
        "search",
        "Поиск по теме",
      ],
      [
        "followup",
        "Проверить обещания перед ответом",
        "Используй {cli} CLI. Перед ответом подрядчику проверь нашу личную переписку и группу ремонта за две недели. Что мы обещали друг другу, что уже выполнено и что ещё нужно уточнить? Подготовь ответ со ссылками на договорённости. Покажи черновик без отправки.",
        "Вы получите проверяемый список обязательств и черновик, который учитывает обе переписки. Даты и обещания без подтверждения должны остаться вопросами.",
        "prompting",
        "Как уточнить запрос",
      ],
    ],
    rankingintro:
      "Узнайте, какие группы активны, где остались вопросы и какие обсуждения требуют внимания. Попросите отчёт за выбранный период: агент соберёт показатели и поможет перейти от цифр к конкретным сообщениям. Ниже — пример недельного обзора трёх групп.",
    rankingsection: [
      "report",
      "Сравнить группы за неделю",
      "Используй {cli} CLI. Составь обзор групп «Проект», «Родители» и «Ремонт» за 1–7 октября: число сообщений, активных участников, активность по дням и вопросы без найденного ответа. Сравни группы, покажи сообщения для вопросов, к которым стоит вернуться. Укажи охват истории. Ничего не отправляй.",
      "Вы получите обзор активности и короткий список следующих действий. Важен не только самый большой счётчик: в небольшой группе тоже может остаться вопрос, который требует вашего решения.",
      "group-admins",
      "Другие задачи с группами",
    ],
    fixturetitle: "Неделя в трёх группах",
    fixtureintro:
      "Например, обзор за 1–7 октября помогает увидеть общую нагрузку и выбрать, с какой группы начать. Сначала — итоги, затем активность по дням и вопросы для проверки.",
    headers: ["Группа", "Сообщения", "Активные участники", "Вопросы без ответа"],
    fixture: [
      ["Проект", "420", "24", "3"],
      ["Родители", "180", "12", "0"],
      ["Ремонт", "84", "8", "1"],
    ],
    fixtureoutcome:
      "Начните с группы «Проект»: там больше всего переписки и три вопроса, к которым стоит вернуться. В «Ремонте» сообщений меньше, но ждёт уточнения дата доставки. В группе «Родители» найдены ответы на все отмеченные вопросы. Попросите: «Покажи эти четыре вопроса вместе с последующими сообщениями и предложи, кому ответить первым».",
    fixturelimit:
      "«Вопрос без ответа» означает, что в проверенной переписке ответ не найден. Перед выводом откройте контекст: могли ответить в другой группе или позже. Если агент проверил только часть недели, попросите загрузить недостающую историю и обновить обзор. Число активных участников считается отдельно для каждой группы; один человек может участвовать в нескольких.",
    next: "Как загрузить нужную историю",
  },
  es: {
    intro:
      "Reúne contexto para decidir: qué cambió, qué materiales necesitas y a quién responder. Elige una tarea, sustituye los chats y envía la petición. Primeras tareas ofrece un inicio breve; aquí se combinan varios mensajes.",
    reference: "Comandos exactos y detalles avanzados",
    usage: [
      [
        "changes",
        "Qué cambió durante mi ausencia",
        "Usa {cli} CLI. No he leído el grupo de trabajo en tres días. Compara los últimos acuerdos con los anteriores: plazos, alcance y responsables. Muestra cambios, desacuerdos y mensajes de origen. No envíes nada.",
        "Recibirás una lista antes → después. Por ejemplo: el plazo pasó del viernes al lunes; la fecha se confirmó, pero el nuevo responsable solo se propuso.",
        "search",
        "Buscar y comprobar acuerdos",
      ],
      [
        "materials",
        "Reunir materiales para una reunión",
        "Usa {cli} CLI. Busca los materiales de la reunión de mañana en el grupo de trabajo y mi conversación con Anna: presentación actual, presupuesto y preguntas abiertas. Muestra el último mensaje de aprobación de cada archivo. Primero lista los archivos; no descargues ni envíes nada.",
        "Recibirás las versiones aprobadas y preguntas para la agenda. Después pide guardar archivos concretos en la carpeta que elijas.",
        "prompting#files-and-voice",
        "Trabajar con archivos",
      ],
      [
        "context",
        "Entender una conversación larga",
        "Usa {cli} CLI. Busca la conversación sobre la excursión del último mes en el grupo de padres. Reúne fecha, lugar, coste y cosas que llevar. Separa decisiones confirmadas de propuestas y muestra fuentes. No envíes nada.",
        "Recibirás una lista práctica en lugar de decenas de mensajes. Si se habló del lugar sin elegirlo, seguirá siendo una pregunta abierta.",
        "search",
        "Buscar por tema",
      ],
      [
        "followup",
        "Comprobar compromisos antes de responder",
        "Usa {cli} CLI. Antes de responder al contratista, revisa nuestro chat privado y el grupo de reforma de las últimas dos semanas. ¿Qué prometimos, qué está hecho y qué falta aclarar? Prepara una respuesta con acuerdos que la respalden. Muestra el borrador sin enviarlo.",
        "Recibirás compromisos comprobables y un borrador con contexto de ambos chats. Fechas y promesas sin confirmar seguirán siendo preguntas.",
        "prompting",
        "Precisar la petición",
      ],
    ],
    rankingintro:
      "Consulta qué grupos están activos, dónde quedan preguntas y qué conversaciones necesitan atención. Pide un informe para un periodo: el agente reúne indicadores y te lleva de las cifras a los mensajes. Abajo tienes un resumen semanal de tres grupos.",
    rankingsection: [
      "report",
      "Comparar grupos durante una semana",
      "Usa {cli} CLI. Revisa los grupos Proyecto, Padres y Reforma del 1 al 7 de octubre: mensajes, participantes activos, actividad diaria y preguntas sin respuesta encontrada. Compara grupos y muestra mensajes para retomar. Indica el historial revisado. No envíes nada.",
      "Recibirás un resumen de actividad y acciones siguientes. La mayor cifra no es la única prioridad: un grupo pequeño también puede tener una pregunta que necesita tu decisión.",
      "group-admins",
      "Más tareas con grupos",
    ],
    fixturetitle: "Una semana en tres grupos",
    fixtureintro:
      "Por ejemplo, el resumen del 1 al 7 de octubre ayuda a entender la carga y elegir dónde empezar. Primero los totales, después la actividad diaria y las preguntas por comprobar.",
    headers: ["Grupo", "Mensajes", "Participantes activos", "Preguntas sin respuesta"],
    fixture: [
      ["Proyecto", "420", "24", "3"],
      ["Padres", "180", "12", "0"],
      ["Reforma", "84", "8", "1"],
    ],
    fixtureoutcome:
      "Empieza por Proyecto: tiene más mensajes y tres preguntas por retomar. Reforma tiene menos mensajes, pero falta aclarar la fecha de entrega. Padres tiene respuestas a todas las preguntas identificadas. Pide: «Muéstrame estas cuatro preguntas con los mensajes posteriores y sugiere a quién responder primero».",
    fixturelimit:
      "«Pregunta sin respuesta» significa que no se encontró en el historial revisado. Abre el contexto: pudieron responder en otro grupo o después. Si falta parte de la semana, descarga el historial y actualiza el informe. Los participantes se cuentan por grupo; una persona puede aparecer en varios.",
    next: "Descargar el historial necesario",
  },
}

export function readerGuide(slugs: string[], lang: string) {
  if (
    slugs.length !== 2 ||
    !["tg", "max"].includes(slugs[0]) ||
    !["usage", "rankings", "bot", "groups"].includes(slugs[1])
  )
    return
  const words = copy[lang === "ru" || lang === "es" ? lang : "en"]
  const rankings = slugs[1] === "rankings"
  const role = roleGuide(slugs[0], slugs[1], lang)
  const roles = roleLabels(lang)
  const sections: TaskSection[] = (rankings ? [words.rankingsection] : words.usage).map(
    ([id, title, prompt, result, page, link]) => ({
      id: `task-${id}`,
      title,
      prompt: prompt.replace("{cli}", slugs[0]),
      result,
      page,
      link,
    }),
  )
  if (rankings) sections.push(...reportTasks(slugs[0], lang))
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
    title: role?.title ?? (rankings ? titles[locale][1] : roles.usage),
    description: `${slugs[0] === "tg" ? "Telegram" : "MAX"}: ${role?.description ?? descriptions[locale][rankings ? 1 : 0]}`,
    intro:
      role?.intro ??
      (rankings
        ? `${words.rankingintro} ${{ ru: "В командах ниже подставьте свои названия чатов, имена и даты.", en: "Replace chat names, people and dates in the commands below with your own.", es: "Sustituye nombres, chats y fechas en los comandos por los tuyos." }[locale]}`
        : words.intro),
    sections: role?.sections ?? sections,
    setup: slugs[1] === "bot" ? botOnboarding(slugs[0], lang) : undefined,
    showRoleNavigation: slugs[1] !== "bot",
    roleNavigation: {
      label: roles.nav,
      links: (["usage", "bot", "groups"] as const).map((page) => ({
        page: `${slugs[0]}/${page}`,
        label: roles[page],
        current: page === slugs[1],
      })),
    },
    reference: roles.reference,
    fixture: rankings
      ? {
          title: words.fixturetitle,
          intro: words.fixtureintro,
          headers: words.headers,
          rows: words.fixture,
          outcome: words.fixtureoutcome,
          limit: words.fixturelimit,
          next: words.next,
          activity: [72, 98, 135, 110, 96, 103, 70],
          activityTitle: {
            en: "Daily activity · all three groups",
            ru: "Активность по дням · все три группы",
            es: "Actividad diaria · los tres grupos",
          }[locale],
          totals: {
            en: "684 messages · 22 questions · 4 without a found answer",
            ru: "684 сообщения · 22 вопроса · 4 без найденного ответа",
            es: "684 mensajes · 22 preguntas · 4 sin respuesta encontrada",
          }[locale],
        }
      : undefined,
  }
}
export function readerGuideMarkdown(slugs: string[], lang: string) {
  const guide = readerGuide(slugs, lang)
  if (!guide) return ""
  const sectionMarkdown = (section: ReportTask) => {
    let result = `## ${section.title}\n\n\`\`\`text prompt\n${section.prompt}\n\`\`\`\n\n${section.result}\n\n`
    if (section.example)
      result += `| ${section.example.headers.join(" | ")} |\n| ${section.example.headers.map(() => "---").join(" | ")} |\n${section.example.rows.map((row) => `| ${row.join(" | ")} |`).join("\n")}\n\n${section.example.note}\n\n`
    if (section.commands) result += `\`\`\`sh\n${section.commands.join("\n")}\n\`\`\`\n\n`
    return `${result}[${section.link}](/${lang}/docs/${section.page})\n\n`
  }
  let text = `${guide.intro}\n\n${guide.showRoleNavigation ? guide.roleNavigation.links.map((link) => `[${link.label}](/${lang}/docs/${link.page})`).join(" · ") : ""}\n\n`
  if (guide.setup)
    text += `## ${guide.setup.title}\n\n[${guide.setup.create}](${guide.setup.url})\n\n[${guide.setup.install}](/${lang}/docs/installation)\n\n${guide.setup.steps.map((step, i) => `${i + 1}. ${step}`).join("\n")}\n\n\`\`\`sh\n${guide.setup.commands.join("\n")}\n\`\`\`\n\n${guide.setup.result}\n\n`
  for (const section of guide.sections.slice(0, guide.fixture ? 1 : undefined)) text += sectionMarkdown(section)
  if (guide.fixture) {
    const fixture = guide.fixture
    text += `## ${fixture.title}\n\n${fixture.intro}\n\n**${fixture.totals}**\n\n### ${fixture.activityTitle}\n\n| ${lang === "ru" ? "День октября" : lang === "es" ? "Día de octubre" : "October day"} | ${fixture.headers[1]} |\n| --- | --- |\n${fixture.activity.map((count, i) => `| ${i + 1} | ${count} |`).join("\n")}\n\n| ${fixture.headers.join(" | ")} |\n| ${fixture.headers.map(() => "---").join(" | ")} |\n${fixture.rows.map((row) => `| ${row.join(" | ")} |`).join("\n")}\n\n${fixture.outcome}\n\n${fixture.limit}\n\n[${fixture.next}](/${lang}/docs/search)\n\n`
  }
  if (guide.fixture) for (const section of guide.sections.slice(1)) text += sectionMarkdown(section)
  return `${text}## ${guide.reference}\n\n`
}
