import type { AxiosInstance } from "axios"
import type mgl from "."

import type * as Responses from "../types/magicline"
import type * as Openmagicline from "../types/openmagicline"

import { DEFAULT_UNIT_ID } from "./constants"

export default class Checkin {
  constructor(private axios: AxiosInstance, private mgl: mgl) {}

  defaultListParams: Openmagicline.Checkin.ListOptions = {
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
  async list(
    options?: Openmagicline.Checkin.ListOptions
  ): Promise<Responses.Checkin.CheckinList> {
    let organizationUnitId = options?.organizationUnitId
    if (typeof organizationUnitId !== "number") {
      organizationUnitId = await this.mgl.util.getDefaultUnitID()
    }

    const { data } = await this.axios("checkin", {
      params: {
        ...this.defaultListParams,
        organizationUnitId,
        ...options,
      },
    })
    return data
  }

  private defaultCheckinParams: Openmagicline.Checkin.CheckinOptions = {
    customerCardNumber: null,
    customerUUID: "",
    fkCustomer: 0,
    fkDevice: null,
    fkOrganizationUnit: DEFAULT_UNIT_ID,
    lockerKey: "",
    purchasedContingentCode: null,
    databaseId: null,
    optlock: 0,
    requiredOrganizationUnitId: DEFAULT_UNIT_ID,
  }
  /**
   * check-in a customer
   */
  async checkin(
    options: Openmagicline.Checkin.CheckinOptions
  ): Promise<Responses.Checkin.CheckinResponse> {
    let unitID = options.requiredOrganizationUnitId ?? options.fkOrganizationUnit
    if (typeof unitID !== "number") {
      unitID = await this.mgl.util.getDefaultUnitID()
    }

    const { data } = await this.axios.post("checkin", {
      ...this.defaultCheckinParams,
      fkOrganizationUnit: unitID,
      requiredOrganizationUnitId: unitID,
      ...options,
    })
    return data
  }

  /**
   * check-out a customer
   * @param checkinId the ID of the checkin, **not** the customer ID
   * @param options optional object containing optLockRemote, not sure what it does
   */
  async checkout(
    checkinId: number,
    options?: Openmagicline.Checkin.CheckoutOptions
  ): Promise<Responses.Checkin.CheckinResponse> {
    const { data } = await this.axios.delete(`checkin/${checkinId}`, {
      params: { ...options },
    })
    return data
  }

  private defaultLockerKeyParams: Openmagicline.Checkin.LockerKeyOptions = {
    databaseId: null,
    optlock: 0,
  }
  async lockerKey(
    checkinId: number,
    lockerKey: number | string,
    options?: Openmagicline.Checkin.LockerKeyOptions
  ): Promise<Responses.Checkin.LockerKeyResponse> {
    const { data } = await this.axios.put(`checkin/lockerkey/${checkinId}`, {
      ...this.defaultLockerKeyParams,
      checkinId,
      lockerKey,
      ...options,
    })
    return data
  }
}
