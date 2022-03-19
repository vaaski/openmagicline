import type Openmagicline from "../src"
import type { Checkin } from "../types/magicline"

import test, { after, before, beforeEach } from "ava"
import setup, { delay } from "./_setup"

const TEST_CUSTOMER = parseInt(process.env.OPENMAGICLINE_TEST_CUSTOMER ?? "0")
const TEST_FACILITY = parseInt(process.env.OPENMAGICLINE_TEST_FACILITY ?? "0")

let instance: Openmagicline
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

test("checkin event handler fires", t => {
  t.timeout(5e3)
  t.plan(1)

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async res => {
    const socket = instance.socket(TEST_FACILITY)

    await socket.onCheckin(data => {
      t.true(data.payload.fkCustomer === TEST_CUSTOMER)

      socket.unsubscribeAll()
      socket.deactivate()
      res()
    })

    // checks if already active returns instantly
    socket.activate()

    await instance.checkin.checkin({
      fkCustomer: TEST_CUSTOMER,
      requiredOrganizationUnitId: TEST_FACILITY,
    })
  })
})

test("socket unsubscribing deactivates the connection automatically", t => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async res => {
    const socket = instance.socket(TEST_FACILITY)

    const unsubscribe = await socket.onCheckin(() => null)
    unsubscribe()
    t.true(socket.isActive === false)
    res()
  })
})
