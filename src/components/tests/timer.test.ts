import { client } from "../../mqtt";
import { router } from "../../router";
import { BASE_TOPIC } from "../../topics";
import { Timer, secondsToHms } from "../timer";

jest.mock("../../../src/mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {
			router.route(newTopic, newPayload);
		}),
	},
}));

jest.useFakeTimers();

describe("Timer", () => {
	it("should trigger when the timer ends", async () => {
		const timer = new Timer({ seconds: 10 });
		const mockCallback = jest.fn();
		timer.on(timer.events.timeout, () => {
			mockCallback();
		});
		expect(timer.isRunning).toBeFalsy();
		timer.start();
		expect(timer.isRunning).toBeTruthy();
		jest.runOnlyPendingTimers();
		expect(mockCallback).toHaveBeenCalled();
	});

	it("should publish countdown time", async () => {
		const timer = new Timer({ seconds: 10 }, "test");
		timer.start();
		jest.runOnlyPendingTimers();
		// console.log((client.publish as jest.Mock).mock.calls)
		expect((client.publish as jest.Mock).mock.calls).toHaveLength(44);
	});

	it("time formatting should adjust", async () => {
		expect(secondsToHms(60 * 60 * 2 - 1)).toStrictEqual("1h 59m");
		expect(secondsToHms(60 * 60 - 1)).toStrictEqual("59m 59s");
		expect(secondsToHms(59)).toStrictEqual("59s");
	});

	it("should trigger when the timer is canceled", async () => {
		const timer = new Timer({ seconds: 10 });
		const mockCallback = jest.fn();
		timer.on(timer.events.cancel, () => {
			mockCallback();
		});
		timer.start();
		timer.cancel();
		expect(mockCallback).toHaveBeenCalled();
	});

	it("should cancel when triggered", async () => {
		const timer = new Timer({ seconds: 10 });
		const trigger = { payload: "1234", topic: "1234" };
		const mockCallback = jest.fn();
		timer.on(timer.events.cancel, () => {
			mockCallback();
		});
		timer.addCancelTriggers(trigger);
		timer.start();
		router.route(trigger.topic, trigger.payload);
		expect(mockCallback).toHaveBeenCalled();
	});
});
