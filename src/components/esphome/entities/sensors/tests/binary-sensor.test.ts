import { router } from "../../../../../router";
import { ESPHOME_TOPIC } from "../../../../../topics";
import {
	type TestBooleanSensor,
	testBooleanSensorFactory,
} from "../../../../interfaces/tests/sensorTests";
import { BinarySensorESPHome } from "../binary-sensor";

jest.mock("../../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

class TestBinarySensorESPHome
	extends BinarySensorESPHome
	implements TestBooleanSensor
{
	mockStateUpdate(value: boolean) {
		router.route(
			`${ESPHOME_TOPIC}/${this.name.split(":")[0]}/binary_sensor/${this.name.split(":")[1]}/state`,
			value ? "ON" : "OFF",
		);
	}
}

testBooleanSensorFactory(() => {
	return new TestBinarySensorESPHome("test", "test");
}, BinarySensorESPHome.name);

describe("BinarySensorESPHome", () => {
	let binarySensor: BinarySensorESPHome;

	beforeAll(async () => {
		binarySensor = new BinarySensorESPHome("test1", "test1");
	});

	it("should be undefined when offline", async () => {
		router.route(`${ESPHOME_TOPIC}/test1/binary_sensor/test1/state`, "ON");
		expect(binarySensor.state).toBeTruthy();

		router.route(`${ESPHOME_TOPIC}/test1/status`, "offline");
		expect(binarySensor.state).toBeUndefined();
	});
});
