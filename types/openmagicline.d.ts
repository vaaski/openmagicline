export namespace Openmagicline {
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
    username: string
    /**
     * login password, making a dedicated account for API access is recommended.
     */
    password: string
    unitID?: number
  }
}
