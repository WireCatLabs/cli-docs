export function botOnboarding(tool: string, lang: string) {
  const locale = lang === "ru" || lang === "es" ? lang : "en"
  const words = {
    ru: {
      title: "Первое подключение",
      create:
        tool === "tg"
          ? "Создайте бота через @BotFather и получите его токен."
          : "Создайте бота на платформе MAX для бизнеса и получите его токен. Боты доступны подтверждённым организациям, ИП и самозанятым после модерации.",
      steps: [
        "Установите инструмент командной строки, если он ещё не установлен.",
        "В командах ниже sales — имя отдельного профиля бота. Введите первую команду и вставьте токен в скрытое поле терминала. Не отправляйте токен агенту.",
        "Выполните вторую команду: она покажет имя подключённого бота. Добавьте бота в нужную группу или канал и выдайте права для вашей задачи.",
      ],
      install: "Установка инструмента",
      result: "Когда имя бота совпадает с ожидаемым, переходите к проверке доступа и первому сообщению ниже.",
    },
    en: {
      title: "First connection",
      create:
        tool === "tg"
          ? "Create a bot through @BotFather and get its token."
          : "Create a bot on MAX for Business and get its token. Bots are available to verified organisations, sole traders and self-employed users after moderation.",
      steps: [
        "Install the command-line tool if you have not installed it yet.",
        "sales below names a separate bot profile. Run the first command and paste the token into the hidden terminal prompt. Do not send the token to your agent.",
        "Run the second command to see the connected bot's name. Add it to your group or channel and grant the permissions your task requires.",
      ],
      install: "Install the tool",
      result: "Once the bot's name matches, continue with checking access and preparing the first message below.",
    },
    es: {
      title: "Primera conexión",
      create:
        tool === "tg"
          ? "Crea un bot con @BotFather y obtén su token."
          : "Crea un bot en MAX para empresas y obtén su token. Se ofrece a organizaciones, empresarios y autónomos verificados tras moderación.",
      steps: [
        "Instala la herramienta de línea de comandos si todavía no está instalada.",
        "sales es el nombre de un perfil separado del bot. Ejecuta el primer comando y pega el token en el campo oculto del terminal. No lo envíes al agente.",
        "Ejecuta el segundo comando para ver el nombre del bot. Añádelo al grupo o canal y concede los permisos necesarios.",
      ],
      install: "Instalar la herramienta",
      result: "Cuando el nombre sea correcto, comprueba acceso y prepara el primer mensaje abajo.",
    },
  }[locale]
  return {
    ...words,
    url: tool === "tg" ? "https://t.me/BotFather" : "https://business.max.ru/self",
    commands: [`${tool} sales bot auth set`, tool === "tg" ? "tg sales bot auth show" : "max sales bot me"],
  }
}
