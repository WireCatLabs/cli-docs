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
        "В командах ниже sales — имя отдельного профиля бота. Введите первую команду и вставьте токен в скрытое поле терминала. Токен можно передать агенту, но он останется в истории переписки. По возможности выполните эту команду сами и введите токен в терминале.",
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
        "sales below names a separate bot profile. Run the first command and paste the token into the hidden terminal prompt. You can give the token to your agent, but it will remain in the conversation history. If possible, run this command yourself and enter the token in the terminal.",
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
        "sales es el nombre de un perfil separado del bot. Ejecuta el primer comando y pega el token en el campo oculto del terminal. Puedes enviarlo al agente, pero quedará en el historial del chat. Si puedes, ejecuta tú el comando e introduce el token en el terminal.",
        "Ejecuta el segundo comando para ver el nombre del bot. Añádelo al grupo o canal y concede los permisos necesarios.",
      ],
      install: "Instalar la herramienta",
      result: "Cuando el nombre sea correcto, comprueba acceso y prepara el primer mensaje abajo.",
    },
  }[locale]
  return {
    ...words,
    creationDetails:
      tool === "tg"
        ? {
            ru: {
              title: "Как создать бота через BotFather",
              steps: [
                "Откройте @BotFather в Telegram, нажмите «Запустить» и отправьте /newbot.",
                "Укажите отображаемое имя бота, затем свободное имя пользователя с окончанием bot, например my_club_helper_bot.",
                "BotFather пришлёт токен — ключ доступа к боту. Используйте его в команде подключения ниже.",
              ],
            },
            en: {
              title: "How to create a bot with BotFather",
              steps: [
                "Open @BotFather in Telegram, press Start and send /newbot.",
                "Choose a display name, then an available username ending in bot, such as my_club_helper_bot.",
                "BotFather returns a token, your bot's access key. Use it in the connection command below.",
              ],
            },
            es: {
              title: "Crear un bot con BotFather",
              steps: [
                "Abre @BotFather en Telegram, pulsa Iniciar y envía /newbot.",
                "Elige un nombre y un usuario disponible terminado en bot, como my_club_helper_bot.",
                "BotFather te dará un token, la clave de acceso al bot. Úsalo en el comando de conexión de abajo.",
              ],
            },
          }[locale]
        : undefined,
    url: tool === "tg" ? "https://t.me/BotFather" : "https://business.max.ru/self",
    commands: [`${tool} sales bot auth set`, tool === "tg" ? "tg sales bot auth show" : "max sales bot me"],
  }
}
