import { NextResponse } from 'next/server';

// Map cloud percentage to descriptive weather word
const getCloudDescription = (cloudPercent: number): string => {
  if (cloudPercent < 25) return 'sunny';
  if (cloudPercent < 50) return 'partly cloudy';
  if (cloudPercent < 75) return 'mostly cloudy';
  return 'cloudy';
};

// Weather condition mapping for non-cloud conditions
const weatherConditionToWord = (condition: string): string => {
  const mapping: Record<string, string> = {
    'Rain': 'rainy',
    'Drizzle': 'drizzly',
    'Thunderstorm': 'stormy',
    'Snow': 'snowy',
    'Mist': 'misty',
    'Fog': 'foggy',
    'Haze': 'hazy',
    'Smoke': 'smoky',
  };

  return mapping[condition] || '';
};

// In-memory cache to avoid hitting API too frequently
let cachedWeather: { word: string; time: string; timestamp: number } | null = null;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export async function GET() {
  try {
    // Check cache first
    if (cachedWeather && Date.now() - cachedWeather.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        weather: cachedWeather.word,
        cached: true
      });
    }

    const apiKey = process.env.OPENWEATHERMAP_API_KEY;

    if (!apiKey) {
      console.error('OPENWEATHERMAP_API_KEY is not set');
      return NextResponse.json({ weather: '', error: 'API key not configured' }, { status: 500 });
    }

    // Fetch weather from OpenWeatherMap for Portland, OR
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Portland,OR,US&appid=${apiKey}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Weather API error: ${response.status} ${response.statusText}`);
      return NextResponse.json({ weather: '', error: 'Weather API error' }, { status: response.status });
    }

    const data = await response.json();

    // Extract weather condition and cloud percentage
    const condition = data.weather?.[0]?.main;
    const cloudPercent = data.clouds?.all ?? 0;

    if (!condition) {
      console.error('No weather condition in API response');
      return NextResponse.json({ weather: '', error: 'Invalid API response' }, { status: 500 });
    }

    // Use cloud percentage for cloud-based conditions, otherwise use condition mapping
    let weatherWord: string;
    if (condition === 'Clouds' || condition === 'Clear') {
      weatherWord = getCloudDescription(cloudPercent);
    } else {
      weatherWord = weatherConditionToWord(condition) || 'beautiful';
    }

    // Update cache
    cachedWeather = {
      word: weatherWord,
      time: '', // No longer returning time
      timestamp: Date.now(),
    };

    return NextResponse.json({
      weather: weatherWord,
      condition,
      cached: false,
    });
  } catch (error) {
    // Handle abort/timeout
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Weather API request timed out');
      return NextResponse.json({ weather: '', error: 'Request timed out' }, { status: 504 });
    }

    console.error('Weather API error:', error);
    return NextResponse.json({ weather: '', error: 'Internal server error' }, { status: 500 });
  }
}
