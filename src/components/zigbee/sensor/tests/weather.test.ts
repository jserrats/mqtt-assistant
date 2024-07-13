import { router } from "../../../../router";
import {
	WeatherSensorZigbee,
	type WeatherSensorZigbeeComponentInfo,
} from "../weather";

jest.mock("../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("WeatherSensorZigbee", () => {
	it("should trigger the callback", async () => {
		const mockCallback = jest.fn();

		const sensor = new WeatherSensorZigbee("test", {
			updateCallback: mockCallback,
		});
		router.route(
			sensor.topic,
			JSON.stringify({ temperature: 10 } as WeatherSensorZigbeeComponentInfo),
		);
		expect(mockCallback).toHaveBeenCalled();
	});

	it("should update the temperature & humidity correctly", async () => {
		const sensor = new WeatherSensorZigbee("test2");
		expect(sensor.temperature).toBeUndefined();
		expect(sensor.humidity).toBeUndefined();

		router.route(
			sensor.topic,
			JSON.stringify({
				temperature: 10,
				humidity: 10,
			} as WeatherSensorZigbeeComponentInfo),
		);
		expect(sensor.temperature).toStrictEqual(10);
		expect(sensor.humidity).toStrictEqual(10);
	});
});
