import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation, Star, Clock } from "lucide-react";

// Fix for default marker icons in Leaflet with bundlers
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Leaflet bundler icon fix
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface BinLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  distance: string;
  wasteTypes: string[];
  rating: number;
  address: string;
  capacity: number;
  hours: string;
  credits: number;
}

interface LiveMapProps {
  bins: BinLocation[];
  selectedFilter: string;
  onBinSelect?: (bin: BinLocation) => void;
}

const createUserIcon = (): L.DivIcon =>
  L.divIcon({
    className: "user-location-icon",
    html: '<div class="user-marker"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

const createBinIcon = (color: string): L.DivIcon =>
  L.divIcon({
    className: "bin-marker-icon",
    html: `<div class="bin-marker" style="background-color: ${color};"></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

const LiveMap = ({ bins, selectedFilter, onBinSelect }: LiveMapProps) => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Default center (Kollam, Kerala, India)
  const defaultCenter: [number, number] = [8.8932, 76.6141];

  const getColorForType = (wasteTypes: string[]) => {
    if (wasteTypes.includes('plastic')) return '#3b82f6';
    if (wasteTypes.includes('paper')) return '#22c55e';
    if (wasteTypes.includes('metal')) return '#eab308';
    if (wasteTypes.includes('textile')) return '#a855f7';
    return '#16a34a';
  };

  const handleLocate = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude]);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
        }
      );
    }
  };

  const filteredBins = useMemo(
    () =>
      selectedFilter === "all"
        ? bins
        : bins.filter((bin) => bin.wasteTypes.includes(selectedFilter)),
    [bins, selectedFilter]
  );

  // Initialize map once
  useEffect(() => {
    if (!mapDivRef.current) return;
    if (mapRef.current) return;

    const map = L.map(mapDivRef.current, {
      zoomControl: true,
      attributionControl: true,
    });

    map.setView(defaultCenter, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
      userMarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update user marker + center
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!userPosition) {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      return;
    }

    const latLng: L.LatLngExpression = userPosition;
    map.setView(latLng, Math.max(map.getZoom(), 15), { animate: true });

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker(latLng, { icon: createUserIcon() }).addTo(map);
    } else {
      userMarkerRef.current.setLatLng(latLng);
    }
  }, [userPosition]);

  // Render bin markers on filter change
  useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    filteredBins.forEach((bin) => {
      const marker = L.marker([bin.lat, bin.lng], {
        icon: createBinIcon(getColorForType(bin.wasteTypes)),
      });

      marker.on("click", () => onBinSelect?.(bin));

      const capacityColor = bin.capacity > 80 ? '#ef4444' : bin.capacity > 50 ? '#eab308' : '#22c55e';
      const popupHtml = `
        <div style="padding: 14px; min-width: 260px; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
            <div style="flex: 1;">
              <div style="font-weight: 600; font-size: 15px; color: #111;">${bin.name}</div>
              <div style="margin-top: 4px; font-size: 12px; color: #666;">${bin.address}</div>
              <div style="margin-top: 6px; display: flex; align-items: center; gap: 8px; font-size: 12px; color: #444;">
                <span>⭐ ${bin.rating}</span>
                <span>📍 ${bin.distance}</span>
              </div>
              <div style="margin-top: 4px; font-size: 12px; color: #666;">🕒 ${bin.hours}</div>
              <div style="margin-top: 6px; display: flex; flex-wrap: wrap; gap: 4px;">
                ${bin.wasteTypes.map(type => {
                  const colors: Record<string, string> = { plastic: '#3b82f6', paper: '#22c55e', metal: '#eab308', textile: '#a855f7' };
                  return `<span style="font-size: 10px; padding: 2px 6px; border-radius: 4px; background: ${colors[type] || '#888'}20; color: ${colors[type] || '#888'}; text-transform: capitalize;">${type}</span>`;
                }).join('')}
              </div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
              <div style="font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; background: #16a34a20; color: #16a34a;">
                +${bin.credits} credits
              </div>
              <div style="text-align: center;">
                <div style="width: 48px; height: 48px; border-radius: 50%; border: 4px solid ${capacityColor}; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 12px; font-weight: 700; color: ${capacityColor};">${bin.capacity}%</span>
                </div>
                <div style="font-size: 10px; color: #666; margin-top: 2px;">Capacity</div>
              </div>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        autoPan: true,
      });

      marker.addTo(layer);
    });
  }, [filteredBins, onBinSelect]);

  return (
    <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
      <style>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          border-radius: 1rem;
          z-index: 0;
        }
        .user-location-icon,
        .bin-marker-icon {
          background: transparent;
          border: none;
        }
        .user-marker {
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 10px rgba(59, 130, 246, 0.5);
        }
        .bin-marker {
          width: 32px;
          height: 32px;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 3px 10px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bin-marker::after {
          content: "♻";
          color: white;
          font-size: 14px;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
        }
        .leaflet-popup-content {
          margin: 0;
          min-width: 200px;
        }
      `}</style>

      <div ref={mapDivRef} className="h-full w-full" />

      {/* Locate Me Button */}
      <Button
        onClick={handleLocate}
        disabled={isLocating}
        className="absolute bottom-4 right-4 z-[400] shadow-md bg-background/80 backdrop-blur-sm text-foreground border border-border hover:bg-background/90"
        size="sm"
        variant="outline"
      >
        <Navigation className={`w-4 h-4 mr-2 ${isLocating ? 'animate-spin' : ''}`} />
        {isLocating ? 'Locating...' : 'My Location'}
      </Button>

      {/* Map Legend - inline capacity */}
      <div className="absolute top-4 left-4 z-[400] bg-background/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md border border-border">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-medium text-foreground">Capacity:</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className="text-muted-foreground">Med</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-muted-foreground">Full</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
