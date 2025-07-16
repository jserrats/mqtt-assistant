import { client } from "../../../../../mqtt";
import { router } from "../../../../../router";
import { ESPHOME_TOPIC } from "../../../../../topics";
import { SwitchESPHome } from "../switch";
import {
	type TestSwitch,
	testSwitchFactory,
} from "../../../../interfaces/tests/switchTests";

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
		const mockCallbackTrue = jest.fn();
		const mockCallbackFalse = jest.fn();

		switchEsphome.on(switchEsphome.events.state, (state) => {
			if (state) {
				mockCallbackTrue();
			} else {
				mockCallbackFalse();
			}
		});

		expect(switchEsphome.state).toBe(undefined);
		router.route(`${ESPHOME_TOPIC}/test1/switch/test1/state`, "ON");
		expect(switchEsphome.state).toBeTruthy();
		expect(mockCallbackTrue).toHaveBeenCalled();

		router.route(`${ESPHOME_TOPIC}/test1/switch/test1/state`, "OFF");
		expect(switchEsphome.state).toBe(false);
		expect(mockCallbackFalse).toHaveBeenCalled();
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

	it("should be undefined when offline", async () => {
		router.route(`${ESPHOME_TOPIC}/test1/switch/test1/state`, "ON");
		expect(switchEsphome.state).toBeTruthy();

		router.route(`${ESPHOME_TOPIC}/test1/status`, "offline");
		expect(switchEsphome.state).toBeUndefined();
	});
});

class TestSwitchESPHome extends SwitchESPHome implements TestSwitch{ 
	mockStateUpdate(value: boolean) {
		router.route(
			`${ESPHOME_TOPIC}/${this.name.split(":")[0]}/switch/${this.name.split(":")[1]}/state`,
			value ? "ON" : "OFF",
		);
	}
}

testSwitchFactory(() => {
	return new TestSwitchESPHome("test", "test");
}, SwitchESPHome.name);

describe("SwitchESPHome", () => {
	let testSwitch: SwitchESPHome;

	beforeAll(async () => {
		testSwitch = new SwitchESPHome("test1", "test1");
	});

	it("should be undefined when offline", async () => {
		router.route(`${ESPHOME_TOPIC}/test1/switch/test1/state`, "ON");
		expect(testSwitch.state).toBeTruthy();

		router.route(`${ESPHOME_TOPIC}/test1/status`, "offline");
		expect(testSwitch.state).toBeUndefined();
	});
});
