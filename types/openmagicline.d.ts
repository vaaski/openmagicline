export * from "./customer"
export * from "./checkin"
export * from "./sales"

/**
 * the "organizationUnitId" used to identify different units for the same gym.
 * that's what i think what it is at least.
 *
 * if it's marked as optional it can be omitted for convenience, in which case it
 * falls back to the first listed unit, **but it *should* always be provided**.
 *
 * mine was 2 by default for some reason, you can find yours using `.permitted()`
 */
export type unitID = number
export interface Config {
  /**
   * the gym's url prefix
   *
   * when you access your dashboard via https://example.web.magicline.com
   * your url prefix will be `example`
   */
  gym: string
  /**
   * login username, making a dedicated account for API access is recommended.
   */
  username?: string
  /**
   * login password, making a dedicated account for API access is recommended.
   */
  password?: string
  // unitID?: number
}
