import { Alarm } from "../../../src/components/alarm"
import { client } from "../../../src/mqtt"
import { router } from "../../../src/router"
import { ContactSensorZigbee, ClosureSensorZigbeeComponentInfo } from "../../../src/components/zigbee/sensor"

jest.mock('../../../src/mqtt', () => ({
    client: {
        publish: jest.fn((newTopic: string, newPayload: string) => { router.route(newTopic, newPayload) })
    }
}));

describe('Alarm', () => {
    var alarm: Alarm
    var calls: Record<string, string> = {};
    var sensors: ContactSensorZigbee[] = []

    beforeAll(async () => {
        [...Array(3).keys()].forEach((element: number) => {
            sensors.push(new ContactSensorZigbee("testSensor" + Number.toString()))
        })

        alarm = new Alarm("TestAlarm", sensors);

        (client.publish as jest.Mock).mock.calls.forEach(element => {
            calls[element[0]] = element[1]
        });
    })

    it('should start false', async () => {
        expect(alarm.safe).toBe(false)
    })

    it('should set true if all sensors close', async () => {
        var payload: ClosureSensorZigbeeComponentInfo = { contact: true, linkquality: 10 };
        sensors.forEach(sensor => {
            client.publish(sensor.topic, JSON.stringify(payload))
        });
        expect(alarm.safe).toBe(true)
    })

    it('should be false if one sensor opens', async () => {
        var payload: ClosureSensorZigbeeComponentInfo = { contact: false, linkquality: 10 };
        client.publish(sensors[0].topic, JSON.stringify(payload))
        expect(alarm.safe).toBe(false)
    })
})