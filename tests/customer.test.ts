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

test("search for customers", async t => {
  const result = await instance.customer.search("e", { facility: TEST_FACILITY })
  t.truthy(result.length)
  t.truthy(result[0].firstname)
  t.truthy(result[0].databaseId)
})

test("get cards of a customer", async t => {
  const result = await instance.customer.getCards(TEST_CUSTOMER)
  t.truthy(result.length)
  t.truthy(result[0].databaseId)
  t.truthy(result[0].uid)
})

test.todo("add customer card")
test.todo("remove customer card")
