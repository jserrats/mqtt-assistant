import { randomUUID } from "node:crypto";
import type {
	BrightLight,
	Light,
	TemperatureLight,
} from "../../../interfaces/light";
import type { Switch } from "../../../interfaces/switch";
import { exposes } from "../../exposes";
import { StatefulZigbeeDevice } from "../../zigbee";

export class SwitchZigbee
	extends StatefulZigbeeDevice<boolean>
	implements Switch
{
	setTopic = `${this.topic}/set`;
	protected switch = new exposes.ExposesSwitch(this);
	public events = {
		state: randomUUID(),
		on: randomUUID(),
		off: randomUUID(),
	};

	constructor(name: string) {
		super(name);
		this.switch.on(this.switch.events.state, (value) => {
			this.state = value;
			if (value) {
				this.emit(this.events.on);
			} else {
				this.emit(this.events.off);
			}
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
