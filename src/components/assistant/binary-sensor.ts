import { randomUUID } from "node:crypto";
import type { BooleanSensor } from "../interfaces/sensor";
import { BaseMQTTSensor } from "./base";

export class BinaryMQTTSensor
	extends BaseMQTTSensor<boolean>
	implements BooleanSensor
{
	public events = {
		/** Emitted when the state property of the object is updated
		 */
		state: randomUUID(),
		/** Emitted when the state property of the object is true
		 */
		on: randomUUID(),
		/** Emitted when the state property of the object is false
		 */
		off: randomUUID(),
	};

	constructor(name) {
		super(name);
		this.on(this.events.state, () => {
			if (this.state) {
				this.emit(this.events.on);
			} else {
				this.emit(this.events.off);
			}
		});
	}
	updateComponent(message: string) {
		if (this.state !== (message === "ON")) {
			this.state = message === "ON";
			super.updateComponent(message);
		}
	}
}
