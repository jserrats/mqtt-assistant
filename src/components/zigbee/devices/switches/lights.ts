import { exposes } from "../../exposes";
import { BrightLightZigbee, TemperatureLightZigbee } from "./base";

/**
 * TRADFRI bulb E26/27, white spectrum, globe, opal, 1055/1100/1160 lm
 */
export class LED1623G12 extends TemperatureLightZigbee {}

/**
 * TRADFRI bulb E12/E14, white spectrum, globe, opal, 450/470 lm
 *
 * https://www.zigbee2mqtt.io/devices/LED2101G4.html#ikea-led2101g4
 */
export class LED2101G4 extends TemperatureLightZigbee {}

/**
 * Zigbee LED controller (Dimmer)
 *
 * https://www.zigbee2mqtt.io/devices/YSR-MINI-01_dimmer.html#ysrsai-ysr-mini-01_dimmer
 */
export class YSR_MINI_01_dimmer extends BrightLightZigbee {}

/**
 * Zigbee LED Controller WW/CW (pro)
 *
 * https://www.zigbee2mqtt.io/devices/GL-C-006P.html#gledopto-gl-c-006p
 */
export class GL_C_006P extends TemperatureLightZigbee {
	colorTemp = new exposes.ExposesColorTemperature(this, 500, 158);
}
