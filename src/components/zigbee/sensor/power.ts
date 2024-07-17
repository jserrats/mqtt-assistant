import { router } from "../../../router";
import type { InboundZigbeeInfo } from "../zigbee";
import { GenericZigbeeSensor } from "./sensor";

export class PowerSensorZigbee extends GenericZigbeeSensor {
	power?: number;
	voltage?: number;
	current?: number;

	updateComponent(message: PowerSensorZigbeeComponentInfo): void {
		this.power = message.power;
		this.voltage = message.voltage;
		this.current = message.current;

		super.updateComponent(message);
	}
}

export type PowerSensorZigbeeComponentInfo = {
	power: number;
	voltage: number;
	current: number;
} & InboundZigbeeInfo;
