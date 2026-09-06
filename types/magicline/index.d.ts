export * as Appointments from "./appointments"
export * as Checkin from "./checkin"
export * as Classes from "./classes"
export * as Customer from "./customer"
export * as Leads from "./leads"
export * as Sales from "./sales"
export * as Socket from "./socket"

export type CurrentLocale = string
export type SupportedLocales = string[]
export type Success = {
	success: "true"
}
export type GenericError = {
	errorMessage: string
	errorCode: string
	args: unknown[]
	typedArgs: unknown[]
}

export type ErrorOrSuccess = Partial<Success> & GenericError[]

export type Permitted = {
	databaseId: null | number
	optlock: null | number
	name: string
	prefix: null | string
	type: number
	country: null | string
	colorHex: string
	currencyCode: string
	timeZone: string
	currency: {
		databaseId: null | number
		optlock: null | number
		unit: string
	}
	isTenantWithSingleStudio: boolean
	permitted: boolean
	listChildren: Permitted[]
	permissions: string[]
	isStudioLoginPermitted: boolean
}
export type Notices = unknown[]
export type AccountInfo = {
	firstname: string
	lastname: string
	fullName: string
	employeeId: number
	imageUrl: {
		url: string
		rewrite: boolean
	}
}
export type App = {
	app: string
	status: string
	values: {
		id?: number
		category: string
		tier?: string
		payment_provider_id?: string
	}
}
