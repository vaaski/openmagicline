import { expect, test } from "bun:test"
import { getInstance } from "./_setup"

const instance = await getInstance()

const TEST_CUSTOMER = Number.parseInt(
	process.env.OPENMAGICLINE_TEST_CUSTOMER ?? "0",
)
const TEST_FACILITY = Number.parseInt(
	process.env.OPENMAGICLINE_TEST_FACILITY ?? "0",
)

test("search for customers", async () => {
	const result = await instance.customer.search("e", {
		facility: TEST_FACILITY,
	})
	expect(result.length).toBeTruthy()
	expect(result[0]?.firstname).toBeTruthy()
	expect(result[0]?.databaseId).toBeTruthy()
})

test("get cards of a customer", async () => {
	const result = await instance.customer.getCards(TEST_CUSTOMER)
	expect(result.length).toBeTruthy()
	expect(result[0]?.databaseId).toBeTruthy()
	expect(result[0]?.uid).toBeTruthy()
})

test("get contracts of a customer", async () => {
	const result = await instance.customer.getContracts(TEST_CUSTOMER)
	expect(result).toBeTruthy()
	expect(Array.isArray(result)).toBeTruthy()

	if (result.length > 0) {
		expect(result.length).toBeTruthy()
		expect(result[0]?.databaseId).toBeTruthy()
		expect(result[0]?.rateName).toBeTruthy()
	}
})

test("get checkin conditions", async () => {
	const conditions = await instance.customer.checkinConditions(
		TEST_CUSTOMER,
		TEST_FACILITY,
	)
	expect(Array.isArray(conditions)).toBeTrue()
})

test("get customer benefits", async () => {
	const benefits = await instance.customer.benefits(TEST_CUSTOMER)
	expect(Array.isArray(benefits)).toBeTrue()
})

test("get customer detailed balance", async () => {
	const balance = await instance.customer.detailedBalance(TEST_CUSTOMER)

	expect(Number.isNaN(balance.databaseId)).toBeFalse()
	expect(Number.isNaN(balance.consumptionCreditBalance)).toBeFalse()
	expect(Number.isNaN(balance.debtClaimBalance)).toBeFalse()
	expect(Number.isNaN(balance.debtClaimBalanceWithoutLaterSale)).toBeFalse()
	expect(Number.isNaN(balance.laterSaleBalance)).toBeFalse()
	expect(Number.isNaN(balance.paymentBalance)).toBeFalse()
	expect(Number.isNaN(balance.transferBalance)).toBeFalse()
	expect(Number.isNaN(balance.totalWithoutConsumptionCredit)).toBeFalse()
})

test.todo("add customer card", () => {})
test.todo("remove customer card", () => {})
