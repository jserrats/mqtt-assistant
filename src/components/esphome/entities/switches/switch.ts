import type { Switch } from "../../../interfaces/switch";
import { BaseESPHomeSensor } from "../sensors/base";

export class SwitchESPHome
	extends BaseESPHomeSensor<boolean>
	implements Switch
{
	commandTopic: string;

	constructor(name: string, component: string) {
		super(name, component, "switch");
		this.commandTopic = `${this.baseTopic}/switch/${component}/command`;
	}

	setOn() {
		this.set(true);
	}

	setOff() {
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

	protected updateComponent(message: string) {
		if (this.state !== (message === "ON")) {
			this.state = message === "ON";
			this.emit(this.events.state, this.state);
		}
	}
}
