import { router } from "../../router";
import type { Automation, Trigger } from "../../types";
import type { Switch } from "../interfaces/switch";
import { ESPHomeComponent } from "./esphome";

export class LightESPHome extends ESPHomeComponent implements Switch {
	commandTopic: string;
	state = false;
	updater: Automation;

	trigger = {
		on: { topic: "", payload: "*OFF*" },
		off: { topic: "", payload: "*ON*" },
	};

	constructor(name: string, component: string) {
		super(name, component, "light");
		this.commandTopic = `${this.baseTopic}/light/${component}/command`;
		this.trigger.on.topic = this.stateTopic;
		this.trigger.off.topic = this.stateTopic;
		this.updater = {
			trigger: { topic: this.stateTopic, payload: "*" },
			callback: (message: Trigger) => {
				this.updateComponent(message.payload);
			},
		};
		router.addAutomation(this.updater);
	}

	setOn() {
		this.set(true);
	}

	setOff() {
		this.set(false);
	}

	toggle() {
		this.set(!this.state);
	}

	private set(status: boolean) {
		this.client.publish(
			this.commandTopic,
			JSON.stringify({ state: status ? "ON" : "OFF" }),
		);
	}

	private updateComponent(message: string) {
		if (this.state !== (JSON.parse(message).state === "ON")) {
			this.state = JSON.parse(message).state === "ON";
			this.emit("state", this.state);
		}
	}
}
