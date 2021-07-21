import { join } from "path"
import { read, write } from "fs-jetpack"

import Openmagicline from "../src"

const tokenPath = join(__dirname, "../token.json")

const readToken = () => read(tokenPath, "json")
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
    console.log("logging in with existing token")
    try {
      await instance.login(token)
    } catch (error) {
      console.log("logging in with token threw, getting new token")
      await instance.login()
    }
  } else {
    console.log("getting new token")
    await instance.login()
  }

  if (instance.cookies) saveToken(instance.cookies)

  return instance
}
