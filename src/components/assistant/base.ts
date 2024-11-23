import { router } from "../../router";
import { BASE_TOPIC } from "../../topics";
import type { Trigger } from "../../types";
import { StatefulComponent } from "../component";

export class BaseMQTTSensor<
	T extends boolean | string | number,
> extends StatefulComponent<T> {
	protected stateTopic: string;
	public name: string;

	constructor(name: string) {
		super();
		this.name = name;
		this.stateTopic = `${BASE_TOPIC}${name}`;
		router.addAutomation({
			trigger: { topic: this.stateTopic, payload: "*" },
			callback: (message: Trigger) => {
				this.updateComponent(message.payload);
			},
		});
	}

	protected updateComponent(message: string) {}
}
