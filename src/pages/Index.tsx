import { useState } from 'react';
import { Wind, Droplets, Thermometer, Activity, CloudRain, Snowflake } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { CoordinateInput } from '@/components/CoordinateInput';

interface WeatherData {
  temperature: string;
  humidity: string;
  airQuality: string;
  windSpeed: string;
  rainfall: string;
  snowfall: string;
}

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const handleSubmitCoordinates = async (lat: string, lng: string, date: Date) => {
    // Replace this with your actual Render app URL
    const RENDER_API_URL = 'YOUR_RENDER_APP_URL'; // e.g., 'https://your-app.onrender.com'
    
    try {
      const dateStr = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const requestBody = { lat, lng, date: dateStr };

      // Fetch all weather metrics in parallel
      const [humidityRes, airDensityRes, tempRes, snowRes, rainRes, windRes] = await Promise.all([
        fetch(`${RENDER_API_URL}/humidity`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        }),
        fetch(`${RENDER_API_URL}/airdensity`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        }),
        fetch(`${RENDER_API_URL}/temperature`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        }),
        fetch(`${RENDER_API_URL}/snow`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        }),
        fetch(`${RENDER_API_URL}/rain`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        }),
        fetch(`${RENDER_API_URL}/windspeed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        })
      ]);

      // Parse all responses
      const [humidity, airDensity, temperature, snow, rain, windSpeed] = await Promise.all([
        humidityRes.json(),
        airDensityRes.json(),
        tempRes.json(),
        snowRes.json(),
        rainRes.json(),
        windRes.json()
      ]);

      // Update weather data with API responses
      setWeatherData({
        temperature: temperature.average_temperature?.toFixed(1) || '--',
        humidity: humidity.average_humidity?.toFixed(1) || '--',
        airQuality: airDensity.average_air_density?.toFixed(3) || '--',
        windSpeed: windSpeed.average_wind_speed?.toFixed(1) || '--',
        rainfall: rain.total_precipitation?.toFixed(1) || '--',
        snowfall: snow.total_snowfall?.toFixed(1) || '--'
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData({
        temperature: 'Error',
        humidity: 'Error',
        airQuality: 'Error',
        windSpeed: 'Error',
        rainfall: 'Error',
        snowfall: 'Error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="w-full py-16 mb-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              ClearHorizons Dashboard
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Real-time weather metrics powered by NASA Earth observation data
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8 max-w-7xl">

        <div className="mb-8">
          <CoordinateInput onSubmit={handleSubmitCoordinates} />
        </div>

        {weatherData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <MetricCard
              title="Temperature"
              subtitle="Current Reading"
              value={weatherData.temperature}
              unit="°C"
              icon={Thermometer}
              iconColor="text-temp"
              iconBg="bg-temp-light"
            />

            <MetricCard
              title="Humidity"
              subtitle="Current Level"
              value={weatherData.humidity}
              unit="%"
              icon={Droplets}
              iconColor="text-sky"
              iconBg="bg-sky-light"
            />

            <MetricCard
              title="Air Quality"
              subtitle="Current Index"
              value={weatherData.airQuality}
              unit="AQI"
              icon={Activity}
              iconColor="text-quality"
              iconBg="bg-quality-light"
            />

            <MetricCard
              title="Wind Speed"
              subtitle="Current Measurement"
              value={weatherData.windSpeed}
              unit="km/h"
              icon={Wind}
              iconColor="text-wind"
              iconBg="bg-wind-light"
            />

            <MetricCard
              title="Rainfall"
              subtitle="Last 24 Hours"
              value={weatherData.rainfall}
              unit="mm"
              icon={CloudRain}
              iconColor="text-sky"
              iconBg="bg-sky-light"
            />

            <MetricCard
              title="Snowfall"
              subtitle="Last 24 Hours"
              value={weatherData.snowfall}
              unit="cm"
              icon={Snowflake}
              iconColor="text-sky"
              iconBg="bg-sky-light"
            />
          </div>
        )}

        <footer className="text-center py-6 text-muted-foreground text-sm">
          <p>© 2025 ClearHorizons Dashboard. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
