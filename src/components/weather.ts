import axios, { type AxiosInstance } from "axios";
import { getEnvVariable } from "../environment";
import { BASE_TOPIC } from "../topics";
import { Component } from "./component";

export class Weather extends Component {
	private location: { latitude: number; longitude: number };
	private httpClient: AxiosInstance;
	forecast: WeatherForecast;

	constructor(latitude: number, longitude: number) {
		super();
		this.location = { latitude, longitude };
		let OPENWEATHERMAP_API_KEY: string;

		try {
			OPENWEATHERMAP_API_KEY = getEnvVariable("OPENWEATHERMAP_API_KEY");
		} catch (error) {
			console.error(
				"[!] Error while creating Weather component: OPENWEATHERMAP_API_KEY is undefined",
			);
			return;
		}

		this.httpClient = axios.create({
			baseURL: `https://api.openweathermap.org/data/2.5/forecast?lat=${this.location.latitude}&lon=${this.location.longitude}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`,
			timeout: 1000,
		});

		this.fetchWeather();

		setInterval(
			() => {
				this.fetchWeather();
			},
			1000 * 60 * 15,
		);
	}

	private async fetchWeather() {
		try {
			const response = await this.httpClient.get<ForecastWeatherAPI>("");
			const now = response.data.list[0];
			const in3h = response.data.list[1];
			const in6h = response.data.list[2];
			const in9h = response.data.list[3];

			this.forecast = {
				now: {
					rain_probability: now.pop,
					temperature: now.main.temp,
					humidity: now.main.humidity,
					clouds: now.clouds.all,
					description: now.weather[0].description,
				},
				in3h: {
					rain_probability: in3h.pop,
					temperature: in3h.main.temp,
					humidity: in3h.main.humidity,
					clouds: in3h.clouds.all,
					description: in3h.weather[0].description,
				},
				in6h: {
					rain_probability: in6h.pop,
					temperature: in6h.main.temp,
					humidity: in6h.main.humidity,
					clouds: in6h.clouds.all,
					description: in6h.weather[0].description,
				},
				in9h: {
					rain_probability: in9h.pop,
					temperature: in9h.main.temp,
					humidity: in9h.main.humidity,
					clouds: in9h.clouds.all,
					description: in9h.weather[0].description,
				},
			};

			this.client.publish("weather", JSON.stringify(this.forecast.now));
			this.client.publish("weather/3h", JSON.stringify(this.forecast.in3h));
			this.client.publish("weather/6h", JSON.stringify(this.forecast.in6h));
			this.client.publish("weather/9h", JSON.stringify(this.forecast.in9h));
		} catch (error) {
			let error_message = "Unknown Error";
			if (error instanceof Error) error_message = error.message;
			console.error(
				`[!] Error while parsing message:
					ERROR: ${error_message}`,
			);
			return;
		}
	}
}

type CurrentWeatherAPI = {
	weather: Array<{ main: string; description: string }>;
	main: { temp: number; feels_like: number; humidity: number };
	clouds: { all: number };
};

type ForecastWeatherAPI = {
	list: Array<
		CurrentWeatherAPI & {
			dt: number;
			dt_txt: string;
			pop: number;
		}
	>;
};

type WeatherMoment = {
	rain_probability: number;
	temperature: number;
	humidity: number;
	clouds: number;
	description: string;
};

export type WeatherForecast = {
	now: WeatherMoment;
	in3h: WeatherMoment;
	in6h: WeatherMoment;
	in9h: WeatherMoment;
};
