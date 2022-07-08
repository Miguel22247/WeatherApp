// Get all necessary elements from the DOM
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
const btn = document.querySelector('.submit');
const search = document.querySelector('.search');
const cities = document.querySelectorAll('.city');
const form = document.getElementById('locationInput');

// Default city when page loads
let cityInput = "Montevideo";

// Add click event to each city in the panel
cities.forEach((city) => {
  city.addEventListener('click', (e) => {
    //change from default city to the selected one
    cityInput = e.target.innerHTML;
    fetchWeatherData();
    // Fade out the app
    app.style.opacity = "0";
  });
})

form.addEventListener('submit', (e) => {
  if(search.value.length == 0) {
    alert('Please type the name of a city');
  } else {
    cityInput = search.value;
    fetchWeatherData();
    // Removes the text from the input field
    search.value = "";
    // Fade out the app
    app.style.opacity = "0";
  }
});

/* Function that returns a day of the week */
function dayOfTheWeek(day, month, year) {
  const weekday=[
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
  fetch(`http://api.weatherapi.com/v1/current.json?key=b61f52df5c5741399dd182333222006&q=${cityInput}`)
  .then(response => response.json())
  .then (data => {
    console.log(data)

    /* adding temperature and weather condition */
    temp.innerHTML = data.current.temp_c + "&#176;";
    conditionOutput.innerHTML = data.current.condition.text;

    /* Get the date and time from the city */
    const date = data.loaction.localtime;
    const y = parseInt(date.substr(0, 4));
    const m = parseInt(date.substr(5, 2));
    const d = parseInt(date.substr(8, 2));
    const time = date.substr(11);

    /* reformat of the date */
    /* Original format: 2022-06-23 23:17 */
    /* New format: 23:17 - Thursday Jun 23 */
    dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
    timeOutput.innerHTML = time;

    // Add the name of the city into the page
    nameOutput.innerHTML = data.location.name;
    /* get the corresponding icon url */
    const iconId = data.current.condition.icon.subst("//cdn.weatherapi.com/weather/64x64/".length)
    icon.src = "./assets/icons" + iconId;

    // Add the weather details
    cloudOutput.innerHTML = data.current.cloud + "%";
    humidityOutput.innerHTML = data.current.humidity + "%";
    windOutput.innerHTML = data.current.wind_kph + "km/h";

    // set default time of day
    let timeOfDay = "day";
    const code = data.current.condition.code;

    if (!data.current.is_day) {
      timeOfDay = "night";
    }

  })
}

fetchWeatherData();


