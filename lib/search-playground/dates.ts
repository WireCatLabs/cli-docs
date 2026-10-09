/** Calendar dates use UTC, just like the playground query engine. */
export function createDemoDates(now = new Date()) {
  const day = (offset: number) =>
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + offset)).toISOString().slice(0, 10)
  const month = (offset: number, date: number) =>
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, date)).toISOString().slice(0, 10)
  return {
    day,
    today: day(0),
    start: day(-2),
    end: day(2),
    deadline: day(3),
    monthStart: month(0, 1),
    monthEnd: month(1, 0),
  }
}

export const demoDates = createDemoDates()
