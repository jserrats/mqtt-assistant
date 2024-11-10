import { exposes } from "../../exposes";
import { ZigbeeDevice } from "../../zigbee";


export class PresenceSensorZigbee extends ZigbeeDevice {
	occupancy = new exposes.ExposesOccupancy()
}

export class IH012_RT01 extends PresenceSensorZigbee { }