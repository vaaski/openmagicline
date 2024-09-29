import type { $Fetch } from "ofetch"

import type { Openmagicline as mgl } from "."
import type { Magicline, OMGL } from "../types"

import { DEFAULT_UNIT_ID } from "./constants"

export default class Checkin {
	constructor(
		private fetch: $Fetch,
		private mgl: mgl,
	) {}

	#checkinMemberMap = new Map<number, number>()
	/** map of `customerID` -> `checkinID` */
	get checkinMemberMap() {
		return this.#checkinMemberMap
	}

	private readonly defaultListParams: OMGL.Checkin.ListOptions = {
		organizationUnitId: DEFAULT_UNIT_ID,
		checkouts: false,
		offset: 0,
		maxResults: 25,
		search: "",
		filter: "",
		sortedby: "checkinTime",
		direction: "DESCENDING",
	}
	/**
	 * list all checked-in customers
	 * @param options filter, sort, etc.
	 */
	list = async (options?: Partial<OMGL.Checkin.ListOptions>) => {
		let organizationUnitId = options?.organizationUnitId
		if (typeof organizationUnitId !== "number") {
			organizationUnitId = await this.mgl.util.getDefaultUnitID()
		}

		const result = await this.fetch<Magicline.Checkin.CheckinList>("/checkin", {
			query: {
				...this.defaultListParams,
				organizationUnitId,
				...options,
			},
		})

		for (const checkin of result.checkins) {
			this.#checkinMemberMap.set(checkin.customerId, checkin.databaseId)
		}

		return result
	}

	private readonly defaultCheckinParams: OMGL.Checkin.CheckinOptions = {
		customerCardNumber: undefined,
		customerUUID: "",
		fkCustomer: 0,
		fkDevice: undefined,
		fkOrganizationUnit: DEFAULT_UNIT_ID,
		lockerKey: "",
		purchasedContingentCode: undefined,
		databaseId: undefined,
		optlock: 0,
		requiredOrganizationUnitId: DEFAULT_UNIT_ID,
	}

	/**
	 * check-in a customer
	 */
	checkin = async (
		options: Partial<OMGL.Checkin.CheckinOptions> &
			Pick<OMGL.Checkin.CheckinOptions, "fkCustomer">,
	) => {
		let unitID =
			options.requiredOrganizationUnitId ?? options.fkOrganizationUnit
		if (typeof unitID !== "number") {
			unitID = await this.mgl.util.getDefaultUnitID()
		}

		return await this.fetch<Magicline.Checkin.CheckinResponse>("/checkin", {
			method: "POST",
			body: {
				...this.defaultCheckinParams,
				fkOrganizationUnit: unitID,
				requiredOrganizationUnitId: unitID,
				...options,
			},
		})
	}

	/**
	 * check-out a customer
	 * @param checkinId the ID of the checkin, **not** the customer ID
	 * @param options optional object containing optLockRemote, not sure what it does
	 */
	checkout = async (
		checkinId: number,
		options?: OMGL.Checkin.CheckoutOptions,
	) => {
		return await this.fetch<Magicline.Checkin.CheckinResponse>(
			`/checkin/${checkinId}`,
			{
				method: "DELETE",
				query: options,
			},
		)
	}

	checkoutByCustomerID = async (customerID: number) => {
		let checkinID = this.#checkinMemberMap.get(customerID)

		if (!checkinID) {
			await this.list({ maxResults: 100 })
			checkinID = this.#checkinMemberMap.get(customerID)
		}

		if (!checkinID) throw new Error("customerID not found in checkinMemberMap")

		const checkout = this.checkout(checkinID)
		this.#checkinMemberMap.delete(customerID)

		return checkout
	}

	private readonly defaultLockerKeyParams: OMGL.Checkin.LockerKeyOptions = {
		databaseId: undefined,
		optlock: 0,
	}
	changeLockerKey = async (
		checkinId: number,
		lockerKey: number | string,
		options?: OMGL.Checkin.LockerKeyOptions,
	) => {
		return await this.fetch<Magicline.Checkin.LockerKeyResponse>(
			`/checkin/lockerkey/${checkinId}`,
			{
				method: "PUT",
				body: {
					...this.defaultLockerKeyParams,
					...options,
					checkinId,
					lockerKey,
				},
			},
		)
	}
}
