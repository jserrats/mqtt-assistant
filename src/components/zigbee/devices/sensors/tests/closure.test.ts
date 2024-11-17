import { router } from "../../../../../router";
import { ClosureSensorZigbee } from "../base";

jest.mock("../../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => { }),
	},
}));

describe("ClosureSensorZigbee", () => {
	it("should trigger the callback", async () => {
		const mockCallback = jest.fn();

		const sensor = new ClosureSensorZigbee("test");
		sensor.contact.on(sensor.contact.events.state, (value) => {
			expect(value).toBeTruthy();
			mockCallback();
		});
		router.route(sensor.topic, JSON.stringify({ contact: true }));

		expect(mockCallback).toHaveBeenCalled();
	});

	it("should update the closure correctly", async () => {
		const sensor = new ClosureSensorZigbee("test2");
		expect(sensor.contact.state).toBeUndefined();
		router.route(sensor.topic, JSON.stringify({ contact: true }));
		expect(sensor.contact.state).toBeTruthy();
		router.route(sensor.topic, JSON.stringify({ contact: false }));
		expect(sensor.contact.state).toBeFalsy();
	});

	it("should also update the closure correctly if inverted", async () => {
		const sensor = new ClosureSensorZigbee("test3", true);
		expect(sensor.contact.state).toBeUndefined();

		router.route(sensor.topic, JSON.stringify({ contact: true }));
		expect(sensor.contact.state).toBeFalsy();

		router.route(sensor.topic, JSON.stringify({ contact: false }));
		expect(sensor.contact.state).toBeTruthy();
	});

	// TODO: fix this test
	it("should emit the correct states", async () => {
		const mockCallbackTrue = jest.fn();
		const mockCallbackFalse = jest.fn();

		const sensor = new ClosureSensorZigbee("test4");

		sensor.contact.on(sensor.contact.events.state, (value) => { if (value) { mockCallbackTrue() } else { mockCallbackFalse() } })
		router.route(
			sensor.topic,
			JSON.stringify({ contact: true }),
		);
		expect(mockCallbackTrue).toHaveBeenCalled();

		router.route(
			sensor.topic,
			JSON.stringify({ contact: false }),
		);
		expect(mockCallbackFalse).toHaveBeenCalled();
	});
});
