import { ESPHOME_TOPIC } from "../../topics";
import { Component } from "../component";
import { router } from "../../router";
import { Trigger } from "../../types";
import { telegram } from "../telegram";

export class ESPHomeComponent extends Component {
	protected baseTopic: string;
	protected stateTopic: string;

	/**
	 * Human readable name
	 */
	name: string;

	constructor(name: string, component: string, type: ESPHomeComponentTypes) {
		super();
		this.baseTopic = ESPHOME_TOPIC + name;
		this.stateTopic = `${this.baseTopic}/${type}/${component}/state`;
		this.name = `${name}:${component}`;
	}
}

export type ESPHomeComponentTypes =
	| "switch"
	| "light"
	| "sensor"
	| "binary_sensor";

export class EsphomeMonitor extends Component {
	offlineDevices: string[] = [];
	ignoredDevices: string[] = [];

	constructor(ignoredDevices?: string[]) {
		super();

		ignoredDevices.forEach((device: string) => {
			this.ignoredDevices.push(`${ESPHOME_TOPIC}${device}/status`);
		});

		router.addAutomation({
			trigger: { topic: `${ESPHOME_TOPIC}*/status`, payload: "*" },
			callback: (message: Trigger) => {
				if (this.ignoredDevices.includes(message.topic)) {
					return;
				}
				const payload = message.payload as InboundAvailability;
				if (payload === "offline") {
					this.sendNotification(message);
					this.offlineDevices.push(message.topic);
				} else if (
					payload === "online" &&
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
				title: `ESPHome component \`${message.topic.split("/")[1]}\``,
				message: `status: \`${message.payload as InboundAvailability}\``,
			},
			"warning",
		);
	}
}

export type InboundAvailability = "online" | "offline";