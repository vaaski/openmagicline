import type { unitID } from ".."
import type { AppointmentStatus } from "../magicline/appointments"

export type SearchOptions = {
	organizationUnitId?: unitID
	/** defaults to today */
	startDate?: string
	/** defaults to 7 days from startDate */
	endDate?: string
	/** defaults to ["PLANNED", "COMPLETED"] */
	appointmentStatuses?: AppointmentStatus[]
	facilityIds?: unitID
}
