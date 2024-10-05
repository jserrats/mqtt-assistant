import { router } from "../../../../router";
import {
	ClosureSensorZigbee,
	type ClosureSensorZigbeeComponentInfo,
} from "../closure";

jest.mock("../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => { }),
	},
}));

describe("ClosureSensorZigbee", () => {
	it("should trigger the callback", async () => {
		const mockCallback = jest.fn();

		const sensor = new ClosureSensorZigbee("test", {
			updateCallback: mockCallback,
		});
		router.route(
			sensor.topic,
			JSON.stringify({ contact: true } as ClosureSensorZigbeeComponentInfo),
		);

		expect(mockCallback).toHaveBeenCalled();
	});

	it("should update the closure correctly", async () => {
		const sensor = new ClosureSensorZigbee("test2");
		expect(sensor.contact).toBeUndefined();
		router.route(
			sensor.topic,
			JSON.stringify({ contact: true } as ClosureSensorZigbeeComponentInfo),
		);
		expect(sensor.contact).toBeTruthy();
		router.route(
			sensor.topic,
			JSON.stringify({ contact: false } as ClosureSensorZigbeeComponentInfo),
		);
		expect(sensor.contact).toBeFalsy();
	});

	it("should also update the closure correctly if inverted", async () => {
		const sensor = new ClosureSensorZigbee("test3", { inverted: true });
		expect(sensor.contact).toBeUndefined();

		router.route(
			sensor.topic,
			JSON.stringify({ contact: true } as ClosureSensorZigbeeComponentInfo),
		);
		expect(sensor.contact).toBeFalsy();

		router.route(
			sensor.topic,
			JSON.stringify({ contact: false } as ClosureSensorZigbeeComponentInfo),
		);
		expect(sensor.contact).toBeTruthy();
	});

	it("should emit the correct states", async () => {
		const closureSensor = new ClosureSensorZigbee("test3");
		const mockCallbackTrue = jest.fn((callback) => { expect(callback).toBeTruthy() });
		const mockCallbackFalse = jest.fn((callback) => { expect(callback).toBeFalsy() });

		expect(closureSensor.contact).toBeUndefined();

		closureSensor.once("state", mockCallbackTrue);

		router.route(
			closureSensor.topic,
			JSON.stringify({ contact: true } as ClosureSensorZigbeeComponentInfo),
		);

		expect(closureSensor.contact).toBeTruthy();
		expect(mockCallbackTrue).toHaveBeenCalled();

		closureSensor.once("state", mockCallbackFalse);
		
		router.route(
			closureSensor.topic,
			JSON.stringify({ contact: false } as ClosureSensorZigbeeComponentInfo),
		);
		expect(closureSensor.contact).toBeFalsy();
		expect(mockCallbackFalse).toHaveBeenCalled();
	});
});
