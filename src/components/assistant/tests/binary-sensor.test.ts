import { router } from "../../../router";
import { BinaryMQTTSensor } from "../binary-sensor";

jest.mock("../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => { }),
	},
}));

describe("BinaryMQTTSensor", () => {
	it("should update state correctly", async () => {
		const sensor = new BinaryMQTTSensor("test");
		expect(sensor.state).toBeUndefined();
		router.route(sensor.trigger.on.topic, sensor.trigger.on.payload);
		expect(sensor.state).toBeTruthy();
		router.route(sensor.trigger.off.topic, sensor.trigger.off.payload);
		expect(sensor.state).toBeFalsy();
	});

	it("should emit the correct states", async () => {
		const sensor = new BinaryMQTTSensor("test3");
		const mockCallbackTrue = jest.fn((callback) => {
			expect(callback).toBeTruthy();
		});
		const mockCallbackFalse = jest.fn((callback) => {
			expect(callback).toBeFalsy();
		});

		expect(sensor.state).toBeUndefined();

		sensor.once("state", mockCallbackTrue);
		router.route(sensor.trigger.on.topic, sensor.trigger.on.payload);
		expect(sensor.state).toBeTruthy();
		expect(mockCallbackTrue).toHaveBeenCalled();
		
		sensor.once("state", mockCallbackFalse);
		router.route(sensor.trigger.off.topic, sensor.trigger.off.payload);
		expect(sensor.state).toBeFalsy();
		expect(mockCallbackFalse).toHaveBeenCalled();
	});
});
