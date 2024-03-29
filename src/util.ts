import type { AxiosInstance } from "axios"
import type { Openmagicline as mgl } from "."

import type { unitID } from "../types"

import FormData from "form-data"
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
  constructor(private axios: AxiosInstance, private mgl: mgl) {}

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

type AxiosHeaders = Record<string, string>
export const headers = (mgl: mgl): AxiosHeaders => {
  const u = new URL(mgl.baseUrl)

  const returnValue: AxiosHeaders = {
    authority: u.hostname,
    "sec-ch-ua": `"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"`,
    accept: `application/json, text/javascript, */*; q=0.01`,
    "x-requested-with": `XMLHttpRequest`,
    "sec-ch-ua-mobile": `?0`,
    "user-agent": `Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36`,
    origin: u.href,
    "sec-fetch-site": `same-origin`,
    "sec-fetch-mode": `cors`,
    "sec-fetch-dest": `empty`,
    referer: u.href,
    "accept-language": `en-CA,en-US;q=0.9,en;q=0.8,de-DE;q=0.7,de;q=0.6,en-GB;q=0.5`,
  }

  if (mgl.cookies) returnValue.cookie = mgl.cookies.join("")
  return returnValue
}

export const websocketHeaders = (mgl: mgl): AxiosHeaders => {
  const u = new URL(mgl.baseUrl)

  const returnValue: AxiosHeaders = {
    Pragma: "no-cache",
    Origin: u.href,
    "Accept-Language": "en-CA,en-US;q=0.9,en;q=0.8,de-DE;q=0.7,de;q=0.6,en-GB;q=0.5",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    "Cache-Control": "no-cache",
  }

  if (mgl.cookies) returnValue.cookie = mgl.cookies.join("")
  return returnValue
}

export const formData = (data: Record<string, string>): FormData => {
  const form = new FormData()
  for (const [key, value] of Object.entries(data)) form.append(key, value)
  return form
}

export const searchParameters = (data: Record<string, string>): URLSearchParams => {
  const parameters = new URLSearchParams()
  for (const [key, value] of Object.entries(data)) parameters.set(key, value)
  return parameters
}
