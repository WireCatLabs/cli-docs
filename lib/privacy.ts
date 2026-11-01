type PrivacySection = { id: string; title: string; paragraphs: string[] }

export const privacyCopy: Record<
  "en" | "ru" | "es",
  { title: string; intro: string; updated: string; contact: string; sections: PrivacySection[] }
> = {
  en: {
    title: "Privacy Policy",
    intro:
      "How WireCat handles Google and Zoom account data, local documents, optional AI processing, WireCat Desktop's update and news checks and bug reports, and visits to wirecat.dev. Learn what is shared and how to disconnect or delete your local copy.",
    updated: "Last updated: 1 November 2026",
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
        id: "zoom-access",
        title: "Zoom account access (zm)",
        paragraphs: [
          "zm connects to Zoom only after you start its login and approve the WireCat CLI app on Zoom’s consent screen. It signs in with a one-time key created on your computer for each login (OAuth with PKCE) and holds no app secret.",
          "With the permissions you approve, zm reads your hosted meetings and their past occurrences, participant names, email addresses and join and leave times, meeting transcripts, Zoom AI summaries, cloud recording file details and meeting chat, your Zoom user profile, and your company and external contacts with their names, email addresses and phone numbers. Downloading recordings, reading invitations and creating, changing or cancelling meetings each need their own permission and an explicit command.",
          "With the search permission you approve, zm sends the words you search for to Zoom’s own hosted search, which answers from what your Zoom account can already see: meetings, calendar events, Team Chat messages and channels, Canvas docs, notes and, where your account has Zoom Phone, calls, text messages and voicemail. zm shows the results when you ask and does not add them to its local archive. zm does not use Zoom’s AI-written answers.",
          "We use this access to keep a searchable local archive of your meetings, show who said what and when, help you prepare for upcoming meetings and run the meeting commands you ask for. zm calls Zoom’s API directly from your computer. Zoom tokens, meetings and transcripts are never sent to a WireCat server.",
          "The login returns through wirecat.dev/zoom-callback. That page is static: a script in your browser passes the one-time code to zm on your computer and removes it from the address bar. The code works only once and only with the key that stays on your computer. wirecat.dev does not store it; Cloudflare, which serves the page, receives the request like any other page view.",
          "To disconnect, remove the WireCat CLI app in the Zoom App Marketplace under Manage → Added Apps. This stops all further access. WireCat holds no Zoom data on its servers, so there is nothing for us to delete; meetings already copied to your computer stay there until you delete zm’s local store.",
        ],
      },
      {
        id: "calendar-access",
        title: "Google Calendar access (gcal)",
        paragraphs: [
          "gcal connects to Google Calendar only after you start its sign-in and approve access on Google’s consent screen. It signs in through WireCat’s Google app, or through your own Google app if you give it one. The default permission reads your calendars and your Google account’s email address. Creating, changing and deleting events and answering invitations need the separate write permission. Seeing and changing who can see a calendar you own needs the separate sharing permission. A change runs only when you, or an agent you connected, give the command for it.",
          "With these permissions gcal reads your list of calendars and, for each event, its title, time, description, location, recurrence, video call link, organizer, and the attendees’ names, email addresses and answers. It reads busy times for the calendars and people you ask about. With the sharing permission it reads and changes the sharing rules of your calendars.",
          "We use this access to keep a searchable copy of your events on your computer, answer questions about free and busy time, and make the event and sharing changes you ask for. When you choose Google’s own search, gcal sends your search words to Google Calendar and stores none of the results.",
          "gcal calls Google’s API directly from your computer. Your Google sign-in stays in your system’s keyring, or in a private file if you choose one, and your events stay in gcal’s local database. Nothing goes to a WireCat server. An agent you connect to gcal receives the events and details its commands return; its provider and settings decide what happens to them next.",
          "gcal’s session end command deletes a profile’s sign-in from your computer; the copied events stay until you delete gcal’s local data. To stop all access, remove WireCat from your Google Account’s third-party connections.",
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
          "WireCat does not sell Google user data, use it for advertising or use it to train general-purpose AI models. The use and transfer by WireCat Drive and gcal of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements. Project maintainers do not receive or routinely inspect your documents or tokens. If you contact support, share only what you choose to disclose; never include tokens or private documents unless needed for your request.",
          "When you explicitly request AI memory extraction, selected cached document text is sent to the AI provider you configured, using your provider credentials. That provider receives the text and extraction request; its processing, retention and data-use settings apply. Choose a provider and settings that do not use Google data to train general-purpose models. Local keyword search and local embeddings do not require this transfer.",
          "An agent or MCP application you connect can receive the document passages and metadata returned by the commands it calls. Its provider and settings control any further processing. Review those settings before giving an agent access to sensitive sources.",
        ],
      },
      {
        id: "desktop-app",
        title: "WireCat Desktop: what stays on your computer",
        paragraphs: [
          "WireCat Desktop runs WireCat's tools on your computer. Your messages, mail, documents, notes, memories, tasks, settings and the tools' logs stay there, and sign-in keys stay in your system's keyring or in the tool's own folder on your computer. WireCat has no account for you and keeps no copy of this data on a server. The app has no analytics and no tracking: its window can talk only to the app itself, and its fonts are part of the app.",
          "The app sends something to WireCat's server in two cases only. It checks for WireCat news when it starts and then once an hour: the request carries only the app version and your operating system, the same for every copy of that version, and the answer holds every notification in every language. Which notifications you read or removed stays on your computer. Nothing records who asked: neither WireCat's server nor the web server in front of it logs the IP address or country for this check. The second case is a bug report, only when you send one (next section).",
          "To find app updates, the app downloads a small release file from WireCat Desktop's releases on GitHub when it starts and then every six hours, and downloads an update from GitHub when you install one. The request carries no version, id or other detail about you. GitHub receives your IP address as for any download, under GitHub's own privacy statement.",
          "When you open the Tools page, the app asks the npm registry, through your own npm, for the newest version of each WireCat tool; the answer is reused for an hour. npm sends what it sends for any such request, and nothing from WireCat is added. Other services are contacted only when you use a feature that needs them: the npm registry to install or update a tool, nodejs.org when Node.js is missing or too old, to offer and install it, Tailscale or Cloudflare and their downloads when you set up a public address for an AI app, and public DNS services (Google, Cloudflare, NextDNS) to check that address. Each applies its own privacy policy.",
          "The tools keep a record of their own runs on your computer, by default successful runs for 7 days and failed runs for 30. The app shows them on its Logs page. They leave your computer only inside a bug report you send.",
        ],
      },
      {
        id: "bug-reports",
        title: "Bug reports from WireCat Desktop",
        paragraphs: [
          "When you send a bug report from WireCat Desktop, the app sends your own text (summary, details and what you expected), the versions of the app, your system and the installed tools, and recent error logs. The logs are each installed tool's last 20 failed run records and, if the report came from a failed install, the install log. A run record holds the command and its words, with every value that may be content or a secret written as [redacted]; whether a profile was used, with its name hidden; the versions of the tool, Node.js and your system; timings and counts; the coding agent that ran the command, with its session id masked; and, for a failed run, the error's class, code, masked message and the program locations where it happened. A report started from an error message in the app also carries the app's last 10 errors (their messages and the program locations where they happened).",
          "The app masks the logs on your computer before it sends them: email addresses, phone numbers, tokens, message text and your home folder path are removed or replaced. WireCat's server masks them again before it stores them. Logs can still contain personal details that you typed into a command yourself, such as a search query.",
          "The logs are stored privately on WireCat's server for 90 days and then deleted; the nightly backups of the server's database, which contain them, are deleted after 14 more days. They are never published. The report is stored with the app's version and your operating system, not with your IP address. As for every request, the IP address and country of the request that sent it are written to the server's request log and the web server's access log, which are deleted as those logs rotate. The public GitHub issue for your report holds only your own text, the app, system and tool versions and a report id. To see or delete a report, write to hello@wirecat.dev with its report id.",
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
          "WireCat is an independent, personally maintained open-source project. This policy covers wirecat.dev, the WireCat Drive application, gcal, the WireCat CLI for Google Calendar, zm, the WireCat CLI app for Zoom, and WireCat Desktop. For website analytics we use PostHog Cloud EU, hosted in Frankfurt, Germany. PostHog processes the data on our behalf.",
          "Cloudflare serves the pages and WireCat's server (api.wirecat.dev) and processes your IP address to deliver them and protect them.",
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
      "Как WireCat обрабатывает данные аккаунтов Google и Zoom, локальные документы, дополнительные ИИ-запросы, проверку обновлений и новостей и отчёты об ошибках в WireCat Desktop и посещения wirecat.dev. Узнайте, что передаётся и как отключить доступ или удалить локальную копию.",
    updated: "Обновлено: 1 ноября 2026 г.",
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
        id: "zoom-access",
        title: "Доступ к аккаунту Zoom (zm)",
        paragraphs: [
          "zm подключается к Zoom только после того, как вы запустите вход и одобрите приложение WireCat CLI на экране согласия Zoom. Для каждого входа он создаёт на вашем компьютере одноразовый ключ (OAuth с PKCE) и не хранит секрет приложения.",
          "С одобренными разрешениями zm читает встречи, которые вы проводили, и их прошедшие повторы, имена участников, адреса электронной почты и время входа и выхода, расшифровки встреч, сводки Zoom AI, сведения о файлах облачных записей и чат встречи, ваш профиль Zoom, а также ваши контакты из компании и внешние контакты с именами, адресами электронной почты и номерами телефонов. Скачивание записей, чтение приглашений и создание, изменение или отмена встреч требуют отдельного разрешения и явной команды.",
          "С одобренным разрешением на поиск zm передаёт слова, которые вы ищете, в собственный поиск Zoom, а тот отвечает из того, что уже видит ваш аккаунт Zoom: встречи, события календаря, сообщения и каналы Team Chat, документы Canvas, заметки и, если в аккаунте есть Zoom Phone, звонки, текстовые сообщения и голосовую почту. zm показывает результаты по вашему запросу и не добавляет их в локальный архив. Ответы, написанные ИИ Zoom, zm не использует.",
          "Доступ используется, чтобы вести локальный архив встреч с поиском, показывать, кто что и когда сказал, помогать готовиться к предстоящим встречам и выполнять команды, которые вы запускаете. zm обращается к API Zoom прямо с вашего компьютера. Токены Zoom, встречи и расшифровки никогда не отправляются на сервер WireCat.",
          "Вход возвращается через wirecat.dev/zoom-callback. Это статическая страница: скрипт в вашем браузере передаёт одноразовый код zm на вашем компьютере и убирает его из адресной строки. Код срабатывает один раз и только вместе с ключом, который остаётся на вашем компьютере. wirecat.dev его не сохраняет; Cloudflare, который отдаёт страницу, получает запрос как любой другой просмотр страницы.",
          "Чтобы отключиться, удалите приложение WireCat CLI в Zoom App Marketplace в разделе Manage → Added Apps. Это прекращает любой дальнейший доступ. WireCat не хранит данные Zoom на своих серверах, поэтому удалять с нашей стороны нечего; встречи, уже скопированные на ваш компьютер, остаются там, пока вы не удалите локальное хранилище zm.",
        ],
      },
      {
        id: "calendar-access",
        title: "Доступ к Google Календарю (gcal)",
        paragraphs: [
          "gcal подключается к Google Календарю только после того, как вы запустите вход и разрешите доступ на экране согласия Google. Вход идёт через Google-приложение WireCat или через ваше собственное, если вы его укажете. Разрешение по умолчанию даёт чтение ваших календарей и адреса электронной почты аккаунта Google. Чтобы создавать, менять и удалять события и отвечать на приглашения, нужно отдельное разрешение на запись. Чтобы видеть и менять, кто видит ваш календарь, нужно отдельное разрешение на совместный доступ. Изменение выполняется, только когда команду даёте вы или подключённый вами агент.",
          "С этими разрешениями gcal читает список ваших календарей и для каждого события — название, время, описание, место, повторение, ссылку на видеозвонок, организатора, а также имена, адреса электронной почты и ответы участников. Он читает занятое время календарей и людей, о которых вы спрашиваете. С разрешением на совместный доступ он читает и меняет правила доступа к вашим календарям.",
          "Мы используем этот доступ, чтобы хранить на вашем компьютере копию событий с поиском, отвечать на вопросы о свободном и занятом времени и вносить изменения в события и доступ, о которых вы просите. Когда вы выбираете поиск самого Google, gcal отправляет слова запроса в Google Календарь и не сохраняет результаты.",
          "gcal обращается к API Google напрямую с вашего компьютера. Вход в Google хранится в системной связке ключей или, если вы так выберете, в закрытом файле, а события — в локальной базе gcal. Ничего не отправляется на сервер WireCat. Агент, которого вы подключили к gcal, получает события и сведения, которые возвращают его команды; что с ними происходит дальше, решают его провайдер и настройки.",
          "Команда gcal session end удаляет вход профиля с вашего компьютера; скопированные события остаются, пока вы не удалите локальные данные gcal. Чтобы полностью закрыть доступ, удалите WireCat из сторонних подключений в аккаунте Google.",
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
          "WireCat не продаёт данные пользователей Google, не использует их для рекламы или обучения универсальных ИИ-моделей. Использование и передача WireCat Drive и gcal сведений, полученных через API Google, соответствуют Правилам в отношении пользовательских данных в сервисах Google API (Google API Services User Data Policy), включая требования об ограниченном использовании (Limited Use). Сопровождающие проекта не получают и не просматривают ваши документы или токены в обычной работе. При обращении в поддержку передавайте только выбранные вами сведения; не включайте токены или приватные документы без необходимости для запроса.",
          "При явном запросе извлечения записей памяти с помощью ИИ выбранный текст из локальных документов отправляется настроенному вами провайдеру ИИ с вашими учётными данными провайдера. Он получает текст и запрос; действуют его правила обработки, хранения и использования данных. Выбирайте провайдера и настройки, которые не используют данные Google для обучения универсальных моделей. Поиск по словам и локальные эмбеддинги не требуют такой передачи.",
          "Подключённый агент или MCP-приложение может получать фрагменты документов и метаданные, возвращаемые вызываемыми командами. Дальнейшая обработка определяется его провайдером и настройками. Проверьте их, прежде чем дать агенту доступ к чувствительным источникам.",
        ],
      },
      {
        id: "desktop-app",
        title: "WireCat Desktop: что остаётся на вашем компьютере",
        paragraphs: [
          "WireCat Desktop запускает инструменты WireCat на вашем компьютере. Сообщения, почта, документы, заметки, записи памяти, задачи, настройки и логи инструментов остаются на нём, а ключи входа хранятся в системном хранилище ключей или в папке инструмента на вашем компьютере. У WireCat нет вашего аккаунта, и на сервере нет копии этих данных. В приложении нет аналитики и слежки: его окно может связываться только с самим приложением, а шрифты встроены в приложение.",
          "Приложение отправляет что-то на сервер WireCat только в двух случаях. Оно проверяет новости WireCat при запуске и затем раз в час: запрос содержит только версию приложения и вашу операционную систему, одинаковые для всех копий этой версии, а ответ содержит все уведомления на всех языках. Какие уведомления вы прочитали или убрали, остаётся на вашем компьютере. Никто не записывает, кто спрашивал: ни сервер WireCat, ни веб-сервер перед ним не пишут в лог IP-адрес и страну для этой проверки. Второй случай — отчёт об ошибке, только когда вы его отправляете (следующий раздел).",
          "Чтобы найти обновления, приложение скачивает небольшой файл выпуска из выпусков WireCat Desktop на GitHub при запуске и затем раз в шесть часов, а само обновление скачивает с GitHub, когда вы его устанавливаете. Запрос не содержит версии, идентификатора или других сведений о вас. GitHub получает ваш IP-адрес, как при любом скачивании, по своей политике конфиденциальности.",
          "Когда вы открываете страницу инструментов, приложение через ваш npm спрашивает у реестра npm последнюю версию каждого инструмента WireCat; ответ используется повторно в течение часа. npm отправляет то же, что и при любом таком запросе, и WireCat ничего не добавляет. К другим сервисам приложение обращается, только когда вы пользуетесь функцией, которой они нужны: к реестру npm — чтобы установить или обновить инструмент, к nodejs.org — когда Node.js нет или он устарел, чтобы предложить и установить его, к Tailscale или Cloudflare и их загрузкам — когда вы настраиваете публичный адрес для ИИ-приложения, и к публичным DNS-сервисам (Google, Cloudflare, NextDNS) — чтобы проверить этот адрес. У каждого из них своя политика конфиденциальности.",
          "Инструменты ведут записи своих запусков на вашем компьютере: по умолчанию успешные хранятся 7 дней, упавшие — 30. Приложение показывает их на странице «Логи». Они покидают компьютер только в отчёте об ошибке, который вы отправляете.",
        ],
      },
      {
        id: "bug-reports",
        title: "Отчёты об ошибках из WireCat Desktop",
        paragraphs: [
          "Когда вы отправляете отчёт об ошибке из WireCat Desktop, приложение отправляет ваш собственный текст (кратко, подробности и что вы ожидали), версии приложения, системы и установленных инструментов, а также последние логи ошибок. Логи — это 20 последних записей упавших запусков каждого установленного инструмента и, если отчёт отправлен после неудачной установки, лог установки. Запись запуска хранит команду и её слова, где каждое значение, которое может быть содержимым или секретом, заменено на [redacted]; был ли использован профиль (его имя скрыто); версии инструмента, Node.js и системы; время и счётчики; агента, запустившего команду (номер его сессии скрыт); а для упавшего запуска — класс, код и замаскированный текст ошибки и места в программе, где она произошла. Отчёт, начатый с сообщения об ошибке в приложении, также содержит 10 последних ошибок приложения (их тексты и места в программе, где они произошли).",
          "Приложение скрывает данные в логах на вашем компьютере до отправки: адреса почты, номера телефонов, токены, текст сообщений и путь к домашней папке удаляются или заменяются. Сервер WireCat скрывает их ещё раз перед сохранением. В логах всё же могут остаться личные данные, которые вы сами ввели в команду, например поисковый запрос.",
          "Логи хранятся закрыто на сервере WireCat 90 дней, затем удаляются; ночные резервные копии базы данных сервера, где они тоже есть, удаляются ещё через 14 дней. Они никогда не публикуются. Отчёт хранится с версией приложения и вашей операционной системой, но без вашего IP-адреса. Как и для любого запроса, IP-адрес и страна запроса, отправившего отчёт, записываются в лог запросов сервера и журнал доступа веб-сервера и удаляются по мере их ротации. Публичное обращение на GitHub по вашему отчёту содержит только ваш текст, версии приложения, системы и инструментов и идентификатор отчёта. Чтобы посмотреть или удалить отчёт, напишите на hello@wirecat.dev и укажите идентификатор отчёта.",
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
          "WireCat — независимый проект с открытым исходным кодом, который поддерживает его автор. Эта политика охватывает wirecat.dev, приложение WireCat Drive, gcal — WireCat CLI для Google Календаря, zm — приложение WireCat CLI для Zoom — и WireCat Desktop. Для аналитики сайта мы используем PostHog Cloud EU; данные хранятся во Франкфурте, Германия. PostHog обрабатывает их по нашему поручению.",
          "Страницы и сервер WireCat (api.wirecat.dev) обслуживает Cloudflare; он обрабатывает ваш IP-адрес, чтобы доставить ответы и защитить их.",
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
      "Cómo WireCat trata los datos de Google y Zoom, los documentos locales, el procesamiento opcional con IA, las comprobaciones de actualizaciones y novedades y los informes de errores de WireCat Desktop, y las visitas a wirecat.dev. Conoce qué se comparte y cómo desconectar o borrar tu copia local.",
    updated: "Última actualización: 1 de noviembre de 2026",
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
        id: "zoom-access",
        title: "Acceso a la cuenta de Zoom (zm)",
        paragraphs: [
          "zm se conecta a Zoom solo después de que inicies su inicio de sesión y apruebes la aplicación WireCat CLI en la pantalla de consentimiento de Zoom. En cada inicio de sesión crea en tu ordenador una clave de un solo uso (OAuth con PKCE) y no guarda ningún secreto de la aplicación.",
          "Con los permisos que apruebes, zm lee las reuniones que organizas y sus sesiones pasadas, los nombres de los participantes, sus direcciones de correo y sus horas de entrada y salida, las transcripciones, los resúmenes de Zoom AI, los datos de los archivos de grabaciones en la nube y el chat de la reunión, tu perfil de usuario de Zoom, y tus contactos de la empresa y externos con sus nombres, direcciones de correo y números de teléfono. Descargar grabaciones, leer invitaciones y crear, cambiar o cancelar reuniones requieren cada uno su propio permiso y un comando explícito.",
          "Con el permiso de búsqueda que apruebes, zm envía las palabras que buscas a la búsqueda alojada de Zoom, que responde a partir de lo que tu cuenta de Zoom ya puede ver: reuniones, eventos del calendario, mensajes y canales de Team Chat, documentos de Canvas, notas y, si tu cuenta tiene Zoom Phone, llamadas, mensajes de texto y buzón de voz. zm muestra los resultados cuando lo pides y no los añade a su archivo local. zm no usa las respuestas escritas por la IA de Zoom.",
          "Usamos este acceso para mantener un archivo local de tus reuniones con búsqueda, mostrar quién dijo qué y cuándo, ayudarte a preparar las próximas reuniones y ejecutar los comandos que pidas. zm llama a la API de Zoom directamente desde tu ordenador. Los tokens de Zoom, las reuniones y las transcripciones nunca se envían a un servidor de WireCat.",
          "El inicio de sesión vuelve a través de wirecat.dev/zoom-callback. Es una página estática: un script en tu navegador pasa el código de un solo uso a zm en tu ordenador y lo quita de la barra de direcciones. El código funciona una sola vez y solo junto con la clave que se queda en tu ordenador. wirecat.dev no lo guarda; Cloudflare, que sirve la página, recibe la petición como cualquier otra visita.",
          "Para desconectar, elimina la aplicación WireCat CLI en Zoom App Marketplace, en Manage → Added Apps. Esto detiene todo acceso posterior. WireCat no guarda datos de Zoom en sus servidores, así que no tenemos nada que borrar; las reuniones ya copiadas en tu ordenador se quedan allí hasta que borres el almacén local de zm.",
        ],
      },
      {
        id: "calendar-access",
        title: "Acceso a Google Calendar (gcal)",
        paragraphs: [
          "gcal se conecta a Google Calendar solo después de que inicies su acceso y apruebes el permiso en la pantalla de consentimiento de Google. Accede a través de la aplicación de Google de WireCat, o de tu propia aplicación de Google si se la indicas. El permiso predeterminado lee tus calendarios y la dirección de correo de tu cuenta de Google. Crear, cambiar y eliminar eventos y responder a invitaciones requiere el permiso de escritura, que es aparte. Ver y cambiar quién puede ver un calendario tuyo requiere el permiso de uso compartido, también aparte. Un cambio se hace solo cuando lo ordenas tú o un agente que conectaste.",
          "Con estos permisos, gcal lee tu lista de calendarios y, de cada evento, su título, hora, descripción, ubicación, repetición, enlace de videollamada, organizador y los nombres, direcciones de correo y respuestas de los asistentes. Lee las horas ocupadas de los calendarios y las personas por las que preguntas. Con el permiso de uso compartido, lee y cambia las reglas de acceso de tus calendarios.",
          "Usamos este acceso para guardar en tu ordenador una copia de tus eventos en la que puedes buscar, responder a preguntas sobre horas libres y ocupadas, y hacer los cambios en eventos y accesos que pidas. Cuando eliges la búsqueda propia de Google, gcal envía tus palabras de búsqueda a Google Calendar y no guarda ningún resultado.",
          "gcal llama a la API de Google directamente desde tu ordenador. Tu acceso a Google se guarda en el llavero del sistema, o en un archivo privado si lo eliges, y tus eventos en la base de datos local de gcal. Nada se envía a un servidor de WireCat. Un agente que conectes a gcal recibe los eventos y datos que devuelven sus comandos; su proveedor y su configuración deciden qué pasa después con ellos.",
          "El comando session end de gcal borra de tu ordenador el acceso de un perfil; los eventos copiados se quedan hasta que borres los datos locales de gcal. Para cortar todo acceso, quita WireCat de las conexiones de terceros de tu cuenta de Google.",
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
          "WireCat no vende datos de usuarios de Google, no los usa para publicidad ni para entrenar modelos de IA de propósito general. El uso y la transferencia por WireCat Drive y gcal de la información recibida de las API de Google cumplen la Política de datos de usuario de los servicios de API de Google (Google API Services User Data Policy), incluidos los requisitos de uso limitado (Limited Use). Los responsables del proyecto no reciben ni inspeccionan habitualmente tus documentos o tokens. Si contactas con soporte, comparte solo lo que decidas revelar; no incluyas tokens ni documentos privados salvo que sean necesarios para tu petición.",
          "Cuando solicitas explícitamente extraer recuerdos con IA, el texto local seleccionado se envía al proveedor de IA que configuraste, con tus credenciales del proveedor. Este recibe el texto y la petición; se aplican sus reglas de procesamiento, conservación y uso de datos. Elige un proveedor y ajustes que no utilicen datos de Google para entrenar modelos de propósito general. La búsqueda por palabras y los embeddings locales no requieren esta transferencia.",
          "Un agente o una aplicación MCP conectados pueden recibir los fragmentos y metadatos devueltos por los comandos que ejecutan. Su proveedor y ajustes controlan el procesamiento posterior. Revísalos antes de dar al agente acceso a fuentes sensibles.",
        ],
      },
      {
        id: "desktop-app",
        title: "WireCat Desktop: lo que se queda en tu ordenador",
        paragraphs: [
          "WireCat Desktop ejecuta las herramientas de WireCat en tu ordenador. Tus mensajes, correo, documentos, notas, memorias, tareas, ajustes y los logs de las herramientas se quedan ahí, y las claves de inicio de sesión se guardan en el llavero de tu sistema o en la carpeta de la herramienta en tu ordenador. WireCat no tiene una cuenta tuya ni guarda una copia de estos datos en un servidor. La aplicación no tiene analítica ni seguimiento: su ventana solo puede comunicarse con la propia aplicación, y sus fuentes vienen incluidas.",
          "La aplicación envía algo al servidor de WireCat solo en dos casos. Comprueba las novedades de WireCat al iniciarse y después una vez por hora: la petición lleva solo la versión de la aplicación y tu sistema operativo, iguales en todas las copias de esa versión, y la respuesta contiene todos los avisos en todos los idiomas. Qué avisos leíste o quitaste se queda en tu ordenador. Nada registra quién preguntó: ni el servidor de WireCat ni el servidor web que está delante anotan en su log la dirección IP ni el país para esta comprobación. El segundo caso es un informe de error, solo cuando envías uno (siguiente sección).",
          "Para buscar actualizaciones, la aplicación descarga un pequeño archivo de versión desde las publicaciones de WireCat Desktop en GitHub al iniciarse y después cada seis horas, y descarga la actualización desde GitHub cuando la instalas. La petición no lleva versión, identificador ni otros datos sobre ti. GitHub recibe tu dirección IP como en cualquier descarga, según su propia declaración de privacidad.",
          "Cuando abres la página de herramientas, la aplicación pregunta al registro de npm, a través de tu propio npm, por la versión más reciente de cada herramienta de WireCat; la respuesta se reutiliza durante una hora. npm envía lo mismo que en cualquier petición de este tipo, y WireCat no añade nada. La aplicación contacta con otros servicios solo cuando usas una función que los necesita: el registro de npm para instalar o actualizar una herramienta, nodejs.org cuando falta Node.js o es antiguo, para ofrecerlo e instalarlo, Tailscale o Cloudflare y sus descargas cuando configuras una dirección pública para una aplicación de IA, y servicios DNS públicos (Google, Cloudflare, NextDNS) para comprobar esa dirección. Cada uno aplica su propia política de privacidad.",
          "Las herramientas guardan un registro de sus propias ejecuciones en tu ordenador: por defecto, las correctas durante 7 días y las fallidas durante 30. La aplicación las muestra en su página de Logs. Solo salen de tu ordenador dentro de un informe de error que tú envías.",
        ],
      },
      {
        id: "bug-reports",
        title: "Informes de errores desde WireCat Desktop",
        paragraphs: [
          "Cuando envías un informe de error desde WireCat Desktop, la aplicación envía tu propio texto (resumen, detalles y lo que esperabas), las versiones de la aplicación, de tu sistema y de las herramientas instaladas, y los logs de errores recientes. Los logs son los últimos 20 registros de ejecuciones fallidas de cada herramienta instalada y, si el informe viene de una instalación fallida, el log de instalación. Un registro de ejecución guarda el comando y sus palabras, con cada valor que pueda ser contenido o un secreto escrito como [redacted]; si se usó un perfil, con su nombre oculto; las versiones de la herramienta, de Node.js y de tu sistema; tiempos y recuentos; el agente que ejecutó el comando, con el id de su sesión oculto; y, en una ejecución fallida, la clase, el código y el mensaje enmascarado del error y los lugares del programa donde ocurrió. Un informe iniciado desde un mensaje de error de la aplicación incluye también los últimos 10 errores de la aplicación (sus mensajes y el lugar del programa donde ocurrieron).",
          "La aplicación oculta los datos de los logs en tu ordenador antes de enviarlos: las direcciones de correo, los números de teléfono, los tokens, el texto de los mensajes y la ruta de tu carpeta personal se eliminan o se sustituyen. El servidor de WireCat los oculta de nuevo antes de guardarlos. Los logs aún pueden contener datos personales que tú mismo escribiste en un comando, como una búsqueda.",
          "Los logs se guardan de forma privada en el servidor de WireCat durante 90 días y después se eliminan; las copias de seguridad nocturnas de la base de datos del servidor, que también los contienen, se eliminan 14 días después. Nunca se publican. El informe se guarda con la versión de la aplicación y tu sistema operativo, no con tu dirección IP. Como en cualquier petición, la dirección IP y el país de la petición que lo envió se escriben en el log de peticiones del servidor y en el registro de accesos del servidor web, y se eliminan a medida que esos registros rotan. La incidencia pública de GitHub de tu informe contiene solo tu propio texto, las versiones de la aplicación, del sistema y de las herramientas y un identificador de informe. Para ver o eliminar un informe, escribe a hello@wirecat.dev con su identificador.",
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
          "WireCat es un proyecto independiente de código abierto mantenido por su autor. Esta política cubre wirecat.dev, la aplicación WireCat Drive, gcal, la CLI de WireCat para Google Calendar, zm, la aplicación WireCat CLI para Zoom, y WireCat Desktop. Para la analítica del sitio usamos PostHog Cloud EU, alojado en Fráncfort (Alemania). PostHog trata los datos por encargo nuestro.",
          "Cloudflare sirve las páginas y el servidor de WireCat (api.wirecat.dev) y trata tu dirección IP para entregarlos y protegerlos.",
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
