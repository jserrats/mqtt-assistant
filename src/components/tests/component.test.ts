import { client } from "../../mqtt";
import { router } from "../../router";
import { StatefulComponent } from "../component";

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
        this.state = state
    }
}

describe("StatefulComponent", () => {
    it("should emit after being in the state", async () => {
        const statefulComponent = new TestClass();
        const mockCallback = jest.fn();
        statefulComponent.on(statefulComponent.newTimeStateEvent({ seconds: 10 }, (state) => { return state }), mockCallback)
        expect(mockCallback).not.toHaveBeenCalled()
        statefulComponent.setState(true)
        statefulComponent.emit(statefulComponent.events.state, statefulComponent.state)
        jest.runOnlyPendingTimers();
        expect(mockCallback).toHaveBeenCalled()
    });

    it("should not emit", async () => {
        const statefulComponent = new TestClass();
        const mockCallback = jest.fn();
        statefulComponent.on(statefulComponent.newTimeStateEvent({ seconds: 10 }, (state) => { return state }), mockCallback)
        expect(mockCallback).not.toHaveBeenCalled()
        statefulComponent.setState(true)
        statefulComponent.setState(false)
        jest.runOnlyPendingTimers();
        expect(mockCallback).not.toHaveBeenCalled()
    });

});
