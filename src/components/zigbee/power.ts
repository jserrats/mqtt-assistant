import { ZigbeeComponent, InboundZigbeeInfo } from "./zigbee"
import { Timer, TimerLength } from "../timer"

class PowerZigbee extends ZigbeeComponent {
    setTopic = this.topic + "/set"
    state: boolean = false
    autoOffTimer: TimerLength
    timer: Timer

    constructor(name: string, options?: PowerZigbeeOptions) {
        super(name)
        if (typeof options !== 'undefined') {
            this.autoOffTimer = options.autoOff
            this.timer = new Timer()
        }
    }

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
        if (typeof this.autoOffTimer !== 'undefined') {
            if (this.state) {
                this.timer.setTimeout(this.autoOffTimer, () => { this.off() })
            } else {
                this.timer.cancelTimeout()
            }
        }
    }
}

type PowerZigbeeOptions = {
    autoOff?: TimerLength
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
