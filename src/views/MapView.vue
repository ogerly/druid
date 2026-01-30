<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup, LPolyline } from "@vue-leaflet/vue-leaflet";
import { useMapStore } from '@/stores/mapStore';
import { usePoisStore } from '@/stores/poisStore';
import L from 'leaflet';

const mapStore = useMapStore();
const poisStore = usePoisStore();

const mapComponent = ref<any>(null);

// Custom icon for user location
const userLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icon for user markers
const userMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Handle map clicks
const onMapClick = (event: any) => {
  if (mapStore.isRecording) {
    // Add point to path while recording
    const latLng: [number, number] = [event.latlng.lat, event.latlng.lng];
    mapStore.addPointToPath(latLng);
  } else {
    // Add user marker when not recording
    const latLng: [number, number] = [event.latlng.lat, event.latlng.lng];
    mapStore.addUserMarker(latLng);
  }
};

const centerOnUser = async () => {
  try {
    await mapStore.centerOnUser();
  } catch (error: any) {
    alert(error.message || 'Failed to get your location');
  }
}

const toggleRecording = () => {
  mapStore.toggleRecording();
}

const clearPath = () => {
  mapStore.clearPath();
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
    if (mapComponent.value?.leafletObject) {
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
      @click="onMapClick"
      class="w-full h-full"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      ></l-tile-layer>
      
      <!-- User Location Marker -->
      <l-marker 
        v-if="mapStore.userLocation" 
        :lat-lng="mapStore.userLocation"
        :icon="userLocationIcon"
      >
        <l-popup>Your Location</l-popup>
      </l-marker>

      <!-- POI Markers -->
      <l-marker 
        v-for="poi in poisStore.pois" 
        :key="poi.id" 
        :lat-lng="poi.coordinates" 
        :icon="poisStore.getMarkerIcon(poi.category)"
      >
        <l-popup><b>{{ poi.name }}</b><br>{{ poi.description }}</l-popup>
      </l-marker>

      <!-- User Markers -->
      <l-marker 
        v-for="marker in mapStore.userMarkers" 
        :key="marker.id" 
        :lat-lng="marker.position"
        :icon="userMarkerIcon"
      >
        <l-popup>
          <div class="flex flex-col gap-2">
            <span>User Marker</span>
            <button 
              @click="mapStore.removeUserMarker(marker.id)"
              class="btn btn-xs btn-error"
            >
              Delete
            </button>
          </div>
        </l-popup>
      </l-marker>

      <!-- Current Recording Path -->
      <l-polyline 
        v-if="mapStore.currentPath.length > 0"
        :lat-lngs="mapStore.currentPath" 
        color="red"
        :weight="4"
        :opacity="0.7"
      />

      <!-- Saved Paths -->
      <l-polyline 
        v-for="path in mapStore.savedPaths" 
        :key="path.id"
        :lat-lngs="path.points" 
        color="blue"
        :weight="3"
        :opacity="0.5"
      />
    </l-map>
  </div>
</template>

<style scoped>
/* Scoped styles for MapView */
</style>
