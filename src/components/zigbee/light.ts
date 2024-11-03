import type { Switch } from "../interfaces/switch";
import { telegram } from "../telegram";
import { type InboundZigbeeInfo, ZigbeeComponent } from "./zigbee";

export class LightZigbee extends ZigbeeComponent implements Switch {
	protected setTopic = `${this.topic}/set`;
	public state: boolean;
	public brightness = 254;
	private static maxBrightness = 254
	private static minBrightness = 5

	setBrightness(level: number) {
		if (this.validBrightnessValue(level)) {
			this.set(this.state, { brightness: level } as LightOptions);
		}
	}

	setOn(options?: LightOptions) {
		if (options !== undefined) {
			if (options.brightness !== undefined && this.validBrightnessValue(options.brightness) || options.brightness === undefined) {
				this.set(true, options);
			}
		} else {
			this.set(true);
		}

	}

	setOff() {
		this.set(false);
	}

	toggle() {
		this.set("toggle");
	}

	protected set(order: boolean | "toggle", options?: LightOptions) {
		if (typeof order === "boolean") {
			this.client.publish(
				this.setTopic,
				JSON.stringify({
					state: order ? "ON" : "OFF",
					...options,
				}),
			);
		} else {
			this.client.publish(this.setTopic, "TOGGLE");
		}
	}

	private validBrightnessValue(value: number): boolean {
		if (value > LightZigbee.maxBrightness && value < LightZigbee.minBrightness) {
			telegram.warning(`Brightness value ${value} out of bounds for light ${this.name}`)
			return false
		} else {
			return true
		}
	}
	updateComponent(message: InboundLightZigbeeInfo): void {
		if (this.state !== (message.state === "ON")) {
			this.state = message.state === "ON";
			this.emit("state", this.state);
		}
		this.brightness = message.brightness;
		super.updateComponent(message);
	}
}

export class TemperatureLightZigbee extends LightZigbee {
	public colorTemp;
	private static maxColorTemp = 454;
	private static minColorTemp = 250;

	/**Sets Light color temp in mired scale. @param colorTemp 250 (normal) to 454 (warm)*/
	setColorTemp(colorTemp: number) {
		if (
			colorTemp >= TemperatureLightZigbee.minColorTemp &&
			colorTemp <= TemperatureLightZigbee.maxColorTemp
		) {
			this.set(this.state, {
				color_temp: colorTemp,
			} as InboundTemperatureLightZigbeeInfo);
		}
	}

	/**
	 *
	 * @param brightness (0-254)
	 * @param colorTemp (250-454)
	 */
	setOn(options?: TemperatureLightOptions) {
		if (
			(typeof options?.color_temp !== "undefined" &&
				options?.color_temp >= TemperatureLightZigbee.minColorTemp &&
				options?.color_temp <= TemperatureLightZigbee.maxColorTemp) ||
			typeof options?.color_temp === "undefined"
		) {
			super.setOn(options);
		} else {
			telegram.warning(`Warm value ${options} out of bounds for light ${this.name}`)
		}
	}

	updateComponent(message: InboundTemperatureLightZigbeeInfo): void {
		this.colorTemp = message.color_temp;
		super.updateComponent(message);
	}
}

export type InboundLightZigbeeInfo = {
	state: string;
	brightness: number;
} & InboundZigbeeInfo;

export type InboundTemperatureLightZigbeeInfo = {
	color_temp: number;
} & InboundLightZigbeeInfo;

type LightOptions = {
	brightness?: number;
};

export type TemperatureLightOptions = {
	color_temp?: number;
} & LightOptions;

/**
 * TRADFRI bulb E26/27, white spectrum, globe, opal, 1055/1100/1160 lm
 */
export class LightLED1623G12 extends TemperatureLightZigbee {

}