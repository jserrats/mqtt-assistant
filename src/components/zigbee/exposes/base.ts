import { randomUUID } from "node:crypto";
import { StatefulComponent } from "../../component";
import type {
	BooleanSensor,
	NumericSensor,
	StringSensor,
} from "../../interfaces/sensor";
import { telegram } from "../../telegram";
import type { SwitchZigbee } from "../devices/switches/base";
import type { ZigbeeDevice } from "../zigbee";

export class ExposesZigbee<
	T extends boolean | number | string,
> extends StatefulComponent<T> {
	public name;
	static exposes: string;
	protected _exposes: string = (this.constructor as typeof ExposesZigbee<T>)
		.exposes;

	constructor(parentDevice?: ZigbeeDevice) {
		super();
		if (parentDevice !== undefined) {
			this.name = `${parentDevice.name}:${this._exposes}`;
			this.on(this.events.state, (value) => {
				parentDevice.emit(this.events.state, value);
			});
		}
	}

	_updateExposes(message: object | undefined): void {
		if (message === undefined) {
			this.state = undefined;
			return;
		}
		if (this.state === undefined || message[this._exposes] !== this.state) {
			this.state = message[this._exposes];
			return;
		}
	}
}

export class ExposesNumber
	extends ExposesZigbee<number>
	implements NumericSensor
{
	public unit: string;
	toString() {
		return `${this.state} ${this.unit}`;
	}
}

export class ExposesString
	extends ExposesZigbee<string>
	implements StringSensor {}

export class ExposesBoolean
	extends ExposesZigbee<boolean>
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

	constructor(parentDevice?) {
		super(parentDevice);
		this.on(this.events.state, () => {
			if (this.state) {
				this.emit(this.events.on);
			} else {
				this.emit(this.events.off);
			}
		});
	}
}

export class ExposesSeteableNumber extends ExposesNumber {
	private device: SwitchZigbee;

	max: number;
	min: number;

	constructor(device: SwitchZigbee, max, min) {
		super(device);
		this.max = max;
		this.min = min;
		this.device = device;
	}

	set(level: number) {
		if (this.isValidValue(level)) {
			this.device.setOn({ [this._exposes]: level });
		}
	}

	private isValidValue(value: number): boolean {
		if (value > this.max && value < this.min) {
			telegram.warning(
				`Value ${value} out of bounds for device ${this.device.name}`,
			);
			return false;
		}
		return true;
	}
}
