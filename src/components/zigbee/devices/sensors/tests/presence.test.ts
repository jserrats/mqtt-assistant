import { router } from "../../../../../router";
import { PresenceSensorZigbee } from "../presence";

jest.mock("../../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("PresenceSensorZigbee", () => {
	it("should trigger the callback", async () => {
		const mockCallback = jest.fn();

		const sensor = new PresenceSensorZigbee("test");
		sensor.occupancy.on("state", (value) => {
			expect(value).toBeTruthy();
			mockCallback();
		});
		router.route(sensor.topic, JSON.stringify({ occupancy: true }));
		expect(mockCallback).toHaveBeenCalled();
	});

	it("should update the occupancy correctly", async () => {
		const sensor = new PresenceSensorZigbee("test2");
		expect(sensor.occupancy.state).toBeUndefined();
		router.route(sensor.topic, JSON.stringify({ occupancy: true }));
		expect(sensor.occupancy.state).toBeTruthy();

		router.route(sensor.topic, JSON.stringify({ occupancy: false }));
		expect(sensor.occupancy.state).toBeFalsy();
	});

	it("should emit the correct states", async () => {
		const sensor = new PresenceSensorZigbee("test3");
		const mockCallbackTrue = jest.fn((callback) => {
			expect(callback).toBeTruthy();
		});
		const mockCallbackFalse = jest.fn((callback) => {
			expect(callback).toBeFalsy();
		});

		expect(sensor.occupancy.state).toBeUndefined();

		sensor.occupancy.once("state", mockCallbackTrue);

		router.route(sensor.topic, JSON.stringify({ occupancy: true }));
		expect(sensor.occupancy.state).toBeTruthy();

		expect(mockCallbackTrue).toHaveBeenCalled();

		sensor.occupancy.once("state", mockCallbackFalse);

		router.route(sensor.topic, JSON.stringify({ occupancy: false }));
		expect(sensor.occupancy.state).toBeFalsy();
		expect(mockCallbackFalse).toHaveBeenCalled();
	});
});
