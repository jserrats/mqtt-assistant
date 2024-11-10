import { client } from "../../../../../mqtt";
import { router } from "../../../../../router";
import { SwitchZigbee } from "../switch";

jest.mock("../../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {
			router.route(newTopic, newPayload);
		}),
	},
}));

jest.useFakeTimers();

describe("Switch", () => {
	let switchDevice: SwitchZigbee;

	beforeAll(async () => {
		switchDevice = new SwitchZigbee("test1");
	});

	afterEach(async () => {
		(client.publish as jest.Mock).mockClear();
	});

	it("should update status", async () => {
		expect(switchDevice.state).toBeUndefined();

		client.publish(switchDevice.topic, JSON.stringify({ state: "ON" }));
		expect(switchDevice.state).toBe(true);
		client.publish(switchDevice.topic, JSON.stringify({ state: "OFF" }));
		expect(switchDevice.state).toBe(false);
	});

	it("should turn on/off", async () => {
		switchDevice.setOn();
		expect(
			JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).state,
		).toStrictEqual("ON");
	});

	it("should toggle", async () => {
		switchDevice.toggle();
		expect((client.publish as jest.Mock).mock.calls[0]).toStrictEqual([
			switchDevice.setTopic,
			"TOGGLE",
		]);
	});

	it("should be named", async () => {
		expect(switchDevice.name).toBe("test1");
	});
});
