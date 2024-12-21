import { router } from "../../router";
import { ESPHOME_TOPIC } from "../../topics";
import type { Trigger } from "../../types";
import { Component } from "../component";
import { telegram } from "../telegram";

export class MonitorESPHome extends Component {
	offlineDevices: string[] = [];
	ignoredDevices: string[] = [];

	constructor(ignoredDevices?: string[]) {
		super();
		if (ignoredDevices) {
			ignoredDevices.forEach((device: string) => {
				this.ignoredDevices.push(`${ESPHOME_TOPIC}${device}/status`);
			});
		}

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
