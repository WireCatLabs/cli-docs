import { describe, expect, it } from "vitest"
import { defaultTimings, estimateTime } from "../lib/time-savings"

describe("editable time estimate", () => {
  it("converts seconds to minutes and uses 22 days for monthly hours", () => {
    const result = estimateTime(200, 12, 6, defaultTimings)
    expect(result.manual).toBeCloseTo(40 + 1 / 3)
    expect(result.assisted).toBe(17)
    expect(result.saved).toBeCloseTo(23 + 1 / 3)
    expect(result.monthlyHours).toBeCloseTo((result.saved * 22) / 60)
  })
  it("shows when manual work is faster instead of inventing savings", () => {
    expect(estimateTime(10, 1, 0, defaultTimings).saved).toBeLessThan(0)
  })
  it("honors the reader's assumptions and includes review of drafts", () => {
    const result = estimateTime(60, 2, 4, {
      readSeconds: 10,
      contextSeconds: 30,
      writeMinutes: 2,
      summaryMinutes: 3,
      checkContextSeconds: 15,
      checkReplyMinutes: 0.5,
    })
    expect(result.manual).toBe(19)
    expect(result.assisted).toBe(5.5)
    expect(result.saved).toBe(13.5)
  })
})
