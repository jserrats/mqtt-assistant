import { router } from "../../../router";
import { BASE_TOPIC } from "../../../topics";
import { BinaryMQTTSensor } from "../binary-sensor";

jest.mock("../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("BinaryMQTTSensor", () => {
	it("should update state correctly", async () => {
		const sensor = new BinaryMQTTSensor("test");
		expect(sensor.state).toBeUndefined();
		router.route(`${BASE_TOPIC}test`, "ON");
		expect(sensor.state).toBeTruthy();
		router.route(`${BASE_TOPIC}test`, "OFF");
		expect(sensor.state).toBeFalsy();
	});

	it("should emit the correct states", async () => {
		const sensor = new BinaryMQTTSensor("test3");
		const mockCallbackTrue = jest.fn((callback) => {});
		const mockCallbackFalse = jest.fn((callback) => {});

		expect(sensor.state).toBeUndefined();

		sensor.on(sensor.events.state, mockCallbackTrue);
		router.route(`${BASE_TOPIC}test3`, "ON");
		expect(sensor.state).toBeTruthy();
		expect(mockCallbackTrue).toHaveBeenCalled();

		sensor.on(sensor.events.state, mockCallbackFalse);
		router.route(`${BASE_TOPIC}test3`, "OFF");
		expect(sensor.state).toBeFalsy();
		expect(mockCallbackFalse).toHaveBeenCalled();
	});
});
