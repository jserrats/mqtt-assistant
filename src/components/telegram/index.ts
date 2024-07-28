import { Component } from "../component";
import type { LogLevel, TelegramMessage } from "./types";
const { dirname } = require("node:path");

class Telegram extends Component {
	static base_topic = "notify/telegram";

	/**
	 * Basic method for sending error messages without formatting
	 * @param string to be logged on telegram
	 */
	send(message: string) {
		this.client.publish(Telegram.base_topic, message);
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
		this.client.publish(topic, JSON.stringify(outMessage));
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
