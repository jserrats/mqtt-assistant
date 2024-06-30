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
            callback: (message: Trigger) => {
                try {
                    this.updateComponent(JSON.parse(message.payload))
                } catch (error) {
                    let error_message = 'Unknown Error'
                    if (error instanceof Error) error_message = error.message
                    console.error(
                        `[!] Error while parsing message:
                            TOPIC: ${message.topic}
                            PAYLOAD: ${message.payload}
                            ERROR: ${error_message}`);
                }
            }
        })
    }

    protected updateComponent(message: InboundZigbeeInfo) {
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