import { ZIGBEE2MQTT_TOPIC } from "../../topics";

import { router } from "../../router";
import type { Trigger } from "../../types";
import { Component } from "../component";
import { Telegram } from "../telegram";
export class ZigbeeComponent extends Component {
	topic: string;
	linkquality = 0;
	name: string;

	constructor(name: string) {
		super();
		this.name = name;
		this.topic = ZIGBEE2MQTT_TOPIC + name;
		router.addAutomation({
			trigger: { topic: this.topic, payload: "*" },
			callback: (message: Trigger) => {
				try {
					this.updateComponent(JSON.parse(message.payload));
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

	protected updateComponent(message: InboundZigbeeInfo) {
		this.linkquality = message.linkquality;
	}
}

export class ZigbeeMonitor extends Component {
	offlineDevices: string[] = [];
	telegram: Telegram;

	constructor() {
		super();
		this.telegram = new Telegram();

		router.addAutomation({
			trigger: { topic: `${ZIGBEE2MQTT_TOPIC}*/availability`, payload: "*" },
			callback: (message: Trigger) => {
				const payload = JSON.parse(message.payload) as InboundAvailability;
				if (payload.state === "offline") {
					this.sendNotification(message);
					this.offlineDevices.push(message.topic);
				} else if (
					payload.state === "online" &&
					this.offlineDevices.includes(message.topic)
				) {
					this.sendNotification(message);
					this.offlineDevices.splice(
						this.offlineDevices.indexOf(message.topic),
						1,
					);
				}
			},
		});
	}

	sendNotification(message: Trigger) {
		this.telegram.send(
			`[!] Zigbee component ${message.topic} status: ${(JSON.parse(message.payload) as InboundAvailability).state}`,
		);
	}
}

export type InboundAvailability = {
	state: "online" | "offline";
};

export type InboundZigbeeInfo = {
	linkquality: number;
};
