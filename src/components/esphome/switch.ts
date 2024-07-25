import { router } from "../../router";
import { type Automation, Trigger } from "../../types";
import { ESPHomeComponent } from "./esphome";

export class SwitchESPHome extends ESPHomeComponent {
	commandTopic: string;
	state = false;
	updater: Automation;

	trigger = {
		on: { topic: "", payload: "ON" },
		off: { topic: "", payload: "OFF" },
	};

	constructor(name: string, component: string) {
		super(name, component, "light");
		this.commandTopic = `${this.baseTopic}/switch/${component}/command`;
		this.trigger.off.topic = this.stateTopic;
		this.trigger.on.topic = this.stateTopic;
		this.updater = {
			trigger: { topic: this.baseTopic, payload: "*" },
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
