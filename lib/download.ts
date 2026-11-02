import type { Format, Platform } from "@/lib/desktop-releases"

/**
 * Text uses `code` and **bold** marks. The macOS app is signed and notarized since 0.1.2; the Windows steps in
 * `unsigned` exist only until the installer has a Microsoft certificate.
 */
type Words = {
  title: string
  description: string
  intro: string
  free: string
  platforms: Record<Platform, string>
  downloadFor: Record<Platform, string>
  formats: Record<Format, { label: string; note: string }>
  version: (version: string) => string
  released: (date: string) => string
  notes: string
  linuxMore: string
  mobile: string
  choose: string
  otherSystems: string
  earlierTitle: string
  earlier: (count: number) => string
  earlierEmpty: string
  failed: string
  openReleases: string
  allReleases: string
  unsigned: {
    title: string
    intro: string
    macos: { steps: string[] }
    windows: { steps: string[]; source: string; smartAppControl: string; smartAppSource: string }
  }
  linux: { appimage: string; setup: string; fuse: string; fuseSource: string; deb: string; rpm: string }
  appimageSetup: {
    title: string
    started: string
    intro: string
    steps: string[]
    helpers: string
    gearLever: string
    appImageLauncher: string
    terminal: string
    agent: string
    prompt: (file: string) => string
    hide: string
  }
  updates: { title: string; auto: string; packages: string }
  uninstall: { title: string; macos: string; windows: string; appimage: string; packages: string; tools: string }
  next: { title: string; docs: string; terminal: string }
  gallery: {
    title: string
    intro: string
    previous: string
    next: string
    close: string
    shots: Record<"tools" | "agents" | "search-hit" | "tasks" | "memory" | "connect", { alt: string; caption: string }>
  }
}

const en: Words = {
  title: "Download WireCat Desktop",
  description:
    "Get the WireCat app for macOS, Windows or Linux. It installs, updates and checks the WireCat tools without a terminal.",
  intro:
    "WireCat Desktop installs, updates and checks the WireCat command-line tools for you. Connect your AI agent to Telegram, MAX, WhatsApp, Zoom, Google Drive, email and notes without typing npm commands.",
  free: "Free and open source. Runs on your computer.",
  platforms: { macos: "macOS", windows: "Windows", linux: "Linux" },
  downloadFor: { macos: "Download for macOS", windows: "Download for Windows", linux: "Download for Linux" },
  formats: {
    dmg: { label: "macOS disk image (.dmg)", note: "Apple silicon and Intel" },
    exe: { label: "Windows installer (.exe)", note: "64-bit Windows" },
    appimage: { label: "AppImage", note: "Most distributions. Updates itself" },
    deb: { label: ".deb package", note: "Debian, Ubuntu, Linux Mint" },
    rpm: { label: ".rpm package", note: "Fedora, RHEL, openSUSE" },
  },
  version: (version) => `Version ${version}`,
  released: (date) => `released ${date}`,
  notes: "Release notes",
  linuxMore: "Or a package for your distribution:",
  mobile: "WireCat Desktop runs on a computer. Open this page on your Mac, Windows or Linux computer to download it.",
  choose: "Choose your computer's system.",
  otherSystems: "Other systems",
  earlierTitle: "Earlier versions",
  earlier: (count) => (count === 1 ? "1 earlier version" : `${count} earlier versions`),
  earlierEmpty: "This is the first version.",
  failed: "The list of downloads did not load. All files are on the GitHub releases page.",
  openReleases: "Open GitHub releases",
  allReleases: "All releases on GitHub",
  unsigned: {
    title: "Open it for the first time",
    intro:
      "The macOS app is signed and checked by Apple. The Windows installer is not signed with a Microsoft developer certificate yet, so Windows asks you to confirm the first start. You do this once.",
    macos: {
      steps: [
        "Open the .dmg file and drag **WireCat** to **Applications**.",
        "Open WireCat. macOS asks once whether to open an app downloaded from the Internet: click **Open**. Apple has checked WireCat, so there is nothing else to allow.",
      ],
    },
    windows: {
      steps: [
        "Open the installer.",
        "If Windows shows **Windows protected your PC**, select **More info**, then **Run anyway**.",
        "The installer puts WireCat in the Start menu and opens it.",
      ],
      source: "Microsoft: SmartScreen and unsigned apps",
      smartAppControl:
        "If **Smart App Control** is on, Windows blocks apps that are not signed and has no way to allow a single app. WireCat cannot start on that PC until it is signed.",
      smartAppSource: "Microsoft: Smart App Control",
    },
  },
  linux: {
    appimage:
      "The AppImage runs without installing anything. To keep it in one place and open it from your app menu, follow the setup steps.",
    setup: "Set up the AppImage",
    fuse: "If it says **AppImages require FUSE to run**, install FUSE 2: `sudo apt install libfuse2t64` on Ubuntu 24.04 and later, `sudo apt install libfuse2` on older Ubuntu and Debian.",
    fuseSource: "AppImage: FUSE",
    deb: "Install the .deb package from a terminal: `wget -O /tmp/{deb} {url} && sudo apt install /tmp/{deb}`. It downloads the package into /tmp, because apt reads the file as its own restricted user, which cannot open your home folder, and prints a notice about it. The install ends with what to do next.",
    rpm: "Install the .rpm package: `sudo dnf install ./{rpm}`. If you installed version 0.1.0 from an .rpm, remove it first: `sudo dnf remove wire-cat`.",
  },
  appimageSetup: {
    title: "Set up the AppImage",
    started: "The download has started.",
    intro: "Three steps turn the file into an app you open from the app menu.",
    steps: [
      "Make it executable: open the file's **Properties** and allow it to run as a program.",
      "Move it to a folder where it can stay, such as `~/Applications`. The menu entry points to this place.",
      "Add it to the app menu with its icon.",
    ],
    helpers: "An app can do this for you:",
    gearLever: "keeps AppImages in one folder and adds them to the app menu. Install it from Flathub.",
    appImageLauncher: "offers to do the same when you first open an AppImage.",
    terminal: "Or in a terminal. It replaces an earlier `WireCat.AppImage` and its menu entry if you have them.",
    agent: "Or let your AI agent do it:",
    prompt: (file) =>
      `Set up the WireCat AppImage on my Linux computer, for my user only, without sudo.

1. The file I downloaded is ~/Downloads/${file}. If it is not there, ask me where it is.
2. Make it executable and move it to ~/Applications/WireCat.AppImage. Create the folder if it is missing.
3. Get its icon: in a temporary folder, run \`~/Applications/WireCat.AppImage --appimage-extract wirecat.png\` and copy squashfs-root/wirecat.png to ~/.local/share/icons/hicolor/256x256/apps/wirecat-desktop.png. Then delete the temporary folder.
4. Create ~/.local/share/applications/wirecat.desktop with Type=Application, Name=WireCat, Exec=<the full path of the AppImage>, Icon=wirecat-desktop, StartupWMClass=wirecat-desktop, Categories=Development; and Terminal=false.

Before you overwrite or delete any file that already exists, show it to me and ask. When you finish, list what you created or changed.`,
    hide: "Hide",
  },
  updates: {
    title: "Updates",
    auto: "On macOS, Windows and with the AppImage, WireCat updates itself. When a new version is out, the app offers it at the top of the window: choose **Install and restart**. Your accounts and data will not be deleted.",
    packages:
      "From version 0.1.3 a .deb or .rpm copy updates too: choose **Download and install**. WireCat downloads the new package and opens your system's installer, which asks for your password; it also shows the `apt` or `dnf` command if you prefer a terminal. An older copy only tells you that a new version is out: download the package from this page and install it the same way. From version 0.1.1 the package is called `wirecat`; the .deb replaces `wire-cat` from 0.1.0 by itself.",
  },
  uninstall: {
    title: "Uninstall",
    macos: "**macOS:** drag WireCat from **Applications** to the Bin.",
    windows:
      "**Windows:** select **Start > Settings > Apps > Installed apps**, find WireCat, then select **More > Uninstall**.",
    appimage: "**AppImage:** delete the file.",
    packages:
      "**.deb or .rpm:** `sudo apt remove wirecat` or `sudo dnf remove wirecat`. Version 0.1.0 used the name `wire-cat`.",
    tools:
      "Removing the app leaves the tools it installed and their data in place. To remove a tool too, uninstall it on the app's **Tools** page first.",
  },
  next: {
    title: "Next",
    docs: "What WireCat Desktop does",
    terminal: "Prefer the terminal? Install the tools with npm",
  },
  gallery: {
    title: "Inside the app",
    intro: "Screens from WireCat Desktop with sample data.",
    previous: "Previous screenshot",
    next: "Next screenshot",
    close: "Close",
    shots: {
      tools: {
        alt: "The Tools page: Telegram synced and WhatsApp opened with its signed-in account",
        caption: "Every messenger, meeting and file tool, installed, signed in and synced.",
      },
      agents: {
        alt: "The Agents page: Claude Code with a current skill for every tool",
        caption: "Claude Code, Codex, Cursor and Gemini CLI get current skills for every tool.",
      },
      "search-hit": {
        alt: "The Search page: a result opened with the messages around it",
        caption: "Open any result to see the conversation around it.",
      },
      tasks: {
        alt: "The Tasks board with open, in-progress and done tasks shared with agents",
        caption: "One task list that you and your agents share.",
      },
      memory: {
        alt: "The Memory page: facts and decisions from your agents waiting for your approval",
        caption: "Nothing an agent remembers counts until you approve it.",
      },
      connect: {
        alt: "Connecting ChatGPT to Telegram: every step checked and the first call received",
        caption: "ChatGPT can now use your Telegram, set up in a few clicks.",
      },
    },
  },
}

const ru: Words = {
  title: "Скачать WireCat Desktop",
  description:
    "Приложение WireCat для macOS, Windows и Linux. Оно устанавливает, обновляет и проверяет инструменты WireCat без терминала.",
  intro:
    "WireCat Desktop устанавливает, обновляет и проверяет инструменты командной строки WireCat за вас. Подключите ИИ-агента к Telegram, MAX, WhatsApp, Zoom, Google Drive, почте и заметкам, не набирая команды npm.",
  free: "Бесплатно и с открытым кодом. Работает на вашем компьютере.",
  platforms: { macos: "macOS", windows: "Windows", linux: "Linux" },
  downloadFor: { macos: "Скачать для macOS", windows: "Скачать для Windows", linux: "Скачать для Linux" },
  formats: {
    dmg: { label: "Образ диска macOS (.dmg)", note: "Apple silicon и Intel" },
    exe: { label: "Установщик Windows (.exe)", note: "64-битная Windows" },
    appimage: { label: "AppImage", note: "Большинство дистрибутивов. Обновляется сам" },
    deb: { label: "Пакет .deb", note: "Debian, Ubuntu, Linux Mint" },
    rpm: { label: "Пакет .rpm", note: "Fedora, RHEL, openSUSE" },
  },
  version: (version) => `Версия ${version}`,
  released: (date) => `вышла ${date}`,
  notes: "Что нового",
  linuxMore: "Или пакет для вашего дистрибутива:",
  mobile:
    "WireCat Desktop работает на компьютере. Откройте эту страницу на Mac, Windows или Linux, чтобы скачать приложение.",
  choose: "Выберите систему вашего компьютера.",
  otherSystems: "Другие системы",
  earlierTitle: "Предыдущие версии",
  earlier: (count) => {
    const tens = count % 100
    const ones = count % 10
    const word = tens > 10 && tens < 20 ? "версий" : ones === 1 ? "версия" : ones > 1 && ones < 5 ? "версии" : "версий"
    return `${count} ${ones === 1 && tens !== 11 ? "предыдущая" : "предыдущих"} ${word}`
  },
  earlierEmpty: "Это первая версия.",
  failed: "Список загрузок не открылся. Все файлы есть на странице выпусков в GitHub.",
  openReleases: "Открыть выпуски в GitHub",
  allReleases: "Все выпуски в GitHub",
  unsigned: {
    title: "Первый запуск",
    intro:
      "Приложение для macOS подписано и проверено Apple. Установщик для Windows пока не подписан сертификатом разработчика Microsoft, поэтому при первом запуске Windows попросит подтверждение. Это нужно сделать один раз.",
    macos: {
      steps: [
        "Откройте файл .dmg и перетащите **WireCat** в **Программы**.",
        "Откройте WireCat. macOS один раз спросит, открыть ли приложение, загруженное из интернета: нажмите **Открыть**. Apple проверила WireCat, поэтому больше ничего разрешать не нужно.",
      ],
    },
    windows: {
      steps: [
        "Откройте установщик.",
        "Если Windows покажет **Система Windows защитила ваш компьютер**, нажмите **Подробнее**, затем **Выполнить в любом случае**.",
        "Установщик добавит WireCat в меню «Пуск» и откроет его.",
      ],
      source: "Microsoft: SmartScreen и неподписанные приложения",
      smartAppControl:
        "Если включено **Интеллектуальное управление приложениями** (Smart App Control), Windows блокирует неподписанные приложения, и разрешить одно приложение нельзя. На таком компьютере WireCat запустится только после того, как его подпишут.",
      smartAppSource: "Microsoft: Smart App Control",
    },
  },
  linux: {
    appimage:
      "AppImage работает без установки. Чтобы хранить его в одном месте и открывать из меню приложений, выполните шаги настройки.",
    setup: "Настроить AppImage",
    fuse: "Если появится **AppImages require FUSE to run**, установите FUSE 2: `sudo apt install libfuse2t64` в Ubuntu 24.04 и новее, `sudo apt install libfuse2` в более старых Ubuntu и Debian.",
    fuseSource: "AppImage: FUSE",
    deb: "Установите пакет .deb из терминала: `wget -O /tmp/{deb} {url} && sudo apt install /tmp/{deb}`. Пакет скачивается в /tmp: apt читает файл от имени своего пользователя с ограниченными правами, который не может открыть вашу домашнюю папку, и пишет об этом предупреждение. В конце установки появится подсказка, что делать дальше.",
    rpm: "Установите пакет .rpm: `sudo dnf install ./{rpm}`. Если раньше вы ставили версию 0.1.0 из .rpm, сначала удалите её: `sudo dnf remove wire-cat`.",
  },
  appimageSetup: {
    title: "Настройте AppImage",
    started: "Загрузка началась.",
    intro: "Три шага превратят файл в приложение, которое открывается из меню.",
    steps: [
      "Сделайте файл исполняемым: откройте его **Свойства** и разрешите запускать как программу.",
      "Переместите его в папку, где он останется, например `~/Applications`. Пункт меню будет указывать на это место.",
      "Добавьте его в меню приложений со значком.",
    ],
    helpers: "Это может сделать приложение:",
    gearLever: "хранит AppImage в одной папке и добавляет их в меню. Устанавливается из Flathub.",
    appImageLauncher: "предлагает сделать то же самое, когда вы впервые открываете AppImage.",
    terminal: "Или в терминале. Команды заменят прежний `WireCat.AppImage` и его пункт меню, если они есть.",
    agent: "Или поручите это ИИ-агенту:",
    prompt: (file) =>
      `Настрой AppImage WireCat на моём компьютере с Linux, только для моего пользователя и без sudo.

1. Скачанный файл: ~/Downloads/${file}. Если его там нет, спроси меня, где он.
2. Сделай его исполняемым и перемести в ~/Applications/WireCat.AppImage. Если папки нет, создай её.
3. Достань значок: во временной папке выполни \`~/Applications/WireCat.AppImage --appimage-extract wirecat.png\` и скопируй squashfs-root/wirecat.png в ~/.local/share/icons/hicolor/256x256/apps/wirecat-desktop.png. Потом удали временную папку.
4. Создай ~/.local/share/applications/wirecat.desktop с Type=Application, Name=WireCat, Exec=<полный путь к AppImage>, Icon=wirecat-desktop, StartupWMClass=wirecat-desktop, Categories=Development; и Terminal=false.

Прежде чем перезаписать или удалить уже существующий файл, покажи его мне и спроси. В конце перечисли, что ты создал или изменил.`,
    hide: "Скрыть",
  },
  updates: {
    title: "Обновления",
    auto: "В macOS, Windows и в AppImage WireCat обновляется сам. Когда выходит новая версия, приложение предлагает её вверху окна: нажмите **Установить и перезапустить**. Ваши аккаунты и данные не удалятся.",
    packages:
      "С версии 0.1.3 копия из .deb или .rpm тоже обновляется: нажмите **Скачать и установить**. WireCat скачает новый пакет и откроет установщик программ вашей системы — там нужно будет ввести пароль; если удобнее терминал, приложение покажет команду `apt` или `dnf`. Более старая копия только сообщает о новой версии: скачайте пакет на этой странице и установите его так же, как первый. С версии 0.1.1 пакет называется `wirecat`; .deb сам заменяет `wire-cat` из версии 0.1.0.",
  },
  uninstall: {
    title: "Удаление",
    macos: "**macOS:** перетащите WireCat из **Программ** в Корзину.",
    windows:
      "**Windows:** выберите **Пуск > Параметры > Приложения > Установленные приложения**, найдите WireCat и выберите **Дополнительно > Удалить**.",
    appimage: "**AppImage:** удалите файл.",
    packages:
      "**.deb или .rpm:** `sudo apt remove wirecat` или `sudo dnf remove wirecat`. В версии 0.1.0 пакет назывался `wire-cat`.",
    tools:
      "Инструменты, которые установило приложение, и их данные после удаления остаются. Чтобы убрать и инструмент, сначала удалите его на странице **Инструменты** в приложении.",
  },
  next: {
    title: "Дальше",
    docs: "Что умеет WireCat Desktop",
    terminal: "Удобнее в терминале? Установите инструменты через npm",
  },
  gallery: {
    title: "Как выглядит приложение",
    intro: "Экраны WireCat Desktop с примерами данных.",
    previous: "Предыдущий снимок",
    next: "Следующий снимок",
    close: "Закрыть",
    shots: {
      tools: {
        alt: "Страница «Инструменты»: Telegram и MAX синхронизированы, у WhatsApp открыт подключённый аккаунт",
        caption: "Все инструменты установлены, вход выполнен, данные синхронизированы.",
      },
      agents: {
        alt: "Страница «Агенты»: у Claude Code актуальный навык для каждого инструмента",
        caption: "Claude Code, Codex, Cursor и Gemini CLI получают актуальные навыки для каждого инструмента.",
      },
      "search-hit": {
        alt: "Страница «Поиск»: открытый результат с сообщениями вокруг него",
        caption: "Откройте результат и увидите переписку вокруг него.",
      },
      tasks: {
        alt: "Доска задач: открытые, текущие и выполненные задачи, общие с агентами",
        caption: "Общий список задач для вас и ваших агентов.",
      },
      memory: {
        alt: "Страница «Память»: факты и решения от агентов ждут вашего одобрения",
        caption: "Ничто из того, что запомнил агент, не считается, пока вы не одобрите.",
      },
      connect: {
        alt: "Подключение ChatGPT к Telegram: все шаги пройдены, первый вызов получен",
        caption: "ChatGPT теперь работает с вашим Telegram — настройка в пару кликов.",
      },
    },
  },
}

const es: Words = {
  title: "Descargar WireCat Desktop",
  description:
    "La aplicación WireCat para macOS, Windows y Linux. Instala, actualiza y comprueba las herramientas de WireCat sin terminal.",
  intro:
    "WireCat Desktop instala, actualiza y comprueba por ti las herramientas de línea de comandos de WireCat. Conecta tu agente de IA a Telegram, MAX, WhatsApp, Zoom, Google Drive, el correo y tus notas sin escribir comandos de npm.",
  free: "Gratis y de código abierto. Funciona en tu ordenador.",
  platforms: { macos: "macOS", windows: "Windows", linux: "Linux" },
  downloadFor: { macos: "Descargar para macOS", windows: "Descargar para Windows", linux: "Descargar para Linux" },
  formats: {
    dmg: { label: "Imagen de disco de macOS (.dmg)", note: "Apple silicon e Intel" },
    exe: { label: "Instalador de Windows (.exe)", note: "Windows de 64 bits" },
    appimage: { label: "AppImage", note: "La mayoría de distribuciones. Se actualiza sola" },
    deb: { label: "Paquete .deb", note: "Debian, Ubuntu, Linux Mint" },
    rpm: { label: "Paquete .rpm", note: "Fedora, RHEL, openSUSE" },
  },
  version: (version) => `Versión ${version}`,
  released: (date) => `publicada el ${date}`,
  notes: "Novedades",
  linuxMore: "O un paquete para tu distribución:",
  mobile: "WireCat Desktop funciona en un ordenador. Abre esta página en tu Mac, Windows o Linux para descargarla.",
  choose: "Elige el sistema de tu ordenador.",
  otherSystems: "Otros sistemas",
  earlierTitle: "Versiones anteriores",
  earlier: (count) => (count === 1 ? "1 versión anterior" : `${count} versiones anteriores`),
  earlierEmpty: "Esta es la primera versión.",
  failed: "La lista de descargas no se ha cargado. Todos los archivos están en la página de versiones de GitHub.",
  openReleases: "Abrir las versiones en GitHub",
  allReleases: "Todas las versiones en GitHub",
  unsigned: {
    title: "Ábrela por primera vez",
    intro:
      "La app para macOS está firmada y comprobada por Apple. El instalador de Windows aún no está firmado con un certificado de desarrollador de Microsoft, así que Windows te pide que confirmes el primer arranque. Solo hace falta una vez.",
    macos: {
      steps: [
        "Abre el archivo .dmg y arrastra **WireCat** a **Aplicaciones**.",
        "Abre WireCat. macOS pregunta una vez si quieres abrir una app descargada de Internet: haz clic en **Abrir**. Apple ha comprobado WireCat, así que no hay nada más que permitir.",
      ],
    },
    windows: {
      steps: [
        "Abre el instalador.",
        "Si Windows muestra **Windows protegió su PC**, selecciona **Más información** y después **Ejecutar de todas formas**.",
        "El instalador añade WireCat al menú Inicio y la abre.",
      ],
      source: "Microsoft: SmartScreen y aplicaciones sin firma",
      smartAppControl:
        "Si **Control Inteligente de Aplicaciones** (Smart App Control) está activado, Windows bloquea las aplicaciones sin firma y no permite autorizar una sola. WireCat no podrá arrancar en ese PC hasta que esté firmada.",
      smartAppSource: "Microsoft: Control Inteligente de Aplicaciones",
    },
  },
  linux: {
    appimage:
      "El AppImage funciona sin instalar nada. Para guardarlo en un sitio y abrirlo desde el menú de aplicaciones, sigue los pasos de preparación.",
    setup: "Preparar el AppImage",
    fuse: "Si aparece **AppImages require FUSE to run**, instala FUSE 2: `sudo apt install libfuse2t64` en Ubuntu 24.04 o posterior, `sudo apt install libfuse2` en Ubuntu y Debian anteriores.",
    fuseSource: "AppImage: FUSE",
    deb: "Instala el paquete .deb desde una terminal: `wget -O /tmp/{deb} {url} && sudo apt install /tmp/{deb}`. El paquete se descarga en /tmp, porque apt lee el archivo con su propio usuario restringido, que no puede abrir tu carpeta personal, y muestra un aviso. Al terminar, la instalación indica los siguientes pasos.",
    rpm: "Instala el paquete .rpm: `sudo dnf install ./{rpm}`. Si instalaste la versión 0.1.0 desde un .rpm, quítala primero: `sudo dnf remove wire-cat`.",
  },
  appimageSetup: {
    title: "Prepara el AppImage",
    started: "La descarga ha empezado.",
    intro: "Con tres pasos el archivo se convierte en una app que abres desde el menú.",
    steps: [
      "Hazlo ejecutable: abre las **Propiedades** del archivo y permite ejecutarlo como programa.",
      "Muévelo a una carpeta donde se quede, como `~/Applications`. La entrada del menú apunta a ese lugar.",
      "Añádelo al menú de aplicaciones con su icono.",
    ],
    helpers: "Una app puede hacerlo por ti:",
    gearLever: "guarda los AppImage en una carpeta y los añade al menú. Se instala desde Flathub.",
    appImageLauncher: "ofrece hacer lo mismo la primera vez que abres un AppImage.",
    terminal: "O en una terminal. Sustituye un `WireCat.AppImage` anterior y su entrada del menú si los tienes.",
    agent: "O deja que lo haga tu agente de IA:",
    prompt: (file) =>
      `Prepara el AppImage de WireCat en mi ordenador con Linux, solo para mi usuario y sin sudo.

1. El archivo que descargué es ~/Downloads/${file}. Si no está ahí, pregúntame dónde está.
2. Hazlo ejecutable y muévelo a ~/Applications/WireCat.AppImage. Crea la carpeta si no existe.
3. Saca su icono: en una carpeta temporal, ejecuta \`~/Applications/WireCat.AppImage --appimage-extract wirecat.png\` y copia squashfs-root/wirecat.png a ~/.local/share/icons/hicolor/256x256/apps/wirecat-desktop.png. Después borra la carpeta temporal.
4. Crea ~/.local/share/applications/wirecat.desktop con Type=Application, Name=WireCat, Exec=<la ruta completa del AppImage>, Icon=wirecat-desktop, StartupWMClass=wirecat-desktop, Categories=Development; y Terminal=false.

Antes de sobrescribir o borrar un archivo que ya exista, enséñamelo y pregúntame. Al terminar, di qué has creado o cambiado.`,
    hide: "Ocultar",
  },
  updates: {
    title: "Actualizaciones",
    auto: "En macOS, Windows y con el AppImage, WireCat se actualiza sola. Cuando sale una versión nueva, la aplicación la ofrece en la parte superior de la ventana: elige **Instalar y reiniciar**. Tus cuentas y tus datos no se borran.",
    packages:
      "Desde la versión 0.1.3, una copia instalada desde .deb o .rpm también se actualiza: elige **Descargar e instalar**. WireCat descarga el paquete nuevo y abre el instalador de tu sistema, que te pedirá la contraseña; si prefieres la terminal, muestra el comando de `apt` o `dnf`. Una copia anterior solo avisa de la versión nueva: descarga el paquete en esta página e instálalo igual que el primero. Desde la versión 0.1.1 el paquete se llama `wirecat`; el .deb sustituye por sí solo a `wire-cat` de la 0.1.0.",
  },
  uninstall: {
    title: "Desinstalar",
    macos: "**macOS:** arrastra WireCat de **Aplicaciones** a la Papelera.",
    windows:
      "**Windows:** selecciona **Inicio > Configuración > Aplicaciones > Aplicaciones instaladas**, busca WireCat y selecciona **Más > Desinstalar**.",
    appimage: "**AppImage:** borra el archivo.",
    packages:
      "**.deb o .rpm:** `sudo apt remove wirecat` o `sudo dnf remove wirecat`. La versión 0.1.0 usaba el nombre `wire-cat`.",
    tools:
      "Al quitar la aplicación, las herramientas que instaló y sus datos se quedan. Para quitar también una herramienta, desinstálala antes en la página **Herramientas** de la aplicación.",
  },
  next: {
    title: "Siguiente paso",
    docs: "Qué hace WireCat Desktop",
    terminal: "¿Prefieres la terminal? Instala las herramientas con npm",
  },
  gallery: {
    title: "Así es la aplicación",
    intro: "Pantallas de WireCat Desktop con datos de ejemplo.",
    previous: "Captura anterior",
    next: "Captura siguiente",
    close: "Cerrar",
    shots: {
      tools: {
        alt: "La página Herramientas: Telegram sincronizado y WhatsApp abierto con su cuenta conectada",
        caption: "Todas tus herramientas instaladas, con sesión iniciada y sincronizadas.",
      },
      agents: {
        alt: "La página Agentes: Claude Code con una habilidad al día para cada herramienta",
        caption: "Claude Code, Codex, Cursor y Gemini CLI reciben habilidades al día para cada herramienta.",
      },
      "search-hit": {
        alt: "La página Búsqueda: un resultado abierto con los mensajes que lo rodean",
        caption: "Abre cualquier resultado y ve la conversación que lo rodea.",
      },
      tasks: {
        alt: "El tablero de tareas con tareas abiertas, en curso y hechas, compartidas con los agentes",
        caption: "Una lista de tareas que compartes con tus agentes.",
      },
      memory: {
        alt: "La página Memoria: hechos y decisiones de tus agentes esperan tu aprobación",
        caption: "Nada de lo que recuerda un agente cuenta hasta que lo apruebas.",
      },
      connect: {
        alt: "Conectar ChatGPT con Telegram: todos los pasos comprobados y la primera llamada recibida",
        caption: "ChatGPT ya puede usar tu Telegram, configurado en unos clics.",
      },
    },
  },
}

export const downloadCopy = { en, ru, es }
export const downloadWords = (lang: string) => downloadCopy[lang as keyof typeof downloadCopy] ?? en

const locales = { en: "en-us", ru: "ru-ru", es: "es-es" }
export const sourceLinks = (lang: string) => {
  const locale = locales[lang as keyof typeof locales] ?? locales.en
  return {
    smartScreen: `https://learn.microsoft.com/${locale}/windows/apps/package-and-deploy/smartscreen-reputation`,
    smartAppControl: `https://support.microsoft.com/${locale}/windows/security/threat-malware-protection/smart-app-control-frequently-asked-questions`,
    fuse: "https://docs.appimage.org/user-guide/troubleshooting/fuse.html",
    gearLever: "https://flathub.org/apps/it.mijorus.gearlever",
    appImageLauncher: "https://github.com/TheAssassin/AppImageLauncher",
  }
}

// The bundled wirecat.desktop names the icon and window class wirecat-desktop; matching them groups the window
// under this entry. Desktop files do not expand ~, so Exec gets $HOME from the unquoted heredoc.
export const appimageCommands = (
  file: string,
) => `mkdir -p ~/Applications ~/.local/share/applications ~/.local/share/icons/hicolor/256x256/apps
mv ~/Downloads/${file} ~/Applications/WireCat.AppImage
chmod +x ~/Applications/WireCat.AppImage
cd "$(mktemp -d)" && ~/Applications/WireCat.AppImage --appimage-extract wirecat.png > /dev/null
cp squashfs-root/wirecat.png ~/.local/share/icons/hicolor/256x256/apps/wirecat-desktop.png
cd ~ && cat > ~/.local/share/applications/wirecat.desktop <<DESKTOP
[Desktop Entry]
Type=Application
Name=WireCat
Comment=Install and manage WireCat tools
Exec=$HOME/Applications/WireCat.AppImage
Icon=wirecat-desktop
StartupWMClass=wirecat-desktop
Categories=Development;
Terminal=false
DESKTOP`
