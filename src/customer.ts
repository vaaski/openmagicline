import type { AxiosInstance } from "axios"

import type * as Responses from "../types/magicline"
import type * as Openmagicline from "../types/openmagicline"
import type mgl from "."

export default class Customer {
  constructor(private axios: AxiosInstance, private mgl: mgl) {}

  defaultSearchOptions: Required<Openmagicline.Customer.SearchOptions> = {
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

  async search(
    searchString: string,
    options?: Openmagicline.Customer.SearchOptions
  ): Promise<Responses.Customer.SearchedCustomer[]> {
    const { data } = await this.axios.post("customersearch", {
      ...this.defaultSearchOptions,
      ...options,
      searchString,
    })
    return data
  }

  async getCards(
    customerID: Openmagicline.Customer.CustomerID
  ): Promise<Responses.Customer.AccessIdentification[]> {
    const { data } = await this.axios(`customer/${customerID}/accessidentification`)
    return data
  }

  /**
   * get contracts of a customer
   * @param customerId customer id
   * @param isActive get only active contracts (default: `true`)
   */
  contract = async (customerId: Openmagicline.Customer.CustomerID, isActive = true) => {
    const { data } = await this.axios.get("contract", {
      params: { customerId, isActive },
    })

    return data as Responses.Customer.Contract[]
  }

  checkinConditions = async (customerId: number, organizationUnitId?: number) => {
    if (typeof organizationUnitId !== "number") {
      organizationUnitId = await this.mgl.util.getDefaultUnitID()
    }

    const { data } = await this.axios.get(`customer/${customerId}/conditions/checkin`, {
      params: { organizationUnitId },
    })

    return data as Responses.Customer.CheckinCondition[]
  }

  // todo: implement card methods
  //? removed until more card methods are implemented
  // removeCard(
  //   customerID: Openmagicline.Customer.CustomerID,
  //   AccessIdentificationID: Openmagicline.Customer.AccessIdentificationID
  // ): Promise<Responses.ErrorOrSuccess> {
  //   return this.got(`customer/${customerID}/accessidentification/${AccessIdentificationID}`, {
  //     method: "DELETE",
  //     searchParams: {
  //       optLockRemote: 0,
  //     },
  //   }).json()
  // }
}
