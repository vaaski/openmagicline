import type { Got } from "got/dist/source"
import type mgl from "."

import type * as Responses from "../types/magicline"
import type * as Openmagicline from "../types/openmagicline"

import { DEFAULT_UNIT_ID } from "./constants"

export default class Checkin {
  constructor(private got: Got, private mgl: mgl) {}

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
  async list(
    options?: Openmagicline.Checkin.ListOptions
  ): Promise<Responses.Checkin.CheckinList> {
    let organizationUnitId = options?.organizationUnitId
    if (typeof organizationUnitId !== "number") {
      organizationUnitId = await this.mgl.util.getDefaultUnitID()
    }

    return this.got("checkin", {
      searchParams: {
        ...this.defaultListParams,
        organizationUnitId,
        ...options,
      },
    }).json()
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
  async checkin(
    options: Openmagicline.Checkin.CheckinOptions
  ): Promise<Responses.Checkin.CheckinResponse> {
    let unitID = options.requiredOrganizationUnitId ?? options.fkOrganizationUnit
    if (typeof unitID !== "number") {
      unitID = await this.mgl.util.getDefaultUnitID()
    }

    return this.got("checkin", {
      method: "POST",
      json: {
        ...this.defaultCheckinParams,
        fkOrganizationUnit: unitID,
        requiredOrganizationUnitId: unitID,
        ...options,
      },
    }).json()
  }
}