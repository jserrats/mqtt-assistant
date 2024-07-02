import type { MqttClient } from "mqtt";
import { client } from "../mqtt";

export class Component {
	client: MqttClient;

	constructor() {
		this.client = client;
	}
}
