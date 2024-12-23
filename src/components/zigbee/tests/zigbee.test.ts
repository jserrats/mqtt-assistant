import { client } from "../../../mqtt";
import { router } from "../../../router";
import { AirSensorZigbee } from "../devices/sensors/base";
import { StatelessZigbeeDevice } from "../zigbee";

jest.mock("../../../../src/mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {
			router.route(newTopic, newPayload);
		}),
	},
}));

describe("StatelessZigbeeDevice", () => {
	let zigbeeComponent: StatelessZigbeeDevice;

	beforeAll(async () => {
		zigbeeComponent = new StatelessZigbeeDevice("test1");
	});

	afterEach(async () => {
		(client.publish as jest.Mock).mockClear();
	});

	it("should not crash with bad JSON", async () => {
		jest.spyOn(console, "error").mockImplementation(jest.fn());
		expect(() => {
			router.route(zigbeeComponent.topic, "asdf");
		}).not.toThrow();
	});

	it("should assign a name to the exposes", async () => {
		const sensor = new AirSensorZigbee("test");
		expect(sensor.temperature.name).toEqual("test:temperature");
	});
});
