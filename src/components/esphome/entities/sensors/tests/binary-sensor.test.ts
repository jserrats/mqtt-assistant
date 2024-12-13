import { router } from "../../../../../router";
import { ESPHOME_TOPIC } from "../../../../../topics";
import { BinarySensorESPHome } from "../binary-sensor";

jest.mock("../../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

//TODO write reusable tests
class TestBinarySensorESPHome extends BinarySensorESPHome {
	mockStateUpdate(value: boolean) {
		router.route(
			`${ESPHOME_TOPIC}/${this.name.split(":")[0]}/binary_sensor/${this.name.split(":")[1]}/state`,
			value ? "ON" : "OFF",
		);
	}
}

describe("BinarySensorESPHome", () => {
	it("should update state correctly", async () => {
		const sensor = new TestBinarySensorESPHome("test2", "test2");
		expect(sensor.state).toBeUndefined();
		sensor.mockStateUpdate(true);
		expect(sensor.state).toBeTruthy();
		sensor.mockStateUpdate(false);
		expect(sensor.state).toBeFalsy();
	});

	it("should trigger the callback", async () => {
		const mockCallback = jest.fn();
		const sensor = new BinarySensorESPHome("test", "test");
		expect(sensor.state).toBeUndefined();
		sensor.on(sensor.events.state, () => {
			mockCallback();
		});
		router.route(`${ESPHOME_TOPIC}/test/binary_sensor/test/state`, "ON");
		expect(sensor.state).toBeTruthy();
		expect(mockCallback).toHaveBeenCalled();
	});

	it("should trigger boolean specific events", async () => {
		const mockCallbackTrue = jest.fn();
		const mockCallbackFalse = jest.fn();
		const sensor = new BinarySensorESPHome("test", "test");
		sensor.on(sensor.events.on, (value) => {
			mockCallbackTrue();
			expect(sensor.state).toStrictEqual(true);
		});
		sensor.on(sensor.events.off, (value) => {
			mockCallbackFalse();
			expect(sensor.state).toStrictEqual(false);
		});
		expect(mockCallbackTrue).toHaveBeenCalledTimes(0);
		expect(mockCallbackFalse).toHaveBeenCalledTimes(0);

		router.route(`${ESPHOME_TOPIC}/test/binary_sensor/test/state`, "OFF");
		expect(mockCallbackTrue).toHaveBeenCalledTimes(0);
		expect(mockCallbackFalse).toHaveBeenCalledTimes(1);

		router.route(`${ESPHOME_TOPIC}/test/binary_sensor/test/state`, "ON");
		expect(mockCallbackTrue).toHaveBeenCalledTimes(1);
		expect(mockCallbackFalse).toHaveBeenCalledTimes(1);
	});
});
