export type TelegramMessage = {
	title?: string;
	message: string;
	recipient?: TelegramRecipients
}

export type TelegramErrorMessage = {
	name: string;
	message: string;
	service: string;
};

export type LogLevel = "debug" | "info" | "warning" | "error";

export type TelegramRecipients = "admin" | "home" | "user"