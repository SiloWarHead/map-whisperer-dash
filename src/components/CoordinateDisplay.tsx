import { useState } from 'react';
import { MapPin, Wind, Droplets, Thermometer, Activity, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Coordinates {
  lat: number;
  lng: number;
}

interface CoordinateDisplayProps {
  coordinates: Coordinates | null;
}

const factors = [
  { id: 'air-quality', name: 'Air Quality', icon: Activity, color: 'text-quality' },
  { id: 'wind-speed', name: 'Wind Speed', icon: Wind, color: 'text-wind' },
  { id: 'precipitation', name: 'Precipitation', icon: Droplets, color: 'text-sky' },
  { id: 'temperature', name: 'Temperature', icon: Thermometer, color: 'text-temp' },
];

export const CoordinateDisplay = ({ coordinates }: CoordinateDisplayProps) => {
  const [selectedFactor, setSelectedFactor] = useState<string>('');

  const handleSearch = () => {
    if (!coordinates) {
      toast.error('Please select a location on the map first');
      return;
    }
    
    if (!selectedFactor) {
      toast.error('Please select a factor to search');
      return;
    }

    const factorName = factors.find(f => f.id === selectedFactor)?.name;
    toast.success(
      `Searching ${factorName} at coordinates: ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`
    );
  };

  return (
    <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-6">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-card-foreground">Selected Coordinates</h3>
      </div>

      {coordinates ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Latitude</p>
              <p className="text-lg font-semibold text-card-foreground">
                {coordinates.lat.toFixed(6)}°
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Longitude</p>
              <p className="text-lg font-semibold text-card-foreground">
                {coordinates.lng.toFixed(6)}°
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-card-foreground mb-3 block">
              Search Weather Factor
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {factors.map((factor) => {
                const Icon = factor.icon;
                return (
                  <button
                    key={factor.id}
                    onClick={() => setSelectedFactor(factor.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedFactor === factor.id
                        ? 'border-primary bg-sky-light'
                        : 'border-border bg-card hover:border-muted-foreground'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${factor.color}`} />
                    <p className="text-xs font-medium text-card-foreground text-center">
                      {factor.name}
                    </p>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={handleSearch}
              className="w-full"
              size="lg"
              disabled={!selectedFactor}
            >
              <Search className="w-4 h-4 mr-2" />
              Search Factor
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground text-sm">
            Click anywhere on the map to select coordinates
          </p>
        </div>
      )}
    </div>
  );
};
