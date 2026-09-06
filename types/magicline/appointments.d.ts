export type AppointmentStatus = "PLANNED" | "COMPLETED" | "CANCELLED"

export type AppointmentSource = "MYSPORTS" | "INTERNAL_API" | "STUDIO"

export type AppointmentVisualType
	= | "SINGLE_APPOINTMENT_WITHOUT_SERIES"
		| "SINGLE_APPOINTMENT_WITH_SERIES"

export type AppointmentType = "SINGLE"

export type DescriptionType
	= | "CUSTOMERS"
		| "BENEFIT"
		| "EQUIPMENTS"
		| "STUDIO"
		| "EVENT"
		| "NOTE"

export type Description = {
	description: string
	type: DescriptionType
}

export type AppointmentCustomer = {
	databaseId: number
	optlock: number
	fkOrganizationUnit: number
	firstname: string
	lastname: string
}

export type Appointment = {
	databaseId: number
	optlock: number
	fkOrganizationUnit: number
	startDateTime: string
	endDateTime: string
	colorHex: string
	descriptions: Description[]
	type: string
	label: string | null
	usageSource: string | null
	abbreviation: string | null
	benefit: unknown | null
	employees: unknown[]
	resourceIds: number[]
	appointmentVisualType: AppointmentVisualType
	resourceStatus: string
	appointmentStatus: AppointmentStatus
	appointmentSource: AppointmentSource | null
	bookingSource: string | null
	appointmentType: AppointmentType
	studioOpen: boolean
	pendingContract: unknown | null
	bookedParticipants: number
	maxParticipants: number
	nonBookedParticipants: number
	customers: AppointmentCustomer[]
	hasNoexcuseCustomers: boolean
	cancelationType: string
	appointmentMeetingType: string
	currentCustomerParticipantStatus: unknown | null
	customerOnWaitingList: boolean
	customerParticipating: number
	customerNotParticipating: number
	customerUnset: number
}
