export type ReportTask = {
  id: string
  title: string
  prompt: string
  result: string
  page: string
  link: string
  commands?: string[]
  example?: { headers: string[]; rows: string[][]; note: string }
}

const texts = {
  ru: [
    [
      "group",
      "Что происходит в группе",
      "Покажи сведения о группе «Проект»: описание, число участников, мою роль и доступные настройки. Затем составь отчёт за неделю: сообщения, активные участники, ответы, реакции, вступления и выходы. Покажи график по дням и три изменения, на которые стоит обратить внимание.",
      "Вы получите карточку группы и её активность. Число участников относится к списку группы, активных — к людям, которые писали в выбранный период. Для Telegram можно дополнительно запросить официальную статистику, если она доступна вашему аккаунту.",
      "groups",
      "Сведения о группе и управление",
    ],
    [
      "authors",
      "Топ участников: кто пишет, отвечает и помогает",
      "В группе «Проект» за неделю покажи три отдельных топа: по числу сообщений, числу ответов на вопросы и скорости ответа. Для каждого человека покажи активные дни и исходные сообщения. Не объединяй всё в оценку человека.",
      "Можно сортировать по сообщениям, словам, реакциям, ответам, обсуждениям и активным дням. «Часто пишет» и «помогает отвечать» — разные показатели. Скорость ответа считается по найденным прямым ответам; отсутствие данных не равно нулю.",
      "rankings#technical-reference",
      "Все показатели и настройки рейтингов",
    ],
    [
      "posts",
      "Топ постов и обсуждений",
      "В чате «Новости» за неделю найди публикации с наибольшим числом реакций, просмотров и ответов. Покажи отдельные списки и ссылки на сообщения. Затем найди посты с большим числом просмотров, но без обсуждения. Укажи, когда проверяли счётчики.",
      "Вы увидите, какие публикации заметили, какие вызвали разговор и какие стоит обсудить отдельно. Реакции и просмотры — накопленные счётчики выбранных сообщений, а не обязательно прирост за эту неделю. Неизвестные просмотры нельзя считать нулевыми.",
      "rankings#check-and-refresh-counters",
      "Проверить свежесть счётчиков",
    ],
    [
      "responses",
      "Где вопросы ждут ответа",
      "В группе «Проект» покажи вопросы, которые ждут ответа больше суток. Отдельно посчитай ответы Анны и Бориса, медианное время ответа и время, за которое отвечают на 90% найденных вопросов. Покажи самые долгие ожидания с контекстом.",
      "Получите очередь вопросов и время ответа выбранных людей. Например: медиана 18 минут, 90% найденных ответов — в пределах двух часов. Это отчёт о прямых ответах в сохранённой переписке; агент не должен считать выбранного человека администратором без проверки.",
      "group-admins",
      "Как разбирать вопросы группы",
    ],
    [
      "newcomers",
      "Как осваиваются новички",
      "В группе «Проект» покажи тех, кто вступил за месяц: кто написал в первую неделю, чьи вопросы остались без ответа и кого наблюдали в группе через 1, 7 и 30 дней. Отдельно укажи, для кого дата вступления или список участников неизвестны.",
      "Вы сможете увидеть, кому нужна помощь после вступления. Отчёт об удержании использует сохранённые наблюдения списков участников: первый раз, когда инструмент увидел человека, не всегда означает дату вступления.",
      "rankings#technical-reference",
      "Новички и удержание: команды",
    ],
    [
      "person",
      "Отчёт по одному человеку",
      "Подготовь отчёт по Анне за неделю: доступные сведения профиля, общие чаты, число сообщений и активные дни по каждому чату, вопросы и ответы, последние договорённости. Дай ссылки на сообщения. Сначала убедись, что выбрал нужную Анну.",
      "Получите профиль и контекст для следующего разговора. Информация зависит от доступности профиля и сохранённой истории: приватные поля не нужно угадывать. Число сообщений относится к выбранному периоду и чатам.",
      "people",
      "Профиль, переписка и контекст человека",
    ],
    [
      "antibot",
      "Антибот: какие аккаунты стоит проверить",
      "Проверь участников группы «Проект» на признаки ботов и спама. Покажи причины, источники и неизвестные данные для каждого подозрительного аккаунта. Для выбранных мной людей подготовь подробную проверку. Пока никого не удаляй и не блокируй.",
      "Сначала получите список для проверки: повторяющийся текст, ссылки, сведения профиля и другие доступные признаки. Балл — сумма признаков, а не вероятность и не доказательство. У настоящего человека тоже может не быть фото. Для Telegram подробная проверка может отправлять ID в публичные антиспам-списки; MAX эти списки не опрашивает.",
      "people",
      "Причины оценки и подробная проверка",
    ],
  ],
  en: [
    [
      "group",
      "Understand a group",
      "Show the Project group's description, member count, my role and available settings. Then report last week's messages, active participants, replies, reactions, joins and departures. Plot daily activity and highlight three changes worth attention.",
      "Expect a group profile and activity overview. Total members comes from the roster; active participants are people who wrote during the selected period. Telegram can also provide official statistics when your account has access.",
      "groups",
      "Group information and administration",
    ],
    [
      "authors",
      "Top participants: posting, answering and helping",
      "For the Project group over the last week, show separate rankings by messages, answers to questions and response speed. Include active days and source messages for each person. Do not combine everything into a judgment about people.",
      "Rank by messages, words, reactions, replies, answers, discussions or active days. Frequent posting and answering questions measure different things. Response time uses observed direct replies; missing data is not zero.",
      "rankings#technical-reference",
      "Ranking metrics and controls",
    ],
    [
      "posts",
      "Top posts and discussions",
      "In News over the last week, find posts with the most reactions, views and replies. Give separate lists and message links. Then find widely viewed posts without discussion. State when counters were checked.",
      "See which posts attracted attention or conversation. Views and reactions are cumulative snapshots for selected posts, not necessarily gains during the week. Unknown views cannot be treated as zero.",
      "rankings#check-and-refresh-counters",
      "Check counter freshness",
    ],
    [
      "responses",
      "Questions waiting for an answer",
      "In Project, find questions waiting more than a day. Separately count Anna and Boris's answers, median response time and the time covering 90% of found answers. Show the longest waits with context.",
      "Expect a queue and response timings. For example: median 18 minutes, 90% of observed answers within two hours. Reports use direct replies in saved history; selected answerers are not automatically verified admins.",
      "group-admins",
      "Review group questions",
    ],
    [
      "newcomers",
      "How newcomers settle in",
      "In Project, list people who joined this month: who wrote in their first week, whose questions remain unanswered and who was observed after 1, 7 and 30 days. Identify unknown joining dates and missing member lists separately.",
      "Find people who may need help. Retention uses saved roster observations; first seeing someone is not necessarily their joining date.",
      "rankings#technical-reference",
      "Newcomer and retention commands",
    ],
    [
      "person",
      "A report about one person",
      "Prepare a weekly report about Anna: available profile details, shared chats, messages and active days per chat, questions, answers and recent agreements. Include message sources. First identify the right Anna.",
      "Expect a profile and context for the next conversation. Respect unavailable profile fields and missing history. Message counts apply to selected dates and chats.",
      "people",
      "Profile and conversation context",
    ],
    [
      "antibot",
      "Anti-bot: accounts worth checking",
      "Check Project members for bot and spam signals. Show reasons, sources and unknown data for each flagged account. Prepare detailed checks only for people I select. Do not remove or block anyone.",
      "Expect a review list based on repeated text, links, profile details and other available signals. Scores sum signals; they are neither probabilities nor proof. Real people may have no photo. Telegram's detailed checks may send IDs to public spam lists; MAX does not query those lists.",
      "people",
      "Signals and detailed checks",
    ],
  ],
  es: [
    [
      "group",
      "Entender qué ocurre en un grupo",
      "Muestra descripción, miembros, mi rol y ajustes del grupo Proyecto. Resume la última semana: mensajes, participantes activos, respuestas, reacciones, entradas y salidas. Dibuja actividad diaria y destaca tres cambios relevantes.",
      "Recibirás una ficha y actividad del grupo. Miembros es el total del listado; participantes activos son quienes escribieron durante el periodo. Telegram también ofrece estadísticas oficiales cuando la cuenta tiene acceso.",
      "groups",
      "Información y administración del grupo",
    ],
    [
      "authors",
      "Participantes: quién escribe y responde",
      "En Proyecto durante la última semana, muestra rankings separados por mensajes, respuestas a preguntas y velocidad de respuesta. Incluye días activos y fuentes por persona. No lo conviertas en un juicio sobre las personas.",
      "Ordena por mensajes, palabras, reacciones, respuestas, conversaciones o días activos. Escribir mucho y responder preguntas son medidas distintas. El tiempo se calcula con respuestas directas observadas; desconocido no equivale a cero.",
      "rankings#technical-reference",
      "Indicadores y ajustes",
    ],
    [
      "posts",
      "Publicaciones y conversaciones destacadas",
      "En Noticias durante la última semana, encuentra publicaciones con más reacciones, vistas y respuestas. Muestra listas separadas con enlaces. Busca también publicaciones muy vistas sin conversación. Indica cuándo se comprobaron los contadores.",
      "Verás qué atrajo atención y conversación. Vistas y reacciones son acumulados de las publicaciones elegidas, no necesariamente incrementos semanales. No trates las vistas desconocidas como cero.",
      "rankings#check-and-refresh-counters",
      "Comprobar los contadores",
    ],
    [
      "responses",
      "Preguntas pendientes",
      "En Proyecto, busca preguntas esperando más de un día. Cuenta las respuestas de Anna y Boris, la mediana y el tiempo que cubre el 90% de las respuestas encontradas. Muestra las esperas más largas con contexto.",
      "Recibirás preguntas y tiempos. Por ejemplo: mediana de 18 minutos, el 90% de respuestas observadas en dos horas. Son respuestas directas del historial; elegir a alguien no confirma que sea administrador.",
      "group-admins",
      "Revisar preguntas del grupo",
    ],
    [
      "newcomers",
      "Cómo se incorporan los nuevos miembros",
      "En Proyecto, muestra quienes entraron este mes: quién escribió en su primera semana, quién tiene preguntas pendientes y a quién se observó después de 1, 7 y 30 días. Separa fechas de entrada y listados desconocidos.",
      "Encuentra personas que necesitan ayuda. La retención usa observaciones guardadas; ver a alguien por primera vez no determina cuándo entró.",
      "rankings#technical-reference",
      "Comandos de nuevos miembros y retención",
    ],
    [
      "person",
      "Informe sobre una persona",
      "Prepara un informe semanal sobre Anna: perfil disponible, chats comunes, mensajes y días activos por chat, preguntas, respuestas y acuerdos recientes. Incluye fuentes. Primero identifica a la Anna correcta.",
      "Recibirás un perfil y contexto para conversar. No adivines campos privados ni historial ausente. Los mensajes corresponden a fechas y chats seleccionados.",
      "people",
      "Perfil y contexto de la persona",
    ],
    [
      "antibot",
      "Antibot: cuentas por comprobar",
      "Comprueba señales de bots y spam entre miembros de Proyecto. Muestra motivos, fuentes y datos desconocidos por cuenta. Prepara revisiones detalladas solo de personas que yo elija. No elimines ni bloquees a nadie.",
      "Recibirás una lista basada en texto repetido, enlaces y perfil. La puntuación suma señales; no es probabilidad ni prueba. Una persona real puede no tener foto. Telegram puede enviar IDs a listas públicas al comprobar en detalle; MAX no consulta esas listas.",
      "people",
      "Señales y comprobaciones detalladas",
    ],
  ],
}

export function reportTasks(tool: string, lang: string): ReportTask[] {
  const locale = lang === "ru" || lang === "es" ? lang : "en"
  const labels = {
    ru: [
      "Показатель",
      "Значение",
      "Участник",
      "Сообщения",
      "Ответы на вопросы",
      "Активные дни",
      "Публикация",
      "Реакции",
      "Просмотры",
      "Ответы",
      "Чат",
      "Признаки",
      "Балл",
    ],
    en: [
      "Metric",
      "Value",
      "Participant",
      "Messages",
      "Answers",
      "Active days",
      "Post",
      "Reactions",
      "Views",
      "Replies",
      "Chat",
      "Signals",
      "Score",
    ],
    es: [
      "Indicador",
      "Valor",
      "Participante",
      "Mensajes",
      "Respuestas",
      "Días activos",
      "Publicación",
      "Reacciones",
      "Vistas",
      "Respuestas",
      "Chat",
      "Señales",
      "Puntuación",
    ],
  }[locale]
  const commands: Record<string, string[]> = {
    group: [
      `${tool} chats show Project --json`,
      `${tool} stats chats show Project --since-time 7d --by day --json`,
      `${tool} stats charts Project --chart-kind active --since-time 7d --output activity.svg`,
    ],
    authors: [
      `${tool} stats contacts top 'date:[2026-10-01 TO 2026-10-07]' --chat Project --measure messages --limit 10 --json`,
      `${tool} stats contacts top 'date:[2026-10-01 TO 2026-10-07]' --chat Project --score helpful --min-messages 3 --limit 10 --json`,
    ],
    posts: [
      `${tool} stats messages top 'date:[2026-10-01 TO 2026-10-07]' --chat News --measure reactions --limit 10 --json`,
      `${tool} stats messages top 'date:[2026-10-01 TO 2026-10-07]' --chat News --measure views --limit 10 --json`,
    ],
    responses: [
      `${tool} stats messages unanswered --chat Project --older-than 24h --json`,
      `${tool} stats contacts responses --chat Project --answerer 42 --answerer 73 --json`,
    ],
    newcomers: [
      `${tool} stats chats newcomers Project --since-time 30d --within 7d --json`,
      `${tool} stats chats retention Project --since-time 30d --checkpoints 1d,7d,30d --within 7d --json`,
    ],
    person: [
      `${tool} contacts profile Anna --json`,
      `${tool} contacts context Anna --json`,
      `${tool} stats contacts top 'date:[2026-10-01 TO 2026-10-07] from:Anna' --chat Project --measure messages --json`,
    ],
    antibot: [
      `${tool} chats members audit Project --budget 2 --min-score 2 --json`,
      `${tool} contacts check 42 --offline --json`,
    ],
  }
  if (tool === "tg") commands.group.push("tg stats chats official Project --json")
  const examples: Record<string, ReportTask["example"]> = {
    group: {
      headers: labels.slice(0, 2),
      rows: [
        [labels[3], "420"],
        [labels[2], "24"],
        [labels[9], "98"],
        [labels[7], "180"],
      ],
      note: {
        ru: "Пример за неделю: 24 активных участника из 78 в списке группы. 9 вступлений и 2 выхода показаны отдельно; если история изменений состава недоступна, эти числа остаются неизвестными.",
        en: "Weekly example: 24 active participants out of 78 listed members. Nine joins and two departures are separate; unavailable membership history remains unknown.",
        es: "Ejemplo semanal: 24 participantes activos de 78 miembros. Nueve entradas y dos salidas se muestran aparte; sin historial del listado quedan desconocidas.",
      }[locale],
    },
    authors: {
      headers: [labels[2], labels[3], labels[4], labels[5]],
      rows: [
        ["Anna", "96", "9", "5"],
        ["Boris", "72", "4", "7"],
        ["Mira", "38", "8", "4"],
      ],
      note: {
        ru: "Борис писал каждый день, Анна чаще отвечала на вопросы, а у Миры восемь ответов при меньшем числе сообщений. Выбирайте показатель под задачу. «Полезность» — настраиваемая комбинация показателей, а не оценка личности.",
        en: "Boris wrote daily; Anna answered most questions; Mira has eight answers with fewer messages. Choose a metric for your task. A helpfulness score is a configurable combination, not a judgment of character.",
        es: "Boris escribió diariamente, Anna respondió más preguntas y Mira tiene ocho respuestas con menos mensajes. Elige según la tarea; la puntuación de ayuda combina indicadores, no juzga a la persona.",
      }[locale],
    },
    posts: {
      headers: [labels[6], labels[7], labels[8], labels[9]],
      rows: [
        ["Release", "43", "860", "18"],
        ["Meeting", "26", "640", "32"],
        ["Guide", "18", "1200", "0"],
      ],
      note: {
        ru: "Пример: «Release» лидирует по реакциям, «Meeting» — по ответам, «Guide» — по просмотрам. Отсутствие найденных ответов само по себе не делает публикацию неудачной. Для подтверждения откройте сообщение и его обсуждение.",
        en: "Example: Release leads in reactions, Meeting in replies, Guide in views. No observed replies does not itself mean a post failed. Open the post and discussion to check.",
        es: "Ejemplo: Release lidera en reacciones, Meeting en respuestas y Guide en vistas. No encontrar respuestas no prueba fracaso. Abre publicación y conversación.",
      }[locale],
    },
    person: {
      headers: [labels[10], labels[3], labels[5]],
      rows: [
        ["Project", "96", "5"],
        ["Renovation", "40", "3"],
      ],
      note: {
        ru: "Пример отчёта по Анне: в «Проекте» она отвечает на вопросы, в «Ремонте» согласует доставку. Попросите отдельно показать последние обещания и подготовить вопросы к следующему разговору.",
        en: "Anna answers Project questions and coordinates deliveries in Renovation. Ask for recent commitments and questions for your next conversation.",
        es: "Anna responde preguntas en Proyecto y coordina entregas en Reforma. Pide compromisos recientes y preguntas para la próxima conversación.",
      }[locale],
    },
    antibot: {
      headers: [labels[2], labels[12], labels[11]],
      rows: [
        ["42", "5", "same_text · link_first · no_photo"],
        ["73", "2", "no_photo · no_bio"],
      ],
      note: {
        ru: "У аккаунта 42 совпали несколько признаков; начните с проверки повторяющихся сообщений. У 73 только пустой профиль — этого недостаточно для вывода о боте. Неизвестный возраст аккаунта или неполная история должны быть видны в результате.",
        en: "Account 42 has several signals; inspect the repeated messages first. Account 73 only has sparse profile information, which is insufficient to identify a bot. Unknown account age or incomplete history should remain explicit.",
        es: "La cuenta 42 tiene varias señales: revisa sus mensajes repetidos. La 73 solo tiene un perfil incompleto, insuficiente para identificar un bot. Edad e historial desconocidos deben quedar explícitos.",
      }[locale],
    },
  }
  const displayNames: Record<string, string> =
    locale === "ru"
      ? {
          Project: "Проект",
          News: "Новости",
          Renovation: "Ремонт",
          Anna: "Анна",
          Boris: "Борис",
          Mira: "Мира",
          Release: "Релиз",
          Meeting: "Встреча",
          Guide: "Инструкция",
          "same_text · link_first · no_photo":
            "Одинаковый текст в нескольких чатах · ссылка в первом сообщении · нет фото",
          "no_photo · no_bio": "Нет фото · нет описания",
        }
      : locale === "es"
        ? {
            Project: "Proyecto",
            News: "Noticias",
            Renovation: "Reforma",
            Release: "Lanzamiento",
            Meeting: "Reunión",
            Guide: "Guía",
            "same_text · link_first · no_photo":
              "Texto repetido en varios chats · enlace en el primer mensaje · sin foto",
            "no_photo · no_bio": "Sin foto · sin descripción",
          }
        : {
            "same_text · link_first · no_photo": "Repeated text across chats · link in first message · no photo",
            "no_photo · no_bio": "No photo · no bio",
          }
  const commandNames = (command: string) => command.replace(/Project|News|Anna/g, (name) => displayNames[name] ?? name)
  for (const example of Object.values(examples))
    if (example) example.rows = example.rows.map((row) => row.map((cell) => displayNames[cell] ?? cell))
  return texts[locale].map(([id, title, prompt, result, page, link]) => ({
    id: `task-${id}`,
    title,
    prompt: `${{ ru: "Используй", en: "Use", es: "Usa" }[locale]} ${tool} CLI. ${prompt} ${{ ru: "Ничего не отправляй и не меняй.", en: "Do not send or change anything.", es: "No envíes ni cambies nada." }[locale]}`,
    result,
    page: ["groups", "people"].includes(page)
      ? `${tool}/${page}`
      : page === "rankings#technical-reference"
        ? `${tool}/rankings#technical-reference`
        : page.startsWith("rankings#")
          ? `${tool}/${tool === "max" && page === "rankings#check-and-refresh-counters" ? "rankings#свежесть-счётчиков" : page}`
          : page,
    link,
    commands: commands[id].map(commandNames),
    example: examples[id],
  }))
}
