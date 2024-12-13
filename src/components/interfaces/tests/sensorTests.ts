import type { BooleanSensor, NumericSensor } from "../sensor";

export interface TestBooleanSensor extends BooleanSensor {
	mockStateUpdate(value: boolean): void;
}

export function testBooleanSensorFactory(
	createSensor: () => TestBooleanSensor,
	className: string,
): void {
	describe(`${className}: BooleanSensor interface compliance`, () => {
		let sensor: TestBooleanSensor;

		beforeEach(() => {
			sensor = createSensor(); // Get a fresh instance for each test
		});

		it("should update state correctly", async () => {
			expect(sensor.state).toBeUndefined();
			sensor.mockStateUpdate(true);
			expect(sensor.state).toBeTruthy();
			sensor.mockStateUpdate(false);
			expect(sensor.state).toBeFalsy();
			sensor.mockStateUpdate(true);
			expect(sensor.state).toBeTruthy();
		});

		it("should emit state change events", async () => {
			const mockCallback = jest.fn();
			sensor.on(sensor.events.state, () => {
				mockCallback();
			});
			expect(mockCallback).toHaveBeenCalledTimes(0);
			sensor.mockStateUpdate(true);
			expect(sensor.state).toBeTruthy();
			expect(mockCallback).toHaveBeenCalledTimes(1);
		});

		it("should trigger boolean specific events", async () => {
			const mockCallbackTrue = jest.fn();
			const mockCallbackFalse = jest.fn();

			sensor.on(sensor.events.on, (value) => {
				mockCallbackTrue();
				expect(sensor.state).toStrictEqual(true);
			});
			sensor.on(sensor.events.off, (value) => {
				mockCallbackFalse();
				expect(sensor.state).toStrictEqual(false);
			});

			expect(mockCallbackTrue).toHaveBeenCalledTimes(0);
			expect(mockCallbackFalse).toHaveBeenCalledTimes(0);

			sensor.mockStateUpdate(false);
			expect(mockCallbackTrue).toHaveBeenCalledTimes(0);
			expect(mockCallbackFalse).toHaveBeenCalledTimes(1);

			sensor.mockStateUpdate(true);
			expect(mockCallbackTrue).toHaveBeenCalledTimes(1);
			expect(mockCallbackFalse).toHaveBeenCalledTimes(1);
		});
	});
}

export interface TestNumericSensor extends NumericSensor {
	mockStateUpdate(value: number): void;
}

export function testNumericSensorFactory(
	createSensor: () => TestNumericSensor,
	className: string,
): void {
	describe(`${className}: NumericSensor interface compliance`, () => {
		let sensor: TestNumericSensor;

		beforeEach(() => {
			sensor = createSensor(); // Get a fresh instance for each test
		});

		it("should update state correctly", async () => {
			expect(sensor.state).toBeUndefined();
			sensor.mockStateUpdate(10);
			expect(sensor.state).toStrictEqual(10);
			sensor.mockStateUpdate(12.5);
			expect(sensor.state).toStrictEqual(12.5);
			sensor.mockStateUpdate(0);
			expect(sensor.state).toStrictEqual(0);
		});

		it("should emit state change events", async () => {
			const mockCallback = jest.fn();
			sensor.on(sensor.events.state, (state) => {
				mockCallback();
				expect(state).toStrictEqual(10);
			});
			expect(mockCallback).toHaveBeenCalledTimes(0);
			sensor.mockStateUpdate(10);
			expect(sensor.state).toStrictEqual(10);
			expect(mockCallback).toHaveBeenCalledTimes(1);
		});
	});
}
