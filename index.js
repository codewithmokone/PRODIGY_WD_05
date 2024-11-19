const url = "http://api.openweathermap.org/data/2.5/weather";

const apiKey = "2c30634243f65ad7130c3c5dba70dd9a";

let lat;
let lon;
let time = "";
let setDate = "";
let setMonth = "";
let setDay = "";
let weatherData = "";
let forecastData = "";
let tempIcon = "";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Function to get current location
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Error getting location.");
  }
};

const showPosition = (position) => {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
};

getLocation();

// Variable for DOM elements
const temperature = document.getElementById("temp");
const city = document.getElementById("city");
const provice = document.getElementById("province");
const dayTime = document.getElementById("time");
const day = document.getElementById("day");

async function weatherFn() {
  const weather = `https://api.openweathermap.org/data/2.5/weather?lat=-26.2569984&lon=27.8757376&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(weather);
    const data = await res.json();
    if (res.ok) {
      weatherData = data.main;
      // console.log(data);

      temperature.innerText = `${Math.round(weatherData.temp)}°`;
      tempIcon.innerText = time = new Date(); // set current date and time
        
      time.getTime();
      setMonth = months[time.getMonth()];
      setDate = time.getDate();
      city.innerText = data.name;
      dayTime.innerText = `${time.getHours()}:${time.getMinutes()}`;
      day.innerText = `${setMonth} ${setDate}`;
    }
  } catch {
    console.log("Error: ", error);
  }
}

const forecastList = document.getElementById("forecastList");

// Function for fetching forecast
const forecast = async () => {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=-26.2569984&lon=27.8757376&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(forecastUrl);
    const data = await res.json();

    if (res.ok) {
      let info = data.list;

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];

      // Filter the data to show only today's forecast
      const todayForecasts = info.filter((item) =>
        item.dt_txt.startsWith(today)
      );

      if (todayForecasts.length === 0) {
        forecastList.innerHTML = `<p>No forecast available for today</p>`;
      } else {
        todayForecasts.forEach((item, index) => {
          const temperature = item.main.temp; // Access the temperature
          const time = item.dt_txt.split(" ")[1]; // Extract only the time
          const iconCode = item.weather[0].icon;
          const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
          // Append new list items
          const listItem = document.createElement("li");
          listItem.setAttribute("key", index);
          listItem.innerHTML = `<p>${time}</p><div class="icon-temp"><img src="${iconUrl}" /><p>${temperature}°C</p></div>`;
          forecastList.appendChild(listItem);
        });
      }
    } else {
      console.log("Error: Failed to fetch forecast data.");
    }
  } catch {
    console.log("Error: ", error.message);
  }
};

weatherFn();
forecast();
