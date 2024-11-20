const url = "http://api.openweathermap.org/data/2.5/weather";

const apiKey = "2c30634243f65ad7130c3c5dba70dd9a";

let lat = "";
let lon = "";
let weatherData = "";
let locationCity = "";

// Function to get current location
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Error getting location.");
  }
};

// Function to convert latitute and longitute to city name
const showPosition = async (position) => {
  lat = position.coords.latitude;
  lon = position.coords.longitude;

  if (lat && lon) {
    const locationUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
      const res = await fetch(locationUrl);
      const data = await res.json();

      if (res.ok) {
        locationCity = "";
        locationCity = data[0].name;
        weatherFn();
        forecastFn();
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }
};

getLocation();

// Variable for DOM elements
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const temperature = document.getElementById("currentTemp");
const HeaderIcon = document.getElementById("leftHeaderIcon");
const forecastList = document.getElementById("forecastList");
const city = document.getElementById("city");
const country = document.getElementById("country");
const dayTime = document.getElementById("time");
const day = document.getElementById("day");

// Function for fetching weather info
async function weatherFn() {
  if (!locationCity) {
    return console.log("No location provided");
  }

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationCity}&appid=${apiKey}&units=metric`;
  try {
    const res = await fetch(weatherUrl);
    const data = await res.json();

    if (res.ok) {
      weatherData = data.main;
      const tempIcon = data.weather[0].icon;
      const tempIconUrl = `https://openweathermap.org/img/wn/${tempIcon}@2x.png`;
      const tempDescription = data.weather[0].description;
      const description =
        tempDescription.charAt(0).toUpperCase() + tempDescription.slice(1);

      temperature.innerText = `${Math.round(weatherData.temp)}°`;
      HeaderIcon.innerHTML = `<img class="image-icon" src="${tempIconUrl}" /><p>${description}</p>`;

      // Shows current time
      dayTime.innerText = moment().format("hh:mm a");
      day.innerText = moment().format("MMMM Do");

      // Update city and country
      city.innerText = data.name;
      country.innerText = data.sys.country;
    }
  } catch {
    console.log("Error: ", error);
  }

}

// Function for fetching forecast
const forecastFn = async () => {
  if (!locationCity) {
    return console.log("No location provided.");
  }

  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${locationCity}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(forecastUrl);
    const data = await res.json();

    if (res.ok) {
      // Assigning response data
      let info = data.list;

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];

      // Filter the data to show only today's forecast
      const todayForecasts = info.filter((item) =>
        item.dt_txt.startsWith(today)
      );

      // Clearing displayed forecast data
      forecastList.innerHTML = "";
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
  } catch (error) {
    console.log("Error: ", error.message);
  }
};

// Handles search button functionality
searchBtn.addEventListener("click", () => {
  locationCity = searchInput.value.trim();
  if (locationCity) {
    weatherFn(locationCity);
    forecastFn(locationCity);
  }
});
