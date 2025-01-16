import { router } from "../../router";
import { ESPHOME_TOPIC } from "../../topics";
import type { Trigger } from "../../types";
import { Component, StatefulComponent } from "../component";

interface ESPhomeDevice extends Component {
	name: string;
}

export class StatefulESPHomeDevice<T extends string | number | boolean>
	extends StatefulComponent<T>
	implements ESPhomeDevice
{
	protected baseTopic: string;
	protected stateTopic: string;

	public name: string;

	constructor(
		name: string,
		component: string,
		deviceType: "switch" | "light" | "sensor" | "binary_sensor" | "text_sensor",
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

		router.addAutomation({
			trigger: { topic: `${this.baseTopic}/status`, payload: "*" },
			callback: (message: Trigger) => {
				if (message.payload === "offline") {
					this.state = undefined;
				}
			},
		});
	}

	protected updateComponent(message: string) {}
}

export class StatelessESPHomeDevice extends Component implements ESPhomeDevice {
	protected baseTopic: string;
	protected commandTopic: string;

	public name: string;

	constructor(name: string, component: string, deviceType: "button") {
		super();
		this.baseTopic = ESPHOME_TOPIC + name;
		this.commandTopic = `${this.baseTopic}/${deviceType}/${component}/command`;
		this.name = `${name}:${component}`;
	}
}
