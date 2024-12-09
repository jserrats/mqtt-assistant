import { randomUUID } from "node:crypto";
import type {
	BrightLight,
	Light,
	TemperatureLight,
} from "../../../interfaces/light";
import type { Switch } from "../../../interfaces/switch";
import { exposes } from "../../exposes";
import { ZigbeeDevice } from "../../zigbee";

export class SwitchZigbee extends ZigbeeDevice implements Switch {
	setTopic = `${this.topic}/set`;
	protected _state = new exposes.ExposesSwitch(this);
	public state: boolean;
	public events = {
		state: randomUUID(),
	};

	constructor(name: string) {
		super(name);
		this._state.on(this._state.events.state, (value) => {
			this.state = value;
			this.emit(this.events.state, this.state);
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

export class LightZigbee extends SwitchZigbee implements Light {}

export class BrightLightZigbee extends LightZigbee implements BrightLight {
	brightness = new exposes.ExposesBrightness(this, 254, 5);
}

export class TemperatureLightZigbee
	extends SwitchZigbee
	implements TemperatureLight
{
	colorTemp = new exposes.ExposesColorTemperature(this, 454, 250);
	brightness = new exposes.ExposesBrightness(this, 254, 5);
}
