import type { Switch } from "../interfaces/switch";
import { type InboundZigbeeInfo, ZigbeeComponent } from "./zigbee";

export class LightZigbee extends ZigbeeComponent implements Switch {
	protected setTopic = `${this.topic}/set`;
	public state: boolean;
	public brightness = 254;

	setBrightness(level: number) {
		if (level > 0 && level < 255) {
			this.brightness = level;
		}
		// apply new brightness only if the light is already on
		if (this.state) {
			this.set(true);
		}
	}

	setOn(options?: LightOptions) {
		if (typeof options?.brightness !== "undefined") {
			this.setBrightness(options.brightness);
		}
		this.set(true);
	}

	setOff() {
		this.set(false);
	}

	toggle() {
		this.set("toggle");
	}

	protected set(order: boolean | "toggle") {
		if (typeof order === "boolean") {
			this.client.publish(
				this.setTopic,
				JSON.stringify({
					state: order ? "ON" : "OFF",
					...this.getOptions(),
				}),
			);
		} else {
			this.client.publish(this.setTopic, "TOGGLE");
		}
	}

	protected getOptions() {
		return { brightness: this.brightness };
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

/**
 * TRADFRI bulb E26/27, white spectrum, globe, opal, 1055/1100/1160 lm
 */
export class TemperatureLightZigbee extends LightZigbee {
	protected colorTemp = 250;

	/**Sets Light color temp in mired scale. @param colorTemp 250 (normal) to 454 (warm)*/
	setColorTemp(colorTemp: number) {
		if (colorTemp > 249 && colorTemp < 455) {
			this.colorTemp = colorTemp;
		}
		// apply new color only if the light is already on
		if (this.state) {
			this.set(true);
		}
	}

	/**
	 *
	 * @param brightness (0-254)
	 * @param colorTemp (250-454)
	 */
	setOn(options?: TemperatureLightOptions) {
		if (typeof options?.colorTemp !== "undefined") {
			this.setColorTemp(options.colorTemp);
		}
		const brightness: number | undefined = options?.brightness;

		super.setOn({ brightness });
	}

	protected getOptions() {
		return { color_temp: this.colorTemp, ...super.getOptions() };
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

type InboundTemperatureLightZigbeeInfo = {
	color_temp: number;
} & InboundLightZigbeeInfo;

type LightOptions = {
	brightness?: number;
};

type TemperatureLightOptions = {
	colorTemp?: number;
} & LightOptions;
