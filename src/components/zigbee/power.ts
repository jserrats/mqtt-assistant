import type { Switch } from "../interfaces/switch";
import { type InboundZigbeeInfo, ZigbeeComponent } from "./zigbee";

export class SwitchZigbee extends ZigbeeComponent implements Switch {
	setTopic = `${this.topic}/set`;
	state: boolean;

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

	updateComponent(message: InboundSwitchZigbeeInfo): void {
		if (this.state !== (message.state === "ON")) {
			this.state = message.state === "ON";
			this.emit("state", this.state);
		}
		super.updateComponent(message);
	}
}

/**
 * TRADFRI control outlet
 */
export class SwitchE1603 extends SwitchZigbee { }

type InboundSwitchZigbeeInfo = {
	state: string;
} & InboundZigbeeInfo;