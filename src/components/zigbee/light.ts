import { type InboundZigbeeInfo, ZigbeeComponent } from "./zigbee";

export class LightZigbee extends ZigbeeComponent {
	protected setTopic = `${this.topic}/set`;
	public state = false;
	protected brightness = 254;

	setBrightness(level: number) {
		if (level > 0 && level < 255) {
			this.brightness = level;
		}
		// apply new brightness only if the light is already on
		if (this.state) {
			this.set(true);
		}
	}

	on(options?: LightOptions) {
		if (typeof options?.brightness !== "undefined") {
			this.setBrightness(options.brightness);
		}
		this.set(true);
	}

	off() {
		this.set(false);
	}

	toggle() {
		this.set(!this.state);
	}

	protected set(order: boolean) {
		this.client.publish(
			this.setTopic,
			JSON.stringify({
				state: order ? "ON" : "OFF",
				...this.getOptions(),
			}),
		);
	}

	protected getOptions() {
		return { brightness: this.brightness };
	}

	updateComponent(message: InboundLightZigbeeInfo): void {
		this.state = message.state === "ON";
		this.brightness = message.brightness;
		super.updateComponent(message);
	}
}

/**
 * TRADFRI bulb E26/27, white spectrum, globe, opal, 1055/1100/1160 lm
 */
export class LightLED1623G12 extends LightZigbee {
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
	on(options?: TemperatureLightOptions) {
		if (typeof options?.colorTemp !== "undefined") {
			this.setColorTemp(options.colorTemp);
		}
		const brightness: number | undefined = options?.brightness;

		super.on({ brightness });
	}

	protected getOptions() {
		return { color_temp: this.colorTemp, ...super.getOptions() };
	}

	updateComponent(message: InboundTemperatureLightZigbeeInfo): void {
		this.colorTemp = message.color_temp;
		super.updateComponent(message);
	}
}

type InboundLightZigbeeInfo = {
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
