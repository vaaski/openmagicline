import type mgl from "."
import type * as Openmagicline from "$/openmagicline"

import { permitted } from "./organization"

/**
 * Just like the native `Date` but with a localized ISOString method `toLocalISOString`.
 *
 * Magicline seems to use something like this.
 */
export class mDate extends Date {
  /**
   * @returns {string} Date as a string value in ISO format for the local Timezone.
   */
  toLocalISOString(): string {
    const offset = this.getTimezoneOffset() * 60e3
    const localTime = new Date(this.getTime() - offset)
    const iso = localTime.toISOString()

    return iso.slice(0, -1)
  }
}

export async function getDefaultUnitID(this: mgl): Promise<number> {
  const data = await permitted.call(this)

  //! idk if 1 or 0 is the default, my gym is 2 for some reason
  return data.listChildren[0].databaseId ?? 1
}
