import type { Got, Headers } from "got/dist/source"
import type mgl from "."
import { unitID } from "../types/openmagicline"
import { DEFAULT_UNIT_ID } from "./constants"

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

  async getDefaultUnitID(): Promise<unitID> {
    const data = await this.mgl.organization.permitted()

    /* istanbul ignore next */
    return data.listChildren[0].databaseId ?? DEFAULT_UNIT_ID
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

export const headers = (mgl: mgl): Headers => {
  const u = new URL(mgl.baseUrl)

  return {
    authority: u.hostname,
    "sec-ch-ua": `" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"`,
    accept: `application/json, text/javascript, */*; q=0.01`,
    "x-requested-with": `XMLHttpRequest`,
    "sec-ch-ua-mobile": `?0`,
    "user-agent": `Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36`,
    origin: u.href,
    "sec-fetch-site": `same-origin`,
    "sec-fetch-mode": `cors`,
    "sec-fetch-dest": `empty`,
    referer: u.href,
    "accept-language": `en-CA,en-US;q=0.9,en;q=0.8,de-DE;q=0.7,de;q=0.6,en-GB;q=0.5`,
    cookie: mgl.cookies,
  }
}

export const websocketHeaders = (mgl: mgl): Headers => {
  const u = new URL(mgl.baseUrl)

  return {
    Pragma: "no-cache",
    Origin: u.href,
    "Accept-Language": "en-CA,en-US;q=0.9,en;q=0.8,de-DE;q=0.7,de;q=0.6,en-GB;q=0.5",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36",
    "Cache-Control": "no-cache",
    cookie: mgl.cookies,
  }
}
