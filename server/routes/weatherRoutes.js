import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Returns a mock localized weather forecast with humidity and temperature risks for the farmer's location
router.get('/', protect, (req, res) => {
  const location = req.query.location || req.user?.location || 'Agritech Zone';

  // Seeded mock weather depending on location name for simple variety
  const seed = location.length % 3;
  let weatherMock = {};

  if (seed === 0) {
    weatherMock = {
      location,
      temperature: '28°C',
      humidity: '75%',
      condition: 'Humid & Overcast',
      precipitationChance: '45%',
      windSpeed: '14 km/h',
      alert: 'Warning: High humidity levels increase fungal blight risks. Monitor crop leaves.',
      forecast: [
        { day: 'Today', temp: '28°C', condition: 'Humid & Overcast' },
        { day: 'Tomorrow', temp: '30°C', condition: 'Scattered Thunderstorms' },
        { day: 'Sunday', temp: '29°C', condition: 'Showers' },
        { day: 'Monday', temp: '27°C', condition: 'Partly Cloudy' }
      ]
    };
  } else if (seed === 1) {
    weatherMock = {
      location,
      temperature: '34°C',
      humidity: '40%',
      condition: 'Sunny & Hot',
      precipitationChance: '5%',
      windSpeed: '8 km/h',
      alert: 'Warning: Soil moisture evaporating rapidly. Increase drip irrigation frequency.',
      forecast: [
        { day: 'Today', temp: '34°C', condition: 'Sunny & Hot' },
        { day: 'Tomorrow', temp: '35°C', condition: 'Clear Skies' },
        { day: 'Sunday', temp: '33°C', condition: 'Mild Wind' },
        { day: 'Monday', temp: '32°C', condition: 'Sunny' }
      ]
    };
  } else {
    weatherMock = {
      location,
      temperature: '24°C',
      humidity: '60%',
      condition: 'Light Showers',
      precipitationChance: '80%',
      windSpeed: '18 km/h',
      alert: 'Warning: Rainfall expected. Avoid spraying foliar fertilizers or pesticides today.',
      forecast: [
        { day: 'Today', temp: '24°C', condition: 'Light Showers' },
        { day: 'Tomorrow', temp: '23°C', condition: 'Steady Rain' },
        { day: 'Sunday', temp: '25°C', condition: 'Isolated Showers' },
        { day: 'Monday', temp: '26°C', condition: 'Sunny Breaks' }
      ]
    };
  }

  res.json(weatherMock);
});

export default router;
