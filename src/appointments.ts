import type { $Fetch } from "ofetch"
import type { Openmagicline as mgl } from "."

import type { Magicline, OMGL } from "../types"

export default class Appointments {
	constructor(
		private fetch: $Fetch,
		private mgl: mgl,
	) {}

	private readonly defaultSearchOptions: OMGL.Appointments.SearchOptions = {
		appointmentStatuses: ["PLANNED", "COMPLETED"],
	}

	/**
	 * search for appointments within a date range.
	 *
	 * defaults to the current week (Monday to Sunday) if no dates are provided.
	 */
	search = async (options?: Partial<OMGL.Appointments.SearchOptions>) => {
		const organizationUnitId =
			options?.organizationUnitId ?? (await this.mgl.unitID)

		const startDate = options?.startDate ?? defaultStartDate()
		const endDate = options?.endDate ?? defaultEndDate(startDate)

		return await this.fetch<Magicline.Appointments.Appointment[]>(
			"/newappointments/search",
			{
				query: {
					...this.defaultSearchOptions,
					...options,
					organizationUnitId,
					facilityIds: options?.facilityIds ?? organizationUnitId,
					startDate,
					endDate,
					appointmentStatuses: (
						options?.appointmentStatuses ??
						this.defaultSearchOptions.appointmentStatuses
					)?.join(","),
				},
			},
		)
	}

	/** get a single appointment by its database ID. */
	get = async (appointmentId: number, type: "single" | "course" = "single") => {
		return await this.fetch<Magicline.Appointments.Appointment>(
			`/${type}appointments/${appointmentId}`,
		)
	}
}

/** returns the current week's Monday as YYYY-MM-DD */
function defaultStartDate(): string {
	const now = new Date()
	const day = now.getDay()
	const offset = day === 0 ? -6 : 1 - day
	const monday = new Date(now)
	monday.setDate(now.getDate() + offset)
	return monday.toISOString().slice(0, 10)
}

/** returns the Sunday after a given start date as YYYY-MM-DD */
function defaultEndDate(startDate: string): string {
	const d = new Date(startDate)
	d.setDate(d.getDate() + 6)
	return d.toISOString().slice(0, 10)
}
