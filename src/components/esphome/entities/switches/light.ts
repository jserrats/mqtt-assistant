import { BaseSwitchESPHome } from "./base";

export class LightESPHome extends BaseSwitchESPHome {
	constructor(name: string, component: string) {
		super(name, component, "light");
		this.commandTopic = `${this.baseTopic}/light/${component}/command`;
	}
}
