import type { Sensor } from "../../interfaces/sensor";
import type { InboundZigbeeInfo } from "../zigbee";
import { GenericZigbeeSensor } from "./sensor";

export class PowerSensorZigbee extends GenericZigbeeSensor implements Sensor {
	power?: number;
	voltage?: number;
	current?: number;
	state: number;

	updateComponent(message: PowerSensorZigbeeComponentInfo): void {
		this.power = message.power;
		this.voltage = message.voltage;
		this.current = message.current;

		// TODO: split power sensors
		super.updateComponent(message);
		if (this.state !== message.power) {
			this.state = message.power;
			this.emit("state", this.state);
		}
	}
}

export type PowerSensorZigbeeComponentInfo = {
	power: number;
	voltage: number;
	current: number;
} & InboundZigbeeInfo;
