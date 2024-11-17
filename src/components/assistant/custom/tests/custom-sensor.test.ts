import { CustomSensor } from "../custom-sensor";

jest.mock("../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("CustomBinarySensor", () => {
	it("Boolean - should update state correctly", async () => {
		const mockCallbackTrue = jest.fn((callback) => {});
		const mockCallbackFalse = jest.fn((callback) => {});

		const sensor = new CustomSensor<boolean>("test", (value) => {
			return Number.parseInt(value) > 10;
		});

		expect(sensor.state).toBeUndefined();

		sensor.on(sensor.events.state, mockCallbackTrue);
		sensor.updateComponent("11");
		expect(sensor.state).toBeTruthy();
		expect(mockCallbackTrue).toHaveBeenCalled();

		sensor.on(sensor.events.state, mockCallbackFalse);
		sensor.updateComponent("8");
		expect(sensor.state).toBeFalsy();
		expect(mockCallbackFalse).toHaveBeenCalled();
	});
});