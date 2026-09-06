import type { $Fetch } from "ofetch"
import type { Openmagicline as mgl } from "."

import type { Magicline, OMGL } from "../types"

export default class Sales {
	constructor(
		private fetch: $Fetch,
		private mgl: mgl,
	) {}

	products = async (options?: OMGL.Sales.ProductOptions) => {
		const organizationUnitId
			= options?.organizationUnitId ?? (await this.mgl.unitID)

		return await this.fetch<Magicline.Sales.ProductOverview>(
			"/sales/productoverview",
			{
				query: {
					organizationUnitId,
					...options,
				},
			},
		)
	}
}
