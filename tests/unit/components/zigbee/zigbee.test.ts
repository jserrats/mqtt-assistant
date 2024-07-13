import {
	InboundAvailability,
	ZigbeeComponent,
	ZigbeeMonitor,
} from "../../../../src/components/zigbee/zigbee";
import { client } from "../../../../src/mqtt";
import { router } from "../../../../src/router";
import { ZIGBEE2MQTT_TOPIC } from "../../../../src/topics";

jest.mock("../../../../src/mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {
			router.route(newTopic, newPayload);
		}),
	},
}));

describe("ZigbeeComponent", () => {
	let zigbeeComponent: ZigbeeComponent;

	beforeAll(async () => {
		zigbeeComponent = new ZigbeeComponent("test1");
	});

	afterEach(async () => {
		(client.publish as jest.Mock).mockClear();
	});

	it("should not crash with bad JSON", async () => {
		jest.spyOn(console, "error").mockImplementation(jest.fn());
		expect(() => {
			router.route(zigbeeComponent.topic, "asdf");
		}).not.toThrow();
	});
});

describe("ZigbeeMonitor", () => {
	let zigbeeMonitor: ZigbeeMonitor;
	const onlineString = JSON.stringify({ state: "online" });
	const offlineString = JSON.stringify({ state: "offline" });

	beforeAll(async () => {
		zigbeeMonitor = new ZigbeeMonitor();
	});

	afterEach(async () => {
		(client.publish as jest.Mock).mockClear();
	});

	it("should notify when a zigbee component disconnects", async () => {
		client.publish(`${ZIGBEE2MQTT_TOPIC}test1/availability`, offlineString);
		expect((client.publish as jest.Mock).mock.calls[1][0]).toStrictEqual(
			"notify/telegram",
		);
	});

	it("should not notify when a zigbee component is online without being offline before", async () => {
		client.publish(`${ZIGBEE2MQTT_TOPIC}test2/availability`, onlineString);
		expect((client.publish as jest.Mock).mock.calls).toHaveLength(1);
	});

	it("should notify when a zigbee component connects after being disconnected", async () => {
		console.log(zigbeeMonitor.offlineDevices);
		client.publish(`${ZIGBEE2MQTT_TOPIC}test1/availability`, onlineString);
		expect((client.publish as jest.Mock).mock.calls).toHaveLength(2);
	});

	it("should not notify again", async () => {
		console.log(zigbeeMonitor.offlineDevices);
		client.publish(`${ZIGBEE2MQTT_TOPIC}test1/availability`, onlineString);
		expect((client.publish as jest.Mock).mock.calls).toHaveLength(1);
	});
});
