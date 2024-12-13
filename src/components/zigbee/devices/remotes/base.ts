import { randomUUID } from "node:crypto";
import { exposes } from "../../exposes";
import { StatelessZigbeeDevice } from "../../zigbee";

export class RemoteZigbee extends StatelessZigbeeDevice {
	protected action = new exposes.ExposesAction(this);
	public button: { [key: string]: string };
	protected remoteId = randomUUID();

	constructor(name) {
		super(name);
		this.action.on(this.action.events.state, (value) => {
			for (const button in this.button) {
				if (this.button[button].startsWith(value) && value !== "") {
					this.emit(this.button[button]);
					return;
				}
			}
		});
	}
}
