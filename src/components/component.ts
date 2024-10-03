import { EventEmitter } from "node:events";
import type { MqttClient } from "mqtt";
import { client } from "../mqtt";

export class Component extends EventEmitter {
	protected client: MqttClient;

	constructor() {
		super();
		this.client = client;
	}
}
