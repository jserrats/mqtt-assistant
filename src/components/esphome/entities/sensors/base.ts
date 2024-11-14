import { randomUUID } from "node:crypto";
import type { Stateful } from "../../../interfaces/stateful";
import { ESPHomeDevice } from "../../esphome";

export class BaseESPHomeSensor<T extends boolean | string | number>
	extends ESPHomeDevice
	implements Stateful
{
	state: T;
	events = { state: randomUUID() };

	protected updateComponent(message: string) {
		this.emit(this.events.state, this.state);
	}
}
