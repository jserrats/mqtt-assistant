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
