import type { Switch } from "../../../interfaces/switch";
import { exposes } from "../../exposes";
import { ZigbeeDevice } from "../../zigbee";

export class SwitchZigbee extends ZigbeeDevice implements Switch {
	setTopic = `${this.topic}/set`;
	protected _state = new exposes.ExposesSwitch(this);
	public state: boolean;

	constructor(name: string) {
		super(name);
		this._state.on(this._state.events.state, (value) => {
			this.state = value;
		});
	}

	setOn(options?: Object) {
		this.set(true, options);
	}
	setOff() {
		this.set(false);
	}

	toggle() {
		this.set("toggle");
	}

	protected set(order: boolean | "toggle", options?: Object) {
		if (typeof order === "boolean") {
			this.client.publish(
				this.setTopic,
				JSON.stringify({
					state: order ? "ON" : "OFF",
					...options,
				}),
			);
		} else {
			this.client.publish(this.setTopic, "TOGGLE");
		}
	}
}

export class LightZigbee extends SwitchZigbee {}

export class BrightLightZigbee extends LightZigbee {
	brightness = new exposes.ExposesBrightness(this, 254, 5);
}

export class TemperatureLightZigbee extends SwitchZigbee {
	colorTemp = new exposes.ExposesColorTemperature(this, 454, 250);
	brightness = new exposes.ExposesBrightness(this, 254, 5);
}
