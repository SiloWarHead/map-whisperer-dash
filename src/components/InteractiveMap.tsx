import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

interface Coordinates {
  lat: number;
  lng: number;
}

interface InteractiveMapProps {
  onCoordinatesChange: (coords: Coordinates) => void;
}

export const InteractiveMap = ({ onCoordinatesChange }: InteractiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      zoom: 2,
      center: [0, 20],
      projection: 'globe' as any,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(220, 235, 255)',
        'high-color': 'rgb(200, 220, 245)',
        'horizon-blend': 0.1,
      });
    });

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      
      if (marker.current) {
        marker.current.remove();
      }
      
      marker.current = new mapboxgl.Marker({
        color: '#3B82F6',
      })
        .setLngLat([lng, lat])
        .addTo(map.current!);
      
      onCoordinatesChange({ lat, lng });
    });

    return () => {
      marker.current?.remove();
      map.current?.remove();
    };
  }, [mapboxToken, onCoordinatesChange]);

  if (!mapboxToken) {
    return (
      <div className="map-container h-[500px] bg-card flex items-center justify-center">
        <div className="max-w-md p-6 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Mapbox Token Required
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please enter your Mapbox public token to enable the interactive map.
            Get one at{' '}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <input
            type="text"
            placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwi..."
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            onChange={(e) => setMapboxToken(e.target.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="map-container h-[500px]">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};
