<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import { useMapStore } from '@/stores/mapStore';
import { usePois } from '@/composables/usePois';

const mapStore = useMapStore();
const { pois, getMarkerIcon } = usePois();

const mapComponent = ref<any>(null);

// Watch for center changes from the store and update the map view
watch(() => mapStore.center, (newCenter) => {
  if (mapComponent.value) {
    // The zoom level is also sourced from the store, ensuring consistency
    mapComponent.value.leafletObject.setView(newCenter, mapStore.zoom);
  }
}, { deep: true });

const centerOnUser = () => {
  // Implementation for centering on user can be added here
  // For example, using the Geolocation API
}

const toggleRecording = () => {
  // Implementation for toggling recording
}

const clearPath = () => {
  // Implementation for clearing a path
}

// Expose methods for potential parent component usage
defineExpose({
  centerOnUser,
  toggleRecording,
  clearPath,
});

onMounted(() => {
  // Ensure map size is correct on mount
  nextTick(() => {
    if (mapComponent.value) {
      mapComponent.value.leafletObject.invalidateSize();
    }
  });
});
</script>

<template>
  <div class="w-full h-full">
    <l-map
      ref="mapComponent"
      :zoom="mapStore.zoom"
      :center="mapStore.center"
      @update:zoom="mapStore.setZoom($event)"
      @update:center="mapStore.setCenter($event)"
      class="w-full h-full"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      
      <!-- POI Markers -->
      <l-marker 
        v-for="poi in pois" 
        :key="poi.id" 
        :lat-lng="poi.coordinates" 
        :icon="getMarkerIcon(poi.category)"
      >
        <l-popup><b>{{ poi.name }}</b><br>{{ poi.description }}</l-popup>
      </l-marker>

    </l-map>
  </div>
</template>

<style scoped>
/* Scoped styles for MapView */
</style>
