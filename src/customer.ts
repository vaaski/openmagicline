import type mgl from "."
import type * as Responses from "../types/magicline"
import type * as Openmagicline from "../types/openmagicline"

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

export function getCards(
  this: mgl,
  customerID: Openmagicline.Customer.CustomerID
): Promise<Responses.Customer.AccessIdentification[]> {
  return this.got(`customer/${customerID}/accessidentification`).json()
}

export function removeCard(
  this: mgl,
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
