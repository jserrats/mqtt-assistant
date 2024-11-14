import { router } from "../../router";
import { ESPHOME_TOPIC } from "../../topics";
import type { Trigger } from "../../types";
import { Component } from "../component";

export class ESPHomeDevice extends Component {
	protected baseTopic: string;
	protected stateTopic: string;

	/**
	 * Human readable name
	 */
	name: string;

	constructor(
		name: string,
		component: string,
		deviceType: "switch" | "light" | "sensor" | "binary_sensor",
	) {
		super();
		this.baseTopic = ESPHOME_TOPIC + name;
		this.stateTopic = `${this.baseTopic}/${deviceType}/${component}/state`;
		this.name = `${name}:${component}`;
		router.addAutomation({
			trigger: { topic: this.stateTopic, payload: "*" },
			callback: (message: Trigger) => {
				this.updateComponent(message.payload);
			},
		});
	}

	protected updateComponent(message: string) {}
}
