import { describe, expect, it } from "vitest"
import { pageNumbers } from "../components/ideas/board/pager.tsx"

describe("ideas pager", () => {
  it("shows every page when there are few", () => {
    expect(pageNumbers(1, 3)).toEqual([1, 2, 3])
  })

  it("keeps the first, the last and the neighbours of the current page", () => {
    expect(pageNumbers(6, 12)).toEqual([1, "gap", 5, 6, 7, "gap", 12])
    expect(pageNumbers(1, 12)).toEqual([1, 2, "gap", 12])
    expect(pageNumbers(12, 12)).toEqual([1, "gap", 11, 12])
  })

  it("does not put a gap between neighbours", () => {
    expect(pageNumbers(3, 5)).toEqual([1, 2, 3, 4, 5])
  })
})
