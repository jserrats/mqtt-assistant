import { client } from "../../../mqtt";
import { router } from "../../../router";
import { ZIGBEE2MQTT_TOPIC } from "../../../topics";
import { ZigbeeMonitor } from "../monitor";

jest.mock("../../../../src/mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {
			router.route(newTopic, newPayload);
		}),
	},
}));

describe("ZigbeeMonitor", () => {
	let zigbeeMonitor: ZigbeeMonitor;
	const onlineString = JSON.stringify({ state: "online" });
	const offlineString = JSON.stringify({ state: "offline" });

	beforeAll(async () => {
		zigbeeMonitor = new ZigbeeMonitor(["ignored"]);
	});

	afterEach(async () => {
		(client.publish as jest.Mock).mockClear();
	});

	it("should notify when a zigbee component disconnects", async () => {
		client.publish(`${ZIGBEE2MQTT_TOPIC}test1/availability`, offlineString);
		expect((client.publish as jest.Mock).mock.calls[1][0]).toStrictEqual(
			"notify/telegram/warning",
		);
	});

	it("should not notify when a zigbee component is online without being offline before", async () => {
		client.publish(`${ZIGBEE2MQTT_TOPIC}test2/availability`, onlineString);
		expect((client.publish as jest.Mock).mock.calls).toHaveLength(1);
	});

	it("should notify when a zigbee component connects after being disconnected", async () => {
		client.publish(`${ZIGBEE2MQTT_TOPIC}test1/availability`, onlineString);
		expect((client.publish as jest.Mock).mock.calls).toHaveLength(2);
		//console.log((client.publish as jest.Mock).mock.calls);
	});

	it("should not notify again", async () => {
		client.publish(`${ZIGBEE2MQTT_TOPIC}test1/availability`, onlineString);
		expect((client.publish as jest.Mock).mock.calls).toHaveLength(1);
	});

	it("should ignore blacklisted devices", async () => {
		client.publish(`${ZIGBEE2MQTT_TOPIC}ignored/availability`, offlineString);
		expect((client.publish as jest.Mock).mock.calls).toHaveLength(1);
	});
});
