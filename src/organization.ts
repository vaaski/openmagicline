import type { AxiosInstance } from "axios"
import type mgl from "."

import type * as Responses from "../types/magicline"
import type * as Openmagicline from "../types/openmagicline"

export default class Organization {
  constructor(private axios: AxiosInstance, private mgl: mgl) {}

  async permitted(): Promise<Responses.Permitted> {
    const { data } = await this.axios("organizationunit/permitted")
    return data
  }

  async accountInfo(): Promise<Responses.AccountInfo> {
    const { data } = await this.axios("me/info")
    return data
  }

  async apps(unitID?: Openmagicline.unitID): Promise<Responses.App[]> {
    if (!unitID) unitID = await this.mgl.util.getDefaultUnitID()

    const { data } = await this.axios("app", {
      params: { organizationUnitId: unitID },
    })
    return data
  }
}
