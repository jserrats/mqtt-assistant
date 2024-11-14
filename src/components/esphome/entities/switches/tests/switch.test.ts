import { client } from "../../../../../mqtt";
import { router } from "../../../../../router";
import { ESPHOME_TOPIC } from "../../../../../topics";
import { SwitchESPHome } from "../switch";

jest.mock("../../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("SwitchESPHome", () => {
	let switchEsphome: SwitchESPHome;

	beforeAll(async () => {
		switchEsphome = new SwitchESPHome("test1", "test1");
	});

	afterEach(async () => {
		(client.publish as jest.Mock).mockClear();
	});

	it("should update status", async () => {
		expect(switchEsphome.state).toBe(undefined);

		router.route(`${ESPHOME_TOPIC}/test1/switch/test1/state`, "ON");
		expect(switchEsphome.state).toBeTruthy();

		router.route(`${ESPHOME_TOPIC}/test1/switch/test1/state`, "OFF");
		expect(switchEsphome.state).toBe(false);
	});

	it("should turn on/off", async () => {
		switchEsphome.setOn();
		expect((client.publish as jest.Mock).mock.calls[0]).toStrictEqual([
			switchEsphome.commandTopic,
			"ON",
		]);
	});

	it("should toggle", async () => {
		switchEsphome.toggle();
		expect((client.publish as jest.Mock).mock.calls[0]).toStrictEqual([
			switchEsphome.commandTopic,
			"TOGGLE",
		]);
	});
});
