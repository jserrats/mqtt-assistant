import { router } from "../../../../../router";
import { WeatherSensorZigbee } from "../weather";

jest.mock("../../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("WeatherSensorZigbee", () => {
	it("should trigger the observe", async () => {
		const mockCallback = jest.fn();

		const sensor = new WeatherSensorZigbee("test");
		sensor.temperature.on("temperature", () => {
			mockCallback();
		});
		router.route(sensor.topic, JSON.stringify({ temperature: 10 }));
		expect(mockCallback).toHaveBeenCalled();
	});

	it("should update the temperature & humidity correctly", async () => {
		const sensor = new WeatherSensorZigbee("test2");
		expect(sensor.temperature.state).toBeUndefined();
		expect(sensor.humidity.state).toBeUndefined();

		router.route(
			sensor.topic,
			JSON.stringify({
				temperature: 10,
				humidity: 10,
			}),
		);
		expect(sensor.temperature.state).toStrictEqual(10);
		expect(sensor.humidity.state).toStrictEqual(10);
	});
});
