import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CORS } from "../cors.service";
import { DataSource } from "@angular/cdk/table";
import { MatTableDataSource } from "@angular/material";

export interface WeatherInfo {
  summary: string;
  humidity: number; // 0 to 1  //umbrella
  windSpeed: number; //jacket
  windGust: number; //jacket
  windGustTime: number; //jacket
  cloudCover: number; // 0 to 1  //umbrella
  dewPoint: number; //fahreheit  //umbrella
  icon: string; //umbrella  //jacket for 'wind'
  precipAccumulation: number; //not defined of no snowfall expected  //jacket
  precipIntensity: number; // in inches of liquid water per hour  //umbrella
  precipProbability: number; //umbrella
  precipType: string; // if precipIntensity = 0, not defined //rain, snow, fleet   //umbrella
  apparentTemperatureLow: number; //jacket
  apparentTemperatureMin: number; //jacket
}

let weatherData: WeatherInfo[] = [];

@Component({
  selector: "app-weather",
  templateUrl: "./weather.component.html",
  styleUrls: ["./weather.component.scss"],
})
export class WeatherComponent implements OnInit {
  city: any;
  lat: any;
  long: any;
  place_name: any;
  foo: any;
  dataSource: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  displayedColumns: string[] = [
    "summary",
    "humidity",
    "windSpeed",
    "windGust",
    "windGustTime",
    "cloudCover",
    "dewPoint",
    "icon",
    "precipAccumulation",
    "precipIntensity",
    "precipProbability",
    "precipType",
    "apparentTemperatureLow",
    "apparentTemperatureMin",
  ];

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }
    this.city = name;
    this.getCoordinates();
  }

  getCoordinates() {
    this.http
      .get(
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
          this.city +
          ".json?access_token=pk.eyJ1Ijoic21pdC1yYWpwdXQiLCJhIjoiY2sxa21lYnZnMGNmbzNpcGU3Z2Jrd2wydiJ9.d6VE1uaNfh84GSCllCofng"
      )
      // console.log(this.foo);
      .subscribe(
        (res) => {
          this.long = res["features"][0].center[0];
          this.lat = res["features"][0].center[1];
          this.place_name = res["features"][0].place_name;
          console.log("RESCOORDI", res);
          this.getWeatherInfo();
        },
        (err) => {
          // console.log(err);
        }
      );
  }

  getWeatherInfo() {
    CORS.doCORSRequest(
      {
        method: "GET",
        url:
          "https://api.darksky.net/forecast/7b2ad38193a3c90be4e4537f3fb729f9/" +
          this.lat +
          "," +
          this.long,
        data: "",
      },
      function result(status, response) {
        response = JSON.parse(response);
        for (let i = 0; i < 5; ++i) {
          if (response["daily"]["data"][i]) {
            // this.weatherData[i].summary = response["daily"]["data"][i].summary;
            // this.weatherData[i].humidity =
            //   response["daily"]["data"][i].humidity;
            // this.weatherData[i].windSpeed =
            //   response["daily"]["data"][i].windSpeed;
            // this.weatherData[i].windGust =
            //   response["daily"]["data"][i].windGust;
            // this.weatherData[i].windGustTime =
            //   response["daily"]["data"][i].windGustTime;
            // this.weatherData[i].cloudCover =
            //   response["daily"]["data"][i].cloudCover;
            // this.weatherData[i].dewPoint =
            //   response["daily"]["data"][i].dewPoint;
            // this.weatherData[i].icon = response["daily"]["data"][i].icon;
            // this.weatherData[i].precipAccumulation =
            //   response["daily"]["data"][i].precipAccumulation;
            // this.weatherData[i].precipIntensity =
            //   response["daily"]["data"][i].precipIntensity;
            // this.weatherData[i].precipProbability =
            //   response["daily"]["data"][i].precipProbability;
            // this.weatherData[i].precipType =
            //   response["daily"]["data"][i].precipType;
            // this.weatherData[i].apparentTemperatureLow =
            //   response["daily"]["data"][i].apparentTemperatureLow;
            // this.weatherData[i].apparentTemperatureMin =
            //   response["daily"]["data"][i].apparentTemperatureMin;
            // console.log("RESS", this.weatherData[i]);
            weatherData.push(response["daily"]["data"][i]);
          }
        }
        this.dataSource = new MatTableDataSource(weatherData);
        // this.dataSource = weatherData;
        // this.displayedColumns = this.dataSource;
      }
    );
  }
}
