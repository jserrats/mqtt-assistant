import { ZIGBEE2MQTT_TOPIC } from "../../topics";

import { router } from "../../router";
import type { Trigger } from "../../types";
import { Component } from "../component";
import { exposes } from "./exposes";
import { ExposesZigbee } from "./exposes/base";

export class ZigbeeDevice extends Component {
	topic: string;
	name: string;
	linkquality = new exposes.ExposesLinkQuality();

	constructor(name: string) {
		super();
		this.name = name;
		this.topic = ZIGBEE2MQTT_TOPIC + name;

		router.addAutomation({
			trigger: { topic: this.topic, payload: "*" },
			callback: (message: Trigger) => {
				try {
					this.updateExposes(JSON.parse(message.payload));
				} catch (error) {
					let error_message = "Unknown Error";
					if (error instanceof Error) error_message = error.message;
					console.error(
						`[!] Error while parsing message:
                            TOPIC: ${message.topic}
                            PAYLOAD: ${message.payload}
                            ERROR: ${error_message}`,
					);
				}
			},
		});
	}

	protected updateExposes(message: Object): void {
		for (const key in this) {
			if (this[key] instanceof ExposesZigbee) {
				this[key].updateExposes(message);
			}
		}
	}
}
