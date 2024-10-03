import type { Switch } from "../interfaces/switch";
import { Timer, type TimerLength } from "../timer";
import { type InboundZigbeeInfo, ZigbeeComponent } from "./zigbee";

class PowerZigbee extends ZigbeeComponent implements Switch {
	setTopic = `${this.topic}/set`;
	state: boolean;
	autoOffTimer: TimerLength;
	timer: Timer;

	constructor(name: string, options?: PowerZigbeeOptions) {
		super(name);
		if (typeof options !== "undefined") {
			this.autoOffTimer = options.autoOff;
			this.timer = new Timer();
		}
	}

	setOn() {
		this.set(true);
	}

	setOff() {
		this.set(false);
	}

	toggle() {
		this.set("toggle");
	}

	private set(order: boolean | "toggle") {
		let text_order: string;
		if (typeof order === "boolean") {
			text_order = order ? "ON" : "OFF";
		} else {
			text_order = "TOGGLE";
		}
		this.client.publish(this.setTopic, text_order);
	}

	updateComponent(message: InboundPowerZigbeeInfo): void {
		if (this.state !== (message.state === "ON")) {
			this.state = message.state === "ON";
			this.emit("state", this.state);
		}
		super.updateComponent(message);
		if (typeof this.autoOffTimer !== "undefined") {
			if (this.state) {
				this.timer.setTimeout(this.autoOffTimer, () => {
					this.setOff();
				});
			} else {
				this.timer.cancelTimeout();
			}
		}
	}
}

type PowerZigbeeOptions = {
	autoOff?: TimerLength;
};

/**
 * TRADFRI control outlet
 */
export class PowerE1603 extends PowerZigbee {}

type InboundPowerZigbeeInfo = {
	state: string;
} & InboundZigbeeInfo;

export class WattPowerZigbee extends PowerZigbee {
	power = 0;
	updateComponent(message: InboundWattPowerZigbeeInfo): void {
		this.power = message.power;
		super.updateComponent(message);
	}
}

type InboundWattPowerZigbeeInfo = {
	power: number;
} & InboundPowerZigbeeInfo;
