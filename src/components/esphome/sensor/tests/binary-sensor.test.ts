import { router } from "../../../../router";
import { BinarySensorESPHome } from "../binary-sensor";

jest.mock("../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("BinarySensorESPHome", () => {
	it("should update state correctly", async () => {
		const sensor = new BinarySensorESPHome("test2", "test2");
		expect(sensor.state).toBeUndefined();
		router.route(sensor.trigger.on.topic, sensor.trigger.on.payload);
		expect(sensor.state).toBeTruthy();
		router.route(sensor.trigger.off.topic, sensor.trigger.off.payload);
		expect(sensor.state).toBeFalsy();
	});
});
