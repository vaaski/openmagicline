import type mgl from "."
import type * as Responses from "$/magicline/responses"
import type * as Openmagicline from "$/openmagicline"

const defaultSearchOptions: Required<Openmagicline.Customer.Search> = {
  searchString: "",
  facility: 0,
  searchInAddress: false,
  searchInBankAccount: false,
  searchInCardNumber: false,
  searchInCustomerNumber: true,
  searchInLockerKey: false,
  searchInName: true,
  searchInPurchasedContingentCode: false,
  showAllFacilities: true,
  showCheckedIn: false,
  showOnlyMembers: false,
}

export function search(
  this: mgl,
  options: Openmagicline.Customer.Search
): Promise<Responses.Customer.SearchedCustomer[]> {
  return this.got("customersearch", {
    method: "POST",
    json: { ...defaultSearchOptions, ...options },
  }).json()
}
