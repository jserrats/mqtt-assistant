import { router } from "../../router";
import { BASE_TOPIC } from "../../topics";
import type { Trigger } from "../../types";
import { Component } from "../component";

export class BaseMQTTSensor<T> extends Component {
	protected stateTopic: string;
	public name: string;
	public state: T;

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
		this.emit("state", this.state);
	}
}
