import { client } from "../../../mqtt";
import { router } from "../../../router";
import { type InboundLightZigbeeInfo, LightZigbee } from "../light";

jest.mock("../../../../src/mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {
			router.route(newTopic, newPayload);
		}),
	},
}));

jest.useFakeTimers();

describe("LightZigbee", () => {
	let light: LightZigbee;

	beforeAll(async () => {
		light = new LightZigbee("test1");
	});

	afterEach(async () => {
		(client.publish as jest.Mock).mockClear();
	});

	it("should update status", async () => {
		router.route(
			light.topic,
			JSON.stringify({ state: "ON" } as InboundLightZigbeeInfo),
		);
		expect(light.state).toBe(true);
		router.route(
			light.topic,
			JSON.stringify({ state: "OFF" } as InboundLightZigbeeInfo),
		);
		expect(light.state).toBe(false);
	});

	it("should update brightness", async () => {
		router.route(
			light.topic,
			JSON.stringify({ brightness: 50 } as InboundLightZigbeeInfo),
		);
		expect(light.brightness).toBe(50);
	});

	it("should turn on", async () => {
		light.on();
		expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
			`${light.topic}/set`,
		);
		expect(
			JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).state,
		).toStrictEqual("ON");
	});

	it("should turn off", async () => {
		light.off();
		expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
			`${light.topic}/set`,
		);
		expect(
			JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).state,
		).toStrictEqual("OFF");
	});

	it("should toggle", async () => {
		light.toggle();
		expect((client.publish as jest.Mock).mock.calls[0]).toStrictEqual([
			`${light.topic}/set`,
			"TOGGLE",
		]);
	});
});
