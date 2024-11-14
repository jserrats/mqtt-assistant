import { router } from "../../../../../router";
import { PowerSensorZigbee } from "../base";

jest.mock("../../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("PowerSensorZigbee", () => {
	it("should trigger the callback", async () => {
		const mockCallback = jest.fn();

		const sensor = new PowerSensorZigbee("test");
		expect(sensor.power).toBeDefined();
		sensor.power.on(sensor.power.events.state, mockCallback);
		router.route(sensor.topic, JSON.stringify({ power: 10 }));
		expect(mockCallback).toHaveBeenCalled();
	});

	it("should update the power correctly", async () => {
		const sensor = new PowerSensorZigbee("test2");
		expect(sensor.power.state).toBeUndefined();

		router.route(
			sensor.topic,
			JSON.stringify({
				power: 10,
				current: 5,
				voltage: 100,
			}),
		);
		expect(sensor.power.state).toStrictEqual(10);
		expect(sensor.current.state).toStrictEqual(5);
		expect(sensor.voltage.state).toStrictEqual(100);
	});
});
