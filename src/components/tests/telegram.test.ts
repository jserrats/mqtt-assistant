import { client } from "../../mqtt";
import { router } from "../../router";
import { telegram } from "../telegram";
import type { TelegramErrorMessage, TelegramMessage } from "../telegram/types";

jest.mock("../../../src/mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {
			router.route(newTopic, newPayload);
		}),
	},
}));

describe("Telegram", () => {
	afterEach(async () => {
		(client.publish as jest.Mock).mockClear();
	});

	it("should send a message", async () => {
		telegram.send("test");
		expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
			"notify/telegram",
		);
		expect((client.publish as jest.Mock).mock.calls[0][1]).toStrictEqual(
			"test",
		);
	});

	it("should send an error message", async () => {
		telegram.logError(new EvalError("test error"));
		expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
			"notify/telegram/error",
		);
		console.log((client.publish as jest.Mock).mock.calls[0][1]);
		expect(
			JSON.parse(
				(client.publish as jest.Mock).mock.calls[0][1],
			) as TelegramErrorMessage,
		).toMatchObject({
			message: "test error",
			name: "EvalError",
		} as TelegramErrorMessage);
	});

	it("should send a message with log level", async () => {
		telegram.log({ message: "test" }, "debug");
		expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
			"notify/telegram/debug",
		);

		const inbound = JSON.parse(
			(client.publish as jest.Mock).mock.calls[0][1],
		) as TelegramMessage;

		expect(inbound.message === "test").toBeTruthy();
	});

	it("should send a message with recipient option", async () => {
		telegram.log({ message: "test1", recipient: "home" });
		expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
			"notify/telegram",
		);

		const inbound = JSON.parse(
			(client.publish as jest.Mock).mock.calls[0][1],
		) as TelegramMessage;

		expect(inbound.message === "test1").toBeTruthy();
		expect(inbound.recipient === "home").toBeTruthy();
	});
});
