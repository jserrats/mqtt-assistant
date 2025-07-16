import { Switch } from "../switch";

export interface TestSwitch extends Switch {
    mockStateUpdate(value: boolean): void;
}

export function testSwitchFactory(
    createSwitch: () => TestSwitch,
    className: string,
): void {
    describe(`${className}: Switch interface compliance`, () => {
        let testSwitch: TestSwitch;

        beforeEach(() => {
            testSwitch = createSwitch(); // Get a fresh instance for each test
        });

        it("should update state correctly", async () => {
            expect(testSwitch.state).toBeUndefined();
            testSwitch.mockStateUpdate(true);
            expect(testSwitch.state).toBeTruthy();
            testSwitch.mockStateUpdate(false);
            expect(testSwitch.state).toBeFalsy();
            testSwitch.mockStateUpdate(true);
            expect(testSwitch.state).toBeTruthy();
        });

        it("should emit state change events", async () => {
            const mockCallback = jest.fn();
            testSwitch.on(testSwitch.events.state, () => {
                mockCallback();
            });
            expect(mockCallback).toHaveBeenCalledTimes(0);
            testSwitch.mockStateUpdate(true);
            expect(testSwitch.state).toBeTruthy();
            expect(mockCallback).toHaveBeenCalledTimes(1);
        });

        it("should trigger boolean specific events", async () => {
            const mockCallbackTrue = jest.fn();
            const mockCallbackFalse = jest.fn();

            testSwitch.on(testSwitch.events.on, (value) => {
                mockCallbackTrue();
                expect(testSwitch.state).toStrictEqual(true);
            });
            testSwitch.on(testSwitch.events.off, (value) => {
                mockCallbackFalse();
                expect(testSwitch.state).toStrictEqual(false);
            });

            expect(mockCallbackTrue).toHaveBeenCalledTimes(0);
            expect(mockCallbackFalse).toHaveBeenCalledTimes(0);

            testSwitch.mockStateUpdate(false);
            expect(mockCallbackTrue).toHaveBeenCalledTimes(0);
            expect(mockCallbackFalse).toHaveBeenCalledTimes(1);

            testSwitch.mockStateUpdate(true);
            expect(mockCallbackTrue).toHaveBeenCalledTimes(1);
            expect(mockCallbackFalse).toHaveBeenCalledTimes(1);
        });
    });
}