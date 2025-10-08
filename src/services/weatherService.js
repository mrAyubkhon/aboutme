/**
 * Weather Service - Integration with real weather APIs
 */

// Yandex Weather API (free tier)
const YANDEX_API_KEY = 'your-yandex-api-key'; // Нужно получить на api.yandex.ru
const YANDEX_BASE_URL = 'https://api.weather.yandex.ru/v2/forecast';

// OpenWeatherMap API (backup)
const OPENWEATHER_API_KEY = 'your-openweather-api-key'; // Нужно получить на openweathermap.org
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Get weather data from Yandex Weather API
 */
export async function getYandexWeather(city = 'Tashkent') {
  try {
    // Mock data for demo (замените на реальный API вызов)
    const mockWeatherData = {
      fact: {
        temp: 28,
        condition: 'clear',
        humidity: 45,
        pressure_mm: 760,
        wind_speed: 3.2,
        wind_dir: 'NW'
      },
      geo_object: {
        locality: {
          name: city
        }
      },
      info: {
        tzinfo: {
          offset: 18000 // UTC+5 for Tashkent
        }
      }
    };

    // Real API call (uncomment when you have API key)
    /*
    const response = await fetch(`${YANDEX_BASE_URL}?lat=${lat}&lon=${lon}&lang=ru_RU&limit=1`, {
      headers: {
        'X-Yandex-API-Key': YANDEX_API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`Yandex API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    */

    return mockWeatherData;
  } catch (error) {
    console.error('Yandex Weather API error:', error);
    throw error;
  }
}

/**
 * Get weather data from OpenWeatherMap API (backup)
 */
export async function getOpenWeatherMapWeather(city = 'Tashkent') {
  try {
    // Mock data for demo (замените на реальный API вызов)
    const mockWeatherData = {
      main: {
        temp: 28.5,
        humidity: 45,
        pressure: 1013
      },
      weather: [{
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }],
      wind: {
        speed: 3.2,
        deg: 315
      },
      name: city,
      sys: {
        country: 'UZ'
      }
    };

    // Real API call (uncomment when you have API key)
    /*
    const response = await fetch(`${OPENWEATHER_BASE_URL}?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=ru`);
    
    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    */

    return mockWeatherData;
  } catch (error) {
    console.error('OpenWeatherMap API error:', error);
    throw error;
  }
}

/**
 * Get weather data from multiple sources with fallback
 */
export async function getWeatherData(city = 'Tashkent') {
  try {
    // Try Yandex first (better for CIS countries)
    const yandexData = await getYandexWeather(city);
    return normalizeYandexData(yandexData);
  } catch (error) {
    console.log('Yandex failed, trying OpenWeatherMap...');
    try {
      // Fallback to OpenWeatherMap
      const openWeatherData = await getOpenWeatherMapWeather(city);
      return normalizeOpenWeatherData(openWeatherData);
    } catch (fallbackError) {
      console.error('All weather APIs failed:', fallbackError);
      // Return default weather data
      return getDefaultWeatherData(city);
    }
  }
}

/**
 * Normalize Yandex Weather data to our format
 */
function normalizeYandexData(data) {
  const conditionMap = {
    'clear': 'sunny',
    'partly-cloudy': 'partly-cloudy',
    'cloudy': 'cloudy',
    'overcast': 'cloudy',
    'light-rain': 'rainy',
    'rain': 'rainy',
    'heavy-rain': 'rainy',
    'showers': 'rainy',
    'wet-snow': 'snowy',
    'light-snow': 'snowy',
    'snow': 'snowy',
    'snow-showers': 'snowy',
    'hail': 'stormy',
    'thunderstorm': 'stormy',
    'thunderstorm-with-rain': 'stormy'
  };

  return {
    temperature: Math.round(data.fact.temp),
    condition: conditionMap[data.fact.condition] || 'clear',
    humidity: data.fact.humidity,
    pressure: data.fact.pressure_mm,
    windSpeed: data.fact.wind_speed,
    windDirection: data.fact.wind_dir,
    location: data.geo_object.locality.name,
    timestamp: new Date().toISOString(),
    source: 'yandex'
  };
}

/**
 * Normalize OpenWeatherMap data to our format
 */
function normalizeOpenWeatherData(data) {
  const conditionMap = {
    'Clear': 'sunny',
    'Clouds': 'cloudy',
    'Rain': 'rainy',
    'Drizzle': 'rainy',
    'Thunderstorm': 'stormy',
    'Snow': 'snowy',
    'Mist': 'foggy',
    'Fog': 'foggy',
    'Haze': 'foggy'
  };

  return {
    temperature: Math.round(data.main.temp),
    condition: conditionMap[data.weather[0].main] || 'sunny',
    humidity: data.main.humidity,
    pressure: Math.round(data.main.pressure * 0.75), // Convert hPa to mmHg
    windSpeed: data.wind.speed,
    windDirection: data.wind.deg,
    location: data.name,
    timestamp: new Date().toISOString(),
    source: 'openweathermap'
  };
}

/**
 * Default weather data when APIs fail
 */
function getDefaultWeatherData(city) {
  const currentHour = new Date().getHours();
  let temperature = 22;
  let condition = 'sunny';

  // Simple time-based weather simulation
  if (currentHour >= 6 && currentHour < 12) {
    temperature = 18 + Math.random() * 8; // 18-26°C morning
    condition = 'sunny';
  } else if (currentHour >= 12 && currentHour < 18) {
    temperature = 25 + Math.random() * 10; // 25-35°C afternoon
    condition = Math.random() > 0.7 ? 'partly-cloudy' : 'sunny';
  } else if (currentHour >= 18 && currentHour < 22) {
    temperature = 20 + Math.random() * 8; // 20-28°C evening
    condition = 'partly-cloudy';
  } else {
    temperature = 15 + Math.random() * 8; // 15-23°C night
    condition = 'cloudy';
  }

  return {
    temperature: Math.round(temperature),
    condition,
    humidity: 40 + Math.random() * 40, // 40-80%
    pressure: 750 + Math.random() * 20, // 750-770 mmHg
    windSpeed: 1 + Math.random() * 5, // 1-6 m/s
    windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
    location: city,
    timestamp: new Date().toISOString(),
    source: 'default'
  };
}

/**
 * Get weather icon based on condition
 */
export function getWeatherIcon(condition) {
  const iconMap = {
    'sunny': '☀️',
    'partly-cloudy': '⛅',
    'cloudy': '☁️',
    'rainy': '🌧️',
    'stormy': '⛈️',
    'snowy': '❄️',
    'foggy': '🌫️'
  };
  return iconMap[condition] || '☀️';
}

/**
 * Get weather description in Russian
 */
export function getWeatherDescription(condition) {
  const descriptions = {
    'sunny': 'Солнечно',
    'partly-cloudy': 'Переменная облачность',
    'cloudy': 'Облачно',
    'rainy': 'Дождь',
    'stormy': 'Гроза',
    'snowy': 'Снег',
    'foggy': 'Туман'
  };
  return descriptions[condition] || 'Ясно';
}
