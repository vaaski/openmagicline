import type { Got } from "got/dist/source"
import type mgl from "."

//? this was for checkin slots, which i don't currently use.
// /**
//  * Just like the native `Date` but with a localized ISOString method `toLocalISOString`.
//  *
//  * Magicline seems to use something like this.
//  */
// export class mDate extends Date {
//   /**
//    * @returns {string} Date as a string value in ISO format for the local Timezone.
//    */
//   toLocalISOString(): string {
//     const offset = this.getTimezoneOffset() * 60e3
//     const localTime = new Date(this.getTime() - offset)
//     const iso = localTime.toISOString()

//     return iso.slice(0, -1)
//   }
// }

export default class Util {
  constructor(private got: Got, private mgl: mgl) {}

  async getDefaultUnitID(): Promise<number> {
    const data = await this.mgl.organization.permitted()

    //! idk if 1 or 0 is the default, my gym is 2 for some reason
    return data.listChildren[0].databaseId ?? 1
  }

  /**
   * check if the login token works.
   */
  async testLogin(): Promise<boolean> {
    try {
      await this.mgl.locale.currentLocale()
      return true
    } catch {
      return false
    }
  }
}
