import {
	ExposesBoolean,
	ExposesNumber,
	ExposesSeteableNumber,
	ExposesString,
} from "./base";

export class ExposesSwitch extends ExposesBoolean {
	static exposes = "state";

	updateExposes(message: Object): boolean {
		let tmp: boolean;
		if (message[ExposesSwitch.exposes] !== undefined) {
			tmp = message[ExposesSwitch.exposes] === "ON";
		}
		if (this.state === undefined || tmp !== this.state) {
			this.state = tmp;
		}
		return this.state;
	}
}

export class ExposesAction extends ExposesString {
	static exposes = "action";
}

export class ExposesLinkQuality extends ExposesNumber {
	static exposes = "linkquality";
	public unit = "LQI";
}

export class ExposesBrightness extends ExposesSeteableNumber {
	static exposes = "brightness";
	static unit = "%";
}

export class ExposesColorTemperature extends ExposesSeteableNumber {
	static exposes = "color_temp";
}

export class ExposesTemperature extends ExposesNumber {
	static exposes = "temperature";
	public unit = "°C";
}

export class ExposesHumidity extends ExposesNumber {
	static exposes = "humidity";
	public unit = "%";
}

export class ExposesCurrent extends ExposesNumber {
	static exposes = "current";
	public unit = "A";
}

export class ExposesPower extends ExposesNumber {
	static exposes = "power";
	public unit = "W";
}

export class ExposesVoltage extends ExposesNumber {
	static exposes = "voltage";
	public unit = "V";
}

export class ExposesOccupancy extends ExposesBoolean {
	static exposes = "occupancy";
}

export class ExposesVibration extends ExposesBoolean {
	static exposes = "vibration";
}

export class ExposesContact extends ExposesBoolean {
	static exposes = "contact";
	private inverted = false;

	constructor(parentDevice, inverted?) {
		super(parentDevice);
		if (inverted !== undefined) {
			this.inverted = inverted;
		}
	}

	updateExposes(message: Object): void {
		let tmp: boolean;
		if (this.inverted) {
			tmp = !message[ExposesContact.exposes];
		} else {
			tmp = message[ExposesContact.exposes];
		}
		super.updateExposes({ contact: tmp });
	}
}
