import { router } from "../../../../../router";
import { ESPHOME_TOPIC } from "../../../../../topics";
import { SensorESPHome } from "../sensor";

jest.mock("../../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("SensorESPHome", () => {
	it("should update state correctly", async () => {
		const sensor = new SensorESPHome("test2", "test2");
		expect(sensor.state).toBeUndefined();
		router.route(`${ESPHOME_TOPIC}/test2/sensor/test2/state`, "1234.5");
		expect(sensor.state).toStrictEqual(1234.5);
	});

	it("should trigger the callback", async () => {
		const mockCallback = jest.fn();

		const sensor = new SensorESPHome("test", "test");
		sensor.on(sensor.events.state, mockCallback);
		router.route(`${ESPHOME_TOPIC}/test/sensor/test/state`, "1234");
		expect(mockCallback).toHaveBeenCalled();
	});
});
