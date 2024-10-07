import { router } from "../../../router";
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
		router.route(sensor.trigger.on.topic, sensor.trigger.on.payload);
		expect(sensor.state).toBeTruthy();
		router.route(sensor.trigger.off.topic, sensor.trigger.off.payload);
		expect(sensor.state).toBeFalsy();
	});
});
