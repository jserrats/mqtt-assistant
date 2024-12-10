import type { Light } from "../../../interfaces/light";
import { BaseSwitchESPHome } from "./base";

export class LightESPHome extends BaseSwitchESPHome implements Light {
	constructor(name: string, component: string) {
		super(name, component, "light");
		this.commandTopic = `${this.baseTopic}/light/${component}/command`;
	}

	protected set(order: boolean | "toggle") {
		let text_order: string;
		if (typeof order === "boolean") {
			text_order = order ? "ON" : "OFF";
		} else {
			text_order = "TOGGLE";
		}
		this.client.publish(
			this.commandTopic,
			JSON.stringify({ state: text_order }),
		);
	}
}
//TODO: control brightness
