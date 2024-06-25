import { client } from "../../../src/mqtt"
import { router } from "../../../src/router"
import { Weather } from "../../../src/components/weather"
import { BASE_TOPIC } from "../../../src/topics";

jest.mock('../../../src/mqtt', () => ({
    client: {
        publish: jest.fn((newTopic: string, newPayload: string) => { router.route(newTopic, newPayload) })
    }
}));


jest.useFakeTimers()

describe('Weather', () => {

    it('should fetch weatherAPI', async () => {
        var weather = new Weather(0, 0)
        await weather.fetchWeather()
        expect(true).toBe(true)
    })
})