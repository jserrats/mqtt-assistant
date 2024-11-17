import { client } from "../../mqtt";
import { router } from "../../router";
import { BASE_TOPIC } from "../../topics";
import { StatefulComponent } from "../component";
import { Timer, secondsToHms } from "../timer";

jest.mock("../../../src/mqtt", () => ({
    client: {
        publish: jest.fn((newTopic: string, newPayload: string) => {
            router.route(newTopic, newPayload);
        }),
    },
}));

jest.useFakeTimers();

describe("StatefulComponent", () => {
    it("should emit after being in the state", async () => {
        const statefulComponent = new StatefulComponent<boolean>();
        const mockCallback = jest.fn();
        statefulComponent.on(statefulComponent.newTimeStateEvent({ seconds: 10 }, (state) => { return state }), mockCallback)
        expect(mockCallback).not.toHaveBeenCalled()
        statefulComponent.state = true
        statefulComponent.emit(statefulComponent.events.state, statefulComponent.state)
        jest.runOnlyPendingTimers();
        expect(mockCallback).toHaveBeenCalled()
    });

    it("should not emit", async () => {
        const statefulComponent = new StatefulComponent<boolean>();
        const mockCallback = jest.fn();
        statefulComponent.on(statefulComponent.newTimeStateEvent({ seconds: 10 }, (state) => { return state }), mockCallback)
        expect(mockCallback).not.toHaveBeenCalled()
        statefulComponent.state = true
        statefulComponent.emit(statefulComponent.events.state, statefulComponent.state)
        statefulComponent.state = false
        statefulComponent.emit(statefulComponent.events.state, statefulComponent.state)
        jest.runOnlyPendingTimers();
        expect(mockCallback).not.toHaveBeenCalled()
    });

});
