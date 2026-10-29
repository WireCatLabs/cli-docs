import type { Format, Platform } from "@/lib/desktop-releases"

/**
 * Text uses `code` and **bold** marks. The `unsigned` block exists only while the builds have no Apple or
 * Microsoft certificate: delete it and its section once signing ships.
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
    macos: { title: string; steps: string[]; source: string; damaged: string; damagedText: string }
    windows: { title: string; steps: string[]; source: string; smartAppControl: string; smartAppSource: string }
  }
  linux: { title: string; appimage: string[]; fuse: string; fuseSource: string; deb: string; rpm: string }
  updates: { title: string; auto: string; packages: string }
  uninstall: { title: string; macos: string; windows: string; appimage: string; packages: string; tools: string }
  next: { title: string; docs: string; terminal: string }
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
      "WireCat is not signed with an Apple or Microsoft developer certificate yet. Your computer therefore asks you to confirm the first start. You do this once.",
    macos: {
      title: "macOS",
      steps: [
        "Open the .dmg file and drag **WireCat** to **Applications**.",
        "Open WireCat. macOS says that it cannot check the app. Close the message.",
        "Choose **Apple menu > System Settings**, then click **Privacy & Security** in the sidebar.",
        "Go to **Security**, then click **Open Anyway**. The button stays for about an hour after you try to open the app.",
        "Enter your login password, then click **OK**. From now on WireCat opens like any other app.",
      ],
      source: "Apple: open a Mac app from an unknown developer",
      damaged: "If macOS says that WireCat “is damaged”",
      damagedText:
        "This message has no **Open Anyway** button. Open **Terminal** and run `xattr -dr com.apple.quarantine /Applications/WireCat.app`, then open WireCat again. The command removes the mark that macOS puts on downloaded files. It does not change the app.",
    },
    windows: {
      title: "Windows",
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
    title: "Linux",
    appimage: [
      "Make the AppImage executable: in your file manager, open its **Properties** and allow it to run as a program. In a terminal: `chmod +x {appimage}`.",
      "Open the file. WireCat starts; nothing else is installed.",
    ],
    fuse: "If it says **AppImages require FUSE to run**, install FUSE 2: `sudo apt install libfuse2t64` on Ubuntu 24.04 and later, `sudo apt install libfuse2` on older Ubuntu and Debian.",
    fuseSource: "AppImage: FUSE",
    deb: "Install the .deb package: `sudo apt install ./{deb}`.",
    rpm: "Install the .rpm package: `sudo dnf install ./{rpm}`. If you installed version 0.1.0 from an .rpm, remove it first: `sudo dnf remove wire-cat`.",
  },
  updates: {
    title: "Updates",
    auto: "On macOS, Windows and with the AppImage, WireCat updates itself. When a new version is out, the app offers it at the top of the window: choose **Install and restart**. Your tools, profiles and data stay as they are.",
    packages:
      "A .deb or .rpm copy tells you that a new version is out, but cannot install it. Download the new package from this page and install it the same way. From version 0.1.1 the package is called `wirecat`; the .deb replaces `wire-cat` from 0.1.0 by itself.",
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
      "WireCat пока не подписан сертификатом разработчика Apple или Microsoft. Поэтому при первом запуске компьютер попросит подтверждение. Это нужно сделать один раз.",
    macos: {
      title: "macOS",
      steps: [
        "Откройте файл .dmg и перетащите **WireCat** в **Программы**.",
        "Откройте WireCat. macOS сообщит, что не может проверить приложение. Закройте сообщение.",
        "Выберите **меню Apple > Системные настройки** и нажмите **Конфиденциальность и безопасность** в боковом меню.",
        "В разделе **Безопасность** нажмите **Все равно открыть**. Кнопка видна около часа после попытки открыть приложение.",
        "Введите пароль входа и нажмите **ОК**. Дальше WireCat открывается как любое другое приложение.",
      ],
      source: "Apple: как открыть приложение от неизвестного разработчика",
      damaged: "Если macOS пишет, что WireCat «повреждён»",
      damagedText:
        "В этом сообщении нет кнопки **Все равно открыть**. Откройте **Терминал** и выполните `xattr -dr com.apple.quarantine /Applications/WireCat.app`, затем снова откройте WireCat. Команда снимает пометку, которую macOS ставит на скачанные файлы. Само приложение она не меняет.",
    },
    windows: {
      title: "Windows",
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
    title: "Linux",
    appimage: [
      "Сделайте AppImage исполняемым: в файловом менеджере откройте **Свойства** файла и разрешите запускать его как программу. В терминале: `chmod +x {appimage}`.",
      "Откройте файл. WireCat запустится; больше ничего не устанавливается.",
    ],
    fuse: "Если появится **AppImages require FUSE to run**, установите FUSE 2: `sudo apt install libfuse2t64` в Ubuntu 24.04 и новее, `sudo apt install libfuse2` в более старых Ubuntu и Debian.",
    fuseSource: "AppImage: FUSE",
    deb: "Установите пакет .deb: `sudo apt install ./{deb}`.",
    rpm: "Установите пакет .rpm: `sudo dnf install ./{rpm}`. Если раньше вы ставили версию 0.1.0 из .rpm, сначала удалите её: `sudo dnf remove wire-cat`.",
  },
  updates: {
    title: "Обновления",
    auto: "В macOS, Windows и в AppImage WireCat обновляется сам. Когда выходит новая версия, приложение предлагает её вверху окна: нажмите **Установить и перезапустить**. Инструменты, профили и данные остаются как есть.",
    packages:
      "Копия из .deb или .rpm сообщает о новой версии, но установить её не может. Скачайте новый пакет на этой странице и установите его так же, как первый. С версии 0.1.1 пакет называется `wirecat`; .deb сам заменяет `wire-cat` из версии 0.1.0.",
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
      "WireCat aún no está firmada con un certificado de desarrollador de Apple o Microsoft. Por eso tu ordenador te pide que confirmes el primer arranque. Solo hace falta una vez.",
    macos: {
      title: "macOS",
      steps: [
        "Abre el archivo .dmg y arrastra **WireCat** a **Aplicaciones**.",
        "Abre WireCat. macOS avisa de que no puede comprobar la aplicación. Cierra el aviso.",
        "Elige **menú Apple > Ajustes del Sistema** y haz clic en **Privacidad y seguridad** en la barra lateral.",
        "Ve a **Seguridad** y haz clic en **Abrir igualmente**. El botón está disponible durante una hora aproximadamente después de intentar abrir la aplicación.",
        "Introduce tu contraseña de inicio de sesión y haz clic en **Aceptar**. A partir de ahora WireCat se abre como cualquier otra aplicación.",
      ],
      source: "Apple: abrir una app de un desarrollador desconocido",
      damaged: "Si macOS dice que WireCat «está dañada»",
      damagedText:
        "Este aviso no tiene el botón **Abrir igualmente**. Abre **Terminal** y ejecuta `xattr -dr com.apple.quarantine /Applications/WireCat.app`; después vuelve a abrir WireCat. El comando quita la marca que macOS pone a los archivos descargados. No cambia la aplicación.",
    },
    windows: {
      title: "Windows",
      steps: [
        "Abre el instalador.",
        "Si Windows muestra **Windows protegió su PC**, selecciona **Más información** y después **Ejecutar de todas formas**.",
        "El instalador añade WireCat al menú Inicio y la abre.",
      ],
      source: "Microsoft: SmartScreen y aplicaciones sin firma",
      smartAppControl:
        "Si **Control inteligente de aplicaciones** (Smart App Control) está activado, Windows bloquea las aplicaciones sin firma y no permite autorizar una sola. WireCat no podrá arrancar en ese PC hasta que esté firmada.",
      smartAppSource: "Microsoft: Control inteligente de aplicaciones",
    },
  },
  linux: {
    title: "Linux",
    appimage: [
      "Haz ejecutable el AppImage: en el gestor de archivos, abre sus **Propiedades** y permite ejecutarlo como programa. En una terminal: `chmod +x {appimage}`.",
      "Abre el archivo. WireCat arranca; no se instala nada más.",
    ],
    fuse: "Si aparece **AppImages require FUSE to run**, instala FUSE 2: `sudo apt install libfuse2t64` en Ubuntu 24.04 o posterior, `sudo apt install libfuse2` en Ubuntu y Debian anteriores.",
    fuseSource: "AppImage: FUSE",
    deb: "Instala el paquete .deb: `sudo apt install ./{deb}`.",
    rpm: "Instala el paquete .rpm: `sudo dnf install ./{rpm}`. Si instalaste la versión 0.1.0 desde un .rpm, quítala primero: `sudo dnf remove wire-cat`.",
  },
  updates: {
    title: "Actualizaciones",
    auto: "En macOS, Windows y con el AppImage, WireCat se actualiza sola. Cuando sale una versión nueva, la aplicación la ofrece en la parte superior de la ventana: elige **Instalar y reiniciar**. Tus herramientas, perfiles y datos se quedan como están.",
    packages:
      "Una copia instalada desde .deb o .rpm avisa de la versión nueva, pero no puede instalarla. Descarga el paquete nuevo en esta página e instálalo igual que el primero. Desde la versión 0.1.1 el paquete se llama `wirecat`; el .deb sustituye por sí solo a `wire-cat` de la 0.1.0.",
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
}

export const downloadCopy = { en, ru, es }
export const downloadWords = (lang: string) => downloadCopy[lang as keyof typeof downloadCopy] ?? en

const locales = { en: "en-us", ru: "ru-ru", es: "es-es" }
export const sourceLinks = (lang: string) => {
  const locale = locales[lang as keyof typeof locales] ?? locales.en
  return {
    apple: `https://support.apple.com/${locale}/guide/mac-help/mh40616/mac`,
    smartScreen: `https://learn.microsoft.com/${locale}/windows/apps/package-and-deploy/smartscreen-reputation`,
    smartAppControl: `https://support.microsoft.com/${locale}/windows/security/threat-malware-protection/smart-app-control-frequently-asked-questions`,
    fuse: "https://docs.appimage.org/user-guide/troubleshooting/fuse.html",
  }
}
