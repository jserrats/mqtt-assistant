import { client } from "../../../mqtt";
import { router } from "../../../router";
import {
	type InboundLightZigbeeInfo,
	type InboundTemperatureLightZigbeeInfo,
	LightZigbee,
	TemperatureLightZigbee,
} from "../light";

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
		expect(light.state).toBeUndefined();
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
		expect(light.brightness).toBeUndefined();
		router.route(
			light.topic,
			JSON.stringify({ brightness: 50 } as InboundLightZigbeeInfo),
		);
		expect(light.brightness).toBe(50);
	});

	it("should turn on", async () => {
		light.setOn();
		expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
			`${light.topic}/set`,
		);
		expect(
			JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).state,
		).toStrictEqual("ON");
	});

	it("should turn on with options", async () => {
		expect(light.state).toBeFalsy();
		light.setOn({ brightness: 70 });
		expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
			`${light.topic}/set`,
		);
		expect(
			JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).state,
		).toStrictEqual("ON");
		expect(
			JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).brightness,
		).toStrictEqual(70);
	});

	it("should turn off", async () => {
		light.setOff();
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

describe("TemperatureLightZigbee", () => {
	let light: TemperatureLightZigbee;

	beforeAll(async () => {
		light = new TemperatureLightZigbee("test1");
	});

	afterEach(async () => {
		(client.publish as jest.Mock).mockClear();
	});

	it("should update color temp", async () => {
		expect(light.colorTemp).toBeUndefined();

		router.route(
			light.topic,
			JSON.stringify({ color_temp: 300 } as InboundTemperatureLightZigbeeInfo),
		);
		expect(light.colorTemp).toEqual(300);
	});

	it("should publish color temp", async () => {
		light.setColorTemp(300);
		expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
			`${light.topic}/set`,
		);
		expect(
			JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).color_temp,
		).toStrictEqual(300);
	});

	it("should turn on", async () => {
		light.setOn();

		expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
			`${light.topic}/set`,
		);
		expect(
			JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).state,
		).toStrictEqual("ON");
	});

	it("should turn on with options", async () => {
		expect(light.state).toBeFalsy();
		light.setOn({ color_temp: 300 });
		expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
			`${light.topic}/set`,
		);
		expect(
			JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).state,
		).toStrictEqual("ON");
		expect(
			JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).color_temp,
		).toStrictEqual(300);
	});
});
