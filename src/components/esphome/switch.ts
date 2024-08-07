import { router } from "../../router";
import type { Automation, Trigger } from "../../types";
import { ESPHomeComponent } from "./esphome";

export class SwitchESPHome extends ESPHomeComponent {
	commandTopic: string;
	state: boolean;
	updater: Automation;

	trigger = {
		on: { topic: this.stateTopic, payload: "ON" },
		off: { topic: this.stateTopic, payload: "OFF" },
		all: { topic: this.stateTopic, payload: "*" },
	};

	constructor(name: string, component: string) {
		super(name, component, "switch");
		this.commandTopic = `${this.baseTopic}/switch/${component}/command`;
		this.updater = {
			trigger: { topic: this.stateTopic, payload: "*" },
			callback: (message: Trigger) => {
				this.updateComponent(message.payload);
			},
		};
		router.addAutomation(this.updater);
	}

	on() {
		this.set(true);
	}

	off() {
		this.set(false);
	}

	toggle() {
		this.set("toggle");
	}

	private set(order: boolean | "toggle") {
		let text_order: string;
		if (typeof order === "boolean") {
			text_order = order ? "ON" : "OFF";
		} else {
			text_order = "TOGGLE";
		}
		this.client.publish(this.commandTopic, text_order);
	}

	private updateComponent(message: string) {
		this.state = message === "ON";
	}
}
