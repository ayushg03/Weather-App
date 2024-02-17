import React, { useState } from 'react';
import axios from 'axios';
import { WiBarometer, WiCloud, WiCloudy, WiDaySunny, WiRain, WiSnow } from 'react-icons/wi';
import './App.css';

const App = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [data, setData] = useState(null);
  const [today, setToday] = useState(null);
  const [week,setWeek]=useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setLocation(e.target.value);
    if(e.target.value===''){

    }
      // fetchWeatherData(e.target.value);
      
    
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      if(location===''){
        window.location.reload();
      }
      fetchWeatherData(location);
    }
  };

  

  const fetchWeatherData = async (location) => {
    try {

      axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=9303eeb6b7d5d354ba0901355c3698a4`)
        .then(response1 => {
          const { lat, lon } = response1.data[0];
          return axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=73023ffd0325ec02832b91e190a04f6d`);
        })
        .then(response => {
          const { weather } = response.data.current;
          const main = response.data.current;
          console.log(response.data);


          // Extract the weather condition, temperature, and humidity
          const weatherCondition = weather[0].main;
          const desc = weather[0].description;
          const visibility = main.visibility / 1000;
          const pressure = main.pressure;
          const wind = main.wind_speed;
          const temperature = main.temp;
          const humidity = main.humidity;
          const feels_like = (main.feels_like - 273.15).toFixed(0);
          const temperatureCelsius = (temperature - 273.15).toFixed(0);

          // Create a weatherData object to send in the response
          const weatherData = {
            condition: weatherCondition,
            desc: desc,
            visibility: visibility,
            pressure: pressure,
            temperature: temperatureCelsius,
            humidity: humidity,
            wind: wind,
            feels_like: feels_like
          };

          function parseHourlyData(hourlyData) {
            return hourlyData.map(hour => ({
              time: formatTime(hour.dt),
              weatherMain: hour.weather[0].main,
              temperature: hour.temp
            }));
          }

          function formatTime(unixTimestamp) {
            const date = new Date(unixTimestamp * 1000);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
          }

          function parseDailyData(dailyData) {
            return dailyData.map(day => ({
                date: formatDate(day.dt),
                WeatherMain: day.weather[0].main,
                temperature: day.temp.day
            }));
        }
        
        function formatDate(unixTimestamp) {
            const date = new Date(unixTimestamp * 1000);
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const dayOfWeek = days[date.getDay()];
            const month = months[date.getMonth()];
            const dayOfMonth = date.getDate().toString().padStart(2, '0');
            return `${dayOfWeek}, ${month} ${dayOfMonth}`;
        }

          setToday(parseHourlyData(response.data.hourly));
          setWeek(parseDailyData(response.data.daily));
          console.log(parseDailyData(response.data.daily));
          setWeatherData(weatherData);
          setData(response.data);
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
          setError('Could not fetch weather data. Please try again later.');
        });

    } catch (error) {
      console.error(error);
      setError('No location found');
      setWeatherData(null);
    }
  };



  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clouds':
        return <WiCloudy size={64} />;
      case 'Clear':
        return <WiDaySunny size={64} />;
      case 'Rain':
        return <WiRain size={64} />;
      case 'Snow':
        return <WiSnow size={64} />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className="weather-card">
        <h2 className="weather-title">Weather Application</h2>

        <form className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Enter location"
            value={location}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </form>

        {error && <p className="error-message">{error}</p>}

        {weatherData && (
          <div className="weather-info">

            <div className='box'>
              <div className='box2'>
                <div className='box1'>
                  <div className="weather-icon">
                    {getWeatherIcon(weatherData.condition)}
                  </div>
                  <div className="temperature">
                    {weatherData.temperature}&deg;C
                  </div>
                </div>
                {(data?.alerts) && (<div className="warning">
                  {data.alerts[0].event}
                </div>
                )}
              </div>

              <div className='line'>

              </div>

              <div className='box2'>
                <div className="weather-condition">
                  Feels like {weatherData.feels_like}&deg;C. {weatherData.desc.charAt(0).toUpperCase() + weatherData.desc.slice(1)}
                </div>
                <div className='box1'>
                  <div className="humidity">
                    <div className='htext'> Pressure </div>
                    {weatherData.pressure} hPa
                  </div>
                  <div className="humidity">
                    <div className='htext'>Wind</div> {weatherData.wind} m/s
                  </div>
                </div>
                <div className='box1' style={{ marginTop: '-15px' }}>
                  <div className="humidity">
                    <div className='htext'> Humidity</div> {weatherData.humidity}%
                  </div>
                  <div className="humidity">
                    <div className='htext'>Visibility</div> {weatherData.visibility} km
                  </div>
                </div>
              </div>
            </div>
            <div className='box-forecast' style={{ marginTop: '20px' }}>
              <div className='box2-forecast'>
                <div className='htext'>
                  Today's Forecast
                </div>
                <div className='box1-forecast' style={{ marginTop: '10px' }}>
                  {today.map((item, index) => (
                    (index % 4 === 0) && (
                      <div key={index} className="forecast">
                        <div className='htext'>{item.time}</div>
                        <div className="weather-icon">
                          {getWeatherIcon(item.weatherMain)}
                        </div>
                        <div className='htext'>{(item.temperature - 273.15).toFixed(0)}&deg;C</div>
                      </div>
                    )
                  ))}
                </div>

              </div>
              <div className='box2-forecast-week'>
                <div className='htext'>
                  Weekly Forecast
                </div>
                <div className='box1-forecast-week' style={{ marginTop: '10px' }}>
                  {week.map((item, index) => (
                   (index!=0) && (
                      <div key={index} className="forecast-week">
                        <div className='htext'>{item.date}</div>
                        <div className="weather-icon">
                          {getWeatherIcon(item.WeatherMain)}
                        </div>
                        <div className='htext'>{(item.temperature - 273.15).toFixed(0)}&deg;C</div>
                      </div>
                   )
                  ))}
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
