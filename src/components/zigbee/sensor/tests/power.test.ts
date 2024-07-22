import { router } from "../../../../router";
import {
	PowerSensorZigbee,
	type PowerSensorZigbeeComponentInfo,
} from "../power";

jest.mock("../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("PowerSensorZigbee", () => {
	it("should trigger the callback", async () => {
		const mockCallback = jest.fn();

		const sensor = new PowerSensorZigbee("test", {
			updateCallback: mockCallback,
		});
		router.route(
			sensor.topic,
			JSON.stringify({ power: 10 } as PowerSensorZigbeeComponentInfo),
		);
		expect(mockCallback).toHaveBeenCalled();
	});

	it("should update the power correctly", async () => {
		const sensor = new PowerSensorZigbee("test2");
		expect(sensor.power).toBeUndefined();

		router.route(
			sensor.topic,
			JSON.stringify({
				power: 10,
			} as PowerSensorZigbeeComponentInfo),
		);
		expect(sensor.power).toStrictEqual(10);
	});
});
