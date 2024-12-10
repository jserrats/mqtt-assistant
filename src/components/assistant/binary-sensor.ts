import type { BooleanSensor } from "../interfaces/sensor";
import { BaseMQTTSensor } from "./base";

export class BinaryMQTTSensor
	extends BaseMQTTSensor<boolean>
	implements BooleanSensor
{
	updateComponent(message: string) {
		if (this.state !== (message === "ON")) {
			this.state = message === "ON";
			super.updateComponent(message);
		}
	}
}
