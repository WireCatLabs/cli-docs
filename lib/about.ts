import siteConfig from "@/site.config.json"

export const aboutCopy = {
  en: {
    title: "About WireCat",
    nav: "About",
    back: "Home",
    docs: "Documentation",
    intro:
      "We build tools that help people and AI agents work with conversations, keep track of agreements and turn messages into useful actions.",
    sections: [
      {
        title: "Why we started",
        paragraphs: [
          "Important information is scattered across chats: a promise to a colleague, a customer's question, a document, a meeting time. We want to find that context without spending hours scrolling and to help questions get answered and promises get followed through.",
          "WireCat brings messenger conversations into the workflows you already use: your terminal, scripts and AI agent.",
        ],
      },
      {
        title: "What you can use today",
        paragraphs: [
          "Our open-source Telegram and MAX CLI tools connect your personal account or bots to an agent. They can retrieve messages, search history, gather context and help prepare replies. Available features depend on the messenger and account type; the documentation describes each tool.",
          "You can work through CLI commands or an MCP server. Agent guides cover Claude Code, Codex, Cursor, Gemini CLI and Hermes. The CLI runs on your computer; you choose your agent, its permissions and which conversations it can access.",
        ],
      },
      {
        title: "Custom chatbots and integrations",
        paragraphs: [
          "Have a specific workflow in mind? Get in touch about building custom Telegram or MAX chatbots, connecting an agent to your business processes, or automating routine work with messages.",
          "Possible projects include support bots that use your knowledge base, assistants for internal teams, notifications and reminders, and integrations with a CRM or other services. We will discuss the task, data sources and access requirements before choosing an approach.",
        ],
      },
      {
        title: "How to discuss a project",
        paragraphs: [
          `Email ${siteConfig.contacts.email} with a short description: who will use the bot, which messenger it needs, what it should do, and which systems it should connect to. Examples of questions or a current workflow are helpful; a detailed specification is not required.`,
          "We can start by clarifying the scope, then agree on a prototype, deployment and maintenance. Timing and cost depend on the task and are discussed individually.",
        ],
      },
      {
        title: "Where we want to go",
        paragraphs: [
          "Our next direction is connecting contacts across messengers and helping you manage relationships: one person, shared history, open questions and agreements. This is a direction for the project; today's foundation is the CLI tools and their agent integrations.",
        ],
      },
      {
        title: "Built in the open",
        paragraphs: [
          "The code is available on GitHub under the MIT licence. You can inspect how the tools work, read their security model, report issues and contribute. Permissions and confirmations help you control what an agent may do; the docs explain how to configure them.",
        ],
      },
    ],
    contact: "How can you be more productive?",
    contactText: "Custom bots, agent integrations and questions about WireCat:",
    source: "Source code",
    security: "Security model",
    start: "Get started",
  },
  ru: {
    title: "О WireCat",
    nav: "О проекте",
    back: "Главная",
    docs: "Документация",
    intro:
      "Мы создаём инструменты, которые помогают людям и ИИ-агентам работать с переписками, помнить договорённости и превращать сообщения в полезные действия.",
    sections: [
      {
        title: "Зачем мы начали",
        paragraphs: [
          "Важная информация разбросана по чатам: обещание коллеге, вопрос клиента, документ, время встречи. Мы хотим находить этот контекст без часов прокрутки и помогать вопросам получать ответы, а договорённостям — выполняться.",
          "WireCat добавляет переписки в привычные рабочие процессы: терминал, скрипты и вашего ИИ-агента.",
        ],
      },
      {
        title: "Что уже можно использовать",
        paragraphs: [
          "Наши открытые CLI для Telegram и MAX подключают личный аккаунт или ботов к агенту. Они позволяют читать сообщения, искать историю, собирать контекст и готовить ответы. Возможности зависят от мессенджера и типа аккаунта; подробности есть в документации каждого инструмента.",
          "Работать можно через команды CLI или MCP-сервер. Гайды подключения охватывают Claude Code, Codex, Cursor, Gemini CLI и Hermes. CLI запускается на вашем компьютере; вы выбираете агента, его права и доступные ему переписки.",
        ],
      },
      {
        title: "Кастомные чатботы и интеграции",
        paragraphs: [
          "Есть конкретная задача? Обращайтесь по вопросам создания кастомных чатботов для Telegram и MAX, подключения агента к процессам вашей команды и автоматизации работы с сообщениями.",
          "Это могут быть боты поддержки с вашей базой знаний, помощники для внутренних команд, уведомления и напоминания, интеграции с CRM и другими сервисами. Сначала обсудим задачу, источники данных и необходимые права доступа, затем выберем подход.",
        ],
      },
      {
        title: "Как обсудить проект",
        paragraphs: [
          `Напишите на ${siteConfig.contacts.email}: кто будет пользоваться ботом, какой нужен мессенджер, что бот должен делать и с какими системами взаимодействовать. Примеры вопросов или описание текущего процесса помогут; подробное техническое задание для первого разговора не требуется.`,
          "Можно начать с уточнения задачи, затем согласовать прототип, размещение и сопровождение. Сроки и стоимость зависят от объёма работы и обсуждаются индивидуально.",
        ],
      },
      {
        title: "Куда хотим двигаться",
        paragraphs: [
          "Следующее направление — связывать контакты из разных мессенджеров и помогать управлять отношениями: один человек, общая история, открытые вопросы и договорённости. Это направление развития проекта; сегодняшняя основа — CLI и их интеграции с агентами.",
        ],
      },
      {
        title: "Развиваем открыто",
        paragraphs: [
          "Код доступен на GitHub под лицензией MIT. Можно проверить, как работают инструменты, прочитать модель безопасности, сообщить о проблеме и предложить изменение. Права доступа и подтверждения помогают управлять действиями агента; документация объясняет их настройку.",
        ],
      },
    ],
    contact: "Как повысить продуктивность?",
    contactText: "Кастомные боты, интеграции агентов и вопросы о WireCat:",
    source: "Исходный код",
    security: "Модель безопасности",
    start: "Начать работу",
  },
  es: {
    title: "Acerca de WireCat",
    nav: "Acerca de",
    back: "Inicio",
    docs: "Documentación",
    intro:
      "Creamos herramientas para que las personas y los agentes de IA trabajen con sus conversaciones, recuerden acuerdos y conviertan mensajes en acciones útiles.",
    sections: [
      {
        title: "Por qué empezamos",
        paragraphs: [
          "La información importante está repartida entre chats: una promesa, una pregunta de un cliente, un documento o una cita. Queremos encontrar ese contexto sin pasar horas desplazándonos y ayudar a que las preguntas reciban respuestas y los acuerdos se cumplan.",
          "WireCat incorpora las conversaciones a tus flujos habituales: la terminal, los scripts y tu agente de IA.",
        ],
      },
      {
        title: "Qué puedes usar hoy",
        paragraphs: [
          "Nuestros CLI de código abierto para Telegram y MAX conectan tu cuenta personal o tus bots con un agente. Permiten consultar mensajes, buscar el historial, reunir contexto y preparar respuestas. Las funciones dependen del mensajero y del tipo de cuenta; la documentación explica cada herramienta.",
          "Puedes usar comandos CLI o un servidor MCP. Las guías cubren Claude Code, Codex, Cursor, Gemini CLI y Hermes. El CLI se ejecuta en tu ordenador; tú eliges el agente, sus permisos y las conversaciones a las que puede acceder.",
        ],
      },
      {
        title: "Chatbots e integraciones a medida",
        paragraphs: [
          "¿Tienes un flujo concreto en mente? Escríbenos sobre chatbots personalizados para Telegram o MAX, integración de agentes en los procesos de tu equipo y automatización del trabajo con mensajes.",
          "Los proyectos pueden incluir bots de soporte con tu base de conocimientos, asistentes internos, avisos y recordatorios, o conexiones con un CRM y otros servicios. Primero hablamos de la tarea, las fuentes de datos y los permisos necesarios para elegir el enfoque.",
        ],
      },
      {
        title: "Cómo hablar de un proyecto",
        paragraphs: [
          `Escribe a ${siteConfig.contacts.email} y cuéntanos quién usará el bot, qué mensajero necesita, qué debe hacer y con qué sistemas se conectará. Ayudan ejemplos de preguntas o del proceso actual; no necesitas una especificación detallada para empezar.`,
          "Podemos comenzar por definir el alcance y después acordar un prototipo, el despliegue y el mantenimiento. Los plazos y el coste dependen del proyecto y se hablan individualmente.",
        ],
      },
      {
        title: "Hacia dónde queremos ir",
        paragraphs: [
          "Nuestra siguiente dirección es conectar contactos entre mensajeros y ayudar a gestionar relaciones: una persona, historial compartido, preguntas pendientes y acuerdos. Es una dirección del proyecto; la base actual son los CLI y sus integraciones con agentes.",
        ],
      },
      {
        title: "Desarrollo abierto",
        paragraphs: [
          "El código está en GitHub bajo la licencia MIT. Puedes revisar las herramientas y su modelo de seguridad, informar de problemas y contribuir. Los permisos y las confirmaciones permiten controlar las acciones del agente; la documentación explica cómo configurarlos.",
        ],
      },
    ],
    contact: "¿Cómo mejorar tu productividad?",
    contactText: "Bots personalizados, integraciones de agentes y preguntas sobre WireCat:",
    source: "Código fuente",
    security: "Modelo de seguridad",
    start: "Empezar",
  },
}
