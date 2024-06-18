import { ZIGBEE2MQTT_TOPIC } from "../../topics"

import { router } from "../../router"
import { Component } from "../component"
import { Trigger } from "../../types"

export class ZigbeeComponent extends Component {
    topic: string
    linkquality = 0
    name: string

    constructor(name: string) {
        super()
        this.name = name
        this.topic = ZIGBEE2MQTT_TOPIC + name
        router.addAutomation({
            trigger: { topic: this.topic, payload: "*" },
            callback: (message: Trigger) => { this.updateComponent(JSON.parse(message.payload)) }
        })
    }
    updateComponent(message: InboundZigbeeInfo) {
        this.linkquality = message["linkquality"]
    }
}

// Workaround to not flood with retained messages at startup
// var noRetained = false
// setTimeout(() => { noRetained = true; }, 1000)
// router.addAutomation({
//     trigger: { topic: ZIGBEE2MQTT_TOPIC + "/*/availability", payload: "*" },
//     callback: (message: Trigger) => {
//         if (noRetained) { Telegram.send("[!] Zigbee component " + message.topic + " status: " + message.payload) }
//     }
// })

export type InboundZigbeeInfo = {
    linkquality: number,
}