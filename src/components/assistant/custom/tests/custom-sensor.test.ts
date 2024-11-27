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
		const mockCallbackTrue = jest.fn();
		const mockCallbackFalse = jest.fn();
		const stateful = new TestState();
		const sensor = new CustomSensor<boolean>("test", stateful, (state) => {
			return (state as number) > 10;
		});

		expect(sensor.state).toBeUndefined();

		sensor.on(sensor.events.state, (state) => {
			if (state) {
				mockCallbackTrue();
			} else {
				mockCallbackFalse();
			}
		});

		stateful.setState(11);
		expect(sensor.state).toBeTruthy();
		expect(mockCallbackTrue).toHaveBeenCalledTimes(1);
		expect(mockCallbackFalse).toHaveBeenCalledTimes(0);

		stateful.setState(8);
		expect(sensor.state).toBeFalsy();
		expect(mockCallbackFalse).toHaveBeenCalledTimes(1);
		expect(mockCallbackTrue).toHaveBeenCalledTimes(1);
	});
});
