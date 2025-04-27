const apiKey = 'f5cb0b965ea1564c50c6f1b74534d823'; // Free API key - you can replace with your own
const searchBox = document.querySelector('.search-box input');
const searchBtn = document.querySelector('.search-box button');
const weatherImg = document.querySelector('.weather-box img');
const temperature = document.querySelector('.weather-box .temperature');
const description = document.querySelector('.weather-box .description');
const humidity = document.querySelector('.humidity span');
const wind = document.querySelector('.wind span');
const forecastContainer = document.querySelector('.forecast-container');

// Function to get weather data
async function getWeather(city) {
    try {
        // Current weather
        const currentWeatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        const currentWeatherData = await currentWeatherResponse.json();

        if (currentWeatherData.cod === 401) {
            alert('Invalid API key. Please check your OpenWeatherMap API key.');
            return;
        }

        if (currentWeatherData.cod === '404') {
            alert('City not found');
            return;
        }

        // 5-day forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );
        const forecastData = await forecastResponse.json();

        // Update current weather
        updateCurrentWeather(currentWeatherData);
        // Update forecast
        updateForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

// Function to update current weather display
function updateCurrentWeather(data) {
    temperature.innerHTML = `${Math.round(data.main.temp)}<span>°C</span>`;
    description.innerHTML = data.weather[0].description;
    humidity.innerHTML = `${data.main.humidity}%`;
    wind.innerHTML = `${data.wind.speed} km/h`;
    
    // Update weather image
    const weatherIcon = data.weather[0].icon;
    weatherImg.src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
}

// Function to update forecast display
function updateForecast(data) {
    forecastContainer.innerHTML = '';
    
    // Get one forecast per day (at noon)
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    
    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="date">${day}</div>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="weather">
            <div class="temp">${Math.round(forecast.main.temp)}°C</div>
        `;
        
        forecastContainer.appendChild(forecastItem);
    });
}

// Event listeners
searchBtn.addEventListener('click', () => {
    const city = searchBox.value.trim();
    if (city) {
        getWeather(city);
    }
});

searchBox.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        const city = searchBox.value.trim();
        if (city) {
            getWeather(city);
        }
    }
});

// Get weather for default city (London) on page load
getWeather('London'); 