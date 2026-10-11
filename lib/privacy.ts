type PrivacySection = { id: string; title: string; paragraphs: string[] }

export const privacyCopy: Record<
  "en" | "ru" | "es",
  { title: string; intro: string; updated: string; contact: string; sections: PrivacySection[] }
> = {
  en: {
    title: "Privacy",
    intro:
      "How wirecat.dev counts visits, what is stored in your browser and how to change your choice. The WireCat tools run on your computer; this page covers only this website.",
    updated: "Last updated: 11 October 2026",
    contact: "Questions and requests about your data:",
    sections: [
      {
        id: "provider",
        title: "Who processes the data",
        paragraphs: [
          "WireCat runs this website. For analytics we use PostHog Cloud EU, hosted in Frankfurt, Germany. PostHog processes the data on our behalf.",
          "Cloudflare serves the pages and processes your IP address to deliver them and protect the site.",
        ],
      },
      {
        id: "without-consent",
        title: "If you decline or do not answer",
        paragraphs: [
          "We count page views and two actions: copying an installation command and opening a setup guide. For these actions we record only the tool, the site language and the part of the page, never the copied text. Each record also holds the page address, the previous page and general browser and device details.",
          "Nothing is stored in your browser: no cookies and no local storage. To count unique visitors, PostHog's servers combine your IP address and browser details with a random value that changes every day and is then deleted, and keep only the result. This count cannot follow you from one day to the next.",
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
    title: "Конфиденциальность",
    intro:
      "Как wirecat.dev считает посещения, что хранится в вашем браузере и как изменить выбор. Инструменты WireCat работают на вашем компьютере; эта страница касается только сайта.",
    updated: "Обновлено: 11 октября 2026 г.",
    contact: "Вопросы и запросы о ваших данных:",
    sections: [
      {
        id: "provider",
        title: "Кто обрабатывает данные",
        paragraphs: [
          "Сайт ведёт WireCat. Для аналитики мы используем PostHog Cloud EU; данные хранятся во Франкфурте, Германия. PostHog обрабатывает их по нашему поручению.",
          "Страницы отдаёт Cloudflare; он обрабатывает ваш IP-адрес, чтобы доставить страницы и защитить сайт.",
        ],
      },
      {
        id: "without-consent",
        title: "Если вы отказались или не ответили",
        paragraphs: [
          "Мы считаем просмотры страниц и два действия: копирование команды установки и открытие руководства по настройке. Для этих действий записываются только инструмент, язык сайта и часть страницы, но не скопированный текст. В каждой записи также есть адрес страницы, предыдущая страница и общие сведения о браузере и устройстве.",
          "В браузере ничего не сохраняется: ни cookie, ни локального хранилища. Чтобы считать уникальных посетителей, серверы PostHog объединяют ваш IP-адрес и сведения о браузере со случайным значением, которое меняется каждый день и затем удаляется, и сохраняют только результат. Такой подсчёт не связывает ваши визиты в разные дни.",
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
    title: "Privacidad",
    intro:
      "Cómo wirecat.dev cuenta las visitas, qué se guarda en tu navegador y cómo cambiar tu elección. Las herramientas de WireCat se ejecutan en tu ordenador; esta página trata solo de este sitio web.",
    updated: "Última actualización: 11 de octubre de 2026",
    contact: "Preguntas y solicitudes sobre tus datos:",
    sections: [
      {
        id: "provider",
        title: "Quién trata los datos",
        paragraphs: [
          "WireCat gestiona este sitio web. Para la analítica usamos PostHog Cloud EU, alojado en Fráncfort (Alemania). PostHog trata los datos por encargo nuestro.",
          "Cloudflare sirve las páginas y trata tu dirección IP para entregarlas y proteger el sitio.",
        ],
      },
      {
        id: "without-consent",
        title: "Si rechazas o no respondes",
        paragraphs: [
          "Contamos las páginas vistas y dos acciones: copiar un comando de instalación y abrir una guía de configuración. De estas acciones registramos solo la herramienta, el idioma del sitio y la parte de la página, nunca el texto copiado. Cada registro incluye también la dirección de la página, la página anterior y datos generales del navegador y del dispositivo.",
          "No se guarda nada en tu navegador: ni cookies ni almacenamiento local. Para contar visitantes únicos, los servidores de PostHog combinan tu dirección IP y los datos del navegador con un valor aleatorio que cambia cada día y después se elimina, y guardan solo el resultado. Este recuento no puede seguirte de un día a otro.",
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
