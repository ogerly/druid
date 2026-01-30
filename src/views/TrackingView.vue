<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useMapStore } from '@/stores/mapStore';
import TrackingControl from '@/components/TrackingControl.vue';
import VueFeather from 'vue-feather';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPolyline } from "@vue-leaflet/vue-leaflet";
import L from 'leaflet';

const mapStore = useMapStore();

// Custom icon for user location
const userLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Computed
const isTracking = computed(() => mapStore.isRecording);
const activeTrack = computed(() => mapStore.activeTrack);
const trackPolyline = computed(() => {
  if (!activeTrack.value) return [];
  return activeTrack.value.waypoints.map(wp => [wp.lat, wp.lng] as [number, number]);
});

// Center on user when tracking starts
const autoCenter = ref(true);

const toggleAutoCenter = () => {
  autoCenter.value = !autoCenter.value;
  if (autoCenter.value && mapStore.userLocation) {
    mapStore.setCenter(mapStore.userLocation);
  }
};

// Auto-center when user location changes during tracking
const watchUserLocation = () => {
  if (isTracking.value && autoCenter.value && mapStore.userLocation) {
    mapStore.setCenter(mapStore.userLocation);
  }
};

onMounted(() => {
  setInterval(watchUserLocation, 2000);
});
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Map Section (takes most space) -->
    <div class="flex-1 relative">
      <l-map
        :zoom="mapStore.zoom"
        :center="mapStore.center"
        @update:zoom="mapStore.setZoom($event)"
        @update:center="mapStore.setCenter($event)"
        :options="{
          touchZoom: true,
          scrollWheelZoom: true,
          dragging: true,
          zoomControl: true
        }"
        class="w-full h-full"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        ></l-tile-layer>
        
        <!-- User Location -->
        <l-marker 
          v-if="mapStore.userLocation" 
          :lat-lng="mapStore.userLocation"
          :icon="userLocationIcon"
        >
          <l-popup>Dein Standort</l-popup>
        </l-marker>

        <!-- Active Track Polyline -->
        <l-polyline 
          v-if="trackPolyline.length > 0"
          :lat-lngs="trackPolyline" 
          color="red"
          :weight="4"
          :opacity="0.8"
        />
        
        <!-- Waypoint Markers (small dots) -->
        <l-marker
          v-for="waypoint in activeTrack?.waypoints || []"
          :key="waypoint.id"
          :lat-lng="[waypoint.lat, waypoint.lng]"
          :icon="L.divIcon({
            className: 'waypoint-marker',
            html: `<div style='background: #e94560; width: 8px; height: 8px; border-radius: 50%; border: 2px solid white;'></div>`,
            iconSize: [8, 8],
            iconAnchor: [4, 4]
          })"
        />
      </l-map>

      <!-- Floating Auto-Center Button -->
      <button
        v-if="isTracking"
        @click="toggleAutoCenter"
        class="btn btn-circle btn-sm absolute top-4 right-4 z-10"
        :class="autoCenter ? 'btn-primary' : 'btn-ghost'"
        title="Auto-Center auf GPS-Position"
      >
        <vue-feather :icon="autoCenter ? 'crosshair' : 'target'" size="16" />
      </button>
    </div>

    <!-- Tracking Control Section (bottom panel) -->
    <div class="bg-base-200 p-4 border-t border-base-300">
      <div class="container mx-auto max-w-4xl">
        <TrackingControl />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.leaflet-container) {
  width: 100%;
  height: 100%;
  z-index: 1;
}

:deep(.waypoint-marker) {
  background: transparent !important;
  border: none !important;
}
</style>
