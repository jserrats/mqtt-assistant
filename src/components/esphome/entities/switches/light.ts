import { router } from "../../../../router";
import type { Automation, Trigger } from "../../../../types";
import type { Switch } from "../../../interfaces/switch";
import { ESPHomeDevice } from "../../esphome";

export class LightESPHome extends ESPHomeDevice implements Switch {
	commandTopic: string;
	state: boolean;

	constructor(name: string, component: string) {
		super(name, component, "light");
		this.commandTopic = `${this.baseTopic}/light/${component}/command`;
		router.addAutomation({
			trigger: { topic: this.stateTopic, payload: "*" },
			callback: (message: Trigger) => {
				this.updateComponent(message.payload);
			},
		});
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

	protected updateComponent(message: string) {
		if (this.state !== (JSON.parse(message).state === "ON")) {
			this.state = JSON.parse(message).state === "ON";
			this.emit(this.events.state, this.state);
		}
	}
}
