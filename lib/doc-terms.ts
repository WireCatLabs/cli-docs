const terms = {
  "local-agent": {
    en: {
      title: "Local agent",
      description:
        "An AI assistant that can run commands on your computer: Claude Code, Codex, Cursor, Gemini CLI or Hermes. A chat in the browser without terminal access cannot install the cli for you.",
      page: "agents",
    },
    ru: {
      title: "Локальный агент",
      description:
        "ИИ-помощник, который может запускать команды на вашем компьютере: Claude Code, Codex, Cursor, Gemini CLI или Hermes. Чат в браузере без доступа к терминалу не сможет установить cli за вас.",
      page: "agents",
    },
    es: {
      title: "Agente local",
      description:
        "Un asistente de IA que puede ejecutar comandos en tu ordenador: Claude Code, Codex, Cursor, Gemini CLI o Hermes. Un chat en el navegador sin acceso a la terminal no puede instalar el cli por ti.",
      page: "agents",
    },
  },
  skill: {
    en: {
      title: "Agent skill",
      description:
        "An instruction file that teaches your agent how to use tg or max. It contains command guidance, not your login details. Installation may already have added it; you can check with tg skill show or max skill show.",
      page: "agents",
    },
    ru: {
      title: "Skill — навык агента",
      description:
        "Файл инструкции, который учит вашего агента пользоваться tg или max. В нём описаны команды, а не данные входа в аккаунт. Установка могла уже добавить его; проверить можно через tg skill show или max skill show.",
      page: "agents",
    },
    es: {
      title: "Skill del agente",
      description:
        "Un archivo de instrucciones que enseña al agente a usar tg o max. Describe comandos, no tus datos de acceso. Puede haberse añadido durante la instalación; compruébalo con tg skill show o max skill show.",
      page: "agents",
    },
  },
  "telegram-app": {
    en: {
      title: "Telegram application credentials",
      description:
        "Telegram gives your program an api_id and api_hash at my.telegram.org. This is a registration for the cli, not another app to install. You then authorize access to your account separately, using a QR code or login code.",
      page: "tg/sessions",
    },
    ru: {
      title: "Данные приложения Telegram",
      description:
        "Telegram выдаёт программе api_id и api_hash на my.telegram.org. Это регистрация cli, а не ещё одно приложение для установки. Доступ к вашему аккаунту вы затем подтверждаете отдельно — QR-кодом или кодом входа.",
      page: "tg/sessions",
    },
    es: {
      title: "Credenciales de aplicación de Telegram",
      description:
        "Telegram da a tu programa un api_id y un api_hash en my.telegram.org. Es el registro del cli, no otra aplicación que debas instalar. Después autorizas el acceso a tu cuenta por separado, con un QR o un código de acceso.",
      page: "tg/sessions",
    },
  },
}

export type DocTermId = keyof typeof terms

export function docTerm(term: DocTermId, lang: string) {
  const entry = terms[term]
  if (!entry) throw new Error(`Unknown documentation term: ${term}`)
  return entry[lang as keyof typeof entry] ?? entry.en
}
