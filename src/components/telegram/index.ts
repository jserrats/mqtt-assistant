import type { LogLevel, TelegramMessage } from "./types";
const { dirname } = require("node:path");
import { client } from "../../mqtt";
import mqtt from "mqtt/*";


class Telegram {
	static base_topic = "notify/telegram";

	/**
	 * Basic method for sending error messages without formatting
	 * @param string to be logged on telegram
	 */
	send(message: string) {
		client.publish(Telegram.base_topic, message);
	}

	log(message: TelegramMessage | string, logLevel?: LogLevel) {
		let outMessage: TelegramMessage;
		if (typeof message === "string") {
			outMessage = { message: message } as TelegramMessage;
		} else {
			outMessage = message;
		}

		let topic = Telegram.base_topic;
		if (logLevel !== undefined) {
			topic = `${topic}/${logLevel}`;
		}
		client.publish(topic, JSON.stringify(outMessage));
	}

	debug(message: TelegramMessage | string) {
		this.log(message, "debug");
	}
	info(message: TelegramMessage | string) {
		this.log(message, "info");
	}
	warning(message: TelegramMessage | string) {
		this.log(message, "warning");
	}
	error(message: TelegramMessage | string | Error) {
		if (message instanceof Error) {
			this.log(
				{
					message: `service:\`${dirname(require.main.filename)}\``,
					title: `${message.name} \`${message.message}\``,
				} as TelegramMessage,
				"error",
			);
		} else {
			this.log(message, "error");
		}
	}
}
export const telegram = new Telegram();
