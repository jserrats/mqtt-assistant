import { randomUUID } from "node:crypto";
import type { Switch } from "../../../interfaces/switch";
import { BaseESPHomeSensor } from "../sensors/base";

export class BaseSwitchESPHome
	extends BaseESPHomeSensor<boolean>
	implements Switch
{
	commandTopic: string;
	public events = {
		state: randomUUID(),
		on: randomUUID(),
		off: randomUUID(),
	};

	setOn() {
		this.set(true);
	}

	setOff() {
		this.set(false);
	}

	toggle() {
		this.set("toggle");
	}

	protected set(order: boolean | "toggle") {}

	protected updateComponent(message: string) {
		let state: boolean;
		try {
			state = JSON.parse(message).state === "ON";
		} catch (e) {
			state = message === "ON";
		} finally {
			if (this.state !== state) {
				this.state = state;
				if (state) {
					this.emit(this.events.on);
				} else {
					this.emit(this.events.off);
				}
			}
		}
	}
}
