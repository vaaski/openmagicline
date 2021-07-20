import test, { before } from "ava"
import Openmagicline from "../src"
import setup from "./setup"

let instance: Openmagicline

before(async () => {
  instance = await setup()
})

test("get permitted", async t => {
  const data = await instance.organization.permitted()
  t.truthy(data)
})

test("get notices", async t => {
  const data = await instance.organization.notices()
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
