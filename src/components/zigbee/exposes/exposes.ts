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
			this.emit(ExposesSwitch.exposes, tmp);
			this.emit(this.events.state, tmp);
		}
		return this.state;
	}
}

export class ExposesAction extends ExposesString {
	static exposes = "action";
}

export class ExposesLinkQuality extends ExposesNumber {
	static exposes = "linkquality";
}

export class ExposesBrightness extends ExposesSeteableNumber {
	static exposes = "brightness";
}

export class ExposesColorTemperature extends ExposesSeteableNumber {
	static exposes = "color_temp";
}

export class ExposesTemperature extends ExposesNumber {
	static exposes = "temperature";
}

export class ExposesHumidity extends ExposesNumber {
	static exposes = "humidity";
}

export class ExposesCurrent extends ExposesNumber {
	static exposes = "current";
}

export class ExposesPower extends ExposesNumber {
	static exposes = "power";
}

export class ExposesVoltage extends ExposesNumber {
	static exposes = "voltage";
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

	constructor(inverted?) {
		super();
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
