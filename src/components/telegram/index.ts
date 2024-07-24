import { Component } from "../component";
import type { LogLevel, TelegramErrorMessage, TelegramMessage } from "./types";
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

	/**
	 *
	 * @param error Error object that needs to be logged
	 */
	logError(error: Error) {
		this.log(
			{
				message: error.message,
				name: error.name,
				// TODO: send the root project folder name
				service: dirname(require.main.filename),
			} as TelegramErrorMessage,
			"error",
		);
	}

	log(
		message: TelegramMessage | TelegramErrorMessage | string,
		logLevel?: LogLevel,
	) {

		let outMessage: TelegramMessage;
		if (typeof message === 'string') {
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
	error(message: TelegramMessage | string) {
		this.log(message, "error");
	}
}

export const telegram = new Telegram();
