import { exposes } from "../exposes";
import { SwitchZigbee } from "./switch";

export class LightZigbee extends SwitchZigbee {
}

export class BrightLightZigbee extends LightZigbee {
	brightness = new exposes.ExposesBrightness(this, 254, 5);
}

export class TemperatureLightZigbee extends SwitchZigbee {
	colorTemp = new exposes.ExposesColorTemperature(this, 454, 250)
	brightness = new exposes.ExposesBrightness(this, 254, 5);
}

/**
 * TRADFRI bulb E26/27, white spectrum, globe, opal, 1055/1100/1160 lm
 */
export class LightLED1623G12 extends TemperatureLightZigbee { }
