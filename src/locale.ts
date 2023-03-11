import type { AxiosInstance } from "axios"

import type { Magicline } from "../types"

export default class Locale {
  constructor(private axios: AxiosInstance) {}

  async currentLocale(): Promise<Magicline.CurrentLocale> {
    const { data } = await this.axios.get("currentLocale")
    return data
  }

  async supportedLocales(): Promise<Magicline.SupportedLocales> {
    const { data } = await this.axios.get("supportedLocales")
    return data
  }
}
