import { ref } from 'vue';

export function useMap() {
  const map = ref(null);
  const markers = ref([]);
  const path = ref([]);
  const isRecording = ref(false);

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error('Geolocation is not supported by your browser.'));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const addMarker = (latLng) => {
    markers.value.push(latLng);
  };

  const addPointToPath = (latLng) => {
    path.value.push(latLng);
  };

  const toggleRecording = () => {
    isRecording.value = !isRecording.value;
  };

  const clearPath = () => {
    path.value = [];
  };

  return { map, getUserLocation, markers, addMarker, path, addPointToPath, isRecording, toggleRecording, clearPath };
}
