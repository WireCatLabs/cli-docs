type TermsSection = { id: string; title: string; paragraphs: string[] }

export const termsCopy: Record<
  "en" | "ru" | "es",
  { title: string; intro: string; updated: string; contact: string; sections: TermsSection[] }
> = {
  en: {
    title: "Terms of Service",
    intro:
      "The conditions for using the WireCat website and tools, connecting your accounts and reviewing actions taken with your data.",
    updated: "Last updated: 24 October 2026",
    contact: "Questions about these terms:",
    sections: [
      {
        id: "project",
        title: "The project",
        paragraphs: [
          "WireCat is an independent, personally maintained open-source project. These terms cover wirecat.dev and the WireCat tools, including WireCat Drive and zm, the WireCat CLI app for Zoom. WireCat is not affiliated with or endorsed by Google, Zoom or the other services its tools connect to.",
        ],
      },
      {
        id: "accounts",
        title: "Your accounts and permissions",
        paragraphs: [
          "Connect only accounts and data you are authorized to use. You remain responsible for following the connected service’s terms, your organization’s rules and applicable law. Do not use the tools to bypass access controls, obtain unauthorized data or harm others.",
          "Google access requires your browser consent. Selected folders control local ingestion; they do not narrow the account-wide OAuth permission. Zoom access requires your approval of the WireCat CLI app on Zoom’s consent screen. Remote writes require the relevant permission and an explicit command. Review commands, account profiles and agent permissions before allowing changes.",
        ],
      },
      {
        id: "your-data",
        title: "Your data and agents",
        paragraphs: [
          "You retain your rights to your documents and other content. Using WireCat does not grant the project ownership of that content. Local stores, exports, backups and credentials are your responsibility to protect and manage.",
          "If you enable an external AI provider or connect an agent, review what data it receives and its terms. AI-generated summaries and memories can be inaccurate: check their sources before relying on them. Approving an agent’s access does not replace your responsibility to review consequential actions.",
        ],
      },
      {
        id: "third-parties",
        title: "Third-party services",
        paragraphs: [
          "Google, AI providers, hosting services and other connected services operate under their own terms and privacy policies. Their availability, API limits, permissions and changes can affect the tools. WireCat does not promise uninterrupted access or complete source history.",
        ],
      },
      {
        id: "license",
        title: "Software license and limitations",
        paragraphs: [
          "Each repository’s software license governs copying, modification and redistribution; these website terms do not replace it. The tools are provided under those licenses, including their warranty and liability provisions. Keep backups and test important workflows on a small scope first.",
          "These terms do not exclude rights or liabilities that applicable law does not allow to be excluded. They do not promise the accuracy of imported content or AI output, uninterrupted operation or recovery of data after deletion.",
        ],
      },
      {
        id: "stopping",
        title: "Stopping use and changes",
        paragraphs: [
          "You can stop using the website or tools at any time. End each profile’s session and revoke the application in your Google Account, or remove the WireCat CLI app in the Zoom App Marketplace, if you want to disconnect; remove local data separately. See the Privacy Policy for the data-handling details.",
          "We update this page when these terms change and show the date above. Software versions and connected providers can change independently. Review the current terms before enabling a new integration.",
        ],
      },
    ],
  },
  ru: {
    title: "Условия использования",
    intro:
      "Условия использования сайта и инструментов WireCat, подключения аккаунтов и проверки действий с вашими данными.",
    updated: "Обновлено: 24 октября 2026 г.",
    contact: "Вопросы об этих условиях:",
    sections: [
      {
        id: "project",
        title: "Проект",
        paragraphs: [
          "WireCat — независимый проект с открытым исходным кодом, который поддерживает его автор. Эти условия охватывают wirecat.dev и инструменты WireCat, включая WireCat Drive и zm — приложение WireCat CLI для Zoom. WireCat не связан с Google, Zoom или другими подключаемыми сервисами и не утверждает, что они одобряют проект.",
        ],
      },
      {
        id: "accounts",
        title: "Ваши аккаунты и разрешения",
        paragraphs: [
          "Подключайте только аккаунты и данные, к которым у вас есть законный доступ. Вы отвечаете за соблюдение условий подключённого сервиса, правил своей организации и применимого права. Не используйте инструменты для обхода контроля доступа, получения чужих данных без разрешения или причинения вреда.",
          "Доступ к Google требует вашего согласия в браузере. Выбранные папки ограничивают локальный импорт, но не разрешение OAuth на Drive аккаунта. Доступ к Zoom требует вашего одобрения приложения WireCat CLI на экране согласия Zoom. Запись в Google или Zoom требует нужного разрешения и явной команды. Проверяйте команды, профили и разрешения агента перед изменениями.",
        ],
      },
      {
        id: "your-data",
        title: "Ваши данные и агенты",
        paragraphs: [
          "Вы сохраняете права на документы и другое содержимое. Использование WireCat не передаёт проекту право собственности на них. Вы отвечаете за защиту и управление локальным хранилищем, экспортом, резервными копиями и учётными данными.",
          "При включении внешнего провайдера ИИ или подключении агента проверьте получаемые им данные и его условия. Созданные ИИ сводки и записи памяти могут быть неточными: сверяйте источники перед использованием. Разрешение агенту доступа не заменяет вашу проверку важных действий.",
        ],
      },
      {
        id: "third-parties",
        title: "Сторонние сервисы",
        paragraphs: [
          "Google, провайдеры ИИ, хостинг и другие подключённые сервисы работают по собственным условиям и политикам конфиденциальности. Их доступность, ограничения API, разрешения и изменения могут влиять на инструменты. WireCat не обещает непрерывный доступ или полную историю источников.",
        ],
      },
      {
        id: "license",
        title: "Лицензия и ограничения",
        paragraphs: [
          "Копирование, изменение и распространение регулирует лицензия каждого репозитория; условия сайта её не заменяют. Инструменты предоставляются по этим лицензиям, включая положения о гарантиях и ответственности. Делайте резервные копии и сначала проверяйте важные сценарии на небольшом объёме данных.",
          "Эти условия не исключают права или ответственность, которые нельзя исключить по применимому закону. Они не обещают точность импортированного содержимого или ИИ-ответов, непрерывную работу или восстановление данных после удаления.",
        ],
      },
      {
        id: "stopping",
        title: "Прекращение использования и изменения",
        paragraphs: [
          "Вы можете прекратить использование сайта и инструментов в любой момент. Для отключения завершите сессию каждого профиля и отзовите доступ приложения в аккаунте Google или удалите приложение WireCat CLI в Zoom App Marketplace; локальные данные удаляются отдельно. Подробности обработки данных приведены в политике конфиденциальности.",
          "При изменении условий мы обновляем страницу и дату выше. Версии программ и подключённые провайдеры могут меняться независимо. Прочитайте действующие условия перед включением новой интеграции.",
        ],
      },
    ],
  },
  es: {
    title: "Términos de servicio",
    intro:
      "Las condiciones para usar el sitio y las herramientas de WireCat, conectar tus cuentas y revisar las acciones realizadas con tus datos.",
    updated: "Última actualización: 24 de octubre de 2026",
    contact: "Preguntas sobre estos términos:",
    sections: [
      {
        id: "project",
        title: "El proyecto",
        paragraphs: [
          "WireCat es un proyecto independiente de código abierto mantenido por su autor. Estos términos cubren wirecat.dev y las herramientas de WireCat, incluidas WireCat Drive y zm, la aplicación WireCat CLI para Zoom. WireCat no está afiliado a Google, Zoom ni a los otros servicios que conecta, ni cuenta con su respaldo.",
        ],
      },
      {
        id: "accounts",
        title: "Tus cuentas y permisos",
        paragraphs: [
          "Conecta solo cuentas y datos que tengas autorización para usar. Eres responsable de cumplir los términos del servicio conectado, las reglas de tu organización y la ley aplicable. No uses las herramientas para eludir controles de acceso, obtener datos sin permiso ni perjudicar a otros.",
          "El acceso a Google requiere tu consentimiento en el navegador. Las carpetas elegidas limitan la importación local, pero no el permiso OAuth sobre el Drive de la cuenta. El acceso a Zoom requiere que apruebes la aplicación WireCat CLI en la pantalla de consentimiento de Zoom. Escribir en Google o Zoom requiere el permiso correspondiente y un comando explícito. Revisa los comandos, perfiles y permisos del agente antes de permitir cambios.",
        ],
      },
      {
        id: "your-data",
        title: "Tus datos y agentes",
        paragraphs: [
          "Conservas tus derechos sobre los documentos y otros contenidos. Usar WireCat no concede al proyecto la propiedad de ese contenido. Eres responsable de proteger y gestionar los almacenes locales, exportaciones, copias de seguridad y credenciales.",
          "Si activas un proveedor externo de IA o conectas un agente, revisa qué datos recibe y sus términos. Los resúmenes y recuerdos generados por IA pueden ser incorrectos: comprueba las fuentes antes de usarlos. Autorizar al agente no sustituye tu revisión de las acciones importantes.",
        ],
      },
      {
        id: "third-parties",
        title: "Servicios de terceros",
        paragraphs: [
          "Google, los proveedores de IA, el alojamiento y otros servicios conectados tienen sus propios términos y políticas de privacidad. Su disponibilidad, límites de API, permisos y cambios pueden afectar a las herramientas. WireCat no promete acceso ininterrumpido ni un historial completo de las fuentes.",
        ],
      },
      {
        id: "license",
        title: "Licencia y limitaciones",
        paragraphs: [
          "La licencia de cada repositorio rige la copia, modificación y redistribución; estos términos del sitio no la sustituyen. Las herramientas se proporcionan bajo esas licencias, incluidas sus disposiciones de garantía y responsabilidad. Mantén copias de seguridad y prueba los flujos importantes con un conjunto pequeño de datos.",
          "Estos términos no excluyen derechos ni responsabilidades que la ley aplicable no permita excluir. No prometen la exactitud del contenido importado o de los resultados de IA, un funcionamiento ininterrumpido ni la recuperación de datos eliminados.",
        ],
      },
      {
        id: "stopping",
        title: "Dejar de usar el servicio y cambios",
        paragraphs: [
          "Puedes dejar de usar el sitio o las herramientas en cualquier momento. Cierra la sesión de cada perfil y revoca la aplicación en tu cuenta de Google, o elimina la aplicación WireCat CLI en Zoom App Marketplace, para desconectarla; elimina los datos locales por separado. Consulta la Política de privacidad para los detalles del tratamiento de datos.",
          "Actualizamos esta página cuando cambian los términos y mostramos la fecha arriba. Las versiones del software y los proveedores conectados pueden cambiar de forma independiente. Revisa los términos actuales antes de activar una nueva integración.",
        ],
      },
    ],
  },
}
