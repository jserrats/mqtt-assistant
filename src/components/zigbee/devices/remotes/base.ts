import { randomUUID } from "node:crypto";
import { exposes } from "../../exposes";
import { ZigbeeDevice } from "../../zigbee";

export class RemoteZigbee extends ZigbeeDevice {
	protected action = new exposes.ExposesAction();
	public button: { [key: string]: string };
	protected remoteId = randomUUID();

	constructor(name) {
		super(name);
		this.action.on(this.action.events.state, (value) => {
			for (const button in this.button) {
				if (this.button[button].startsWith(value)) {
					this.emit(this.button[button]);
					return;
				}
			}
		});
	}
}
