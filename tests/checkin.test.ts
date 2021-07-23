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

test("check-in a customer", async t => {
  const data = await instance.checkin.checkin({
    lockerKey: "openmagicline automated test",
    fkCustomer: TEST_CUSTOMER,
    requiredOrganizationUnitId: TEST_FACILITY,
  })
  t.true(data.fkCustomer === TEST_CUSTOMER)
})
