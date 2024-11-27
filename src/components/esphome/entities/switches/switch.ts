import { BaseSwitchESPHome } from "./base";

export class SwitchESPHome extends BaseSwitchESPHome {
	constructor(name: string, component: string) {
		super(name, component, "switch");
		this.commandTopic = `${this.baseTopic}/switch/${component}/command`;
	}

	protected set(order: boolean | "toggle") {
		let text_order: string;
		if (typeof order === "boolean") {
			text_order = order ? "ON" : "OFF";
		} else {
			text_order = "TOGGLE";
		}
		this.client.publish(this.commandTopic, text_order);
	}
}
