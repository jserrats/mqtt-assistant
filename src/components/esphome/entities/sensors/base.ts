import type { Stateful } from "../../../interfaces/stateful";
import { ESPHomeDevice } from "../../esphome";

export class BaseESPHomeSensor<T extends boolean | string | number>
	extends ESPHomeDevice<T>
	implements Stateful {
	protected updateComponent(message: string) {
		this.emit(this.events.state, this.state);
	}
}
