import type mgl from "."
import type * as Responses from "$/magicline"

export function currentLocale(this: mgl): Promise<Responses.CurrentLocale> {
  return this.got("currentLocale").text()
}

export function supportedLocales(this: mgl): Promise<Responses.SupportedLocales> {
  return this.got("supportedLocales").json()
}
