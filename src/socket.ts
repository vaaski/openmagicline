import type { Openmagicline as mgl } from "."

import type { unitID } from "../types"
import type { Magicline } from "."

import { _log } from "."
import { Client } from "@stomp/stompjs"
import { websocketHeaders } from "./util"

import WebSocket from "ws"

export default class MagicSocket {
  private client: Client
  private log = _log.extend("socket")

  public isActive: false | Promise<unknown> = false

  private webSocketFactory = (baseUrl: string, unitID: unitID) => () => {
    const socketURL = new URL(baseUrl)
    socketURL.protocol = "wss:"
    socketURL.pathname = "ws"
    socketURL.searchParams.set("organizationUnitId", unitID.toString())
    this.log(`connecting to ${socketURL.href}`)

    return new WebSocket(socketURL.href, [], {
      headers: websocketHeaders(this.mgl),
    })
  }

  constructor(private mgl: mgl, unitID: unitID) {
    this.client = new Client({
      debug: this.log,
      heartbeatIncoming: 10_000,
      heartbeatOutgoing: 10_000,
      webSocketFactory: this.webSocketFactory(mgl.baseUrl, unitID),

      onWebSocketError: /* istanbul ignore next */ error => {
        console.log(error.target._req.res)
        throw error
      },
      onStompError: /* istanbul ignore next */ error => {
        throw error
      },
    })
  }

  subscriptions: Record<string, Magicline.Socket.UnsubscribeFunction> = {}

  activate(): Promise<unknown> {
    if (this.isActive) return this.isActive

    this.isActive = new Promise(resolve => {
      this.client.onConnect = resolve
      this.client.activate()
    })

    return this.isActive
  }

  unsubscribeAll(): Promise<void> {
    for (const [key, unsubscribe] of Object.entries(this.subscriptions)) {
      unsubscribe()
      delete this.subscriptions[key]
    }
    return this.deactivate()
  }

  deactivate(): Promise<void> {
    this.log("deactivating STOMP")
    this.isActive = false
    return this.client.deactivate()
  }

  private deactivateAutomatically() {
    /* istanbul ignore else */
    if (Object.entries(this.subscriptions).length === 0) this.deactivate()
    else this.log("there are still active subscriptions, keeping stomp active")
  }

  /* eslint-disable @typescript-eslint/indent */
  private subscribeFactory =
    <T>(topic: string) =>
    async (callback: Magicline.Socket.CallbackFunction<T>) => {
      await this.activate()
      this.client.subscribe(topic, ({ body }) => callback(JSON.parse(body)))
      this.log(`subscribed to "${topic}"`)

      const unsubscribe = () => {
        this.client.unsubscribe(topic)
        delete this.subscriptions[topic]
        this.deactivateAutomatically()
      }
      this.subscriptions[topic] = unsubscribe
      return this.subscriptions[topic]
    }
  /* eslint-enable @typescript-eslint/indent */

  onCheckin = this.subscribeFactory<Magicline.Socket.CheckinEvent>("/user/topic/checkin")
}
