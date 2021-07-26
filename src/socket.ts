import type mgl from "."
import type { unitID } from "../types/openmagicline"

import { _log } from "."
import { Client } from "@stomp/stompjs"
import { websocketHeaders } from "./util"

import WebSocket from "ws"

type CallbackFn = (data: Record<string, any>) => void

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
      onWebSocketError: err => {
        throw err
      },
      onStompError: err => {
        throw err
      },
    })
  }

  subscriptions: Record<string, false | (() => void)> = {}

  activate(): Promise<unknown> {
    if (this.isActive) return this.isActive

    this.isActive = new Promise(res => {
      this.client.onConnect = res
      this.client.activate()
    })

    return this.isActive
  }

  deactivate(): Promise<void> {
    this.log("deactivating STOMP")
    return this.client.deactivate()
  }

  private deactivateIfNoSubscriptions() {
    const subs = Object.values(this.subscriptions).filter(s => s && typeof s === "function")
    if (!subs.length) this.deactivate()
    else this.log("there are still active subscriptions, keeping stomp active")
  }

  private subscribeFactory = (topic: string) => async (cb: CallbackFn) => {
    await this.activate()
    this.client.subscribe(topic, ({ body }) => cb(JSON.parse(body)))
    this.log(`subscribed to "${topic}"`)

    this.subscriptions[topic] = () => {
      this.client.unsubscribe(topic)
      this.subscriptions[topic] = false
      this.deactivateIfNoSubscriptions()
    }
    return this.subscriptions[topic]
  }

  checkin = this.subscribeFactory("/user/topic/checkin")
}
