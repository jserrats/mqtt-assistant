import { router } from "../../router";
import { ESPHOME_TOPIC } from "../../topics";
import type { Trigger } from "../../types";
import { StatefulComponent } from "../component";

export class ESPHomeDevice<
	T extends string | number | boolean,
> extends StatefulComponent<T> {
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
	}

	protected updateComponent(message: string) {}
}
