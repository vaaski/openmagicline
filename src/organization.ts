import type { $Fetch } from "ofetch"
import type { Openmagicline as mgl } from "."

import type { Magicline, unitID } from "../types"

export default class Organization {
  constructor(private fetch: $Fetch, private mgl: mgl) {}

  async permitted() {
    return await this.fetch<Magicline.Permitted>("/organizationunit/permitted")
  }

  async accountInfo() {
    return await this.fetch<Magicline.AccountInfo>("/me/info")
  }

  async apps(unitID?: unitID) {
    if (!unitID) unitID = await this.mgl.util.getDefaultUnitID()

    return await this.fetch<Magicline.App[]>("/app", {
      query: { organizationUnitId: unitID },
    })
  }
}
