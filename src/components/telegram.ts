import { Component } from "./component";
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

	log(message: TelegramMessage | TelegramErrorMessage, logLevel?: LogLevel) {
		let topic = Telegram.base_topic;
		if (logLevel !== undefined) {
			topic = `${topic}/${logLevel}`;
		}
		this.client.publish(topic, JSON.stringify(message));
	}
}

export type LogLevel = "debug" | "info" | "warning" | "error";

export const telegram = new Telegram();

export type TelegramMessage = {
	title?: string;
	message: string;
	recipient?: "admin" | "home";
};

export type TelegramErrorMessage = {
	name: string;
	message: string;
	service: string;
};
