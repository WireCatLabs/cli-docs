const purpose = {
  en: {
    sessions:
      "Connect the tool to your messenger account so your agent can read the chats you choose and help with replies. This guide explains login, checking the connection and managing or ending a session. Login adds an authorised device; it does not download all your chat history.",
    usage:
      "Use your connected account to read conversations, find the context you need and prepare or send a reply. Start with a reading task, check the result, then use the relevant section for files, groups or sending.",
    archive:
      "Save the history of the chats you need so your agent can search older messages and recall agreements. This guide helps you choose the period to download, check what was saved and export a copy when needed.",
    search:
      "Find an older message, agreement, link or file in the conversation you have saved. This guide shows the search options and how to check sources. Fetch the relevant history first if it is not on your computer yet.",
    bot: "Use a bot's separate account to answer requests, publish updates or help with a group. This guide takes you through connecting a bot, finding the chat and checking its access; your personal conversations stay separate.",
    groups:
      "Manage a group you participate in: inspect its members and settings, then choose the action you need. This guide explains the supported operations and required rights so you can check the target before changing anything.",
    security:
      "Choose what your assistant may do and understand where login data and messages are stored. This guide explains the protections, their limits and the settings you can check before granting sending or other changes.",
    recipes:
      "Give your agent a useful task without writing a command sequence yourself. These examples show requests you can adapt to your chats, the expected result and where to find the exact command details.",
    troubleshooting:
      "Find the symptom you are seeing and follow its recovery steps. The aim is to get the tool working again and check the result; keep the error text if you need help reporting a problem.",
    changelog:
      "See what changed in the reviewed releases: new capabilities, fixes and changes that may affect your commands. Start with your installed version, then use the linked guide for the feature you want to try.",
    roadmap:
      "See what is planned and what is still unavailable. These are development priorities rather than promised dates; the changelog records what has actually shipped.",
  },
  ru: {
    sessions:
      "Подключите инструмент к своему аккаунту мессенджера, чтобы агент мог читать выбранные чаты и помогать с ответами. Здесь вы пройдёте вход, проверите подключение и узнаете, как управлять сессией или завершить её. Вход добавляет разрешённое устройство; всю историю чатов он не скачивает.",
    usage:
      "Используйте подключённый аккаунт, чтобы читать переписку, собирать нужный контекст и готовить или отправлять ответы. Начните с чтения, проверьте результат, затем выберите раздел про файлы, группы или отправку.",
    archive:
      "Сохраните историю нужных чатов, чтобы агент мог найти старые сообщения и вспомнить договорённости. Здесь вы выберете период загрузки, проверите, что сохранено, и при необходимости выгрузите копию переписки.",
    search:
      "Найдите старое сообщение, договорённость, ссылку или файл в сохранённой переписке. Здесь описаны способы поиска и проверка исходных сообщений. Если нужной истории ещё нет на компьютере, сначала загрузите её.",
    bot: "Используйте отдельный аккаунт бота для ответов, публикаций и помощи в группе. Здесь вы подключите бота, найдёте нужный чат и проверите его доступ; ваша личная переписка остаётся отдельной.",
    groups:
      "Управляйте группой, в которой участвуете: посмотрите участников и настройки, затем выберите нужное действие. Здесь описаны доступные операции и необходимые права, чтобы вы могли проверить цель перед изменением.",
    security:
      "Выберите, что разрешено ассистенту, и узнайте, где хранятся данные входа и сообщения. Здесь объясняются защита, её ограничения и настройки, которые стоит проверить перед разрешением отправки и других изменений.",
    recipes:
      "Поручите агенту полезную задачу, не составляя последовательность команд самостоятельно. В примерах есть запросы для ваших чатов, ожидаемый результат и ссылки на точные инструкции.",
    troubleshooting:
      "Найдите свою ошибку или симптом и выполните шаги восстановления. Цель — вернуть инструмент в рабочее состояние и проверить результат; сохраните текст ошибки, если потребуется помощь с отчётом о проблеме.",
    changelog:
      "Узнайте, что изменилось в проверенных выпусках: новые возможности, исправления и изменения, влияющие на команды. Начните со своей установленной версии, затем откройте инструкцию для функции, которую хотите попробовать.",
    roadmap:
      "Посмотрите, что планируется и чего пока нет. Это приоритеты разработки, а не обещанные даты; уже выпущенные изменения перечислены в истории версий.",
  },
  es: {
    sessions:
      "Conecta el instrumento a tu cuenta para que el agente pueda leer los chats que elijas y ayudarte a responder. Esta guía explica el acceso, su comprobación y cómo gestionar o cerrar una sesión. Iniciar sesión añade un dispositivo autorizado; no descarga todo el historial.",
    usage:
      "Usa tu cuenta conectada para leer conversaciones, reunir contexto y preparar o enviar respuestas. Empieza por leer, comprueba el resultado y elige después la sección de archivos, grupos o envío.",
    archive:
      "Guarda el historial de los chats que necesitas para encontrar mensajes antiguos y recordar acuerdos. Esta guía te ayuda a elegir el periodo, comprobar lo guardado y exportar una copia cuando haga falta.",
    search:
      "Encuentra un mensaje antiguo, acuerdo, enlace o archivo en las conversaciones guardadas. Aquí se explican las opciones de búsqueda y cómo comprobar los mensajes de origen. Descarga primero el historial pertinente si aún no está en tu ordenador.",
    bot: "Usa la cuenta independiente de un bot para responder, publicar o ayudar en un grupo. Aquí conectarás el bot, encontrarás el chat y comprobarás su acceso; tus conversaciones personales siguen separadas.",
    groups:
      "Gestiona un grupo en el que participas: consulta miembros y ajustes, y elige la acción que necesitas. Aquí se explican las operaciones y derechos necesarios para comprobar el destino antes de cambiar algo.",
    security:
      "Elige lo que puede hacer tu asistente y conoce dónde se guardan los datos de acceso y mensajes. Aquí se explican las protecciones, sus límites y los ajustes que puedes comprobar antes de permitir envíos u otros cambios.",
    recipes:
      "Da una tarea útil al agente sin escribir tú la secuencia de comandos. Los ejemplos incluyen peticiones para tus chats, el resultado esperado y enlaces a las instrucciones exactas.",
    troubleshooting:
      "Encuentra tu error o síntoma y sigue los pasos de recuperación. El objetivo es volver a usar el instrumento y comprobar el resultado; conserva el texto del error si necesitas ayuda para informar del problema.",
    changelog:
      "Consulta lo que cambió en las versiones revisadas: capacidades, correcciones y cambios que afectan a comandos. Empieza por tu versión instalada y abre la guía de la función que quieras probar.",
    roadmap:
      "Consulta lo previsto y lo que aún falta. Son prioridades de desarrollo, no fechas prometidas; el historial de versiones registra lo que ya se publicó.",
  },
}
export function guideOrientation(slugs: string[], lang: string): string | undefined {
  if (slugs.length !== 2 || !["tg", "max"].includes(slugs[0])) return
  const text = purpose[lang === "ru" || lang === "es" ? lang : "en"]
  return text[slugs[1] as keyof typeof text]
}
