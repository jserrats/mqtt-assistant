import { StatefulComponent } from "../../../component";
import { CustomSensor } from "../custom-sensor";

jest.mock("../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

class TestState extends StatefulComponent<number> {
	setState(newState: number) {
		this.state = newState;
	}
}
describe("CustomSensor", () => {
	it("Boolean - should update state correctly", async () => {
		const mockCallbackTrue = jest.fn((callback) => {});
		const mockCallbackFalse = jest.fn((callback) => {});
		const stateful = new TestState();
		const sensor = new CustomSensor<boolean>("test", stateful, (state) => {
			return (state as number) > 10;
		});

		expect(sensor.state).toBeUndefined();

		sensor.on(sensor.events.state, mockCallbackTrue);

		stateful.setState(11);
		expect(sensor.state).toBeTruthy();
		expect(mockCallbackTrue).toHaveBeenCalled();

		sensor.on(sensor.events.state, mockCallbackFalse);
		stateful.setState(8);
		expect(sensor.state).toBeFalsy();
		expect(mockCallbackFalse).toHaveBeenCalled();
	});
});
