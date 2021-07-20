import type { Got } from "got/dist/source"
import type mgl from "."

import type * as Responses from "../types/magicline"
import type * as Openmagicline from "../types/openmagicline"

export default class Organization {
  constructor(private got: Got, private mgl: mgl) {}

  permitted(): Promise<Responses.Permitted> {
    return this.got("organizationunit/permitted").json()
  }

  notices(): Promise<Responses.Notices> {
    return this.got("notices").json()
  }

  accountInfo(): Promise<Responses.AccountInfo> {
    return this.got("me/info").json()
  }

  async apps(unitID?: Openmagicline.unitID): Promise<Responses.App[]> {
    if (!unitID) unitID = await this.mgl.util.getDefaultUnitID()

    return this.got("app", {
      searchParams: {
        organizationUnitId: unitID,
      },
    }).json()
  }
}
