import { router } from "../../../../src/router"
import { client } from "../../../../src/mqtt"
import { ZigbeeComponent } from "../../../../src/components/zigbee/zigbee"

jest.mock('../../../../src/mqtt', () => ({
    client: {
        publish: jest.fn((newTopic: string, newPayload: string) => { router.route(newTopic, newPayload) })
    }
}));

jest.useFakeTimers()

describe('ZigbeeComponent', () => {
    var zigbeeComponent: ZigbeeComponent


    beforeAll(async () => {
        zigbeeComponent = new ZigbeeComponent("test1")
    })

    afterEach(async () => {
        (client.publish as jest.Mock).mockClear()

    })

    it('should not crash with bad JSON', async () => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn());
        expect(() => {
            router.route(zigbeeComponent.topic, "asdf")
        }).not.toThrow()
    })

})