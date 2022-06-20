// gets all necesary elements from the DOM
const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.search-btn');
const cities = document.querySelectorAll('.city');

// Default city when page loads
let cityInput = "Montevideo";

//Add click event to each city in the panel
cities.forEach((city) => {
  city.addEventListener('click', (e) => {
    //change from default city to the clicked one
    cityInput = e.target.innerText;
    fetchWeatherData();
    // fade out the app
    app.style.opacity = "0";
  });
})

form.addEventListener('submit', (e) => {
  /* if the search bar is empty, throw an alert */
  if(search.value.length == 0) {
    alert("Please enter a city");
  } else {
    //change from default city to the entered one
    cityInput = search.value;
    /* function that featches weather data and displays all the data from the weather API */
    fetchWeatherData();
    search.value = "";
    app.style.opacity = 0;
  }
  // Prevents the default behaviour of the form
  e.preventDefault();
})

function dayOfTheWeek(day, month, year) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  return weekday[new Date(`${day}/${month}/${year}`).getDay()];
};

function fetchWeatherData() {
  /* fetch weather data from the API */
  fetch(`http://api.weatherapi.com/v1/current.json?key=b61f52df5c5741399dd182333222006&q=${cityInput}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      /* display the data from the API */
      temp.innerHTML = data.current.temp_c + "°C";
      conditionOutput.innerHTML = data.current.condition.text;

      /* get the date and time from the city and extract the day, month and time*/
      const date = data.location.localtime;
      const y = parseInt(date.substr(0, 4));
      const m = parseInt(date.substr(5, 2));
      const d = parseInt(date.substr(8, 2));
      const time = date.substr(11);

      dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}/${m}/${y}`;
      timeOutput.innerHTML = time;

      /* Add the name of the city into the page */
      nameOutput.innerHTML = data.location.name;
      const iconId = data.current.condition.icon.substr("http://cdn.weatherapi.com/weather/64x64/".length);
      icon.src = "./assets/icons" + iconId;

      // add the weather details to the page
      cloudOutput.innerHTML = data.current.cloud + "%";
      humidityOutput.innerHTML = data.current.humidity + "%";
      windOutput.innerHTML = data.current.wind_kph + " km/h"

      //set default time of day
      let timeOfDay = "day";
      const code = data.current.condition.code;

      if (!data.current.is_day) {
        timeOfDay = "night";
      }

      if(code == 1000) {
        app.style.backgroundImage = `url(./assets/images/${timeOfDay}/clear.jpg)`;
        btn.style.background = "#e5ba92";
        if(timeOfDay == "night"){
          btn.style.background = "#181e27";
        }
      } else if (
        code == 1003 ||
        code == 1006 ||
        code == 1009 ||
        code == 1030 ||
        code == 1069 ||
        code == 1087 ||
        code == 1135 ||
        code == 1273 ||
        code == 1276 ||
        code == 1279 ||
        code == 1282
        ) {
          app.style.backgroundImage = `url(./assets/images/${timeOfDay}/cloudy.jpg)`
          btn.style.background = "#fa6d1b";
          if (timeOfDay == "night") {
            btn.style.background = "#181e27";
          }
          // And rain
        } else if (
          code == 1063 ||
          code == 1069 ||
          code == 1072 ||
          code == 1150 ||
          code == 1180 ||
          code == 1183 ||
          code == 1186 ||
          code == 1189 ||
          code == 1192 ||
          code == 1195 ||
          code == 1204 ||
          code == 1207
        ) {
          app.style.backgroundImage = `url(./assets/images/${timeOfDay}/rainy.jpg)`
          btn.style.background = "#647d75";
          if(timeOfDay == "night") {
            btn.style.background = "#325c80";
          }
          // Finally.. Snow
        } else {
          app.style.backgroundImage = `url(../assets/images/${timeOfDay}/snowy.jpg)`;
          btn.style.background = "#4d72aa";
          if(timeOfDay == "night") {
            btn.style.background = "#1b1b1b";
          }
        }
        // Fade in the page once all is done
        app.style.opacity = "1";
    })
  .catch(() => {
    alert("City not found, please try again");
    app.style.opacity = "1"
  });
}

// call the function on page load
fetchWeatherData();

app.style.opacity = "1";
