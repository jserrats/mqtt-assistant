import { client } from "../../../mqtt";
import { router } from "../../../router";
import { ZigbeeDevice } from "../zigbee";

jest.mock("../../../../src/mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {
			router.route(newTopic, newPayload);
		}),
	},
}));

describe("ZigbeeComponent", () => {
	let zigbeeComponent: ZigbeeDevice;

	beforeAll(async () => {
		zigbeeComponent = new ZigbeeDevice("test1");
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
});
