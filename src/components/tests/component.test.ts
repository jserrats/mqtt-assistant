import { router } from "../../router";
import { StatefulComponent } from "../component";
import { globalEventManager } from "../component";

jest.mock("../../../src/mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {
			router.route(newTopic, newPayload);
		}),
	},
}));

jest.useFakeTimers();

class TestClass extends StatefulComponent<boolean> {
	setState(state: boolean) {
		this.state = state;
	}
}

describe("StatefulComponent", () => {
	it("should emit after state change", async () => {
		const statefulComponent = new TestClass();
		const mockCallback = jest.fn();
		statefulComponent.on(statefulComponent.events.state, mockCallback);
		expect(mockCallback).not.toHaveBeenCalled();
		statefulComponent.setState(true);
		statefulComponent.setState(true);
		expect(mockCallback).toHaveBeenCalledTimes(1);
		statefulComponent.setState(false);
		statefulComponent.setState(false);
		expect(mockCallback).toHaveBeenCalledTimes(2);
	});

	it("should emit after being in the state", async () => {
		const statefulComponent = new TestClass();
		const mockCallback = jest.fn();
		statefulComponent.on(
			statefulComponent.newTimeStateEvent({ seconds: 10 }, (state) => {
				return state;
			}),
			mockCallback,
		);
		expect(mockCallback).not.toHaveBeenCalled();
		statefulComponent.setState(true);
		jest.runOnlyPendingTimers();
		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	it("should not emit", async () => {
		const statefulComponent = new TestClass();
		const mockCallback = jest.fn();
		statefulComponent.on(
			statefulComponent.newTimeStateEvent({ seconds: 10 }, (state) => {
				return state;
			}),
			mockCallback,
		);
		expect(mockCallback).not.toHaveBeenCalled();
		statefulComponent.setState(true);
		statefulComponent.setState(false);
		jest.runOnlyPendingTimers();
		expect(mockCallback).not.toHaveBeenCalled();
	});
});

describe("globalEventManager", () => {
	it("should emit after being in the state", async () => {
		const statefulComponent = new TestClass();
		const mockCallback = jest.fn();
		globalEventManager.on(statefulComponent.events.state, mockCallback);
		expect(mockCallback).not.toHaveBeenCalled();
		statefulComponent.setState(true);
		expect(mockCallback).toHaveBeenCalledTimes(1);
	});
});
