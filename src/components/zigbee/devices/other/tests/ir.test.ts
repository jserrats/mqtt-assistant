import { client } from "../../../../../mqtt";
import { router } from "../../../../../router";
import { IriHF8260 } from "../ir";

jest.mock("../../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {
			router.route(newTopic, newPayload);
		}),
	},
}));

jest.useFakeTimers();

describe("IRZigbee", () => {
	let ir: IriHF8260;

	beforeAll(async () => {
		ir = new IriHF8260("test1");
	});

	afterEach(async () => {
		(client.publish as jest.Mock).mockClear();
	});

	it("should update status", async () => {
		expect(ir.learnIrCode.state).toBeUndefined();
		router.route(ir.topic, JSON.stringify({ learn_ir_code: "ON" }));
		expect(ir.learnIrCode.state).toBe(true);
		
		router.route(ir.topic, JSON.stringify({ learn_ir_code: "OFF" }));
		expect(ir.learnIrCode.state).toBe(false);
	});

	it("should turn on", async () => {
		ir.setLearnIrCode(true);
		expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
			`${ir.topic}/set`,
		);
		expect(
			JSON.parse((client.publish as jest.Mock).mock.calls[0][1])["learn_ir_code"],
		).toStrictEqual("ON");
	});

	it("should turn off", async () => {
		ir.setLearnIrCode(false);
		expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
			`${ir.topic}/set`,
		);
		expect(
			JSON.parse((client.publish as jest.Mock).mock.calls[0][1])["learn_ir_code"],
		).toStrictEqual("OFF");
	});
});
