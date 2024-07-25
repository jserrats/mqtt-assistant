import { ESPHOME_TOPIC } from "../../topics";
import { Component } from "../component";

export class ESPHomeComponent extends Component {
	protected baseTopic: string;
	protected stateTopic: string;
	name: string;

	constructor(name: string, component: string) {
		super();
		this.baseTopic = ESPHOME_TOPIC + name;
		this.stateTopic = `${this.baseTopic}/switch/${component}/state`;
		this.name = name;
	}
}
