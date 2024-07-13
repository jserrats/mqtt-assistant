import { Component } from "./component";

export class Telegram extends Component {
	send(message: string) {
		this.client.publish("notify/telegram", message);
	}
}
