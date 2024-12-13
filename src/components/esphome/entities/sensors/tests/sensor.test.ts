import { router } from "../../../../../router";
import { ESPHOME_TOPIC } from "../../../../../topics";
import {
	type TestNumericSensor,
	testNumericSensorFactory,
} from "../../../../interfaces/tests/sensorTests";
import { SensorESPHome } from "../sensor";

jest.mock("../../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

class testSensorESPHome extends SensorESPHome implements TestNumericSensor {
	mockStateUpdate(value: number) {
		router.route(
			`${ESPHOME_TOPIC}/${this.name.split(":")[0]}/sensor/${this.name.split(":")[1]}/state`,
			value.toString(),
		);
	}
}

testNumericSensorFactory(() => {
	return new testSensorESPHome("test", "test");
}, SensorESPHome.name);
