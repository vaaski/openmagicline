import { join } from "path"
import { read, write } from "fs-jetpack"

import Openmagicline from "../src"

const tokenPath = join(__dirname, "../token.json")

const readToken = (): string[] => read(tokenPath, "json")
const saveToken = (token: string[]) => write(tokenPath, token)

export const config = {
  gym: process.env.OPENMAGICLINE_GYM ?? "",
  username: process.env.OPENMAGICLINE_USERNAME ?? "",
  password: process.env.OPENMAGICLINE_PASSWORD ?? "",
}

export default async (): Promise<Openmagicline> => {
  const token = readToken()

  const instance = new Openmagicline(config)

  if (token) {
    try {
      await instance.login(token)
    } catch (error) {
      console.log("getting new token because the existing was invalid")
      await instance.login()
    }
  } else {
    console.log("getting new token")
    await instance.login()
  }

  if (instance.cookies) saveToken(instance.cookies)

  return instance
}

const randomNumber = (m = 0, M = 1) => Math.random() * (M - m) + m
/**
 * magicline starts to return 429s pretty early i think.
 * we delay calls randomly by 1-3 seconds to avoid this.
 */
export const delay = (): Promise<void> => {
  return new Promise(r => {
    const delay = Math.floor(randomNumber(1e3, 3e3))
    setTimeout(r, delay)
  })
}
