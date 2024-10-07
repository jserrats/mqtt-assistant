import type { BinarySensor } from "../../interfaces/binary-sensor";
import { GenericMQTTSensor } from "../generic-sensor";

export class CustomBinarySensor<Type>
	extends GenericMQTTSensor
	implements BinarySensor
{
	state: boolean;
	private logic: (message: Type) => boolean;

	trigger = {
		on: { topic: this.stateTopic, payload: "ON" },
		off: { topic: this.stateTopic, payload: "OFF" },
		all: { topic: this.stateTopic, payload: "*" },
	};

	constructor(name: string, logic: (message: Type) => boolean) {
		super(name);
		this.logic = logic;
	}

	updateComponent(message: Type) {
		const state = this.logic(message);

		if (state !== this.state) {
			this.emit("state", this.state);
			this.state = state;
		}

		this.client.publish(this.stateTopic, this.state ? "ON" : "OFF", {
			retain: true,
		});
	}
}
