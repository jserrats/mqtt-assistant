import { client } from "../../mqtt";
import { router } from "../../router";
import { Alarm } from "../alarm";
import type { BinarySensorESPHome } from "../esphome/entities/sensors/binary-sensor";
import { ClosureSensorZigbee } from "../zigbee/devices/sensors/base";
import type { ExposesContact } from "../zigbee/exposes/exposes";

jest.mock("../../../src/mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {
			router.route(newTopic, newPayload);
		}),
	},
}));

describe("Alarm", () => {
	let alarm: Alarm;
	const calls: Record<string, string> = {};
	const sensors: (ExposesContact | BinarySensorESPHome)[] = [];
	const topics: string[] = [];

	beforeAll(async () => {
		[...Array(3).keys()].forEach((element: number) => {
			const newSensor = new ClosureSensorZigbee(
				`testSensor${Number.toString()}`,
			);
			sensors.push(newSensor.contact);
			topics.push(newSensor.topic);
		});

		alarm = new Alarm("TestAlarm", sensors);

		(client.publish as jest.Mock).mock.calls.forEach((element) => {
			calls[element[0]] = element[1];
		});
	});

	it("should start false", async () => {
		expect(alarm.state).toBeFalsy();
	});

	it("should set true if all sensors close", async () => {
		const payload = {
			contact: true,
			linkquality: 10,
		};
		topics.forEach((topic) => {
			client.publish(topic, JSON.stringify(payload));
		});
		expect(alarm.state).toBeTruthy();
	});

	it("should be false if one sensor opens", async () => {
		const payload = {
			contact: false,
			linkquality: 10,
		};
		client.publish(topics[0], JSON.stringify(payload));
		expect(alarm.state).toBe(false);
	});
});
