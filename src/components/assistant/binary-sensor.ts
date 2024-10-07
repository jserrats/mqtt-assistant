import { router } from "../../router";
import type { Automation, Trigger } from "../../types";
import type { BinarySensor } from "../interfaces/binary-sensor";
import { GenericMQTTSensor } from "./generic-sensor";

export class BinaryMQTTSensor
	extends GenericMQTTSensor
	implements BinarySensor
{
	state: boolean;
	private updater: Automation;

	trigger = {
		on: { topic: this.stateTopic, payload: "ON" },
		off: { topic: this.stateTopic, payload: "OFF" },
		all: { topic: this.stateTopic, payload: "*" },
	};

	constructor(name: string) {
		super(name);
		this.updater = {
			trigger: { topic: this.stateTopic, payload: "*" },
			callback: (message: Trigger) => {
				this.updateComponent(message.payload);
			},
		};
		router.addAutomation(this.updater);
	}

	updateComponent(message: string) {
		if (this.state !== (message === "ON")) {
			this.state = message === "ON";
			this.emit("state", this.state);
		}
	}
}
