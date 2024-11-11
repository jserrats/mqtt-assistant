import { exposes } from "../../exposes";
import { SwitchZigbee } from "./base";

/**
 * TRADFRI control outlet
 *
 * https://www.zigbee2mqtt.io/devices/E1603_E1702_E1708.html#ikea-e1603%252Fe1702%252Fe1708
 */
export class E1603 extends SwitchZigbee {}

/**
 * Smart plug (with power monitoring by polling)
 *
 * https://www.zigbee2mqtt.io/devices/BSD29_1.html#tuya-bsd29_1
 */
export class BSD29_1 extends SwitchZigbee {
	power = new exposes.ExposesPower();
	current = new exposes.ExposesCurrent();
	voltage = new exposes.ExposesVoltage();
}
