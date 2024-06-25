import { BASE_TOPIC } from "../topics"
import { Component } from "./component"
import axios, { AxiosInstance } from 'axios';

export class Weather extends Component {

    private location: [number, number]
    private instance: AxiosInstance;

    constructor(latitude: number, longitude: number) {
        super()
        this.location = [latitude, longitude]
        this.instance = axios.create({
            baseURL: 'https://api.met.no/weatherapi/locationforecast/2.0/mini?lat=41.3831173&lon=2.1640883',
            timeout: 1000,
            headers: {
                "User-Agent": "Automations https://github.com/jserrats/automations"
            }
        });
    }

    async fetchWeather() {
        var response = await this.instance.get<WeatherAPIResponse>("")
        console.log(response.data.properties.timeseries[0].data.instant)
    }

}


type WeatherAPIResponse = {
    properties: {
        timeseries: Array<DataWeatherAPIResponse>
    }
}

type DataWeatherAPIResponse = {
    data: {
        instant: {
            details: {
                air_pressure_at_sea_level: number,
                air_temperature: number,
                cloud_area_fraction: number,
                relative_humidity: number,
                wind_from_direction: number,
                wind_speed: number
            }
        },
        next_12_hours: PredictionWeatherAPIResponse,
        next_6_hours: PredictionWeatherAPIResponse,
        next_1_hours: PredictionWeatherAPIResponse,
    },
    time: Date
}

type PredictionWeatherAPIResponse = {
    details: {
        precipitation_amount?: number
    },
    summary: {
        symbol_code: string
    }
}
//https://api.met.no/weatherapi/locationforecast/2.0/mini?lat=41.3831173&lon=2.1640883