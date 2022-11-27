import type { ExecutionContext } from "ava"
import type { Magicline } from "../src"
import type Openmagicline from "../src"

import test from "ava"
import setup, { delay } from "./_setup"

const TEST_CUSTOMER = Number.parseInt(process.env.OPENMAGICLINE_TEST_CUSTOMER ?? "0")
const TEST_FACILITY = Number.parseInt(process.env.OPENMAGICLINE_TEST_FACILITY ?? "0")

let instance: Openmagicline
test.before(async () => {
  instance = await setup()
})
test.beforeEach(delay)

const verifyProductOverview = (p: Magicline.Sales.ProductOverview, t: ExecutionContext) => {
  const { classOfGoodsList } = p
  t.truthy(classOfGoodsList.length)

  const { productList } = classOfGoodsList[0]
  t.truthy(productList.length)

  const { productVariantList } = productList[0]
  t.truthy(productVariantList.length)
}

test("list products", async t => {
  const products = await instance.sales.products()

  verifyProductOverview(products, t)
})

test("list products for a customer", async t => {
  const products = await instance.disposal.products({
    customerId: TEST_CUSTOMER,
    organizationUnitId: TEST_FACILITY,
  })

  verifyProductOverview(products, t)
})
