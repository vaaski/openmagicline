export type ClassResponse = {
	databaseId: number
	optlock: number
	fkOrganizationUnit: number
	startDateTime: string
	endDateTime: string
	customerIds: null
	customerNames: null
	cancelledCustomerIds: null
	cancelledCustomerNames: null
	hasNoexcuseCustomers: boolean
	externalId: null
	benefit: Benefit
	bookedParticipants: number
	nonBookedParticipantsCount: null
	maxParticipants: number
	waitingListCustomerCount: number
	maxWaitingList: number
	plannedParticipants: number
	aggregatorParticipantConfigs: null
	employees: Employee[]
	locations: Employee[]
	stream: null
	customerReminderTermDto: TermDto
	autoCancelation: boolean
	minCancelationParticipants: number
	appointmentCancelationTermDto: TermDto
	appointmentStatus: string
}

export type TermDto = {
	term: number
	termUnit: string
}

export type Benefit = {
	databaseId: number
	optlock: number
	facilityInfo: null
	fkOrganizationUnit: number
	type: number
	name: string
	abbreviation: null
	description: null | string
	publicName: null
	publicNames: Public[]
	publicDescription: null
	publicDescriptions: Public[]
	publicImage: null | string
	cdnPublicImage: CDNPublicImage | null
	colorHex: string
	bookingOptionType: string
	purchasingType: string
	virtualProductId: number
	fkTaxRate: number
	taxPercentage: number
	mixedTaxRateShareDtos: unknown[]
	mixedTaxRate: boolean
	permission: null
	restrictCashPayer: boolean
	benefitCategory: BenefitCategory
	benefitTargetGroups: BenefitTargetGroup[]
	level: null | string
	minimumAge: null
	visibleInPublicApi: boolean
	benefitUsageCountRestriction: BenefitUsageCountRestriction | null
	bookingCodes: unknown[]
	timeMainInMinutes: number
	benefitPrice: null
	appointmentMeetingType: string
	appointmentStreamType: null
	noShowPenaltyConfig: null
	studioEvent: boolean
	participantsConfig: ParticipantsConfig
}

export type BenefitCategory = {
	databaseId: number
	optlock: number
	name: string
	colorHex: string
	type: string
}

export type BenefitTargetGroup = {
	databaseId: number
	optlock: null
	name: string
}

export type BenefitUsageCountRestriction = {
	databaseId: number
	optlock: number
	facilityInfo: null
	name: string
	shared: boolean
	countPerDay: null
	countPerWeek: null
	countPerMonth: null
	countPerYear: null
}

export type CDNPublicImage = {
	bucketName: string
	objectKey: string
	id: null
	url: string
}

export type ParticipantsConfig = {
	maxParticipants: number | null
	maxWaitingList: number | null
	plannedParticipants: number | null
}

export type Public = {
	locale: string
	value: string
}

export type Employee = {
	resourceId: number
	resourceLabel: string
	available: boolean
	archived: boolean
	standIn: null
}
