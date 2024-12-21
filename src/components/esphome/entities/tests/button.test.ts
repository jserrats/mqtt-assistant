import { client } from "../../../../mqtt";
import { ESPHOME_TOPIC } from "../../../../topics";
import { ButtonESPHome } from "../button";

jest.mock("../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

class TestESPHomeButton extends ButtonESPHome {
	public declare commandTopic: string;
}

describe("SwitchESPHome", () => {
	let button: TestESPHomeButton;

	beforeAll(async () => {
		button = new TestESPHomeButton("test1", "test1");
	});

	afterEach(async () => {
		(client.publish as jest.Mock).mockClear();
	});

	it("should craft the correct command topic", async () => {
		expect(button.commandTopic).toBe(
			`${ESPHOME_TOPIC}test1/button/test1/command`,
		);
	});

	it("should press the button", async () => {
		button.press();
		expect((client.publish as jest.Mock).mock.calls[0]).toStrictEqual([
			button.commandTopic,
			"PRESS",
		]);
	});
});
