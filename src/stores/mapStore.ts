import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMapStore = defineStore('map', () => {
  const center = ref<[number, number]>([51.1657, 10.4515]); // Germany center
  const zoom = ref(6);
  const selectedPoiId = ref<string | null>(null);
  
  // GPS & Recording
  const userLocation = ref<[number, number] | null>(null);
  const isRecording = ref(false);
  const currentPath = ref<[number, number][]>([]);
  const savedPaths = ref<{ id: number; points: [number, number][] }[]>([]);
  const userMarkers = ref<{ id: number; position: [number, number] }[]>([]);
  
  let nextPathId = 1;
  let nextMarkerId = 1;

  const setCenter = (newCenter: [number, number]) => {
    center.value = newCenter;
  };

  const setZoom = (newZoom: number) => {
    zoom.value = newZoom;
  };

  const selectPoi = (poiId: string, poiCenter: [number, number]) => {
    selectedPoiId.value = poiId;
    center.value = poiCenter;
    zoom.value = 15; // Zoom closer when selecting a POI
  };

  const clearSelection = () => {
    selectedPoiId.value = null;
  };
  
  // GPS Functions
  const centerOnUser = async () => {
    return new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          userLocation.value = [lat, lng];
          center.value = [lat, lng];
          zoom.value = 15;
          resolve();
        },
        () => {
          reject(new Error('Unable to retrieve your location'));
        }
      );
    });
  };
  
  // Recording Functions
  const toggleRecording = () => {
    if (isRecording.value) {
      // Stop recording and save
      if (currentPath.value.length > 0) {
        savedPaths.value.push({
          id: nextPathId++,
          points: [...currentPath.value]
        });
        currentPath.value = [];
      }
    }
    isRecording.value = !isRecording.value;
  };
  
  const addPointToPath = (point: [number, number]) => {
    if (isRecording.value) {
      currentPath.value.push(point);
    }
  };
  
  const clearPath = () => {
    currentPath.value = [];
    isRecording.value = false;
  };
  
  // Marker Functions
  const addUserMarker = (position: [number, number]) => {
    userMarkers.value.push({
      id: nextMarkerId++,
      position
    });
  };
  
  const removeUserMarker = (id: number) => {
    const index = userMarkers.value.findIndex(m => m.id === id);
    if (index !== -1) {
      userMarkers.value.splice(index, 1);
    }
  };

  return {
    center,
    zoom,
    selectedPoiId,
    userLocation,
    isRecording,
    currentPath,
    savedPaths,
    userMarkers,
    setCenter,
    setZoom,
    selectPoi,
    clearSelection,
    centerOnUser,
    toggleRecording,
    addPointToPath,
    clearPath,
    addUserMarker,
    removeUserMarker,
  };
});
