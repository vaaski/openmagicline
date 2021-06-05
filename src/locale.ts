import type openmagicline from "."
import type { Magicline } from "../types/magicline"

export async function currentLocale(
  this: openmagicline
): Promise<Magicline.Responses.CurrentLocale> {
  return await this.got("currentLocale").text()
}

export async function supportedLocales(
  this: openmagicline
): Promise<Magicline.Responses.SupportedLocales> {
  return await this.got("supportedLocales").json()
}
