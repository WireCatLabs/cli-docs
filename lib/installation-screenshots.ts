export type InstallationScreenshot = {
  src?: string
  target: string
  alt: string
  width?: number
}

const descriptions = {
  en: [
    "Telegram message with the login code for my.telegram.org",
    "Terminal showing the Telegram account-login QR code",
    "Telegram Settings → Devices, with Add Device highlighted",
    "my.telegram.org form for entering the phone number and confirmation code",
    "my.telegram.org menu with API development tools highlighted",
    "App configuration with App api_id and App api_hash highlighted",
    "Terminal showing the MAX login QR code during setup",
    "MAX Settings → Devices, with the QR scanner button",
  ],
  ru: [
    "Сообщение Telegram с кодом для входа на my.telegram.org",
    "Терминал с QR-кодом для входа в аккаунт Telegram",
    "Telegram: Настройки → Устройства, выделена кнопка Add Device",
    "Форма my.telegram.org для номера телефона и кода подтверждения",
    "Меню my.telegram.org, выделен пункт API development tools",
    "App configuration, выделены App api_id и App api_hash",
    "Терминал с QR-кодом для входа в MAX при настройке",
    "MAX: Настройки → Устройства, кнопка сканера QR-кода",
  ],
  es: [
    "Mensaje de Telegram con el código para acceder a my.telegram.org",
    "Terminal con el QR de inicio de sesión de Telegram",
    "Telegram: Configuración → Dispositivos, con Add Device resaltado",
    "Formulario de my.telegram.org para el teléfono y el código de confirmación",
    "Menú de my.telegram.org con API development tools resaltado",
    "App configuration con App api_id y App api_hash resaltados",
    "Terminal con el QR de inicio de sesión de MAX durante la configuración",
    "MAX: configuración y dispositivos, con el botón del escáner QR",
  ],
}

export function installationScreenshots(tool: string, lang: string) {
  const labels = descriptions[lang === "ru" || lang === "es" ? lang : "en"]
  const image = (file: string, index: number, width?: number): InstallationScreenshot => ({
    src: `/screenshots/${file}`,
    target: `/screenshots/${file}`,
    alt: labels[index],
    width,
  })
  const slot = (file: string, index: number, width?: number): InstallationScreenshot => ({
    target: `/screenshots/${file}`,
    alt: labels[index],
    width,
  })
  return tool === "tg"
    ? {
        login: {
          1: [image("telegram/code-message.jpg", 0, 360)],
          2: [slot("telegram/terminal-qr.png", 1)],
          3: [image("telegram/add-device.jpg", 2, 360)],
        } as Record<number, InstallationScreenshot[]>,
        browser: {
          0: [image("telegram/my-telegram-login.png", 3)],
          1: [image("telegram/my-telegram-api-tools.png", 4)],
          3: [image("telegram/my-telegram-credentials.png", 5)],
        } as Record<number, InstallationScreenshot[]>,
      }
    : {
        login: {
          0: [slot("max/terminal-qr-current.png", 6, 1000)],
          1: [slot("max/devices-scanner.png", 7, 360)],
        } as Record<number, InstallationScreenshot[]>,
        browser: {} as Record<number, InstallationScreenshot[]>,
      }
}

export function screenshotMarkdown(screenshot: InstallationScreenshot, lang: string) {
  if (screenshot.src) return `![${screenshot.alt}](${screenshot.src})`
  const label = { en: "Screenshot needed", ru: "Нужен скриншот", es: "Falta una captura" }[lang] ?? "Screenshot needed"
  return `*${label}: ${screenshot.alt}*`
}
