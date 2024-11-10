import { exposes } from "../../exposes";
import { ZigbeeDevice } from "../../zigbee";

export class ClosureSensorZigbee extends ZigbeeDevice {
	closure: exposes.ExposesClosure

	constructor(name: string, inverted?) {
		super(name);
		this.closure = new exposes.ExposesClosure(inverted)
	}
}