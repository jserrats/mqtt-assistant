import { StatelessESPHomeDevice } from "../esphome";

export class ButtonESPHome extends StatelessESPHomeDevice {
	constructor(name: string, component: string) {
		super(name, component, "button");
	}

	public press(): void {
		this.client.publish(this.commandTopic, "PRESS");
	}
}
