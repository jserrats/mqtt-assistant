import { router } from "../../../router";
import type { Automation, Trigger } from "../../../types";
import {
	GenericESPHomeSensor,
	type GenericESPHomeSensorOptions,
} from "./generic-sensor";

export class BinarySensorESPHome extends GenericESPHomeSensor {
	state: boolean;
	private updater: Automation;

	trigger = {
		on: { topic: this.stateTopic, payload: "ON" },
		off: { topic: this.stateTopic, payload: "OFF" },
		all: { topic: this.stateTopic, payload: "*" },
	};

	constructor(
		name: string,
		component: string,
		options?: GenericESPHomeSensorOptions,
	) {
		super(name, component, "binary_sensor", options);
		this.updater = {
			trigger: { topic: this.stateTopic, payload: "*" },
			callback: (message: Trigger) => {
				this.updateComponent(message.payload);
			},
		};
		router.addAutomation(this.updater);
	}

	updateComponent(message: string) {
		super.updateComponent(message);
		this.state = message === "ON";
	}
}

export class ContactSensorESPHome extends BinarySensorESPHome {
	contact = false;

	updateComponent(message: string) {
		this.contact = message === "ON";
	}
}
