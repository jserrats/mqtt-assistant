import { ZigbeeComponent, InboundZigbeeInfo } from "./zigbee"


class PowerZigbee extends ZigbeeComponent {
    setTopic = this.topic + "/set"
    state: boolean = false

    on() {
        this.set(true)
    }

    off() {
        this.set(false)
    }

    toggle() {
        this.set(!this.state)
    }

    private set(order: boolean) {
        this.client.publish(this.setTopic, order ? "ON" : "OFF")
    }

    updateComponent(message: InboundPowerZigbeeInfo): void {
        this.state = (message.state == "ON")
        super.updateComponent(message)
    }
}

/**
 * TRADFRI control outlet
 */
export class PowerE1603 extends PowerZigbee {

}

type InboundPowerZigbeeInfo = {
    state: string,
} & InboundZigbeeInfo

export class WattPowerZigbee extends PowerZigbee {
    power = 0
    updateComponent(message: InboundWattPowerZigbeeInfo): void {
        this.power = message.power
        super.updateComponent(message)
    }
}

type InboundWattPowerZigbeeInfo = {
    power: number,
} & InboundPowerZigbeeInfo
