import { useState } from 'react';
import { Wind, Droplets, Thermometer, Activity, CloudRain, Snowflake } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { CoordinateInput } from '@/components/CoordinateInput';
import earthHero from '@/assets/earth-hero.jpg';

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

  const handleSubmitCoordinates = async (lat: number, lng: number, area: number) => {
    // This would send data to your Python backend
    // For now, we'll simulate the response
    try {
      // TODO: Replace with actual Python API endpoint
      // const response = await fetch('YOUR_PYTHON_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ lat, lng, area })
      // });
      // const data = await response.json();
      
      // Simulated data for display
      setWeatherData({
        temperature: '--',
        humidity: '--',
        airQuality: '--',
        windSpeed: '--',
        rainfall: '--',
        snowfall: '--'
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section with Earth Image */}
      <div className="relative w-full h-[400px] mb-12 overflow-hidden">
        <img 
          src={earthHero} 
          alt="Earth from space" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-3 drop-shadow-2xl">
              ClearHorizons <span className="text-primary drop-shadow-[0_0_20px_rgba(66,153,225,0.8)]">Dashboard</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl drop-shadow-lg">
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
