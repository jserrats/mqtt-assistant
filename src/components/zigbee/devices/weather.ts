import { exposes } from "../exposes";
import { ZigbeeDevice } from "../zigbee";

export class WeatherSensorZigbee extends ZigbeeDevice {
	temperature = new exposes.ExposesTemperature()
	humidity = new exposes.ExposesHumidity()
}

export class TH01Z extends WeatherSensorZigbee {

}

export class WSD500A extends WeatherSensorZigbee {

}