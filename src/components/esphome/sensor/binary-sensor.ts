import { router } from "../../../router";
import type { Automation, Trigger } from "../../../types";
import { ESPHomeComponent } from "../esphome";

export class BinarySensorESPHome extends ESPHomeComponent {
	state: boolean;
	private updater: Automation;

	trigger = {
		on: { topic: this.stateTopic, payload: "ON" },
		off: { topic: this.stateTopic, payload: "OFF" },
		all: { topic: this.stateTopic, payload: "*" },
	};

	constructor(name: string, component: string) {
		super(name, component);
		this.updater = {
			trigger: { topic: this.stateTopic, payload: "*" },
			callback: (message: Trigger) => {
				this.updateComponent(message.payload);
			},
		};
		router.addAutomation(this.updater);
	}

	updateComponent(message: string) {
		this.state = message === "ON";
	}
}

export class ContactSensorESPHome extends BinarySensorESPHome {
	contact = false;

	updateComponent(message: string) {
		this.contact = message === "ON";
	}
}
