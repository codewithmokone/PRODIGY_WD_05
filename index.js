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
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const temperature = document.getElementById("temp");
const HeaderIcon = document.getElementById("leftHeaderIcon");
const city = document.getElementById("city");
const country = document.getElementById("country");
const dayTime = document.getElementById("time");
const day = document.getElementById("day");

// Handles search button functionality
searchBtn.addEventListener("click", () => {
  const location = searchInput.value.trim();
  if (location) {
    weatherFn(location);
    forecastFn(location);
    console.log("Location: ", location);
  }
});

// Function for fetching weather info
async function weatherFn(location) {
  if (location) {
    const searchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    try {
      const res = await fetch(searchUrl);
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        weatherData = data.main;
        const tempIcon = data.weather[0].icon;
        const tempIconUrl = `https://openweathermap.org/img/wn/${tempIcon}@2x.png`;
        const tempDescription = data.weather[0].description;
        const description =
          tempDescription.charAt(0).toUpperCase() + tempDescription.slice(1);

        temperature.innerText = `${Math.round(weatherData.temp)}°`;
        HeaderIcon.innerHTML = `<img class="image-icon" src="${tempIconUrl}" /><p>${description}</p>`;
        tempIcon.innerText = time = new Date(); // set current date and time

        time.getTime();
        setMonth = months[time.getMonth()];
        setDate = time.getDate();
        city.innerText = data.name;
        country.innerText = data.sys.country
        dayTime.innerText = `${time.getHours()}:${time.getMinutes()}`;
        day.innerText = `${setMonth} ${setDate}`;
      }
    } catch {
      console.log("Error: ", error);
    }
  } else {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=-26.2569984&lon=27.8757376&appid=${apiKey}&units=metric`;

    try {
      const res = await fetch(weatherUrl);
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        weatherData = data.main;
        const tempIcon = data.weather[0].icon;
        const tempIconUrl = `https://openweathermap.org/img/wn/${tempIcon}@2x.png`;
        const tempDescription = data.weather[0].description;
        const description =
          tempDescription.charAt(0).toUpperCase() + tempDescription.slice(1);
        console.log(data.weather[0].description);

        temperature.innerText = `${Math.round(weatherData.temp)}°`;
        //   const imgIcon = document.createElement('div')
        HeaderIcon.innerHTML = `<img class="image-icon" src="${tempIconUrl}" /><p>${description}</p>`;
        //   HeaderIcon.appendChild(imgIcon)
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
}

const forecastList = document.getElementById("forecastList");

// Function for fetching forecast
const forecastFn = async (location) => {
    if(location){
        const searchUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

        try {
            const res = await fetch(searchUrl);
            const data = await res.json();
        
            if (res.ok) {
              let info = data.list;
        
              // Get today's date in YYYY-MM-DD format
              const today = new Date().toISOString().split("T")[0];
        
              // Filter the data to show only today's forecast
              const todayForecasts = info.filter((item) =>
                item.dt_txt.startsWith(today)
              );
        
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
          } catch {
            console.log("Error: ", error.message);
          }
    }else{
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
    }

//   try {
//     const res = await fetch(forecastUrl);
//     const data = await res.json();

//     if (res.ok) {
//       let info = data.list;

//       // Get today's date in YYYY-MM-DD format
//       const today = new Date().toISOString().split("T")[0];

//       // Filter the data to show only today's forecast
//       const todayForecasts = info.filter((item) =>
//         item.dt_txt.startsWith(today)
//       );

//       if (todayForecasts.length === 0) {
//         forecastList.innerHTML = `<p>No forecast available for today</p>`;
//       } else {
//         todayForecasts.forEach((item, index) => {
//           const temperature = item.main.temp; // Access the temperature
//           const time = item.dt_txt.split(" ")[1]; // Extract only the time
//           const iconCode = item.weather[0].icon;
//           const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
//           // Append new list items
//           const listItem = document.createElement("li");
//           listItem.setAttribute("key", index);
//           listItem.innerHTML = `<p>${time}</p><div class="icon-temp"><img src="${iconUrl}" /><p>${temperature}°C</p></div>`;
//           forecastList.appendChild(listItem);
//         });
//       }
//     } else {
//       console.log("Error: Failed to fetch forecast data.");
//     }
//   } catch {
//     console.log("Error: ", error.message);
//   }
};

weatherFn();
forecastFn();
