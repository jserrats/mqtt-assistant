import { randomUUID } from "node:crypto";
import { exposes } from "../../exposes";
import { ZigbeeDevice } from "../../zigbee";

export class RemoteZigbee extends ZigbeeDevice {
	protected action = new exposes.ExposesAction();
	public button: { [key: string]: string };
	protected remoteId = randomUUID()

	constructor(name) {
		super(name);
		this.action.on("action", (value) => {
			this.emit(value);
		});
	}
}
