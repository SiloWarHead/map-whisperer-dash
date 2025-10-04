import { useState } from 'react';
import { Wind, Droplets, Thermometer, Activity } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { InteractiveMap } from '@/components/InteractiveMap';
import { CoordinateDisplay } from '@/components/CoordinateDisplay';

interface Coordinates {
  lat: number;
  lng: number;
}

const Index = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const handleCoordinatesChange = (coords: Coordinates) => {
    setCoordinates(coords);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-sky-light/20 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-3">
            ClearHorizons <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time weather metrics at your fingertips
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Air Quality"
            subtitle="Current Index"
            value="78"
            unit="AQI"
            icon={Activity}
            iconColor="text-quality"
            iconBg="bg-quality-light"
            trend={{
              value: "2.5%",
              direction: "up",
              label: "from yesterday"
            }}
          />

          <MetricCard
            title="Wind Speed"
            subtitle="Current Measurement"
            value="12"
            unit="km/h"
            icon={Wind}
            iconColor="text-wind"
            iconBg="bg-wind-light"
            trend={{
              value: "NNE",
              direction: "neutral",
              label: "direction"
            }}
          />

          <MetricCard
            title="Precipitation"
            subtitle="Last 24 Hours"
            value="2.4"
            unit="mm"
            icon={Droplets}
            iconColor="text-sky"
            iconBg="bg-sky-light"
            trend={{
              value: "0.8mm",
              direction: "down",
              label: "from average"
            }}
          />

          <MetricCard
            title="Temperature"
            subtitle="Current Reading"
            value="24"
            unit="°C"
            icon={Thermometer}
            iconColor="text-temp"
            iconBg="bg-temp-light"
            trend={{
              value: "1.2°",
              direction: "down",
              label: "from yesterday"
            }}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <InteractiveMap onCoordinatesChange={handleCoordinatesChange} />
          </div>
          
          <div>
            <CoordinateDisplay coordinates={coordinates} />
          </div>
        </div>

        <footer className="text-center py-6 text-muted-foreground text-sm">
          <p>© 2025 ClearHorizons Dashboard. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
