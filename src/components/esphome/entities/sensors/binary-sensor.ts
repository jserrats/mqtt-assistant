import { BaseESPHomeSensor } from "./base";

export class BinarySensorESPHome extends BaseESPHomeSensor<boolean> {
	constructor(name: string, component: string) {
		super(name, component, "binary_sensor");
	}

	protected updateComponent(message: string) {
		if (this.state === undefined || this.state !== (message === "ON")) {
			this.state = message === "ON";
			super.updateComponent(message);
		}
	}
}
