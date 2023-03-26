import type { Openmagicline } from "../src"

import test from "ava"
import setup, { delay } from "./_setup"

let instance: Openmagicline

const TEST_CUSTOMER = Number.parseInt(process.env.OPENMAGICLINE_TEST_CUSTOMER ?? "0")
const TEST_FACILITY = Number.parseInt(process.env.OPENMAGICLINE_TEST_FACILITY ?? "0")

test.before(async () => {
  instance = await setup()
})
test.beforeEach(delay)

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

test("get contracts of a customer", async t => {
  const result = await instance.customer.contract(TEST_CUSTOMER)
  t.truthy(result)
  t.truthy(Array.isArray(result))

  if (result.length > 0) {
    t.truthy(result.length)
    t.truthy(result[0].databaseId)
    t.truthy(result[0].rateName)
  }
})

test("get checkin conditions", async t => {
  const conditions = await instance.customer.checkinConditions(TEST_CUSTOMER, TEST_FACILITY)
  t.true(Array.isArray(conditions))
})

test("get customer benefits", async t => {
  const benefits = await instance.customer.benefits(TEST_CUSTOMER)
  t.true(Array.isArray(benefits))
})

test("get customer detailed balance", async t => {
  const balance = await instance.customer.detailedBalance(TEST_CUSTOMER)

  t.false(Number.isNaN(balance.databaseId))
  t.false(Number.isNaN(balance.consumptionCreditBalance))
  t.false(Number.isNaN(balance.debtClaimBalance))
  t.false(Number.isNaN(balance.debtClaimBalanceWithoutLaterSale))
  t.false(Number.isNaN(balance.laterSaleBalance))
  t.false(Number.isNaN(balance.paymentBalance))
  t.false(Number.isNaN(balance.transferBalance))
  t.false(Number.isNaN(balance.totalWithoutConsumptionCredit))
})

test.todo("add customer card")
test.todo("remove customer card")
