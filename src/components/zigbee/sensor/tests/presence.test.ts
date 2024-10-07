import { router } from "../../../../router";
import {
	PresenceSensorZigbee,
	type PresenceSensorZigbeeComponentInfo,
} from "../presence";

jest.mock("../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("PresenceSensorZigbee", () => {
	it("should trigger the callback", async () => {
		const mockCallback = jest.fn();

		const sensor = new PresenceSensorZigbee("test", {
			updateCallback: mockCallback,
		});
		router.route(
			sensor.topic,
			JSON.stringify({ occupancy: true } as PresenceSensorZigbeeComponentInfo),
		);
		expect(mockCallback).toHaveBeenCalled();
	});
	it("should update the occupancy correctly", async () => {
		const sensor = new PresenceSensorZigbee("test2");
		expect(sensor.occupancy).toBeUndefined();
		router.route(
			sensor.topic,
			JSON.stringify({ occupancy: true } as PresenceSensorZigbeeComponentInfo),
		);
		expect(sensor.occupancy).toBeTruthy();
		router.route(
			sensor.topic,
			JSON.stringify({ occupancy: false } as PresenceSensorZigbeeComponentInfo),
		);
		expect(sensor.occupancy).toBeFalsy();
	});

	it("should emit the correct states", async () => {
		const sensor = new PresenceSensorZigbee("test3");
		const mockCallbackTrue = jest.fn((callback) => {
			expect(callback).toBeTruthy();
		});
		const mockCallbackFalse = jest.fn((callback) => {
			expect(callback).toBeFalsy();
		});

		expect(sensor.occupancy).toBeUndefined();

		sensor.once("state", mockCallbackTrue);

		router.route(
			sensor.topic,
			JSON.stringify({ occupancy: true } as PresenceSensorZigbeeComponentInfo),
		);
		expect(sensor.occupancy).toBeTruthy();

		expect(mockCallbackTrue).toHaveBeenCalled();

		sensor.once("state", mockCallbackFalse);

		router.route(
			sensor.topic,
			JSON.stringify({ occupancy: false } as PresenceSensorZigbeeComponentInfo),
		);
		expect(sensor.occupancy).toBeFalsy();
		expect(mockCallbackFalse).toHaveBeenCalled();
	});
});
