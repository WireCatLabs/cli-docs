type PrivacySection = { id: string; title: string; paragraphs: string[] }

export const privacyCopy: Record<
  "en" | "ru" | "es",
  { title: string; intro: string; updated: string; contact: string; sections: PrivacySection[] }
> = {
  en: {
    title: "Privacy Policy",
    intro:
      "How WireCat handles Google account data, local documents, optional AI processing, bug reports from WireCat Desktop and visits to wirecat.dev. Learn what is shared and how to disconnect or delete your local copy.",
    updated: "Last updated: 25 October 2026",
    contact: "Questions and requests about your data:",
    sections: [
      {
        id: "google-access",
        title: "Google account access",
        paragraphs: [
          "WireCat Drive connects to Google only after you choose an account and approve access in Google’s browser consent screen. The default permission reads Drive files; it covers the account’s Drive, while your selected folders limit what the CLI imports. Google Docs and uploaded Markdown/plain text are supported for local indexing.",
          "The application accesses file and folder IDs, names, types, parent relationships, links, timestamps and document contents for the operations you request. It can also read owner and last-editor names, email addresses or Google identifiers, permissions, comments and revisions. Activity history and installed-application metadata require their optional sign-in permissions. Remote creation, editing and file management require the separate write permission and an explicit command.",
          "We use this access to import and refresh documents, export Markdown, search your local copy, show source links and history, and attach tags, notes, people and source-backed memories. Connecting an account does not import its whole Drive.",
        ],
      },
      {
        id: "local-storage",
        title: "Local storage and security",
        paragraphs: [
          "The CLI communicates directly with Google APIs from your computer. It does not send Google tokens or imported documents to a WireCat-operated server. Website analytics is separate from the CLI and does not receive your Google documents.",
          "OAuth tokens are stored in the operating-system credential store. If you explicitly choose file credential storage, they are written to a private local file. The CLI stores profile settings, document snapshots, searchable text, source metadata, tags, notes and memories locally. Optional search embeddings are computed locally with a downloaded model.",
          "Local copies remain until you remove them. Removing a selected folder and running sync removes its imported sources from search and deletes managed snapshots; notes and memories can retain source context. Signing out or uninstalling the package does not erase the local store, exports or backups. Protect your computer and the copies you create.",
        ],
      },
      {
        id: "sharing-ai",
        title: "Sharing and optional AI processing",
        paragraphs: [
          "WireCat does not sell Google user data, use it for advertising or use it to train general-purpose AI models. WireCat Drive's use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements. Project maintainers do not receive or routinely inspect your documents or tokens. If you contact support, share only what you choose to disclose; never include tokens or private documents unless needed for your request.",
          "When you explicitly request AI memory extraction, selected cached document text is sent to the AI provider you configured, using your provider credentials. That provider receives the text and extraction request; its processing, retention and data-use settings apply. Choose a provider and settings that do not use Google data to train general-purpose models. Local keyword search and local embeddings do not require this transfer.",
          "An agent or MCP application you connect can receive the document passages and metadata returned by the commands it calls. Its provider and settings control any further processing. Review those settings before giving an agent access to sensitive sources.",
        ],
      },
      {
        id: "bug-reports",
        title: "Bug reports from WireCat Desktop",
        paragraphs: [
          "When you send a bug report from WireCat Desktop, the app sends your own text (summary, details and what you expected), the versions of the app, your system and the installed tools, and recent error logs. The logs are each installed tool's last 20 failed run records and, if the report came from a failed install, the install log.",
          "The app masks the logs on your computer before it sends them: email addresses, phone numbers, tokens, message text and your home folder path are removed or replaced. WireCat's server masks them again before it stores them. Logs can still contain personal details that you typed into a command yourself, such as a search query.",
          "The logs are stored privately on WireCat's server for 90 days and then deleted. They are never published. The public GitHub issue for your report holds only your own text, the app, system and tool versions and a report id. To see or delete a report, write to hello@wirecat.dev with its report id.",
        ],
      },
      {
        id: "disconnect-delete",
        title: "Disconnecting and deleting data",
        paragraphs: [
          "Use the CLI’s session end command for each named profile to remove its local sign-in credentials. To revoke the application’s Google permission, remove WireCat from your Google Account’s third-party connections. Revocation stops future authorized access but does not delete copies already stored on your computer.",
          "To erase local data, close the CLI and remove its local configuration and data directories, including any explicitly configured shared store, exports and backups you intend to delete. A shared store can contain data from other tools; do not delete it unless you intend to remove that data too. WireCat cannot remotely erase files on your computer.",
          "Contact hello@wirecat.dev for privacy questions or requests concerning website or support data. Access, correction, deletion, restriction, portability and objection rights may apply under your local law. You can withdraw website consent and complain to the relevant data protection authority.",
        ],
      },
      {
        id: "policy-updates",
        title: "Policy changes",
        paragraphs: [
          "We update this page when data practices change and show the update date above. Review the policy before enabling a new integration or optional permission. A broader use of Google data requires disclosure and the applicable consent before that use.",
        ],
      },
      {
        id: "provider",
        title: "Who processes the data",
        paragraphs: [
          "WireCat is an independent, personally maintained open-source project. This policy covers wirecat.dev, the WireCat Drive application and bug reports sent from WireCat Desktop. For website analytics we use PostHog Cloud EU, hosted in Frankfurt, Germany. PostHog processes the data on our behalf.",
          "Cloudflare serves the pages and processes your IP address to deliver them and protect the site.",
        ],
      },
      {
        id: "without-consent",
        title: "If you decline or do not answer",
        paragraphs: [
          "We count page views and two actions: copying an installation command and opening a setup guide. For these actions we record only the tool, the site language and the part of the page, never the copied text. Each record also holds the page address, the previous page and general browser and device details.",
          "Nothing is stored in your browser apart from your answer, if you gave one: no cookies and no identifiers. To count unique visitors, PostHog's servers combine your IP address and browser details with a random value that changes every day and is then deleted, and keep only the result. This count cannot follow you from one day to the next.",
        ],
      },
      {
        id: "with-consent",
        title: "If you accept",
        paragraphs: [
          "PostHog stores a random identifier in a cookie and in your browser's local storage for this site, so a return visit counts as the same visitor.",
          "We also record sessions: page layout, scrolling, clicks and mouse movement. All page text and everything typed into fields is masked in your browser before it is sent. Recordings show us which pages are hard to use.",
        ],
      },
      {
        id: "ip-address",
        title: "IP address",
        paragraphs: [
          "Your IP address reaches PostHog with every request. PostHog does not store it with the events, and we do not use it to find your location.",
        ],
      },
      {
        id: "legal-basis",
        title: "Legal basis",
        paragraphs: [
          "Counting visits without cookies rests on our legitimate interest in knowing how the site is used (GDPR Article 6(1)(f)); you can object by writing to us. The identifier and session recordings rest on your consent (Article 6(1)(a)), which you can withdraw at any time.",
        ],
      },
      {
        id: "retention",
        title: "How long we keep data",
        paragraphs: ["Session recordings are deleted after 30 days. Analytics events are kept for up to 12 months."],
      },
      {
        id: "your-choice",
        title: "Changing your choice",
        paragraphs: [
          "Your answer is saved in your browser's local storage so we do not ask on every page. This record holds only the answer.",
          "To change it, select “Cookie settings” at the bottom of any page. If you withdraw consent, recording stops and the identifier is no longer used. To remove the record as well, clear this site's data in your browser.",
          "You can ask us to see or delete data about you, and you can complain to your data protection authority.",
        ],
      },
    ],
  },
  ru: {
    title: "Политика конфиденциальности",
    intro:
      "Как WireCat обрабатывает данные аккаунта Google, локальные документы, дополнительные ИИ-запросы, отчёты об ошибках из WireCat Desktop и посещения wirecat.dev. Узнайте, что передаётся и как отключить доступ или удалить локальную копию.",
    updated: "Обновлено: 25 октября 2026 г.",
    contact: "Вопросы и запросы о ваших данных:",
    sections: [
      {
        id: "google-access",
        title: "Доступ к аккаунту Google",
        paragraphs: [
          "WireCat Drive подключается к Google только после выбора аккаунта и вашего согласия в браузере Google. По умолчанию запрашивается чтение файлов Drive: разрешение охватывает Drive аккаунта, а выбранные папки ограничивают импорт в CLI. Для локальной индексации поддерживаются Google Docs и загруженные Markdown/обычный текст.",
          "Для запрошенных действий приложение получает идентификаторы файлов и папок, названия, типы, родительские связи, ссылки, даты и содержимое документов. Оно также может читать имена владельцев и последнего редактора, адреса электронной почты или идентификаторы Google, разрешения, комментарии и ревизии. История действий и сведения об установленных приложениях требуют дополнительных разрешений при входе. Создание, редактирование и управление файлами в Google требуют отдельного разрешения на запись и явной команды.",
          "Доступ используется для импорта и обновления документов, экспорта Markdown, поиска в локальной копии, показа ссылок и истории, а также добавления тегов, заметок, людей и записей памяти с источниками. Подключение аккаунта не импортирует весь Drive.",
        ],
      },
      {
        id: "local-storage",
        title: "Локальное хранение и защита",
        paragraphs: [
          "CLI обращается к API Google прямо с вашего компьютера. Он не отправляет токены Google или импортированные документы на сервер WireCat. Аналитика сайта отделена от CLI и не получает ваши документы Google.",
          "Токены OAuth хранятся в системном хранилище учётных данных. При явном выборе файлового хранения они записываются в приватный локальный файл. Настройки профиля, снимки документов, текст для поиска, метаданные источников, теги, заметки и записи памяти хранятся локально. Дополнительные эмбеддинги для поиска вычисляются локально с загруженной моделью.",
          "Локальные копии остаются, пока вы их не удалите. Удаление выбранной папки из импорта и последующая синхронизация убирают её источники из поиска и удаляют управляемые снимки; заметки и записи памяти могут сохранять контекст источников. Выход из аккаунта и удаление пакета не стирают локальное хранилище, экспорт или резервные копии. Защищайте компьютер и созданные копии.",
        ],
      },
      {
        id: "sharing-ai",
        title: "Передача данных и дополнительные ИИ-запросы",
        paragraphs: [
          "WireCat не продаёт данные пользователей Google, не использует их для рекламы или обучения универсальных ИИ-моделей. Использование и передача WireCat Drive сведений, полученных через API Google, соответствуют Правилам в отношении пользовательских данных в сервисах Google API (Google API Services User Data Policy), включая требования об ограниченном использовании (Limited Use). Сопровождающие проекта не получают и не просматривают ваши документы или токены в обычной работе. При обращении в поддержку передавайте только выбранные вами сведения; не включайте токены или приватные документы без необходимости для запроса.",
          "При явном запросе извлечения записей памяти с помощью ИИ выбранный текст из локальных документов отправляется настроенному вами провайдеру ИИ с вашими учётными данными провайдера. Он получает текст и запрос; действуют его правила обработки, хранения и использования данных. Выбирайте провайдера и настройки, которые не используют данные Google для обучения универсальных моделей. Поиск по словам и локальные эмбеддинги не требуют такой передачи.",
          "Подключённый агент или MCP-приложение может получать фрагменты документов и метаданные, возвращаемые вызываемыми командами. Дальнейшая обработка определяется его провайдером и настройками. Проверьте их, прежде чем дать агенту доступ к чувствительным источникам.",
        ],
      },
      {
        id: "bug-reports",
        title: "Отчёты об ошибках из WireCat Desktop",
        paragraphs: [
          "Когда вы отправляете отчёт об ошибке из WireCat Desktop, приложение отправляет ваш собственный текст (кратко, подробности и что вы ожидали), версии приложения, системы и установленных инструментов, а также последние логи ошибок. Логи — это 20 последних записей упавших запусков каждого установленного инструмента и, если отчёт отправлен после неудачной установки, лог установки.",
          "Приложение скрывает данные в логах на вашем компьютере до отправки: адреса почты, номера телефонов, токены, текст сообщений и путь к домашней папке удаляются или заменяются. Сервер WireCat скрывает их ещё раз перед сохранением. В логах всё же могут остаться личные данные, которые вы сами ввели в команду, например поисковый запрос.",
          "Логи хранятся закрыто на сервере WireCat 90 дней, затем удаляются. Они никогда не публикуются. Публичное обращение на GitHub по вашему отчёту содержит только ваш текст, версии приложения, системы и инструментов и идентификатор отчёта. Чтобы посмотреть или удалить отчёт, напишите на hello@wirecat.dev и укажите идентификатор отчёта.",
        ],
      },
      {
        id: "disconnect-delete",
        title: "Отключение и удаление данных",
        paragraphs: [
          "Команда session end для каждого явно названного профиля удаляет локальные учётные данные входа. Чтобы отозвать разрешение Google, удалите WireCat из сторонних подключений в аккаунте Google. Отзыв прекращает дальнейший разрешённый доступ, но не удаляет уже сохранённые на компьютере копии.",
          "Чтобы стереть локальные данные, закройте CLI и удалите его каталоги настроек и данных, а также явно выбранное общее хранилище, экспорт и резервные копии, которые хотите удалить. Общее хранилище может содержать данные других инструментов; удаляйте его только если хотите удалить и их. WireCat не может удалённо стереть файлы на вашем компьютере.",
          "Для вопросов о конфиденциальности и запросов о данных сайта или поддержки пишите на hello@wirecat.dev. Местное право может предоставлять права на доступ, исправление, удаление, ограничение обработки, переносимость и возражение. Можно отозвать согласие на сайте и обратиться в орган по защите данных.",
        ],
      },
      {
        id: "policy-updates",
        title: "Изменения политики",
        paragraphs: [
          "При изменении обработки данных мы обновляем эту страницу и дату выше. Ознакомьтесь с политикой перед включением новой интеграции или дополнительного разрешения. Более широкое использование данных Google требует раскрытия информации и применимого согласия до начала такого использования.",
        ],
      },
      {
        id: "provider",
        title: "Кто обрабатывает данные",
        paragraphs: [
          "WireCat — независимый проект с открытым исходным кодом, который поддерживает его автор. Эта политика охватывает wirecat.dev, приложение WireCat Drive и отчёты об ошибках, отправленные из WireCat Desktop. Для аналитики сайта мы используем PostHog Cloud EU; данные хранятся во Франкфурте, Германия. PostHog обрабатывает их по нашему поручению.",
          "Страницы отдаёт Cloudflare; он обрабатывает ваш IP-адрес, чтобы доставить страницы и защитить сайт.",
        ],
      },
      {
        id: "without-consent",
        title: "Если вы отказались или не ответили",
        paragraphs: [
          "Мы считаем просмотры страниц и два действия: копирование команды установки и открытие руководства по настройке. Для этих действий записываются только инструмент, язык сайта и часть страницы, но не скопированный текст. В каждой записи также есть адрес страницы, предыдущая страница и общие сведения о браузере и устройстве.",
          "В браузере ничего не сохраняется, кроме вашего ответа, если вы его дали: ни cookie, ни идентификаторов. Чтобы считать уникальных посетителей, серверы PostHog объединяют ваш IP-адрес и сведения о браузере со случайным значением, которое меняется каждый день и затем удаляется, и сохраняют только результат. Такой подсчёт не связывает ваши визиты в разные дни.",
        ],
      },
      {
        id: "with-consent",
        title: "Если вы согласились",
        paragraphs: [
          "PostHog сохраняет случайный идентификатор в cookie и в локальном хранилище браузера для этого сайта, чтобы повторный визит считался тем же посетителем.",
          "Мы также записываем сессии: расположение элементов, прокрутку, клики и движения мыши. Весь текст страницы и всё, что вводится в поля, скрывается в браузере до отправки. Записи показывают, какими страницами неудобно пользоваться.",
        ],
      },
      {
        id: "ip-address",
        title: "IP-адрес",
        paragraphs: [
          "Ваш IP-адрес приходит в PostHog с каждым запросом. PostHog не сохраняет его вместе с событиями, и мы не определяем по нему ваше местоположение.",
        ],
      },
      {
        id: "legal-basis",
        title: "Правовое основание",
        paragraphs: [
          "Подсчёт посещений без cookie основан на нашем законном интересе понимать, как используется сайт (статья 6(1)(f) GDPR); вы можете возразить, написав нам. Идентификатор и записи сессий основаны на вашем согласии (статья 6(1)(a)), которое можно отозвать в любой момент.",
        ],
      },
      {
        id: "retention",
        title: "Сколько хранятся данные",
        paragraphs: ["Записи сессий удаляются через 30 дней. События аналитики хранятся не дольше 12 месяцев."],
      },
      {
        id: "your-choice",
        title: "Как изменить выбор",
        paragraphs: [
          "Ваш ответ сохраняется в локальном хранилище браузера, чтобы не спрашивать на каждой странице. В этой записи хранится только ответ.",
          "Чтобы изменить его, нажмите «Настройки cookie» внизу любой страницы. Если вы отзовёте согласие, запись сессий остановится, а идентификатор больше не будет использоваться. Чтобы удалить и сам ответ, очистите данные этого сайта в браузере.",
          "Вы можете запросить доступ к данным о вас или их удаление, а также пожаловаться в орган по защите данных.",
        ],
      },
    ],
  },
  es: {
    title: "Política de privacidad",
    intro:
      "Cómo WireCat trata los datos de Google, los documentos locales, el procesamiento opcional con IA, los informes de errores desde WireCat Desktop y las visitas a wirecat.dev. Conoce qué se comparte y cómo desconectar o borrar tu copia local.",
    updated: "Última actualización: 25 de octubre de 2026",
    contact: "Preguntas y solicitudes sobre tus datos:",
    sections: [
      {
        id: "google-access",
        title: "Acceso a la cuenta de Google",
        paragraphs: [
          "WireCat Drive se conecta a Google solo después de elegir una cuenta y aprobar el acceso en la pantalla de consentimiento de Google. El permiso predeterminado lee archivos de Drive: cubre el Drive de la cuenta, mientras que las carpetas seleccionadas limitan la importación del CLI. La indexación local admite Google Docs y archivos Markdown o texto plano subidos.",
          "La aplicación accede a identificadores de archivos y carpetas, nombres, tipos, relaciones de carpetas, enlaces, fechas y contenido para las operaciones que solicitas. También puede leer nombres de propietarios y del último editor, correos o identificadores de Google, permisos, comentarios y revisiones. El historial de actividad y los metadatos de aplicaciones instaladas requieren permisos opcionales al conectar. Crear, editar y gestionar archivos en Google requiere un permiso de escritura separado y un comando explícito.",
          "Usamos este acceso para importar y actualizar documentos, exportar Markdown, buscar en tu copia local, mostrar enlaces e historial y añadir etiquetas, notas, personas y recuerdos con fuentes. Conectar una cuenta no importa todo su Drive.",
        ],
      },
      {
        id: "local-storage",
        title: "Almacenamiento local y seguridad",
        paragraphs: [
          "El CLI se comunica con las API de Google directamente desde tu ordenador. No envía tokens de Google ni documentos importados a un servidor de WireCat. La analítica del sitio es independiente del CLI y no recibe tus documentos de Google.",
          "Los tokens OAuth se guardan en el almacén de credenciales del sistema operativo. Si eliges explícitamente guardarlos en un archivo, se escriben en un archivo local privado. El CLI guarda localmente perfiles, copias de documentos, texto para búsqueda, metadatos, etiquetas, notas y recuerdos. Los embeddings opcionales se calculan localmente con un modelo descargado.",
          "Las copias locales permanecen hasta que las elimines. Quitar una carpeta de la importación y sincronizar elimina sus fuentes del índice y sus copias gestionadas; las notas y los recuerdos pueden conservar contexto. Desconectar la cuenta o desinstalar el paquete no borra el almacén local, las exportaciones ni las copias de seguridad. Protege tu ordenador y las copias que crees.",
        ],
      },
      {
        id: "sharing-ai",
        title: "Datos compartidos y procesamiento opcional con IA",
        paragraphs: [
          "WireCat no vende datos de usuarios de Google, no los usa para publicidad ni para entrenar modelos de IA de propósito general. El uso y la transferencia por WireCat Drive de la información recibida de las API de Google cumplen la Política de datos de usuario de los servicios de API de Google (Google API Services User Data Policy), incluidos los requisitos de uso limitado (Limited Use). Los responsables del proyecto no reciben ni inspeccionan habitualmente tus documentos o tokens. Si contactas con soporte, comparte solo lo que decidas revelar; no incluyas tokens ni documentos privados salvo que sean necesarios para tu petición.",
          "Cuando solicitas explícitamente extraer recuerdos con IA, el texto local seleccionado se envía al proveedor de IA que configuraste, con tus credenciales del proveedor. Este recibe el texto y la petición; se aplican sus reglas de procesamiento, conservación y uso de datos. Elige un proveedor y ajustes que no utilicen datos de Google para entrenar modelos de propósito general. La búsqueda por palabras y los embeddings locales no requieren esta transferencia.",
          "Un agente o una aplicación MCP conectados pueden recibir los fragmentos y metadatos devueltos por los comandos que ejecutan. Su proveedor y ajustes controlan el procesamiento posterior. Revísalos antes de dar al agente acceso a fuentes sensibles.",
        ],
      },
      {
        id: "bug-reports",
        title: "Informes de errores desde WireCat Desktop",
        paragraphs: [
          "Cuando envías un informe de error desde WireCat Desktop, la aplicación envía tu propio texto (resumen, detalles y lo que esperabas), las versiones de la aplicación, de tu sistema y de las herramientas instaladas, y los logs de errores recientes. Los logs son los últimos 20 registros de ejecuciones fallidas de cada herramienta instalada y, si el informe viene de una instalación fallida, el log de instalación.",
          "La aplicación oculta los datos de los logs en tu ordenador antes de enviarlos: las direcciones de correo, los números de teléfono, los tokens, el texto de los mensajes y la ruta de tu carpeta personal se eliminan o se sustituyen. El servidor de WireCat los oculta de nuevo antes de guardarlos. Los logs aún pueden contener datos personales que tú mismo escribiste en un comando, como una búsqueda.",
          "Los logs se guardan de forma privada en el servidor de WireCat durante 90 días y después se eliminan. Nunca se publican. La incidencia pública de GitHub de tu informe contiene solo tu propio texto, las versiones de la aplicación, del sistema y de las herramientas y un identificador de informe. Para ver o eliminar un informe, escribe a hello@wirecat.dev con su identificador.",
        ],
      },
      {
        id: "disconnect-delete",
        title: "Desconectar y eliminar datos",
        paragraphs: [
          "Usa el comando session end para cada perfil nombrado para eliminar sus credenciales locales. Para revocar el permiso de Google, elimina WireCat de las conexiones de terceros de tu cuenta de Google. La revocación detiene el acceso autorizado futuro, pero no borra las copias ya guardadas en tu ordenador.",
          "Para borrar datos locales, cierra el CLI y elimina sus directorios de configuración y datos, incluidos el almacén compartido que hayas configurado, las exportaciones y las copias de seguridad que quieras borrar. Un almacén compartido puede contener datos de otras herramientas; bórralo solo si también quieres eliminar esos datos. WireCat no puede borrar remotamente los archivos de tu ordenador.",
          "Escribe a hello@wirecat.dev para preguntas de privacidad o solicitudes sobre datos del sitio o de soporte. Según la ley aplicable, puedes tener derechos de acceso, rectificación, supresión, limitación, portabilidad y oposición. Puedes retirar el consentimiento del sitio y reclamar ante la autoridad de protección de datos correspondiente.",
        ],
      },
      {
        id: "policy-updates",
        title: "Cambios de la política",
        paragraphs: [
          "Actualizamos esta página cuando cambian las prácticas de datos y mostramos la fecha arriba. Revisa la política antes de activar una integración o un permiso opcional nuevos. Un uso más amplio de datos de Google requiere información y el consentimiento aplicable antes de empezar.",
        ],
      },
      {
        id: "provider",
        title: "Quién trata los datos",
        paragraphs: [
          "WireCat es un proyecto independiente de código abierto mantenido por su autor. Esta política cubre wirecat.dev, la aplicación WireCat Drive y los informes de errores enviados desde WireCat Desktop. Para la analítica del sitio usamos PostHog Cloud EU, alojado en Fráncfort (Alemania). PostHog trata los datos por encargo nuestro.",
          "Cloudflare sirve las páginas y trata tu dirección IP para entregarlas y proteger el sitio.",
        ],
      },
      {
        id: "without-consent",
        title: "Si rechazas o no respondes",
        paragraphs: [
          "Contamos las páginas vistas y dos acciones: copiar un comando de instalación y abrir una guía de configuración. De estas acciones registramos solo la herramienta, el idioma del sitio y la parte de la página, nunca el texto copiado. Cada registro incluye también la dirección de la página, la página anterior y datos generales del navegador y del dispositivo.",
          "No se guarda nada en tu navegador salvo tu respuesta, si la diste: ni cookies ni identificadores. Para contar visitantes únicos, los servidores de PostHog combinan tu dirección IP y los datos del navegador con un valor aleatorio que cambia cada día y después se elimina, y guardan solo el resultado. Este recuento no puede seguirte de un día a otro.",
        ],
      },
      {
        id: "with-consent",
        title: "Si aceptas",
        paragraphs: [
          "PostHog guarda un identificador aleatorio en una cookie y en el almacenamiento local de tu navegador para este sitio, de modo que una nueva visita cuenta como el mismo visitante.",
          "También grabamos sesiones: la disposición de la página, el desplazamiento, los clics y el movimiento del ratón. Todo el texto de la página y todo lo que se escribe en los campos se oculta en tu navegador antes de enviarse. Las grabaciones nos muestran qué páginas son difíciles de usar.",
        ],
      },
      {
        id: "ip-address",
        title: "Dirección IP",
        paragraphs: [
          "Tu dirección IP llega a PostHog con cada solicitud. PostHog no la guarda con los eventos y no la usamos para conocer tu ubicación.",
        ],
      },
      {
        id: "legal-basis",
        title: "Base jurídica",
        paragraphs: [
          "Contar visitas sin cookies se basa en nuestro interés legítimo en saber cómo se usa el sitio (artículo 6.1.f del RGPD); puedes oponerte escribiéndonos. El identificador y las grabaciones de sesiones se basan en tu consentimiento (artículo 6.1.a), que puedes retirar en cualquier momento.",
        ],
      },
      {
        id: "retention",
        title: "Cuánto tiempo guardamos los datos",
        paragraphs: [
          "Las grabaciones de sesiones se eliminan a los 30 días. Los eventos de analítica se guardan un máximo de 12 meses.",
        ],
      },
      {
        id: "your-choice",
        title: "Cambiar tu elección",
        paragraphs: [
          "Tu respuesta se guarda en el almacenamiento local del navegador para no preguntarte en cada página. Este registro contiene solo la respuesta.",
          "Para cambiarla, selecciona «Configuración de cookies» al pie de cualquier página. Si retiras el consentimiento, la grabación se detiene y el identificador deja de usarse. Para borrar también el registro, elimina los datos de este sitio en tu navegador.",
          "Puedes pedirnos ver o eliminar los datos sobre ti y presentar una reclamación ante tu autoridad de protección de datos.",
        ],
      },
    ],
  },
}

const googleDisclosures = {
  en: {
    title: "Google API Limited Use",
    text: "WireCat’s use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including its Limited Use requirements.",
    policy: "Google API Services User Data Policy",
    revoke: "Manage your Google Account connections",
    terms: "Terms of Service",
  },
  ru: {
    title: "Ограниченное использование данных Google API",
    text: "Использование и передача WireCat информации, полученной через API Google, соответствуют политике Google API Services User Data Policy, включая требования Limited Use.",
    policy: "Google API Services User Data Policy",
    revoke: "Управление подключениями в аккаунте Google",
    terms: "Условия использования",
  },
  es: {
    title: "Uso limitado de las API de Google",
    text: "El uso y la transferencia por WireCat de información recibida de las API de Google cumplen la Google API Services User Data Policy, incluidos sus requisitos de uso limitado.",
    policy: "Google API Services User Data Policy",
    revoke: "Gestionar las conexiones de tu cuenta de Google",
    terms: "Términos de servicio",
  },
} as const

export const googleDisclosureFor = (lang: string) =>
  googleDisclosures[lang as keyof typeof googleDisclosures] ?? googleDisclosures.en
