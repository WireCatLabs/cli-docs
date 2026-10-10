import { installationScreenshots, screenshotMarkdown } from "./installation-screenshots"
import { wordsFor } from "./words"

const copy = {
  en: {
    intro: (name: string) =>
      `Connect your ${name} account to an AI agent on your computer. After setup, you can ask it to read chats, find messages and prepare replies.`,
    titles: [
      "1. Open your agent on the computer",
      "2. Ask it to help with installation",
      "3. Confirm the login yourself",
      "4. Check that it works",
    ],
    agent:
      "Use an agent such as Codex, Claude Code or Cursor that can run programs on this computer. Have your phone ready, with your account already signed in to the messaging app.",
    browser:
      "If you only use an agent chat in a browser or on your phone, follow the web and mobile connection guide instead.",
    browserLink: "Connect from the web or your phone",
    install: (name: string) =>
      `The ${name} tool is a program that gives your agent access to your account. Open the installation block below and copy the request into your agent chat. The agent will check the programs your computer needs and help install the tool.`,
    request: (name: string, tool: string) =>
      `Help connect my ${name} account to my AI agent on this computer.
Follow https://wirecat.dev/en/docs/${tool}/installation: check the required programs and help install the tool.
Show me the login steps so I can confirm account access myself.
Connect the tool's instructions to my agent. Then show my account and a few chats. Do not send any messages.`,
    login:
      "The agent starts setup; you complete the account confirmation. Enter login codes and passwords in the setup terminal or the messenger's login page, rather than in the agent chat. The terminal is the command window where setup is running; ask the agent to show you that window if you cannot find it.",
    manualLogin:
      "If the agent cannot provide an interactive login prompt, open Terminal on macOS/Linux or PowerShell on Windows yourself and run the setup command below. Follow its prompts; keep the window open until the account check finishes.",
    tgSteps: [
      "When setup asks for your phone number, enter it with the country code, for example +44… . This first confirmation lets the tool prepare the connection details that Telegram requires for your account.",
      "Open Telegram on your phone and find the service message from Telegram with the code for my.telegram.org. This code arrives in Telegram, not by SMS. Enter it at the setup prompt. The tool reads your existing connection details or creates them for you; you do not need to write a program.",
      "Next, wait for the account-login QR code on your computer. These are separate confirmations: the earlier code prepares the connection, while this QR code signs the tool in to your account.",
      "In Telegram on your phone, open Settings → Devices and choose Link Desktop Device or Add Device. Allow camera access if asked, then point the scanner at the QR code shown by setup on your computer. Use Telegram’s scanner, rather than the phone’s regular camera app.",
      "If setup asks for your additional Telegram password, enter the password you previously set in Telegram. This is different from the one-time code. Password input is hidden; type it and press Enter.",
      "Wait for setup to confirm the login and check your account and chats. This computer will appear among the connected devices in Telegram. If you interrupted setup, ask the agent to resume it; a completed login can be reused.",
    ],
    tgPhone:
      "If you cannot scan the QR code, ask the agent to choose phone-number login. Enter your number and the new login code at the setup prompts, followed by your additional Telegram password if requested. Use the delivery method shown by setup; the code may arrive in Telegram rather than by SMS.",
    maxSteps: [
      "Wait for setup to show a login QR code on your computer. It appears in the terminal; if the window is too narrow, setup opens the code in your browser.",
      "Open MAX on the phone where you are already signed in. Open Settings → Devices and choose QR scanning. Allow access to the camera if asked.",
      "Point the scanner at the code shown by setup on your computer. Use the login code from setup, rather than your profile's QR code for sharing contacts. Complete any confirmation shown in MAX.",
      "If setup asks for your additional account password, enter the password you previously set in MAX. The terminal hides what you type; enter it and press Enter.",
      "Wait for setup to confirm the login and check your account and up to five chats. The new device appears in MAX's device list. If setup was interrupted or the code expired, ask the agent to restart setup and scan the new code.",
    ],
    maxFallback:
      "If scanning does not work, ask the agent to open browser login. On web.max.ru you can scan its QR code or choose phone-number login and complete the steps on the page, including any CAPTCHA. This opens a separate browser window for the connection.",
    fallback: "If the usual login does not work",
    sessions: "Login methods and connection help",
    check:
      "Ask your agent to show your account and a few chats. Check that the name and chats belong to the account you intended to connect. If they do, the connection is ready. Finding older messages may require a separate history download; setup does not download your entire history.",
    archive: "Download the history you need",
    tasks: "Try your first task",
    registrationWhy:
      "Telegram first registers the program that will connect to your account. The app ID and app hash identify that connection; they do not grant access to messages on their own. The code for my.telegram.org lets setup complete this registration. Scanning the QR code is the separate step that authorises account access.",
    deviceWhy:
      "Login adds this computer as another device on your account, like a desktop messaging app. You can review it and revoke its access in your phone's device list. Setup connects your account; it does not download your entire chat history.",
    browserSteps: [
      "Open my.telegram.org/apps and sign in with your phone number. Enter the code from the Telegram service chat on that page, rather than in the agent chat.",
      "Choose API development tools. You need the application settings, rather than Delete account.",
      "If there is no application yet, choose a title and short name, select Desktop and create it. If an application already exists, use it.",
      "Enter App api_id and App api_hash in the setup terminal when prompted. The hash stays hidden while you type. These are connection identifiers, not a bot token.",
      "Continue with the QR login described above.",
    ],
    recovery: [
      "Command not found: open a new terminal or restart the agent so it sees the installed tool. For Windows repairs, use the technical installation instructions below.",
      "Not logged in: repeat setup and confirm the account login. For an expired session, follow the login help linked above.",
      "A chat or older messages are missing: ask the agent to download the chat and period you need. An empty local history does not mean the chat has no messages.",
    ],
    agentCheck:
      "If setup asks which agent you use, choose yours. Open a new agent session if the installed instructions have not loaded. If it still cannot use the tool, follow Connect your agent.",
    agents: "Connect your agent",
    permissions: "Choose what the agent may do",
    reference: "Manual setup and technical details",
  },
  ru: {
    intro: (name: string) =>
      `Подключите свой аккаунт ${name} к ИИ-агенту на компьютере. После настройки можно просить его читать чаты, искать сообщения и готовить ответы.`,
    titles: [
      "1. Откройте агента на компьютере",
      "2. Попросите помочь с установкой",
      "3. Подтвердите вход самостоятельно",
      "4. Проверьте, что всё работает",
    ],
    agent:
      "Подойдёт, например, Codex, Claude Code или Cursor с доступом к запуску программ на этом компьютере. Держите рядом телефон, на котором вы уже вошли в нужный аккаунт мессенджера.",
    browser:
      "Если вы пользуетесь только чатом с агентом в браузере или на телефоне, начните с руководства по подключению для веба и телефона.",
    browserLink: "Подключить из веба или с телефона",
    install: (name: string) =>
      `Инструмент ${name} — программа, которая даёт агенту доступ к вашему аккаунту. Раскройте блок установки ниже и скопируйте запрос в чат с агентом. Он проверит, какие программы нужны вашему компьютеру, и поможет установить инструмент.`,
    request: (name: string, tool: string) =>
      `Помоги подключить мой аккаунт ${name} к моему ИИ-агенту на этом компьютере.
Следуй https://wirecat.dev/ru/docs/${tool}/installation: проверь нужные программы и помоги с установкой.
Покажи мне шаги входа, чтобы я сам подтвердил доступ к аккаунту.
Подключи инструкции инструмента к моему агенту. В конце покажи мой аккаунт и несколько чатов. Ничего не отправляй.`,
    login:
      "Агент запускает настройку, а доступ к аккаунту подтверждаете вы. Коды и пароли вводите в терминал настройки или на страницу входа мессенджера, а не в чат с агентом. Терминал — окно команд, в котором идёт настройка; если вы его не видите, попросите агента показать это окно.",
    manualLogin:
      "Если агент не может открыть ввод для подтверждения входа, откройте сами «Терминал» в macOS/Linux или PowerShell в Windows и запустите настройку командой ниже. Следуйте вопросам настройки и не закрывайте окно до проверки аккаунта.",
    tgSteps: [
      "Когда настройка попросит номер телефона, введите его с кодом страны, например +7… . Это первое подтверждение нужно, чтобы инструмент подготовил данные подключения, которые Telegram требует для вашего аккаунта.",
      "Откройте Telegram на телефоне и найдите служебное сообщение Telegram с кодом для my.telegram.org. Этот код приходит в Telegram, а не по SMS. Введите его в запросе настройки. Инструмент получит уже созданные данные подключения или создаст их за вас — писать программу не нужно.",
      "Затем дождитесь QR-кода для входа в аккаунт на экране компьютера. Это два отдельных подтверждения: предыдущий код нужен для настройки подключения, а QR-код — для входа инструмента в ваш аккаунт.",
      "В Telegram на телефоне откройте «Настройки» → «Устройства» и выберите «Добавить устройство» (Add Device) или «Привязать настольное устройство». Разрешите доступ к камере, если приложение попросит, и наведите сканер на QR-код, который настройка показала на компьютере. Используйте сканер внутри Telegram, а не обычное приложение камеры.",
      "Если настройка попросит дополнительный пароль Telegram, введите пароль, который вы ранее задали в Telegram. Это не одноразовый код. При вводе пароль не отображается — наберите его и нажмите Enter.",
      "Дождитесь подтверждения входа и проверки аккаунта и чатов. Компьютер появится в списке подключённых устройств Telegram. Если настройка прервалась, попросите агента продолжить её; уже выполненный вход можно использовать повторно.",
    ],
    tgPhone:
      "Если не получается отсканировать QR-код, попросите агента выбрать вход по номеру телефона. Введите номер и новый код для входа в запросах настройки, затем дополнительный пароль Telegram, если его попросят. Способ доставки кода покажет настройка: он может прийти в Telegram, а не по SMS.",
    maxSteps: [
      "Дождитесь QR-кода для входа на компьютере. Он появится в терминале; если окно слишком узкое, настройка откроет код в браузере.",
      "Откройте MAX на телефоне, где вы уже вошли в свой аккаунт. Перейдите в «Настройки» → «Устройства» и выберите сканирование QR-кода. Разрешите доступ к камере, если приложение попросит.",
      "Наведите сканер на код, который настройка показала на компьютере. Нужен код для входа из настройки, а не QR-код вашего профиля для обмена контактами. Выполните подтверждение, если MAX покажет его на телефоне.",
      "Если настройка попросит дополнительный пароль аккаунта, введите пароль, который вы ранее задали в MAX. В терминале ввод скрыт — наберите пароль и нажмите Enter.",
      "Дождитесь подтверждения входа и проверки аккаунта и до пяти чатов. Новое устройство появится в списке устройств MAX. Если настройка прервалась или код устарел, попросите агента запустить настройку заново и отсканируйте новый код.",
    ],
    maxFallback:
      "Если сканирование не работает, попросите агента открыть вход через браузер. На web.max.ru можно отсканировать QR-код или выбрать вход по номеру телефона и выполнить шаги на странице, включая проверку CAPTCHA, если она появится. Для подключения откроется отдельное окно браузера.",
    fallback: "Если обычный вход не получается",
    sessions: "Способы входа и помощь с подключением",
    check:
      "Попросите агента показать ваш аккаунт и несколько чатов. Проверьте, что имя и чаты относятся к тому аккаунту, который вы хотели подключить. Если всё верно, подключение готово. Для поиска в старых сообщениях может понадобиться отдельно скачать нужный период; настройка не скачивает всю историю.",
    archive: "Скачать нужную историю",
    tasks: "Попробовать первую задачу",
    registrationWhy:
      "Сначала Telegram регистрирует программу, которая будет подключаться к аккаунту. App api_id и App api_hash обозначают это подключение; сами по себе они не дают доступа к сообщениям. Код для my.telegram.org позволяет настройке выполнить регистрацию. Сканирование QR-кода — отдельный шаг, который разрешает доступ к аккаунту.",
    deviceWhy:
      "Вход добавляет этот компьютер как ещё одно устройство аккаунта, подобно настольному приложению мессенджера. Его можно проверить и отключить в списке устройств на телефоне. Настройка подключает аккаунт, но не скачивает всю историю чатов.",
    browserSteps: [
      "Откройте my.telegram.org/apps и войдите по номеру телефона. Код из служебного чата Telegram введите на этой странице, а не в чат с агентом.",
      "Выберите API development tools. Нужны настройки приложения, а не Delete account.",
      "Если приложения ещё нет, укажите название и краткое имя, выберите Desktop и создайте приложение. Если оно уже есть, используйте его.",
      "Введите App api_id и App api_hash в терминал настройки, когда он попросит их. Хэш при вводе скрыт. Это данные подключения, а не токен бота.",
      "Продолжите вход по QR-коду, как описано выше.",
    ],
    recovery: [
      "Команда не найдена: откройте новый терминал или перезапустите агента, чтобы он увидел установленный инструмент. Исправления для Windows есть в технических инструкциях установки ниже.",
      "Нет входа в аккаунт: повторите настройку и подтвердите вход. Если сессия истекла, следуйте руководству по входу, ссылка на которое дана выше.",
      "Не видно чата или старых сообщений: попросите агента скачать нужный чат и период. Пустая локальная история не означает, что в чате нет сообщений.",
    ],
    agentCheck:
      "Если настройка спросит, какого агента вы используете, выберите своего. Откройте новую сессию агента, если установленные инструкции ещё не загрузились. Если он по-прежнему не умеет пользоваться инструментом, следуйте руководству подключения агента.",
    agents: "Подключить агента",
    permissions: "Выбрать, что разрешено агенту",
    reference: "Самостоятельная установка и технические детали",
  },
  es: {
    intro: (name: string) =>
      `Conecta tu cuenta de ${name} a un agente de IA en tu ordenador. Después podrás pedirle que lea chats, busque mensajes y prepare respuestas.`,
    titles: [
      "1. Abre el agente en tu ordenador",
      "2. Pídele ayuda con la instalación",
      "3. Confirma tú el inicio de sesión",
      "4. Comprueba que funciona",
    ],
    agent:
      "Puedes usar, por ejemplo, Codex, Claude Code o Cursor con acceso para ejecutar programas en este ordenador. Ten a mano el teléfono donde ya has iniciado sesión en tu cuenta de mensajería.",
    browser:
      "Si solo usas un chat con el agente en el navegador o en el teléfono, empieza con la guía de conexión para web y móvil.",
    browserLink: "Conectar desde la web o el móvil",
    install: (name: string) =>
      `La herramienta de ${name} es un programa que permite al agente acceder a tu cuenta. Abre el bloque de instalación de abajo y copia la petición en el chat con tu agente. Comprobará los programas necesarios en tu ordenador y te ayudará a instalar la herramienta.`,
    request: (name: string, tool: string) =>
      `Ayúdame a conectar mi cuenta de ${name} a mi agente de IA en este ordenador.
Sigue https://wirecat.dev/es/docs/${tool}/installation: comprueba los programas necesarios y ayúdame a instalar la herramienta.
Muéstrame los pasos de inicio de sesión para que yo confirme el acceso a mi cuenta.
Conecta las instrucciones de la herramienta a mi agente. Al final muestra mi cuenta y algunos chats. No envíes mensajes.`,
    login:
      "El agente inicia la configuración; tú confirmas el acceso a la cuenta. Introduce los códigos y contraseñas en el terminal de configuración o en la página de inicio de sesión, en lugar del chat con el agente. El terminal es la ventana de comandos donde se ejecuta la configuración; pide al agente que te muestre esa ventana si no la encuentras.",
    manualLogin:
      "Si el agente no puede ofrecer un campo interactivo para confirmar el acceso, abre Terminal en macOS/Linux o PowerShell en Windows y ejecuta el comando de configuración de abajo. Sigue sus preguntas y mantén la ventana abierta hasta que termine la comprobación de la cuenta.",
    tgSteps: [
      "Cuando la configuración pida tu número de teléfono, introdúcelo con el prefijo del país, por ejemplo +34… . Esta primera confirmación permite preparar los datos de conexión que Telegram requiere para tu cuenta.",
      "Abre Telegram en el teléfono y busca el mensaje de servicio de Telegram con el código para my.telegram.org. Este código llega a Telegram, no por SMS. Introdúcelo cuando lo pida la configuración. La herramienta obtiene los datos de conexión existentes o los crea por ti; no necesitas programar.",
      "Después espera a que aparezca el código QR de inicio de sesión en el ordenador. Son dos confirmaciones distintas: el primer código prepara la conexión y el QR conecta la herramienta a tu cuenta.",
      "En Telegram en el teléfono, abre Configuración → Dispositivos y elige Vincular dispositivo o Vincular dispositivo de escritorio. Permite el acceso a la cámara si se solicita y apunta el escáner al QR que muestra la configuración en el ordenador. Usa el escáner de Telegram, en lugar de la cámara habitual del teléfono.",
      "Si la configuración pide la contraseña adicional de Telegram, introduce la que habías establecido en Telegram. Es distinta del código de un solo uso. La contraseña no se muestra al escribir; introdúcela y pulsa Enter.",
      "Espera a la confirmación del inicio de sesión y a la comprobación de la cuenta y los chats. El ordenador aparecerá entre los dispositivos conectados en Telegram. Si interrumpiste la configuración, pide al agente que la continúe; puede reutilizar el acceso ya confirmado.",
    ],
    tgPhone:
      "Si no puedes escanear el QR, pide al agente que elija el inicio de sesión por número de teléfono. Introduce el número y el nuevo código cuando lo pida la configuración, seguido de la contraseña adicional de Telegram si se solicita. Sigue el método de entrega que indique la configuración: el código puede llegar a Telegram en lugar de por SMS.",
    maxSteps: [
      "Espera a que la configuración muestre un QR de inicio de sesión en el ordenador. Aparece en el terminal; si la ventana es demasiado estrecha, la configuración abre el código en el navegador.",
      "Abre MAX en el teléfono donde ya has iniciado sesión. Entra en Ajustes → Dispositivos y elige escanear el QR. Permite el acceso a la cámara si se solicita.",
      "Apunta el escáner al código que muestra la configuración en el ordenador. Usa el QR de inicio de sesión de la configuración, en lugar del QR de tu perfil para compartir contactos. Completa cualquier confirmación que MAX muestre en el teléfono.",
      "Si la configuración pide la contraseña adicional de la cuenta, introduce la que habías establecido en MAX. El terminal oculta lo que escribes; introduce la contraseña y pulsa Enter.",
      "Espera a la confirmación del inicio de sesión y a la comprobación de tu cuenta y hasta cinco chats. El nuevo dispositivo aparece en la lista de dispositivos de MAX. Si la configuración se interrumpe o el código caduca, pide al agente que la reinicie y escanea el nuevo código.",
    ],
    maxFallback:
      "Si el escaneo no funciona, pide al agente que abra el inicio de sesión en el navegador. En web.max.ru puedes escanear el QR o elegir el acceso por número de teléfono y completar los pasos de la página, incluido el CAPTCHA si aparece. La conexión abre una ventana de navegador separada.",
    fallback: "Si el inicio de sesión habitual no funciona",
    sessions: "Métodos de acceso y ayuda con la conexión",
    check:
      "Pide al agente que muestre tu cuenta y algunos chats. Comprueba que el nombre y los chats pertenecen a la cuenta que querías conectar. Si es así, la conexión está lista. Para buscar mensajes antiguos puede ser necesario descargar ese período por separado; la configuración no descarga todo el historial.",
    archive: "Descargar el historial que necesitas",
    tasks: "Probar la primera tarea",
    registrationWhy:
      "Telegram registra primero el programa que se conectará a la cuenta. App api_id y App api_hash identifican esa conexión; por sí solos no permiten leer mensajes. El código de my.telegram.org permite completar el registro. Escanear el QR es el paso separado que autoriza el acceso a la cuenta.",
    deviceWhy:
      "El acceso añade este ordenador como otro dispositivo de tu cuenta, igual que una aplicación de mensajería de escritorio. Puedes revisarlo y revocar su acceso desde la lista de dispositivos del teléfono. La configuración conecta la cuenta; no descarga todo el historial.",
    browserSteps: [
      "Abre my.telegram.org/apps e inicia sesión con tu número. Introduce el código del chat de servicio de Telegram en esa página, en lugar del chat con el agente.",
      "Elige API development tools. Necesitas los ajustes de la aplicación, en lugar de Delete account.",
      "Si todavía no hay una aplicación, elige un título y un nombre corto, selecciona Desktop y créala. Si ya existe, úsala.",
      "Introduce App api_id y App api_hash en el terminal de configuración cuando los pida. El hash permanece oculto al escribir. Son datos de conexión, no un token de bot.",
      "Continúa con el inicio de sesión por QR descrito arriba.",
    ],
    recovery: [
      "Comando no encontrado: abre un terminal nuevo o reinicia el agente para que vea la herramienta instalada. Las instrucciones técnicas de abajo incluyen las soluciones para Windows.",
      "No has iniciado sesión: repite la configuración y confirma el acceso. Para una sesión caducada, sigue la guía de acceso enlazada arriba.",
      "Falta un chat o mensajes antiguos: pide al agente que descargue el chat y el período necesarios. Un historial local vacío no demuestra que el chat no tenga mensajes.",
    ],
    agentCheck:
      "Si la configuración pregunta qué agente usas, elige el tuyo. Abre una sesión nueva del agente si las instrucciones instaladas aún no se han cargado. Si sigue sin poder usar la herramienta, consulta la guía de conexión del agente.",
    agents: "Conectar el agente",
    permissions: "Elegir qué puede hacer el agente",
    reference: "Instalación manual y detalles técnicos",
  },
}

export function toolInstallationGuide(tool: string, lang: string) {
  const text = copy[lang === "ru" || lang === "es" ? lang : "en"]
  const name = tool === "tg" ? "Telegram" : "MAX"
  const root = `/${lang}/docs`
  const screenshots = installationScreenshots(tool, lang)
  return {
    intro: text.intro(name),
    title: wordsFor(lang).navigation.installGuide,
    reference: text.reference,
    sections: [
      {
        id: "install-open-agent",
        title: text.titles[0],
        paragraphs: [text.agent, text.browser],
        links: [{ label: text.browserLink, href: `${root}/browser-apps` }],
      },
      {
        id: "install-request",
        title: text.titles[1],
        paragraphs: [text.install(name)],
        request: text.request(name, tool),
        links: [],
      },
      {
        id: "install-login",
        title: text.titles[2],
        paragraphs: [text.login, text.deviceWhy, ...(tool === "tg" ? [text.registrationWhy] : []), text.manualLogin],
        command: `${tool} setup`,
        steps: (tool === "tg" ? text.tgSteps : text.maxSteps).map((text, index) => ({
          text,
          screenshots: screenshots.login[index] ?? [],
        })),
        fallback: {
          title: text.fallback,
          paragraphs: tool === "tg" ? [text.tgPhone] : [text.maxFallback],
          command: tool === "tg" ? "tg setup --app browser" : undefined,
          steps:
            tool === "tg"
              ? text.browserSteps.map((text, index) => ({ text, screenshots: screenshots.browser[index] ?? [] }))
              : [],
        },
        links: [
          {
            label: tool === "tg" ? "my.telegram.org/apps" : "web.max.ru",
            href: tool === "tg" ? "https://my.telegram.org/apps" : "https://web.max.ru",
          },
          { label: text.sessions, href: `${root}/${tool}/sessions` },
        ],
      },
      {
        id: "install-check",
        title: text.titles[3],
        paragraphs: [text.check, text.agentCheck],
        recovery: text.recovery,
        links: [
          { label: text.tasks, href: `${root}/first-tasks` },
          { label: text.archive, href: `${root}/${tool}/archive` },
          { label: text.agents, href: `${root}/agents` },
          { label: text.permissions, href: `${root}/permissions` },
        ],
      },
    ],
  }
}

/** Same reader steps and request as HTML, ahead of the unchanged native reference. */
export function toolInstallationMarkdown(slugs: string[], lang: string) {
  if (slugs.length !== 2 || !["tg", "max"].includes(slugs[0]) || slugs[1] !== "installation") return ""
  const guide = toolInstallationGuide(slugs[0], lang)
  const sections = guide.sections
    .map((section) =>
      [
        `### ${section.title} [#${section.id}]`,
        ...section.paragraphs,
        ...(section.command ? [`\`\`\`sh\n${section.command}\n\`\`\``] : []),
        ...(section.request ? [`\`\`\`text\n${section.request}\n\`\`\``] : []),
        ...(section.steps
          ? [
              section.steps
                .map(
                  (step, i) =>
                    `${i + 1}. ${step.text}${step.screenshots.map((image) => `\n\n   ${screenshotMarkdown(image, lang)}`).join("")}`,
                )
                .join("\n"),
            ]
          : []),
        ...(section.fallback
          ? [
              `#### ${section.fallback.title}`,
              ...(section.fallback.command ? [`\`\`\`sh\n${section.fallback.command}\n\`\`\``] : []),
              ...section.fallback.steps.map(
                (step, i) =>
                  `${i + 1}. ${step.text}${step.screenshots.map((image) => `\n\n   ${screenshotMarkdown(image, lang)}`).join("")}`,
              ),
              ...section.fallback.paragraphs,
            ]
          : []),
        ...(section.recovery ? [section.recovery.map((item) => `- ${item}`).join("\n")] : []),
        ...section.links.map((link) => `[${link.label}](${link.href})`),
      ].join("\n\n"),
    )
    .join("\n\n")
  return `${guide.intro}\n\n## ${guide.title} [#agent-installation]\n\n${sections}\n\n## ${guide.reference} [#installation-reference]\n\n`
}
