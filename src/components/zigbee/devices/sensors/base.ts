import { exposes } from "../../exposes";
import { StatelessZigbeeDevice } from "../../zigbee";

export class AirSensorZigbee extends StatelessZigbeeDevice {
	temperature = new exposes.ExposesTemperature(this);
	humidity = new exposes.ExposesHumidity(this);
}

export class ClosureSensorZigbee extends StatelessZigbeeDevice {
	contact: exposes.ExposesContact;

	constructor(name: string, inverted?: boolean) {
		super(name);
		this.contact = new exposes.ExposesContact(this, inverted);
	}
}

export class PowerSensorZigbee extends StatelessZigbeeDevice {
	power = new exposes.ExposesPower(this);
	voltage = new exposes.ExposesVoltage(this);
	current = new exposes.ExposesCurrent(this);
}

export class PresenceSensorZigbee extends StatelessZigbeeDevice {
	occupancy = new exposes.ExposesOccupancy(this);
}

export class VibrationSensorsZigbee extends StatelessZigbeeDevice {
	occupancy = new exposes.ExposesVibration(this);
}
