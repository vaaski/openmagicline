import type { AxiosInstance } from "axios"

import type * as Responses from "../types/magicline"

export default class Locale {
  constructor(private axios: AxiosInstance) {}

  async currentLocale(): Promise<Responses.CurrentLocale> {
    const { data } = await this.axios.get("currentLocale")
    return data
  }

  async supportedLocales(): Promise<Responses.SupportedLocales> {
    const { data } = await this.axios.get("supportedLocales")
    return data
  }
}
