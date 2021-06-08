import type mgl from "."
import { permitted } from "./organization"

export async function getDefaultUnitID(this: mgl): Promise<number> {
  const data = await permitted.call(this)

  //! idk if 1 or 0 is the default, my gym is 2 for some reason
  return data.listChildren[0].databaseId ?? 1
}
