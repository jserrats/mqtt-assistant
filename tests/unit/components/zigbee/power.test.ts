import { router } from "../../../../src/router"
import { client } from "../../../../src/mqtt"
import { WattPowerZigbee } from "../../../../src/components/zigbee/power"

jest.mock('../../../../src/mqtt', () => ({
    client: {
        publish: jest.fn((newTopic: string, newPayload: string) => { router.route(newTopic, newPayload) })
    }
}));

jest.useFakeTimers()

describe('Power', () => {
    var wattPower: WattPowerZigbee


    beforeAll(async () => {
        wattPower = new WattPowerZigbee("test1", { autoOff: { hours: 4 } })
    })

    afterEach(async () => {
        (client.publish as jest.Mock).mockClear()

    })

    it('should update status', async () => {
        client.publish(wattPower.topic, JSON.stringify({ power: 43.57, state: "ON", }))
        expect(wattPower.state).toBe(true)
        client.publish(wattPower.topic, JSON.stringify({ power: 43.57, state: "OFF", }))
        expect(wattPower.state).toBe(false)
    })

    it('should update power', async () => {
        client.publish(wattPower.topic, JSON.stringify({ power: 43.57, state: "OFF", }))
        expect(wattPower.power).toBe(43.57)
    })

    it('should turn on/off', async () => {
        wattPower.on()
        expect((client.publish as jest.Mock).mock.calls[0]).toStrictEqual([wattPower.setTopic, 'ON'])
    })

    it('should be named', async () => {
        expect(wattPower.name).toBe("test1")
    })

    it('should timeout correctly', async () => {
        client.publish(wattPower.topic, JSON.stringify({ power: 43.57, state: "ON", }));
        expect(wattPower.state).toBe(true);

        (client.publish as jest.Mock).mockClear()
        jest.runOnlyPendingTimers();
        expect((client.publish as jest.Mock).mock.calls[0]).toStrictEqual([wattPower.setTopic, 'OFF'])
    })

})