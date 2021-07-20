import type { Got } from "got/dist/source"

import type * as Responses from "../types/magicline"

export default class Locale {
  constructor(private got: Got) {}

  currentLocale(): Promise<Responses.CurrentLocale> {
    return this.got("currentLocale").text()
  }

  supportedLocales(): Promise<Responses.SupportedLocales> {
    return this.got("supportedLocales").json()
  }
}
