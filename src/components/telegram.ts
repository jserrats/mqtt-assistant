import { Component } from "./component";

class Telegram extends Component {
	send(message: string) {
		this.client.publish("notify/telegram", message);
	}

	sendError(error: Error) {
		this.send(error.message);
	}
}

export const telegram = new Telegram();
