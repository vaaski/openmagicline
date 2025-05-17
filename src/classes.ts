import type { $Fetch } from "ofetch"
import type { Openmagicline as mgl } from "."

import type { Magicline, OMGL } from "../types"

export default class Classes {
	constructor(
		private fetch: $Fetch,
		private mgl: mgl,
	) {}

	getClasses = async (options?: OMGL.Classes.GetClassesOptions) => {
		const organizationUnitId =
			options?.organizationUnitId ?? (await this.mgl.unitID)

		const startDateTime = new Date()
		const endDateTime = new Date()
		endDateTime.setMonth(endDateTime.getMonth() + 1)

		return await this.fetch<Magicline.Classes.ClassResponse[]>(
			"/courseappointments/paged",
			{
				query: {
					organizationUnitId,
					startDateTime: startDateTime.toISOString(),
					endDateTime: endDateTime.toISOString(),
					maxResults: 30,
					...options,
				} satisfies OMGL.Classes.GetClassesOptions,
			},
		)
	}
}
