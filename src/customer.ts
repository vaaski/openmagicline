import type { AxiosInstance } from "axios"

import type { Magicline, OMGL } from "../types"
import type { Openmagicline as mgl } from "."

export default class Customer {
  constructor(private axios: AxiosInstance, private mgl: mgl) {}

  defaultSearchOptions: Required<OMGL.Customer.SearchOptions> = {
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

  async search(searchString: string, options?: OMGL.Customer.SearchOptions) {
    const { data } = await this.axios.post("customersearch", {
      ...this.defaultSearchOptions,
      ...options,
      searchString,
    })

    return data as Magicline.Customer.SearchedCustomer[]
  }

  async getCards(customerID: OMGL.Customer.CustomerID) {
    const { data } = await this.axios(`customer/${customerID}/accessidentification`)

    return data as Magicline.Customer.AccessIdentification[]
  }

  /**
   * get contracts of a customer
   * @param customerId customer id
   * @param isActive get only active contracts (default: `true`)
   */
  contract = async (customerId: OMGL.Customer.CustomerID, isActive = true) => {
    const { data } = await this.axios.get("contract", {
      params: { customerId, isActive },
    })

    return data as Magicline.Customer.Contract[]
  }

  checkinConditions = async (customerId: number, organizationUnitId?: number) => {
    if (typeof organizationUnitId !== "number") {
      organizationUnitId = await this.mgl.util.getDefaultUnitID()
    }

    const { data } = await this.axios.get(`customer/${customerId}/conditions/checkin`, {
      params: { organizationUnitId },
    })

    return data as Magicline.Customer.CheckinCondition[]
  }

  benefits = async (
    customerId: OMGL.Customer.CustomerID,
    active: boolean | "both" = "both"
  ) => {
    const returnList: Magicline.Customer.Benefit[] = []

    if (active === true || active === "both") {
      const { data } = await this.axios.get("benefitaccount", {
        params: { customerId, active: true },
      })
      returnList.push(...data)
    }

    if (active === false || active === "both") {
      const { data } = await this.axios.get("benefitaccount", {
        params: { customerId, active: false },
      })
      returnList.push(...data)
    }

    return returnList
  }

  detailedBalance = async (customerId: OMGL.Customer.CustomerID) => {
    const { data } = await this.axios.get(`customer/${customerId}/balance/detailed`)

    return data as Magicline.Customer.DetailedBalance
  }

  // todo: implement card methods
  //? removed until more card methods are implemented
  // removeCard(
  //   customerID: Openmagicline.Customer.CustomerID,
  //   AccessIdentificationID: Openmagicline.Customer.AccessIdentificationID
  // ): Promise<Magicline.ErrorOrSuccess> {
  //   return this.got(`customer/${customerID}/accessidentification/${AccessIdentificationID}`, {
  //     method: "DELETE",
  //     searchParams: {
  //       optLockRemote: 0,
  //     },
  //   }).json()
  // }
}
