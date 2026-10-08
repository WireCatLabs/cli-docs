import type { ReportTask } from "./report-tasks.ts"

const labels = {
  en: {
    usage: "Personal account",
    bot: "Bots",
    groups: "Administration",
    reference: "Commands and instructions",
    nav: "Choose how you use the messenger",
  },
  ru: {
    usage: "Личный аккаунт",
    bot: "Боты",
    groups: "Администрирование",
    reference: "Команды и инструкции",
    nav: "Выберите, с чем вы работаете",
  },
  es: {
    usage: "Cuenta personal",
    bot: "Bots",
    groups: "Administración",
    reference: "Comandos e instrucciones",
    nav: "Elige cómo usar el mensajero",
  },
}
const pages = {
  ru: {
    bot: {
      intro:
        "Подключите своего бота, чтобы отвечать от его имени, публиковать сообщения и добавлять кнопки. У бота отдельные доступ и чаты: он не получает вашу личную переписку. Начните с проверки бота, затем подготовьте первое сообщение; настройка и команды видны ниже.",
      sections: [
        [
          "bot-check",
          "Проверить, какой бот подключён",
          "Используй {cli} CLI с профилем моего бота sales. Покажи имя бота и проверь доступ к группе «Клуб». Объясни, что он может делать и каких прав не хватает. Ничего не отправляй и не меняй.",
          "Ожидайте имя бота, выбранную группу и понятное объяснение доступа. Если бот ещё не подключён, настройте токен по инструкции ниже; не вставляйте токен в запрос агенту.",
          "profiles",
          "Выбрать профиль бота",
        ],
        [
          "bot-post",
          "Подготовить сообщение с кнопками",
          "Используй {cli} CLI с профилем бота sales. Подготовь объявление для группы «Клуб» с кнопками «Записаться» и «Подробнее». Покажи текст и предложенные действия кнопок. Пока ничего не отправляй.",
          "Проверьте текст, ссылки и действие каждой кнопки. Публикация от бота — отдельное действие; бот должен быть добавлен в выбранный чат и иметь нужный доступ.",
          "bot-api",
          "Что умеет Bot API",
        ],
      ],
    },
    groups: {
      intro:
        "Посмотрите состав, настройки и состояние своей группы, затем выберите действие администратора. Здесь можно проверить права, найти вопросы и подозрительные аккаунты, подготовить изменения. Начните с отчёта; изменение настроек или удаление участников требует отдельного решения.",
      sections: [
        [
          "admin-check",
          "Проверить группу и свои права",
          "Используй {cli} CLI. В группе «Клуб» покажи описание, участников, администраторов и мои права. Какие настройки я могу менять? Ничего не меняй.",
          "Вы получите карточку группы и список доступных действий. Участие в группе не всегда даёт права администратора; агент должен проверить их до изменений.",
          "rankings",
          "Отчёты о группе и участниках",
        ],
        [
          "admin-review",
          "Подготовить план наведения порядка",
          "Используй {cli} CLI. Проверь группу «Клуб»: вопросы без ответа, новые участники и признаки спама. Предложи, кому помочь и какие сообщения проверить. Не удаляй сообщения, не блокируй людей и не меняй настройки.",
          "Получите план с конкретными сообщениями и причинами. Затем можно выбрать отдельное действие: ответить, проверить аккаунт, изменить описание или правила доступа. Команды управления приведены ниже.",
          "rankings#task-antibot",
          "Антибот и другие отчёты",
        ],
      ],
    },
  },
  en: {
    bot: {
      intro:
        "Connect your bot to reply in its name, publish messages and add buttons. Bots have separate access and chats; they do not receive your private conversations. Check the bot first, then prepare a message. Setup and commands are visible below.",
      sections: [
        [
          "bot-check",
          "Check the connected bot",
          "Use {cli} CLI with my sales bot profile. Show the bot's name and check access to Club. Explain what it can do and which permissions are missing. Do not send or change anything.",
          "Expect the bot's identity, selected group and access explanation. If unconnected, set its token using the instructions below; do not paste the token into an agent request.",
          "profiles",
          "Choose a bot profile",
        ],
        [
          "bot-post",
          "Prepare a message with buttons",
          "Use {cli} CLI with the sales bot profile. Prepare a Club announcement with Sign up and Learn more buttons. Show the text and proposed button actions. Do not send yet.",
          "Check the text, links and each button's action. Publishing is a separate action; the bot needs access to the chosen chat.",
          "bot-api",
          "Bot API capabilities",
        ],
      ],
    },
    groups: {
      intro:
        "Inspect your group's members, settings and activity, then choose an administrative task. Check permissions, unanswered questions and suspicious accounts before preparing changes. Start with a report; settings changes and member removal are separate decisions.",
      sections: [
        [
          "admin-check",
          "Check the group and your permissions",
          "Use {cli} CLI. In Club, show the description, members, administrators and my permissions. Which settings can I change? Do not change anything.",
          "Expect group information and available actions. Membership does not automatically grant administrative access; check permissions first.",
          "rankings",
          "Group and participant reports",
        ],
        [
          "admin-review",
          "Prepare a moderation plan",
          "Use {cli} CLI. Review Club: unanswered questions, newcomers and spam signals. Suggest people to help and messages to check. Do not delete messages, block people or change settings.",
          "Expect specific messages and reasons. Choose subsequent actions separately: reply, inspect an account or change access rules. Management commands follow below.",
          "rankings#task-antibot",
          "Anti-bot and other reports",
        ],
      ],
    },
  },
  es: {
    bot: {
      intro:
        "Conecta tu bot para responder en su nombre, publicar y añadir botones. Tiene sus propios chats y acceso; no recibe conversaciones privadas. Primero comprueba el bot y después prepara un mensaje. La configuración y los comandos están visibles abajo.",
      sections: [
        [
          "bot-check",
          "Comprobar el bot conectado",
          "Usa {cli} CLI con el perfil sales de mi bot. Muestra su nombre y comprueba acceso a Club. Explica qué puede hacer y qué permisos faltan. No envíes ni cambies nada.",
          "Recibirás identidad, grupo y explicación del acceso. Configura el token con las instrucciones siguientes si falta; no lo pegues en una petición al agente.",
          "profiles",
          "Elegir perfil del bot",
        ],
        [
          "bot-post",
          "Preparar un mensaje con botones",
          "Usa {cli} CLI con el perfil sales del bot. Prepara un anuncio de Club con botones Inscribirse y Más información. Muestra texto y acciones propuestas. No envíes todavía.",
          "Comprueba texto, enlaces y acciones. Publicar es otro paso; el bot necesita acceso al chat elegido.",
          "bot-api",
          "Funciones de Bot API",
        ],
      ],
    },
    groups: {
      intro:
        "Consulta miembros, ajustes y actividad antes de elegir una tarea administrativa. Comprueba permisos, preguntas pendientes y cuentas sospechosas. Primero un informe; cambiar ajustes o eliminar miembros son decisiones aparte.",
      sections: [
        [
          "admin-check",
          "Comprobar grupo y permisos",
          "Usa {cli} CLI. En Club, muestra descripción, miembros, administradores y mis permisos. ¿Qué ajustes puedo cambiar? No cambies nada.",
          "Recibirás información y acciones disponibles. Ser miembro no concede automáticamente permisos administrativos.",
          "rankings",
          "Informes del grupo y participantes",
        ],
        [
          "admin-review",
          "Preparar un plan de moderación",
          "Usa {cli} CLI. Revisa Club: preguntas pendientes, nuevos miembros y señales de spam. Sugiere personas a ayudar y mensajes a comprobar. No borres, bloquees ni cambies ajustes.",
          "Recibirás mensajes y motivos concretos. Elige después si responder, revisar una cuenta o cambiar reglas de acceso. Los comandos están abajo.",
          "rankings#task-antibot",
          "Antibot y otros informes",
        ],
      ],
    },
  },
}
export function roleLabels(lang: string) {
  return labels[lang === "ru" || lang === "es" ? lang : "en"]
}
export function roleGuide(tool: string, page: string, lang: string) {
  if (page !== "bot" && page !== "groups") return
  const locale = lang === "ru" || lang === "es" ? lang : "en"
  const data = pages[locale][page]
  return {
    title: labels[locale][page],
    intro: data.intro,
    sections: data.sections.map(
      ([id, title, prompt, result, target, link]): ReportTask => ({
        id: `task-${id}`,
        title,
        prompt: prompt.replace("{cli}", tool),
        result,
        page: target.startsWith("rankings") ? `${tool}/${target}` : target,
        link,
      }),
    ),
  }
}
