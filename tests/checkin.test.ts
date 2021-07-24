import test, { before, beforeEach } from "ava"
import Openmagicline from "../src"
import setup, { delay } from "./_setup"

let instance: Openmagicline

const TEST_CUSTOMER = parseInt(process.env.OPENMAGICLINE_TEST_CUSTOMER ?? "0")
const TEST_FACILITY = parseInt(process.env.OPENMAGICLINE_TEST_FACILITY ?? "0")

before(async () => {
  instance = await setup()
})
beforeEach(delay)

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

test("change lockerKey", async t => {
  const checkin = await instance.checkin.checkin({
    lockerKey: "openmagicline automated test",
    fkCustomer: TEST_CUSTOMER,
    fkOrganizationUnit: TEST_FACILITY,
  })

  await delay()

  const changedTo = "openmagicline automated test 2"
  await instance.checkin.lockerKey(checkin.databaseId, changedTo)

  await delay()

  const list = await instance.checkin.list()
  const changedCheckin = list.checkins.find(c => c.databaseId === checkin.databaseId)
  if (!changedCheckin) throw "can't find lockerkey-changed checkin anymore"

  t.true(changedCheckin.lockerKey === changedTo)
})
