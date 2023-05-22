import React, { useState } from 'react';
import axios from 'axios';
import { WiCloud, WiDaySunny, WiRain, WiSnow } from 'react-icons/wi';
import './App.css';

const App = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setLocation(e.target.value);
    fetchWeatherData(e.target.value);
  };

  const fetchWeatherData = async (location) => {
    try {
      const response = await axios.post('http://localhost:5000/api/weather', { location });
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('No location found');
      setWeatherData(null);
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clouds':
        return <WiCloud size={64} />;
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
          />
        </form>

        {error && <p className="error-message">{error}</p>}

        {weatherData && (
          <div className="weather-info">
             <div className="weather-icon">
              {getWeatherIcon(weatherData.condition)}
            </div>
            <div className="temperature">
              {weatherData.temperature}&deg;C
            </div>
           
            <div className="weather-condition">
              {weatherData.condition}
            </div>
            <div className="humidity">
              Humidity: {weatherData.humidity}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
