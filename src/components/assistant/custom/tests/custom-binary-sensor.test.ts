import { CustomBinarySensor } from "../custom-binary-sensor";

jest.mock("../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => { }),
	},
}));

describe("CustomBinarySensor", () => {
	it("should update state correctly", async () => {

		const mockCallbackTrue = jest.fn((callback) => {
			expect(callback).toBeTruthy();
		});
		const mockCallbackFalse = jest.fn((callback) => {
			expect(callback).toBeFalsy();
		});

		const sensor = new CustomBinarySensor<number>("test", (value) => {
			return value > 10;
		});
		
		expect(sensor.state).toBeUndefined();

		sensor.once("state", mockCallbackTrue);
		sensor.updateComponent(11);
		expect(sensor.state).toBeTruthy();
		expect(mockCallbackTrue).toHaveBeenCalled();

		sensor.once("state", mockCallbackFalse);
		sensor.updateComponent(8);
		expect(sensor.state).toBeFalsy();
		expect(mockCallbackFalse).toHaveBeenCalled();
	});
});
