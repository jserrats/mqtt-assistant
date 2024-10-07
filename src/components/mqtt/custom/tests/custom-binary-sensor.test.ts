import { CustomBinarySensor } from "../custom-binary-sensor";

jest.mock("../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("CustomBinarySensor", () => {
	it("should update state correctly", async () => {
		const sensor = new CustomBinarySensor<number>("test", (value) => {
			return value > 10;
		});
		expect(sensor.state).toBeUndefined();
		sensor.updateComponent(11);
		expect(sensor.state).toBeTruthy();
		sensor.updateComponent(8);
		expect(sensor.state).toBeFalsy();
	});
});
