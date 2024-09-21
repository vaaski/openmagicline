import type { Magicline } from "../types"

import { expect, test } from "bun:test"
import { getInstance } from "./_setup"

const instance = await getInstance()

const TEST_CUSTOMER = Number.parseInt(
	process.env.OPENMAGICLINE_TEST_CUSTOMER ?? "0",
)
const TEST_FACILITY = Number.parseInt(
	process.env.OPENMAGICLINE_TEST_FACILITY ?? "0",
)

const verifyProductOverview = ({
	classOfGoodsList,
}: Magicline.Sales.ProductOverview) => {
	expect(classOfGoodsList.length).toBeTruthy()

	const { productList } = classOfGoodsList[0]
	expect(productList.length).toBeTruthy()

	const { productVariantList } = productList[0]
	expect(productVariantList.length).toBeTruthy()
}

test("list products", async () => {
	const products = await instance.sales.products()

	verifyProductOverview(products)
})

test("list products for a customer", async () => {
	const products = await instance.disposal.products({
		customerId: TEST_CUSTOMER,
		organizationUnitId: TEST_FACILITY,
	})

	verifyProductOverview(products)
})
