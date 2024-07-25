import { router } from "../../../../router";
import { SensorESPHome } from "../sensor";

jest.mock("../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("SensorESPHome", () => {
	it("should update state correctly", async () => {
		const sensor = new SensorESPHome("test2", "test2");
		expect(sensor.state).toBeUndefined();
		router.route(sensor.trigger.all.topic, "1234.5");
		expect(sensor.state).toStrictEqual(1234.5);
	});

	it("should trigger the callback", async () => {
		const mockCallback = jest.fn();

		const sensor = new SensorESPHome("test", "test", {
			updateCallback: mockCallback,
		});

		router.route(sensor.trigger.all.topic, "1234");
		expect(mockCallback).toHaveBeenCalled();
	});
});
