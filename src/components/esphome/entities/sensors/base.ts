import { ESPHomeDevice } from "../../esphome";

export class BaseESPHomeSensor<T> extends ESPHomeDevice {
	state: T;

	protected updateComponent(message: string) {
		this.emit("state", this.state);
	}
}
