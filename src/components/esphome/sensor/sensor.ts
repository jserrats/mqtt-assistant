import { router } from "../../../router";
import type { Automation, Trigger } from "../../../types";
import {
	GenericESPHomeSensor,
	type GenericESPHomeSensorOptions,
} from "./generic-sensor";

export class SensorESPHome extends GenericESPHomeSensor {
	state: number;
	private updater: Automation;

	trigger = {
		all: { topic: this.stateTopic, payload: "*" },
	};

	constructor(
		name: string,
		component: string,
		options?: GenericESPHomeSensorOptions,
	) {
		super(name, component, "sensor", options);
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
		this.state = Number(message);
	}
}
