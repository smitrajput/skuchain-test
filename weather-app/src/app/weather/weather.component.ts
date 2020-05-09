import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CORS } from "../cors.service";
import { DataSource } from "@angular/cdk/table";
import { MatTableDataSource } from "@angular/material";

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
  arr: any;
  indexU: any;
  indexJ: any;
  umbrellaNum: number;
  jacketNum: number;
  uArr: any = [];
  jArr: any = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  displayedColumns: string[] = [
    "day",
    "icon",
    "humidity",
    "windSpeed",
    "cloudCover",
    "precipAccumulation",
    "precipIntensity",
    "precipProbability",
    "apparentTemperatureHigh",
    "apparentTemperatureLow",
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
    let meta = this;
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
        meta.arr = [];
        for (let i = 0; i < 5; ++i) {
          let obj = {
            day: 0,
            humidity: 0,
            windSpeed: 0,
            cloudCover: 0,
            icon: 0,
            precipAccumulation: 0,
            precipIntensity: 0,
            precipProbability: 0,
            apparentTemperatureHigh: 0,
            apparentTemperatureLow: 0,
          };
          if (response["daily"]["data"]) {
            obj.day = i + 1;
            obj.humidity = response["daily"]["data"][i].humidity;
            obj.windSpeed = response["daily"]["data"][i].windSpeed;
            obj.cloudCover = response["daily"]["data"][i].cloudCover;
            obj.icon = response["daily"]["data"][i].icon;
            obj.precipAccumulation =
              response["daily"]["data"][i].precipAccumulation;
            obj.precipIntensity = response["daily"]["data"][i].precipIntensity;
            obj.precipProbability =
              response["daily"]["data"][i].precipProbability;
            obj.apparentTemperatureHigh =
              response["daily"]["data"][i].apparentTemperatureHigh;
            obj.apparentTemperatureLow =
              response["daily"]["data"][i].apparentTemperatureLow;
            meta.arr.push(obj);
          }
        }
        meta.dataSource = new MatTableDataSource(meta.arr);
        meta.findUmbrellaDay();
        meta.findJacketDay();
      }
    );
  }

  // Summary: 'clear-day: 5', 'clear-night', 'rain: 10', 'snow: 7', 'sleet: 6', 'wind', 'fog', 'cloudy: 4', 'partly-cloudy-day: 3', or 'partly-cloudy-night: 3'
  findUmbrellaDay() {
    this.umbrellaNum = 0;
    let max = -1;
    this.uArr = [];
    this.indexU = 0;
    for (let i = 0; i < 5; ++i) {
      this.umbrellaNum = 0;
      let day = this.arr[i];
      if (day.icon == "rain") this.umbrellaNum += 10;
      else if (day.icon == "snow") this.umbrellaNum += 7;
      else if (day.icon == "sleet") this.umbrellaNum += 6;
      else if (day.icon == "clear-day") this.umbrellaNum += 5;
      else if (day.icon == "cloudy") this.umbrellaNum += 4;
      else if (
        day.icon == "partly-cloudy-day" ||
        day.icon == "partly-cloudy-night"
      )
        this.umbrellaNum += 3;
      if (day.humidity > 0) this.umbrellaNum *= day.humidity;
      if (day.cloudCover > 0) this.umbrellaNum *= day.cloudCover;
      if (day.precipAccumulation) this.umbrellaNum += day.precipAccumulation;
      this.umbrellaNum += day.precipIntensity;
      if (day.precipProbability > 0) this.umbrellaNum *= day.precipProbability;
      this.umbrellaNum += day.apparentTemperatureHigh;
      this.uArr.push(this.umbrellaNum);

      if (this.umbrellaNum > max) {
        max = this.umbrellaNum;
        this.indexU = i + 1;
      }
    }
    console.log(this.uArr);
  }

  //Summary: 'snow: 10', 'sleet: 8', 'wind: 5'
  findJacketDay() {
    console.log(this.arr);
    this.jacketNum = 0;
    let max = -1000000;
    this.jArr = [];
    this.indexJ = 0;
    for (let i = 0; i < 5; ++i) {
      this.jacketNum = 0;
      let day = this.arr[i];
      if (day.icon == "snow") this.jacketNum += 10;
      else if (day.icon == "sleet") this.jacketNum += 8;
      else if (day.icon == "wind") this.jacketNum += 5;
      if (day.precipAccumulation) this.jacketNum += day.precipAccumulation;
      this.jacketNum -= day.apparentTemperatureLow;
      this.jacketNum += day.windSpeed;

      this.jArr.push(this.jacketNum);
      if (this.jacketNum > max) {
        max = this.jacketNum;
        this.indexJ = i + 1;
      }
    }
  }
}
