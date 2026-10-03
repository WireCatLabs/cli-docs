export const defaultTimings = {
  readSeconds: 4,
  contextSeconds: 45,
  writeMinutes: 3,
  summaryMinutes: 8,
  checkContextSeconds: 15,
  checkReplyMinutes: 1,
}
export type Timings = typeof defaultTimings

export function estimateTime(messages: number, chats: number, replies: number, timings: Timings) {
  const manual = (messages * timings.readSeconds + chats * timings.contextSeconds) / 60 + replies * timings.writeMinutes
  const assisted =
    timings.summaryMinutes + (chats * timings.checkContextSeconds) / 60 + replies * timings.checkReplyMinutes
  const saved = manual - assisted
  return { manual, assisted, saved, monthlyHours: (saved * 22) / 60 }
}
