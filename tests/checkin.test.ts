import type Openmagicline from "../src"
import type { Checkin } from "../types/magicline"

import test, { after, before, beforeEach } from "ava"
import setup, { delay } from "./_setup"

let instance: Openmagicline

const TEST_CUSTOMER = parseInt(process.env.OPENMAGICLINE_TEST_CUSTOMER ?? "0")
const TEST_FACILITY = parseInt(process.env.OPENMAGICLINE_TEST_FACILITY ?? "0")

before(async () => {
  instance = await setup()
})
beforeEach(delay)

let checkin: Checkin.CheckinResponse

after(async () => {
  try {
    await instance.checkin.checkout(checkin.databaseId)
  } catch (_) {
    // ignore
  }
})

test("get checkin list", async t => {
  const data = await instance.checkin.list()
  t.true(data.checkins instanceof Array)
  t.truthy(data.checkins[0].firstname)
  t.true(typeof data.checkins[0].databaseId === "number")
})

test("get checkin list with a unitID", async t => {
  const data = await instance.checkin.list({
    organizationUnitId: TEST_FACILITY,
  })
  t.true(data.checkins instanceof Array)
  t.truthy(data.checkins[0].firstname)
  t.true(typeof data.checkins[0].databaseId === "number")
})

test("check-in a customer", async t => {
  const data = await instance.checkin.checkin({
    lockerKey: "openmagicline automated test",
    fkCustomer: TEST_CUSTOMER,
  })
  t.true(data.fkCustomer === TEST_CUSTOMER)
})

test("check-out a customer", async t => {
  const checkin = await instance.checkin.checkin({
    lockerKey: "openmagicline automated test",
    fkCustomer: TEST_CUSTOMER,
    requiredOrganizationUnitId: TEST_FACILITY,
  })

  const checkout = await instance.checkin.checkout(checkin.databaseId)
  t.true(checkout.fkCustomer === TEST_CUSTOMER)
})

test("change lockerKey part 1: ensure checkin", async t => {
  const lockerKey = "openmagicline automated test"

  checkin = await instance.checkin.checkin({
    lockerKey,
    fkCustomer: TEST_CUSTOMER,
    fkOrganizationUnit: TEST_FACILITY,
  })

  t.assert(checkin.lockerKey === lockerKey)
})

const changedTo = "openmagicline automated test 2"
test("change lockerKey part 2: change key", async t => {
  const changed = await instance.checkin.lockerKey(checkin.databaseId, changedTo)

  t.assert(changed.lockerKey === changedTo)
  t.assert(changed.checkinId === checkin.databaseId)
})

test("change lockerKey part 3: check key", async t => {
  const list = await instance.checkin.list()
  const changedCheckin = list.checkins.find(c => c.databaseId === checkin.databaseId)
  if (!changedCheckin) throw "can't find lockerkey-changed checkin anymore"

  t.true(changedCheckin.lockerKey === changedTo)
})
