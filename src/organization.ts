import type { AxiosInstance } from "axios"
import type { Openmagicline as mgl } from "."

import type { Magicline, unitID } from "../types"

export default class Organization {
  constructor(private axios: AxiosInstance, private mgl: mgl) {}

  async permitted(): Promise<Magicline.Permitted> {
    const { data } = await this.axios("organizationunit/permitted")
    return data
  }

  async accountInfo(): Promise<Magicline.AccountInfo> {
    const { data } = await this.axios("me/info")
    return data
  }

  async apps(unitID?: unitID): Promise<Magicline.App[]> {
    if (!unitID) unitID = await this.mgl.util.getDefaultUnitID()

    const { data } = await this.axios("app", {
      params: { organizationUnitId: unitID },
    })
    return data
  }
}
