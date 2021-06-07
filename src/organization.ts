import type mgl from "."
import type { Responses } from "../types/magicline"
import type { Openmagicline } from "../types/openmagicline"

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
  if (!unitID) {
    const data = await permitted.call(this)

    //! idk if 1 or 0 is the default, my gym is 2 for some reason
    unitID = data.listChildren[0].databaseId ?? 1
  }
  return this.got("app", {
    searchParams: {
      organizationUnitId: unitID,
    },
  }).json()
}
