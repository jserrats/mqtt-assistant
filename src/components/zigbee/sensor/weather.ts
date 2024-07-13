import type { InboundZigbeeInfo } from "../zigbee";
import { GenericZigbeeSensor } from "./sensor";

export class WeatherSensorZigbee extends GenericZigbeeSensor {
	temperature: number | undefined;
	humidity: number | undefined;

	updateComponent(message: WeatherSensorZigbeeComponentInfo): void {
		this.temperature = message.temperature;
		this.humidity = message.humidity;
		super.updateComponent(message);
	}
}

export type WeatherSensorZigbeeComponentInfo = {
	temperature: number;
	humidity: number;
} & InboundZigbeeInfo;
