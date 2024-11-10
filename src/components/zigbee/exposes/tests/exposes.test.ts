import {
	ExposesClosure,
	ExposesOccupancy,
	ExposesSwitch,
	ExposesTemperature,
} from "../exposes";

jest.mock("../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("Exposes", () => {
	it("Numeric - should update state", async () => {
		const exposes = new ExposesTemperature();
		expect(exposes.state).toBeUndefined();
		exposes.updateExposes({ temperature: 10 });
		expect(exposes.state).toStrictEqual(10);
	});

	it("Numeric - should trigger the callback", async () => {
		const mockCallback = jest.fn();
		const exposes = new ExposesTemperature();
		exposes.on("temperature", (value) => {
			mockCallback(), expect(value).toStrictEqual(10);
		});
		exposes.updateExposes({ temperature: 10 });
		expect(mockCallback).toHaveBeenCalled();
	});

	it("Boolean - should update state", async () => {
		const exposes = new ExposesOccupancy();
		expect(exposes.state).toBeUndefined();
		exposes.updateExposes({ occupancy: false });
		expect(exposes.state).toBeFalsy();
		exposes.updateExposes({ occupancy: true });
		expect(exposes.state).toBeTruthy();
	});

	it("Boolean - should trigger the callback", async () => {
		const mockCallback = jest.fn();
		const exposes = new ExposesOccupancy();
		exposes.on("occupancy", (value) => {
			mockCallback(), expect(value).toStrictEqual(false);
		});
		exposes.updateExposes({ occupancy: false });
		expect(mockCallback).toHaveBeenCalled();
	});

	it("Closure - should invert", async () => {
		const exposes = new ExposesClosure(true);
		expect(exposes.state).toBeUndefined();
		exposes.updateExposes({ closure: false });
		expect(exposes.state).toBeTruthy();
		exposes.updateExposes({ closure: true });
		expect(exposes.state).toBeFalsy();
	});

	it("Switch - should update state", async () => {
		const exposes = new ExposesSwitch();
		expect(exposes.state).toBeUndefined();
		exposes.updateExposes({ state: "OFF" });
		expect(exposes.state).toBeFalsy();
		exposes.updateExposes({ state: "ON" });
		expect(exposes.state).toBeTruthy();
	});

	it("Switch - should trigger the callback", async () => {
		const mockCallback = jest.fn();
		const exposes = new ExposesSwitch();
		exposes.on("state", (value) => {
			mockCallback(), expect(value).toStrictEqual(false);
		});
		exposes.updateExposes({ state: "OFF" });
		expect(mockCallback).toHaveBeenCalled();
	});
});
