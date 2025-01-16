import {
	ExposesContact,
	ExposesOccupancy,
	ExposesSwitch,
	ExposesTemperature,
} from "../exposes";

import { router } from "../../../../router";
import {
	type TestBooleanSensor,
	type TestNumericSensor,
	testBooleanSensorFactory,
	testNumericSensorFactory,
} from "../../../interfaces/tests/sensorTests";
import { ExposesBoolean, ExposesNumber, ExposesString } from "../base";

jest.mock("../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

// ExposesBoolean

class TestBinaryExpose extends ExposesOccupancy implements TestBooleanSensor {
	mockStateUpdate(value: boolean): void {
		this._updateExposes({ occupancy: value });
	}
}
testBooleanSensorFactory(() => {
	return new TestBinaryExpose("test");
}, ExposesBoolean.name);

// ExposesNumber

class TestNumericExpose
	extends ExposesTemperature
	implements TestNumericSensor
{
	mockStateUpdate(value: number): void {
		this._updateExposes({ temperature: value });
	}
}

testNumericSensorFactory(() => {
	return new TestNumericExpose();
}, ExposesNumber.name);

// Expose specific tests

describe("Exposes", () => {
	it("Closure - should invert", async () => {
		const exposes = new ExposesContact(undefined, true);
		expect(exposes.state).toBeUndefined();
		exposes._updateExposes({ contact: false });
		expect(exposes.state).toBeTruthy();
		exposes._updateExposes({ contact: true });
		expect(exposes.state).toBeFalsy();
	});

	it("Switch - should update state", async () => {
		const exposes = new ExposesSwitch();
		expect(exposes.state).toBeUndefined();
		exposes._updateExposes({ state: "OFF" });
		expect(exposes.state).toBeFalsy();
		exposes._updateExposes({ state: "ON" });
		expect(exposes.state).toBeTruthy();
	});

	it("Switch - should trigger the callback", async () => {
		const mockCallback = jest.fn();
		const exposes = new ExposesSwitch();
		exposes.on(exposes.events.state, (value) => {
			mockCallback();
			expect(value).toStrictEqual(false);
		});
		exposes._updateExposes({ state: "OFF" });
		expect(mockCallback).toHaveBeenCalled();
	});

	it("should turn undefined when offline", async () => {
		const exposes = new ExposesTemperature();
		exposes._updateExposes(undefined);
		expect(exposes.state).toBe(undefined);

		exposes._updateExposes({ temperature: 10 });
		expect(exposes.state).toStrictEqual(10);
	});
});
