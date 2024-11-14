
import { BaseMQTTSensor } from "./base";

export class BinaryMQTTSensor extends BaseMQTTSensor<boolean> {
	updateComponent(message: string) {
		if (this.state !== (message === "ON")) {
			this.state = message === "ON";
			super.updateComponent(message);
		}
	}
}
