import { router } from "../../../../../router";
import { RemoteE2002 } from "../remotes";

jest.mock("../../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("Exposes", () => {
	it("remote - should emit when pressed", async () => {
		const mockCallback = jest.fn();
		const remote = new RemoteE2002("test");
		remote.on(remote.button.up, () => {
			mockCallback();
		});
		router.route(remote.topic, JSON.stringify({ action: remote.button.up }));
		expect(mockCallback).toHaveBeenCalled();
	});
});
