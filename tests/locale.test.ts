import type { Openmagicline } from "../src"

import test from "ava"
import setup, { delay } from "./_setup"

let instance: Openmagicline

test.before(async () => {
  instance = await setup()
})
test.beforeEach(delay)

test("get supported locales", async t => {
  const data = await instance.locale.supportedLocales()
  t.truthy(data.length)
  t.truthy(typeof data[0] === "string")
})
