const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/weather', async (req, res) => {  
  const { location } = req.body;

  try {
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid={APIKEY}`
    );

    // Extract the relevant weather data from the response
    const { weather, main } = weatherResponse.data;

    // Extract the weather condition, temperature, and humidity
    const weatherCondition = weather[0].main;
    const temperature = main.temp;
    const humidity = main.humidity;
    const temperatureCelsius = (temperature - 273.15).toFixed(0);

    // Create a weatherData object to send in the response
    const weatherData = {
      condition: weatherCondition,
      temperature: temperatureCelsius,
      humidity: humidity,
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
