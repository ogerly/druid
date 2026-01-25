import { ref, readonly } from 'vue';

// --- State ---
// This state is created only once and shared across all calls to useMap()
const map = ref(null);
const zoom = ref(13);
const userLocation = ref(null);
const path = ref([]);
const isRecording = ref(false);

export function useMap() {

  // --- Methods ---

  // Method for components to set the map instance
  const setMap = (mapInstance) => {
    map.value = mapInstance;
  };

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error('Geolocation is not supported by your browser.'));
      }
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const centerOnUser = async () => {
    if (!map.value) {
      console.error("Map not initialized yet.");
      return;
    }
    try {
      const position = await getUserLocation();
      const coords = [position.coords.latitude, position.coords.longitude];
      userLocation.value = coords;
      map.value.leafletObject.flyTo(coords, 15);
    } catch (error) {
      console.error("Error centering on user:", error);
    }
  };

  const toggleRecording = () => {
    isRecording.value = !isRecording.value;
  };

  const clearPath = () => {
    path.value = [];
    isRecording.value = false; // Also stop recording
  };

  // --- Return ---
  // Expose state (some as readonly) and methods
  return {
    map: readonly(map), // Expose map state as readonly to prevent outside modification
    zoom,
    userLocation,
    path,
    isRecording,
    setMap,
    centerOnUser,
    toggleRecording,
    clearPath,
  };
}
