import { exposes } from "../../exposes";
import { ZigbeeDevice } from "../../zigbee";

export class PowerSensorZigbee extends ZigbeeDevice {
	power = new exposes.ExposesPower();
	voltage = new exposes.ExposesVoltage();
	current = new exposes.ExposesCurrent();
}

export class PJ_1203_W extends PowerSensorZigbee {}
