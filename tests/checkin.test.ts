import type Openmagicline from "../src"
import type { Checkin } from "../types/magicline"

import test from "ava"
import setup, { delay } from "./_setup"

let instance: Openmagicline

const TEST_CUSTOMER = Number.parseInt(process.env.OPENMAGICLINE_TEST_CUSTOMER ?? "0")
const TEST_FACILITY = Number.parseInt(process.env.OPENMAGICLINE_TEST_FACILITY ?? "0")

test.before(async () => {
  instance = await setup()
})
test.beforeEach(delay)

let checkin: Checkin.CheckinResponse
let checkinList: Checkin.CheckinList

test("get checkin list", async t => {
  checkinList = await instance.checkin.list()
  t.true(Array.isArray(checkinList.checkins))
  t.truthy(checkinList.checkins[0].firstname)
  t.true(typeof checkinList.checkins[0].databaseId === "number")
})

test("check-in a customer", async t => {
  checkin = await instance.checkin.checkin({
    lockerKey: "openmagicline automated test",
    fkCustomer: TEST_CUSTOMER,
  })
  t.true(checkin.fkCustomer === TEST_CUSTOMER)
})

const changedTo = "openmagicline automated test 2"
test("change lockerKey: change key", async t => {
  const changed = await instance.checkin.lockerKey(checkin.databaseId, changedTo)

  t.assert(changed.lockerKey === changedTo)
  t.assert(changed.checkinId === checkin.databaseId)
})

test("get checkin list with a unitID", async t => {
  checkinList = await instance.checkin.list({
    organizationUnitId: TEST_FACILITY,
  })
  t.true(Array.isArray(checkinList.checkins))
  t.truthy(checkinList.checkins[0].firstname)
  t.true(typeof checkinList.checkins[0].databaseId === "number")
})

test("change lockerKey: check key", async t => {
  const changedCheckin = checkinList.checkins.find(c => c.databaseId === checkin.databaseId)
  if (!changedCheckin) throw "can't find lockerkey-changed checkin anymore"

  t.true(changedCheckin.lockerKey === changedTo)
})

test("check-out a customer", async t => {
  const checkout = await instance.checkin.checkout(checkin.databaseId)
  t.true(checkout.fkCustomer === TEST_CUSTOMER)
})
