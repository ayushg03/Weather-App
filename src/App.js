import React, { useState } from 'react';
import axios from 'axios';
import { WiBarometer, WiCloud, WiCloudy, WiDayHaze, WiDaySunny, WiFog, WiRain, WiSmoke, WiSnow } from 'react-icons/wi';
import './App.css';
import { ThreeDots } from 'react-loader-spinner';

const App = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [data, setData] = useState(null);
  const [place,setPlace]=useState(null);
  const [today, setToday] = useState(null);
  const [week, setWeek] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiKey = process.env.REACT_APP_API_KEY;

  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      
      if (location === '') {
        window.location.reload();
      }
      setError(null);
      setWeatherData(null);
      setData(null);
      setToday(null);
      setWeek(null);
      setLoading(true);
      fetchWeatherData(location);
    }
  };



  const fetchWeatherData = async (location) => {
    try {

      axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${apiKey}`)
        .then(response1 => {
          const { lat, lon } = response1.data[0];
          const loc=response1.data[0].name+', '+response1.data[0].state;
          setPlace(loc);
          return axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        })
        .then(response => {
          const { weather } = response.data.current;
          const main = response.data.current;
          

          setLoading(false);


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
          setLoading(false);
          setError('Could not fetch weather data. Please try again later.');
        });

    } catch (error) {
      console.error(error);
      setLoading(false);
      setError('No location found');
      setWeatherData(null);
      setData(null);
      setToday(null);
      setWeek(null);
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
      case 'Haze':
        return <WiDayHaze size={64} />;
      case 'Fog':
        return <WiFog size={64}/>;
      case 'Smoke':
        return <WiSmoke size={64}/>;
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
            placeholder="Enter location and press enter ↵"
            value={location}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </form>

        {(loading == true) &&
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#9dd4f6"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        }

        {error && <p className="error-message">{error}</p>}

        {weatherData && (
          <div className="weather-info">

            <div className='box'>
              <div className='box2'>
              <div className="weather-condition" style={{display:'flex',justifyContent:'flex-start'}}>
                  {place}
                </div>
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
                    (index != 0) && (
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
