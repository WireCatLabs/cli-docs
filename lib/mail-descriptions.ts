export const mailDescriptions: Record<string, Record<string, string>> = {
  en: {
    compare: "See what Mail does and does not do: read-only IMAP sync, offline search, no sending, no Outlook yet.",
    index: "Sync your mailbox over IMAP into a local store, so you and your AI agent can search mail offline.",
    installation: "Install the Mail CLI with npm, check the Node.js version and run doctor.",
    usage: "Connect a mailbox with an app password, sync mail in parts, script the output and connect an agent.",
    providers:
      "Turn on IMAP and make an app password for Yandex, Gmail, iCloud, Mail.ru, Fastmail or another provider.",
    commands: "Find every Mail CLI command, option and exit code in the generated reference.",
    configuration: "See and change a profile's mailbox settings, permissions and run records.",
    troubleshooting: "Fix Mail CLI profile, app password, keyring, rate limit and settings-file problems.",
    security: "What the Mail CLI keeps, where the app password lives and how to treat synced mail.",
    changelog: "Read Mail CLI release notes, including new capabilities, changes and fixes.",
    roadmap: "See which Mail CLI capabilities are available and which work remains planned.",
  },
  ru: {
    compare:
      "Что Mail умеет и чего нет: синхронизация IMAP только для чтения, поиск без сети, без отправки, пока без Outlook.",
    index: "Синхронизируйте почтовый ящик по IMAP в локальное хранилище: вы и ваш ИИ-агент ищете письма без интернета.",
    installation: "Установите Mail CLI через npm, проверьте версию Node.js и запустите doctor.",
    usage:
      "Подключите ящик с паролем приложения, синхронизируйте почту частями, получайте вывод для скриптов и подключайте агента.",
    providers:
      "Включите IMAP и создайте пароль приложения для Yandex, Gmail, iCloud, Mail.ru, Fastmail или другого провайдера.",
    commands: "Все команды, параметры и коды выхода Mail CLI в сгенерированном справочнике.",
    configuration: "Посмотрите и измените настройки ящика профиля, разрешения и записи запусков.",
    troubleshooting:
      "Исправьте проблемы с профилем, паролем приложения, связкой ключей, лимитами и файлом настроек Mail CLI.",
    security: "Что хранит Mail CLI, где лежит пароль приложения и как обращаться с синхронизированной почтой.",
    changelog: "Заметки о выпусках Mail CLI: новые возможности, изменения и исправления.",
    roadmap: "Какие возможности Mail CLI уже есть и какие работы ещё запланированы.",
  },
  es: {
    compare:
      "Qué hace y qué no hace Mail: sincronización IMAP de solo lectura, búsqueda sin conexión, sin envío y aún sin Outlook.",
    index:
      "Sincroniza tu buzón por IMAP en un almacén local para que tú y tu agente de IA busquéis correo sin conexión.",
    installation: "Instala la CLI de Mail con npm, comprueba la versión de Node.js y ejecuta doctor.",
    usage:
      "Conecta un buzón con una contraseña de aplicación, sincroniza el correo por partes, usa la salida en scripts y conecta un agente.",
    providers:
      "Activa IMAP y crea una contraseña de aplicación para Yandex, Gmail, iCloud, Mail.ru, Fastmail u otro proveedor.",
    commands: "Todos los comandos, opciones y códigos de salida de la CLI de Mail en la referencia generada.",
    configuration: "Consulta y cambia los ajustes del buzón de un perfil, los permisos y los registros de ejecución.",
    troubleshooting:
      "Resuelve problemas de perfil, contraseña de aplicación, llavero, límites y archivo de ajustes de la CLI de Mail.",
    security: "Qué guarda la CLI de Mail, dónde vive la contraseña de aplicación y cómo tratar el correo sincronizado.",
    changelog: "Notas de versión de la CLI de Mail: nuevas capacidades, cambios y correcciones.",
    roadmap: "Qué capacidades de la CLI de Mail están disponibles y qué trabajo sigue previsto.",
  },
}
