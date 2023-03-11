import type { Openmagicline } from "../src"

import test from "ava"
import setup, { delay } from "./_setup"

let instance: Openmagicline

test.before(async () => {
  instance = await setup()
})
test.beforeEach(delay)

test("get permitted", async t => {
  const data = await instance.organization.permitted()
  t.truthy(data)
})

test("get accountInfo", async t => {
  const data = await instance.organization.accountInfo()
  t.truthy(data)
})

test("get apps", async t => {
  const data = await instance.organization.apps()
  t.truthy(data)
})

test("get apps for specific unitID", async t => {
  const unitID = await instance.util.getDefaultUnitID()
  const data = await instance.organization.apps(unitID)
  t.truthy(data)
})
