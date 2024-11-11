import { exposes } from "../../exposes";
import { ZigbeeDevice } from "../../zigbee";

export class RemoteZigbee extends ZigbeeDevice {
	protected action = new exposes.ExposesAction();
	public button: { [key: string]: string };

	constructor(name) {
		super(name);
		this.action.on("action", (value) => {
			this.emit(value);
		});
	}
}
