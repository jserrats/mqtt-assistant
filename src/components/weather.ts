import { BASE_TOPIC } from "../topics"
import { Component } from "./component"

export class Weather extends Component {

    private location: [number, number]

    constructor(latitude: number, longitude: number) {
        super()
        this.location = [latitude, longitude]
    }

    private fetchWeather() {

    }

}


type WeatherAPIResponse = {
    properties: {
        timeseries: Array<{ data: DataWeatherAPI }>
    }
}

type DataWeatherAPI = {

}

https://api.met.no/weatherapi/locationforecast/2.0/mini?lat=41.3831173&lon=2.1640883