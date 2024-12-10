import type { StringSensor } from "../../../interfaces/sensor";
import { BaseESPHomeSensor } from "./base";

//TODO: test this
export class TextSensorESPHome
	extends BaseESPHomeSensor<string>
	implements StringSensor
{
	constructor(name: string, component: string, unit?: string) {
		super(name, component, "text_sensor");
	}

	protected updateComponent(message: string) {
		if (this.state === undefined || this.state !== message) {
			this.state = message;
			super.updateComponent(message);
		}
	}
}
