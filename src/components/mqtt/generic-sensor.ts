import { BASE_TOPIC } from "../../topics";
import type { Trigger } from "../../types";
import { Component } from "../component";

export class GenericMQTTSensor extends Component {
	protected stateTopic: string;
	trigger: Record<string, Trigger>;
	public name: string;

	constructor(name: string) {
		super();
		this.name = name;
		this.stateTopic = `${BASE_TOPIC}${name}`;
	}
}
