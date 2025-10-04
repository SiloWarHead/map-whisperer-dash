import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CoordinateInputProps {
  onSubmit: (lat: number, lng: number, area: number) => void;
}

export const CoordinateInput = ({ onSubmit }: CoordinateInputProps) => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [area, setArea] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const areaValue = parseFloat(area);

    // Validation
    if (isNaN(lat) || lat < -90 || lat > 90) {
      toast({
        title: "Invalid Latitude",
        description: "Latitude must be between -90 and 90",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      toast({
        title: "Invalid Longitude",
        description: "Longitude must be between -180 and 180",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(areaValue) || areaValue <= 0 || areaValue > 25) {
      toast({
        title: "Invalid Area",
        description: "Area must be between 0 and 25 sq km",
        variant: "destructive"
      });
      return;
    }

    onSubmit(lat, lng, areaValue);
    
    toast({
      title: "Coordinates Submitted",
      description: `Fetching weather data for (${lat}, ${lng}) with ${areaValue} sq km area...`
    });
  };

  return (
    <div className="metric-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-primary/10">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-card-foreground">Enter Coordinates</h2>
          <p className="text-sm text-muted-foreground">Area must be under 25 sq km</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              placeholder="-90 to 90"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              placeholder="-180 to 180"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Area (sq km)</Label>
            <Input
              id="area"
              type="number"
              step="any"
              placeholder="Max 25 sq km"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Fetch Weather Data
        </Button>
      </form>
    </div>
  );
};
