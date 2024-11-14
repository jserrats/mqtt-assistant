import type { UUID } from "node:crypto";
import { EventEmitter } from "node:events";
import type { MqttClient } from "mqtt";
import { client } from "../mqtt";

export class SimplerEventEmitter {
	private emiter = new EventEmitter();

	public events: Record<string, UUID>;

	on(eventName: string | symbol, listener: (...args: any[]) => void) {
		this.emiter.on(eventName, listener);
	}

	emit(eventName: string | symbol, ...args: any) {
		this.emiter.emit(eventName, ...args);
	}
}
export class Component extends SimplerEventEmitter {
	protected client: MqttClient;

	constructor() {
		super();
		this.client = client;
	}
}
