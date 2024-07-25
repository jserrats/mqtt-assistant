import { ESPHOME_TOPIC } from "../../topics";
import { Component } from "../component";

export class ESPHomeComponent extends Component {
	protected baseTopic: string;
	protected stateTopic: string;
	name: string;

	constructor(name: string, component: string, type: ESPHomeComponentTypes) {
		super();
		this.baseTopic = ESPHOME_TOPIC + name;
		this.stateTopic = `${this.baseTopic}/${type}/${component}/state`;
		this.name = name;
	}
}

export type ESPHomeComponentTypes =
	| "switch"
	| "light"
	| "sensor"
	| "binary_sensor";
