import { BaseSwitchESPHome } from "./base";

export class SwitchESPHome extends BaseSwitchESPHome {
	constructor(name: string, component: string) {
		super(name, component, "switch");
		this.commandTopic = `${this.baseTopic}/switch/${component}/command`;
	}
}
