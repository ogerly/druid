
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';

// Define the POI type
export interface POI {
  id: number;
  name: string;
  description: string;
  coordinates: LatLngExpression;
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

export const usePoisStore = defineStore('pois', () => {
  const pois = ref<POI[]>([
    { id: 1, name: 'Keltenwelt am Glauberg', description: 'Keltisches Fürstengrab und Museum', coordinates: [50.3030, 8.9110], category: 'culture' },
    { id: 2, name: 'Externsteine', description: 'Markante Felsformation mit historischer Bedeutung', coordinates: [51.8672, 8.9172], category: 'nature' },
    { id: 3, name: 'Heuneburg', description: 'Rekonstruierte keltische Siedlung', coordinates: [48.0567, 9.3117], category: 'culture' },
  ]);

  let nextId = 4; // Start after the initial POIs

  const filteredPois = computed(() => pois.value);

  function getMarkerIcon(category: POI['category']) {
    const color = categoryColors[category];
    return icons[color as keyof typeof icons] || icons.blue;
  }

  function getCategoryColor(category: POI['category']) {
    return categoryColors[category] || 'gray';
  }

  function addPoi(poiData: Omit<POI, 'id'>) {
    pois.value.push({
      id: nextId++,
      ...poiData,
    });
  }

  return { 
    pois, 
    filteredPois,
    getMarkerIcon, 
    getCategoryColor,
    addPoi 
  };
});
