import { ZIGBEE2MQTT_TOPIC } from "../../topics";

import { router } from "../../router";
import type { Trigger } from "../../types";
import { Component, StatefulComponent } from "../component";
import type { Eventful } from "../interfaces/eventful";
import { exposes } from "./exposes";
import { ExposesZigbee } from "./exposes/base";

const zigbeeDeviceConstructor = (device: ZigbeeDevice, name: string) => {
	device.name = name;
	device.topic = ZIGBEE2MQTT_TOPIC + name;

	router.addAutomation({
		trigger: { topic: device.topic, payload: "*" },
		callback: (message: Trigger) => {
			try {
				device._updateExposes(JSON.parse(message.payload));
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
};

export interface ZigbeeDevice extends Eventful {
	topic: string;
	name: string;
	linkquality: exposes.ExposesLinkQuality;
	_updateExposes(message: Object): void;
}

export class StatelessZigbeeDevice extends Component implements ZigbeeDevice {
	topic: string;
	name: string;
	linkquality = new exposes.ExposesLinkQuality(this);

	constructor(name: string) {
		super();
		zigbeeDeviceConstructor(this, name);
		router.addAutomation({
			trigger: { topic: `${this.topic}/availability`, payload: "*" },
			callback: (message: Trigger) => {
				try {
					if (JSON.parse(message.payload)["state"] === "offline") {
						// set all exposes of this device to undefined
						for (const key in this) {
							if (this[key] instanceof ExposesZigbee) {
								this[key]._updateExposes(undefined);
							}
						}
					};
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

	_updateExposes(message: Object): void {
		for (const key in this) {
			if (this[key] instanceof ExposesZigbee) {
				this[key]._updateExposes(message);
			}
		}
	}
}

export class StatefulZigbeeDevice<T extends string | number | boolean>
	extends StatefulComponent<T>
	implements ZigbeeDevice {
	topic: string;
	name: string;
	linkquality = new exposes.ExposesLinkQuality(this);

	constructor(name: string) {
		super();
		zigbeeDeviceConstructor(this, name);
		router.addAutomation({
			trigger: { topic: `${this.topic}/availability`, payload: "*" },
			callback: (message: Trigger) => {
				try {
					if (JSON.parse(message.payload)["state"] === "offline") {
						this.state = undefined;
					};
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

	//TODO: deduplicate this code
	_updateExposes(message: Object): void {
		for (const key in this) {
			if (this[key] instanceof ExposesZigbee) {
				this[key]._updateExposes(message);
			}
		}
	}
}
