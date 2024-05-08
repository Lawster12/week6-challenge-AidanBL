const apiKey = '9f4a29a7bfb78b4b8fe7fac912cedc89'; 
const apiUrl = 'https://api.openweathermap.org/data/2.5/';

const form = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const searchHistoryList = document.getElementById('search-history-list');

// Function to save searched city to local storage
function saveToLocalStorage(city) {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  // Add the new city to the beginning of the array to display latest searches first
  searchHistory.unshift(city);
  // Limit the search history to 5 items
  searchHistory = searchHistory.slice(0, 5);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Function to display search history
function displaySearchHistory() {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  searchHistoryList.innerHTML = `<ul>${searchHistory.map(city => `<li><button onclick="getWeather('${city}')">${city}</button></li>`).join('')}</ul>`;
}


form.addEventListener('submit', e => {
  e.preventDefault();
  const cityName = cityInput.value.trim();
  saveToLocalStorage(cityName);
  displaySearchHistory();
  if (cityName) {
    getWeather(cityName);
    cityInput.value = '';
  } else {
    alert('Please enter a city name');
  }
});

async function getWeather(city) {
  try {
    const response = await fetch(`${apiUrl}weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();

    displayCurrentWeather(data);

    // Fetch 5-day forecast data
    const forecastResponse = await fetch(`${apiUrl}forecast?q=${city}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastResponse.json();

    displayForecast(forecastData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function displayCurrentWeather(data) {
  currentWeatherDiv.innerHTML = `
    <h2>${data.name}</h2>
    <p>Temperature: ${data.main.temp} °C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

function displayForecast(data) {
  // Extract data for the next 5 days
  const forecasts = data.list.filter((item, index) => index % 8 === 0); // Data for every 3 hours, so taking data for every 24 hours

  forecastDiv.innerHTML = '<h2>5-Day Forecast</h2>';

  forecasts.forEach(forecast => {
    const date = new Date(forecast.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });

    forecastDiv.innerHTML += `
      <div>
        <p>${day}</p>
        <p>Temperature: ${forecast.main.temp} °C</p>
        <p>Humidity: ${forecast.main.humidity}%</p>
        <p>Wind Speed: ${forecast.wind.speed} m/s</p>
      </div>
    `;
  });
}