import type mgl from "."
import type * as Responses from "$/magicline/responses"
import type * as Openmagicline from "$/openmagicline"
import { getDefaultUnitID } from "./util"

export function permitted(this: mgl): Promise<Responses.Permitted> {
  return this.got("organizationunit/permitted").json()
}

export function notices(this: mgl): Promise<Responses.Notices> {
  return this.got("notices").json()
}

export function accountInfo(this: mgl): Promise<Responses.AccountInfo> {
  return this.got("me/info").json()
}

export async function apps(
  this: mgl,
  unitID?: Openmagicline.unitID
): Promise<Responses.App[]> {
  if (!unitID) unitID = await getDefaultUnitID.call(this)

  return this.got("app", {
    searchParams: {
      organizationUnitId: unitID,
    },
  }).json()
}
