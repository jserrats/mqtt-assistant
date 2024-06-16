import { ESPHomeComponent } from "./esphome"
import { router } from "../../router"
import { Automation, Trigger } from "../../types"

export class BinarySensorESPHome extends ESPHomeComponent {
    sensorTopic: string
    state: boolean = false
    updater: Automation

    trigger = {
        on: { topic: "", payload: "ON" },
        off: { topic: "", payload: "OFF" },
        all: { topic: "", payload: "*" }
    }

    constructor(name: string, component: string) {
        super(name)
        this.sensorTopic = this.topic + "/binary_sensor/" + component + "/state"
        this.trigger.off.topic = this.sensorTopic
        this.trigger.on.topic = this.sensorTopic
        this.trigger.all.topic = this.sensorTopic
        this.updater = {
            trigger: { topic: this.topic, payload: "*" }, callback: (message: Trigger) => {
                this.updateComponent(message.payload)
            }
        }
        router.addAutomation(this.updater)
    }

    updateComponent(message: string) {
        this.state = (message == "ON")
    }
}

export class ContactSensorESPHome extends BinarySensorESPHome {
    contact = false

    updateComponent(message: string) {
        this.contact = (message == "ON")
    }
}