import type { Got } from "got/dist/source"

import type * as Responses from "../types/magicline"
import type * as Openmagicline from "../types/openmagicline"

const defaultSearchOptions: Required<Openmagicline.Customer.Search> = {
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

export default class Customer {
  constructor(private got: Got) {}

  search(
    searchString: string,
    options?: Openmagicline.Customer.Search
  ): Promise<Responses.Customer.SearchedCustomer[]> {
    return this.got("customersearch", {
      method: "POST",
      json: {
        ...defaultSearchOptions,
        ...options,
        searchString,
      },
    }).json()
  }

  getCards(
    customerID: Openmagicline.Customer.CustomerID
  ): Promise<Responses.Customer.AccessIdentification[]> {
    return this.got(`customer/${customerID}/accessidentification`).json()
  }

  removeCard(
    customerID: Openmagicline.Customer.CustomerID,
    AccessIdentificationID: Openmagicline.Customer.AccessIdentificationID
  ): Promise<Responses.ErrorOrSuccess> {
    return this.got(`customer/${customerID}/accessidentification/${AccessIdentificationID}`, {
      method: "DELETE",
      searchParams: {
        optLockRemote: 0,
      },
    }).json()
  }
}
