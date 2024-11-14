import { BaseESPHomeSensor } from "./base";

export class SensorESPHome extends BaseESPHomeSensor<number> {
	constructor(name: string, component: string) {
		super(name, component, "sensor");
	}

	protected updateComponent(message: string) {
		if (this.state === undefined || this.state !== Number(message)) {
			this.state = Number(message);
			super.updateComponent(message);
		}
	}
}
