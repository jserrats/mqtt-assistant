import { router } from "../../../../../router";
import { globalEventManager } from "../../../../component";
import { RemoteE1812, RemoteE2002 } from "../remotes";

jest.mock("../../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("Remote", () => {
	it("remote - should emit when pressed", async () => {
		const mockCallback = jest.fn();
		const remote = new RemoteE1812("test");
		remote.on(remote.button.click, () => {
			mockCallback();
		});
		router.route(remote.topic, JSON.stringify({ action: "on" }));
		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	it("remote - should not emit when action is empty", async () => {
		const mockCallback = jest.fn();
		const remote = new RemoteE1812("test");
		remote.on(remote.button.click, () => {
			mockCallback();
		});
		router.route(remote.topic, JSON.stringify({ action: "" }));
		expect(mockCallback).toHaveBeenCalledTimes(0);
	});

	it("should work well with globalEvents", async () => {
		const mockCallback = jest.fn();
		const testRemote = new RemoteE2002("test2");
		globalEventManager.on(testRemote.button.up, mockCallback);
		router.route(testRemote.topic, JSON.stringify({ action: "on" }));
		expect(mockCallback).toHaveBeenCalledTimes(1);
	});
});
