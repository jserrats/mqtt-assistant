import { exposes } from "../../exposes";
import { ZigbeeDevice } from "../../zigbee";

export class AirSensorZigbee extends ZigbeeDevice {
	temperature = new exposes.ExposesTemperature();
	humidity = new exposes.ExposesHumidity();
}

export class ClosureSensorZigbee extends ZigbeeDevice {
	contact: exposes.ExposesContact;

	constructor(name: string, inverted?) {
		super(name);
		this.contact = new exposes.ExposesContact(inverted);
	}
}

export class PowerSensorZigbee extends ZigbeeDevice {
	power = new exposes.ExposesPower();
	voltage = new exposes.ExposesVoltage();
	current = new exposes.ExposesCurrent();
}

export class PresenceSensorZigbee extends ZigbeeDevice {
	occupancy = new exposes.ExposesOccupancy();
}

export class VibrationSensorsZigbee extends ZigbeeDevice {
	occupancy = new exposes.ExposesVibration();
}
