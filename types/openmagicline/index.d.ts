import type { unitID } from ".."

export * as Appointments from "./appointments"
export * as Checkin from "./checkin"
export * as Classes from "./classes"
export * as Customer from "./customer"
export * as Sales from "./sales"

export type Config = {
	/**
	 * the gym's url prefix
	 *
	 * when you access your dashboard via https://example.web.magicline.com
	 * your url prefix will be `example`
	 */
	gym: string
	/**
	 * login username, making a dedicated account for API access is recommended.
	 */
	username?: string
	/**
	 * login password, making a dedicated account for API access is recommended.
	 */
	password?: string
	unitID?: unitID
}
