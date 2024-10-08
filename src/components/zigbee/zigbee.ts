import { ZIGBEE2MQTT_TOPIC } from "../../topics";

import { router } from "../../router";
import type { Trigger } from "../../types";
import { Component } from "../component";
import { telegram } from "../telegram";
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

export type InboundZigbeeInfo = {
	linkquality: number;
};

// For this to work is necessary to go to zigbee2mqtt > Settings > Availability > Enable
export class ZigbeeMonitor extends Component {
	offlineDevices: string[] = [];
	ignoredDevices: string[] = [];

	constructor(ignoredDevices?: string[]) {
		super();

		if (ignoredDevices) {
			ignoredDevices.forEach((device: string) => {
				this.ignoredDevices.push(`${ZIGBEE2MQTT_TOPIC}${device}/availability`);
			});
		}

		router.addAutomation({
			trigger: { topic: `${ZIGBEE2MQTT_TOPIC}*/availability`, payload: "*" },
			callback: (message: Trigger) => {
				if (this.ignoredDevices.includes(message.topic)) {
					return;
				}
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
		telegram.log(
			{
				title: `Zigbee component \`${message.topic.split("/")[1]}\``,
				message: `status: \`${(JSON.parse(message.payload) as InboundAvailability).state}\``,
			},
			"warning",
		);
	}
}

export type InboundAvailability = {
	state: "online" | "offline";
};
