import type { Openmagicline } from "../src"
import type { Checkin } from "../types/magicline"

import test from "ava"
import setup from "./_setup"

const TEST_CUSTOMER = Number.parseInt(process.env.OPENMAGICLINE_TEST_CUSTOMER ?? "0")
const TEST_FACILITY = Number.parseInt(process.env.OPENMAGICLINE_TEST_FACILITY ?? "0")

let instance: Openmagicline
test.before(async () => {
  instance = await setup()
})

let checkin: Checkin.CheckinResponse

test.after(async () => {
  try {
    await instance.checkin.checkout(checkin.databaseId)
  } catch {
    // ignore
  }
})

test("checkin event handler fires", t => {
  t.timeout(30e3)
  t.plan(1)

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async resolve => {
    const socket = instance.socket(TEST_FACILITY)

    await socket.onCheckin(data => {
      t.true(data.payload.fkCustomer === TEST_CUSTOMER)

      socket.unsubscribeAll()
      socket.deactivate()
      resolve()
    })

    // checks if already active returns instantly
    socket.activate()

    checkin = await instance.checkin.checkin({
      fkCustomer: TEST_CUSTOMER,
      requiredOrganizationUnitId: TEST_FACILITY,
    })
  })
})

test("socket unsubscribing deactivates the connection automatically", t => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async resolve => {
    const socket = instance.socket(TEST_FACILITY)

    const unsubscribe = await socket.onCheckin(() => "")
    unsubscribe()
    t.true(socket.isActive === false)
    resolve()
  })
})
