const channelName = "wirecat-ideas-sign-in"

export const popupReturnPath = (lang: string) => `/${lang}/ideas/sign-in?popup=1`

/** The Google window comes back to the sign-in page with `popup=1`, either directly or inside `next`. */
export function isSignInPopup() {
  if (typeof window === "undefined") return false
  const params = new URLSearchParams(window.location.search)
  return params.get("popup") === "1" || (params.get("next") ?? "").includes("popup=1")
}

// Google's pages can cut window.opener on the way back, so the page that opened the window hears it on a channel.
export function announceSignIn(error?: string) {
  try {
    const channel = new BroadcastChannel(channelName)
    channel.postMessage({ type: "signed-in", error })
    channel.close()
  } catch {}
  setTimeout(() => window.close(), 150)
}

export function listenForSignIn(onMessage: (error?: string) => void) {
  if (typeof BroadcastChannel === "undefined") return () => {}
  const channel = new BroadcastChannel(channelName)
  channel.onmessage = (event) => {
    if (event.data?.type === "signed-in") onMessage(event.data.error)
  }
  return () => channel.close()
}
