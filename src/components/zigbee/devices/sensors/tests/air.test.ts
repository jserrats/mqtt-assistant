import { router } from "../../../../../router";
import { AirSensorZigbee } from "../base";

jest.mock("../../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("AirSensorZigbee", () => {
	it("should trigger the observe", async () => {
		const mockCallback = jest.fn();

		const sensor = new AirSensorZigbee("test");
		sensor.temperature.on(sensor.temperature.events.state, () => {
			mockCallback();
		});
		router.route(sensor.topic, JSON.stringify({ temperature: 10 }));
		expect(mockCallback).toHaveBeenCalled();
	});

	// it("should trigger the observe on the main device", async () => {
	// 	const mockCallback = jest.fn();

	// 	const sensor = new AirSensorZigbee("test2");
	// 	sensor.on(sensor.temperature.events.state, () => {
	// 		mockCallback();
	// 	});
	// 	router.route(sensor.topic, JSON.stringify({ temperature: 10 }));
	// 	expect(mockCallback).toHaveBeenCalled();
	// });

	it("should update the temperature & humidity correctly", async () => {
		const sensor = new AirSensorZigbee("test2");
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
