import { router } from "../../router";
import { type Automation, Trigger } from "../../types";
import { ESPHomeComponent } from "./esphome";

export class SwitchESPHome extends ESPHomeComponent {
	sensorTopic: string;
	commandTopic: string;
	state = false;
	updater: Automation;

	trigger = {
		on: { topic: "", payload: "ON" },
		off: { topic: "", payload: "OFF" },
	};

	constructor(name: string, component: string) {
		super(name);
		this.sensorTopic = `${this.topic}/switch/${component}/state`;
		this.commandTopic = `${this.topic}/switch/${component}/command`;
		this.trigger.off.topic = this.sensorTopic;
		this.trigger.on.topic = this.sensorTopic;
		this.updater = {
			trigger: { topic: this.topic, payload: "*" },
			callback: (message: string) => {
				this.updateComponent(message);
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

	private set(status: boolean) {
		this.client.publish(this.commandTopic, status ? "ON" : "OFF");
	}

	private updateComponent(message: string) {
		this.state = message === "ON";
	}
}
