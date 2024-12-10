import type { NumericSensor } from "../../../interfaces/sensor";
import { BaseESPHomeSensor } from "./base";

export class SensorESPHome
	extends BaseESPHomeSensor<number>
	implements NumericSensor
{
	public unit: string;

	constructor(name: string, component: string, unit?: string) {
		super(name, component, "sensor");
		this.unit = unit;
	}

	protected updateComponent(message: string) {
		if (this.state === undefined || this.state !== Number(message)) {
			this.state = Number(message);
			super.updateComponent(message);
		}
	}
}
