import { router } from "../../../../../router";
import { RemoteE2002 } from "../remotes";
import { globalEventManager } from "../../../../component"

jest.mock("../../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => { }),
	},
}));

describe("Remote", () => {
	it("remote - should emit when pressed", async () => {
		const mockCallback = jest.fn();
		const remote = new RemoteE2002("test");
		remote.on(remote.button.up, () => {
			mockCallback();
		});
		router.route(remote.topic, JSON.stringify({ action: remote.button.up }));
		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	it("should work well with globalEvents", async () => {
		const mockCallback = jest.fn();
		const testRemote = new RemoteE2002("test2");
		globalEventManager.on(testRemote.button.up, mockCallback);
		router.route(testRemote.topic, JSON.stringify({ action: testRemote.button.up }));
		expect(mockCallback).toHaveBeenCalledTimes(1);
	});
});
