import { exposes } from "../../exposes";
import { ZigbeeDevice } from "../../zigbee";

export class SwitchZigbee extends ZigbeeDevice {
	setTopic = `${this.topic}/set`;
	protected _state = new exposes.ExposesSwitch()
	public state: boolean

	constructor(name: string) {
		super(name)
		this._state.on('state', (value) => { this.state = value })
	}
	
	setOn(options?: Object) {
		this.set(true, options)
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

/**
 * TRADFRI control outlet
 */
export class SwitchE1603 extends SwitchZigbee { }
