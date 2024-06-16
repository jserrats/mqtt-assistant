import { ZigbeeComponent, InboundZigbeeInfo } from "./zigbee"
import { Trigger } from "../../types"

export class PresenceSensorZigbee extends ZigbeeComponent {
    occupancy = false
    actionTopic = this.topic + "/action"
    trigger = {
        occupied: { topic: this.actionTopic, payload: "ON" },
        cleared: { topic: this.actionTopic, payload: "OFF" },
        all: { topic: this.actionTopic, payload: "*" }
    }


    updateComponent(message: PresenceSensorZigbeeComponentInfo): void {
        if (this.occupancy == !message.occupancy) { this.triggerItself() }
        this.occupancy = message.occupancy
        super.updateComponent(message)
    }

    triggerItself() {
        this.client.publish(this.actionTopic, !this.occupancy ? "ON" : "OFF")
    }

}

type PresenceSensorZigbeeComponentInfo = {
    occupancy: boolean
} & InboundZigbeeInfo


export class ContactSensorZigbee extends ZigbeeComponent {
    contact = false
    private inverted = false
    private actionTopic = this.topic + "/action"
    trigger = {
        whenClosed: { topic: this.actionTopic, payload: "CLOSED" },
        whenOpened: { topic: this.actionTopic, payload: "OPEN" },
        all: { topic: this.actionTopic, payload: "*" }
    }

    constructor(name: string, options?: ClosureSensorZigbeeOptions) {
        super(name)
        if (typeof options !== "undefined" && typeof options.inverted !== "undefined") {
            this.inverted = options.inverted
        }
    }

    updateComponent(message: ClosureSensorZigbeeComponentInfo): void {
        if (this.contact !== !(message.contact === this.inverted)) {
            this.contact = !this.contact
            this.triggerItself(this.contact)

        }
        super.updateComponent(message)
    }

    private triggerItself(contact: boolean) {
        this.client.publish(this.actionTopic, !contact ? "OPEN" : "CLOSED")
    }

}

type ClosureSensorZigbeeComponentInfo = {
    contact: boolean
} & InboundZigbeeInfo

type ClosureSensorZigbeeOptions = {
    inverted?: boolean
}