import { exposes } from "../../exposes";
import { ZigbeeDevice } from "../../zigbee";

export class AirSensorZigbee extends ZigbeeDevice {
	temperature = new exposes.ExposesTemperature(this);
	humidity = new exposes.ExposesHumidity(this);
}

export class ClosureSensorZigbee extends ZigbeeDevice {
	contact: exposes.ExposesContact;

	constructor(name: string, inverted?: boolean) {
		super(name);
		this.contact = new exposes.ExposesContact(this, inverted);
	}
}

export class PowerSensorZigbee extends ZigbeeDevice {
	power = new exposes.ExposesPower(this);
	voltage = new exposes.ExposesVoltage(this);
	current = new exposes.ExposesCurrent(this);
}

export class PresenceSensorZigbee extends ZigbeeDevice {
	occupancy = new exposes.ExposesOccupancy(this);
}

export class VibrationSensorsZigbee extends ZigbeeDevice {
	occupancy = new exposes.ExposesVibration(this);
}
