import { router } from "../../../router";
import { Sensor } from "../../interfaces/sensor";
import type { InboundZigbeeInfo } from "../zigbee";
import { GenericZigbeeSensor } from "./sensor";

export class PowerSensorZigbee extends GenericZigbeeSensor implements Sensor{
	power?: number;
	voltage?: number;
	current?: number;
	state: number;
	
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
