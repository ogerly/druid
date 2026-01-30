import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMapStore = defineStore('map', () => {
  const center = ref<[number, number]>([51.505, -0.09]); // Default center
  const zoom = ref(13);
  const selectedPoiId = ref<string | null>(null);

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

  return {
    center,
    zoom,
    selectedPoiId,
    setCenter,
    setZoom,
    selectPoi,
    clearSelection,
  };
});
