import type { $Fetch } from "ofetch"

import type { Magicline, OMGL } from "../types"
import type { Openmagicline as mgl } from "."

export default class Customer {
	constructor(
		private fetch: $Fetch,
		private mgl: mgl,
	) {}

	private readonly defaultSearchOptions: OMGL.Customer.SearchOptions = {
		facility: 0,
		searchInName: true,
		searchInCustomerNumber: true,
		searchInAddress: false,
		searchInBankAccount: false,
		searchInCardNumber: false,
		searchInLockerKey: false,
		searchInPurchasedContingentCode: false,
		showAllFacilities: true,
		showCheckedIn: false,
		showOnlyMembers: false,
	}

	/**
	 * Search for customers.
	 *
	 * You will probably want to set `facility` to the unitID of the gym.
	 */
	public search = async (
		searchString: string,
		options?: Partial<OMGL.Customer.SearchOptions>,
	) => {
		return await this.fetch<Magicline.Customer.SearchedCustomer[]>(
			"/customersearch",
			{
				method: "POST",
				body: {
					...this.defaultSearchOptions,
					...options,
					searchString,
				},
			},
		)
	}

	/**
	 * Get the cards of a customer.
	 */
	getCards = async (customerID: OMGL.Customer.CustomerID) => {
		return await this.fetch<Magicline.Customer.AccessIdentification[]>(
			`/customer/${customerID}/accessidentification`,
		)
	}

	/**
	 * get contracts of a customer
	 * @param customerId customer id
	 * @param isActive get only active contracts (default: `true`)
	 */
	getContracts = async (
		customerId: OMGL.Customer.CustomerID,
		isActive = true,
	) => {
		return await this.fetch<Magicline.Customer.Contract[]>("/contract", {
			query: { customerId, isActive },
		})
	}

	checkinConditions = async (
		customerId: number,
		organizationUnitId?: number,
	) => {
		const unitID = organizationUnitId ?? (await this.mgl.unitID)

		return await this.fetch<Magicline.Customer.CheckinCondition[]>(
			`/customer/${customerId}/conditions/checkin`,
			{
				query: { organizationUnitId: unitID },
			},
		)
	}

	benefits = async (
		customerId: OMGL.Customer.CustomerID,
		active: boolean | "both" = "both",
	) => {
		const returnList: Magicline.Customer.Benefit[] = []

		if (active === "both" || active === true) {
			const data = await this.fetch<Magicline.Customer.Benefit[]>(
				"/benefitaccount",
				{
					query: { customerId, active: true },
				},
			)
			returnList.push(...data)
		}

		if (active === "both" || active === false) {
			const data = await this.fetch<Magicline.Customer.Benefit[]>(
				"/benefitaccount",
				{
					query: { customerId, active: false },
				},
			)
			returnList.push(...data)
		}

		return returnList
	}

	detailedBalance = async (customerId: OMGL.Customer.CustomerID) => {
		return await this.fetch<Magicline.Customer.DetailedBalance>(
			`/customer/${customerId}/balance/detailed`,
		)
	}

	getAssignableTagIDs = async (facilityId: number) => {
		return this.fetch<Magicline.Customer.CustomerTagID[]>(
			`/customer-tag/assignable/simple?facilityIds=${facilityId}`,
		)
	}

	setTagIDs = async (customerId: OMGL.Customer.CustomerID, IDs: number[]) => {
		return this.fetch<{ success: "true" }>(
			`/customer/${customerId}/customer-tag/ids`,
			{
				body: IDs,
				method: "PUT",
			},
		)
	}
}
