import { randomUUID } from "node:crypto";
import { router } from "../../router";
import { BASE_TOPIC } from "../../topics";
import type { Trigger } from "../../types";
import { Component } from "../component";
import type { Stateful } from "../interfaces/stateful";

export class BaseMQTTSensor<T extends boolean | string | number>
	extends Component
	implements Stateful
{
	protected stateTopic: string;
	public name: string;
	public state: T;

	public events = { state: randomUUID() };

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

	protected updateComponent(message: string) {
		this.emit(this.events.state, this.state);
	}
}
