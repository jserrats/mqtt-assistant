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

export type LogLevel = "debug" | "info" | "warning" | "error";
