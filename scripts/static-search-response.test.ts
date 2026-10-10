import { gunzipSync } from "node:zlib"
import { expect, it } from "vitest"
import { staticSearchResponse } from "../lib/static-search-response"

it("retains the complete localized search data in a compressed JSON response", async () => {
  const data = { type: "i18n", data: { ru: { title: "Поиск сообщений", tokens: ["чаты", "messages.send"] } } }
  const response = staticSearchResponse(data)
  expect(response.headers.get("Content-Encoding")).toBeNull()
  expect(response.headers.get("Content-Type")).toBe("application/gzip")
  expect(JSON.parse(gunzipSync(new Uint8Array(await response.arrayBuffer())).toString())).toEqual(data)
})
