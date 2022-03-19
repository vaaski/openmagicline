import type mgl from "."
import type { unitID } from "../types/openmagicline"
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
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      webSocketFactory: this.webSocketFactory(mgl.baseUrl, unitID),

      onWebSocketError: /* istanbul ignore next */ err => {
        console.log(err.target._req.res)
        throw err
      },
      onStompError: /* istanbul ignore next */ err => {
        throw err
      },
    })
  }

  subscriptions: Record<string, Magicline.Socket.UnsubscribeFn> = {}

  activate(): Promise<unknown> {
    if (this.isActive) return this.isActive

    this.isActive = new Promise(res => {
      this.client.onConnect = res
      this.client.activate()
    })

    return this.isActive
  }

  unsubscribeAll(): Promise<void> {
    Object.entries(this.subscriptions).forEach(([key, unsubscribe]) => {
      unsubscribe()
      delete this.subscriptions[key]
    })
    return this.deactivate()
  }

  deactivate(): Promise<void> {
    this.log("deactivating STOMP")
    this.isActive = false
    return this.client.deactivate()
  }

  private deactivateAutomatically() {
    /* istanbul ignore else */
    if (!this.subscriptions.length) this.deactivate()
    else this.log("there are still active subscriptions, keeping stomp active")
  }

  /* eslint-disable @typescript-eslint/indent */
  private subscribeFactory =
    <T = Record<string, any>>(topic: string) =>
    async (cb: Magicline.Socket.CallbackFn<T>) => {
      await this.activate()
      this.client.subscribe(topic, ({ body }) => cb(JSON.parse(body)))
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
