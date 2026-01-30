import { ref } from 'vue';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';

// Define the POI type
interface POI {
  id: number;
  name: string;
  description: string;
  coords: LatLngExpression;
  category: 'culture' | 'nature' | 'food';
}

// Define the color mapping for categories
const categoryColors: Record<POI['category'], string> = {
  culture: 'blue',
  nature: 'green',
  food: 'orange', 
};

// Create custom icons
const createIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const icons = {
  blue: createIcon('blue'),
  green: createIcon('green'),
  orange: createIcon('orange'),
};

export function usePois() {
  const pois = ref<POI[]>([
    { id: 1, name: 'Historic Museum', description: 'A museum of local history.', coords: [51.51, -0.1], category: 'culture' },
    { id: 2, name: 'City Park', description: 'A large urban park.', coords: [51.505, -0.09], category: 'nature' },
    { id: 3, name: 'Famous Restaurant', description: 'Known for its exquisite cuisine.', coords: [51.515, -0.08], category: 'food' },
  ]);

  function getMarkerIcon(category: POI['category']) {
    const color = categoryColors[category];
    return icons[color as keyof typeof icons] || icons.blue;
  }

  function getCategoryColor(category: POI['category']) {
    return categoryColors[category] || 'gray';
  }

  return { pois, getMarkerIcon, getCategoryColor };
}
