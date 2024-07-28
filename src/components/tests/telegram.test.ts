import { client } from "../../mqtt";
import { router } from "../../router";
import { telegram } from "../telegram";
import type { TelegramMessage } from "../telegram/types";

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

		telegram.log("test");
		expect(
			JSON.parse((client.publish as jest.Mock).mock.calls[1][1]),
		).toStrictEqual({ message: "test" });
	});

	it("should send an error message", async () => {
		telegram.error(new EvalError("test error"));
		expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
			"notify/telegram/error",
		);
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
