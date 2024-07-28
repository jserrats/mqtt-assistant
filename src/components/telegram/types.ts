export type TelegramMessage = {
	title?: string;
	message: string;
	recipient?: TelegramRecipients;
};

export type LogLevel = "debug" | "info" | "warning" | "error";

export type TelegramRecipients = "admin" | "home" | "user";
