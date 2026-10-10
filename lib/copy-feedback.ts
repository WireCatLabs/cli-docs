export const copyFeedbackEvent = "wirecat:copy-feedback"

export function notifyCopyFeedback(copied: boolean) {
  window.dispatchEvent(new CustomEvent(copyFeedbackEvent, { detail: copied }))
}
