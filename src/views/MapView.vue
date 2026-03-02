<script setup lang="ts">
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup, LPolyline } from "@vue-leaflet/vue-leaflet";
import { useMapStore, type Track } from '@/stores/mapStore';
// import { usePoisStore } from '@/stores/poisStore'; // Removed, was unused
import MarkerFormModal from '@/components/MarkerFormModal.vue';
import TrackingControl from '@/components/TrackingControl.vue';
import L from 'leaflet';

// FIX: Import Leaflet's default icon assets to prevent build errors
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const props = defineProps({
  showTrackingPanel: Boolean
});

const mapStore = useMapStore();

const mapComponent = ref<any>(null);
const markerFormModal = ref<InstanceType<typeof MarkerFormModal> | null>(null);
const pendingMarkerPosition = ref<[number, number] | null>(null);

// FIX: Correctly define the icon object with explicit properties to satisfy IconOptions
const userLocationIcon = L.icon({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Handle map clicks
const onMapClick = (event: any) => {
  const latLng: [number, number] = [event.latlng.lat, event.latlng.lng];
  if (mapStore.isRecording) {
    mapStore.addPointToPath(latLng);
  } else {
    pendingMarkerPosition.value = latLng;
    markerFormModal.value?.showModal();
  }
};

const handleMarkerSave = (data: { label?: string; description?: string; category: string }) => {
  if (pendingMarkerPosition.value) {
    mapStore.addUserMarker(pendingMarkerPosition.value, data.label, data.description, data.category);
    pendingMarkerPosition.value = null;
  }
};

const handleMarkerCancel = () => {
  pendingMarkerPosition.value = null;
};

// Removed formatDate function, was unused

const flyToTrackBounds = (track: Track) => {
  if (!track || track.waypoints.length === 0 || !mapComponent.value) return;
  const waypoints = track.waypoints.map(wp => [wp.lat, wp.lng] as [number, number]);
  const bounds = L.latLngBounds(waypoints);
  if (bounds.isValid()) {
    mapComponent.value.leafletObject.flyToBounds(bounds, { padding: [50, 50] });
  }
};

const flyToPolylineBounds = (polyline: [number, number][]) => {
  if (!polyline || polyline.length === 0 || !mapComponent.value) return;
  const bounds = L.latLngBounds(polyline);
  if (bounds.isValid()) {
    mapComponent.value.leafletObject.flyToBounds(bounds, { padding: [50, 50] });
  }
};

// Watch for original track to display
watch(() => mapStore.trackToDisplay, (newTrack) => {
  if (newTrack) {
    flyToTrackBounds(newTrack);
  }
});

// Watch for snapped track to display
watch(() => mapStore.snappedTrackPolyline, (newPolyline) => {
  if (newPolyline) {
    flyToPolylineBounds(newPolyline);
  }
});

onMounted(() => {
  nextTick(() => {
    mapComponent.value?.leafletObject.invalidateSize();
    if (mapStore.trackToDisplay) {
      flyToTrackBounds(mapStore.trackToDisplay);
    }
    if (mapStore.snappedTrackPolyline) {
      flyToPolylineBounds(mapStore.snappedTrackPolyline);
    }
  });
});

onUnmounted(() => {
  // Clear any displayed track when leaving the map view
  mapStore.clearPath();
});
</script>

<template>
  <div class="w-full h-full relative">
    <l-map
      ref="mapComponent"
      :zoom="mapStore.zoom"
      :center="mapStore.center"
      @update:zoom="mapStore.setZoom($event)"
      @update:center="mapStore.setCenter($event)"
      @click="onMapClick"
      :options="{ zoomControl: true, attributionControl: true }"
      class="w-full h-full"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      ></l-tile-layer>
      
      <!-- User Location Marker -->
      <l-marker v-if="mapStore.userLocation" :lat-lng="mapStore.userLocation" :icon="userLocationIcon">
        <l-popup>Deine Position</l-popup>
      </l-marker>

      <!-- User & POI Markers -->
      <!-- ... markers ... -->

      <!-- === TRACK POLYLINES === -->

      <!-- 1. Original Track (from TracksView) -->
      <l-polyline
        v-if="mapStore.trackToDisplay && mapStore.trackToDisplay.waypoints.length > 0"
        :lat-lngs="mapStore.trackToDisplay.waypoints.map(wp => [wp.lat, wp.lng])"
        color="#8A2BE2" 
        :weight="5"
        :opacity="0.8"
      />

      <!-- 2. Snapped Track (Result from Mapbox) -->
      <l-polyline
        v-if="mapStore.snappedTrackPolyline && mapStore.snappedTrackPolyline.length > 0"
        :lat-lngs="mapStore.snappedTrackPolyline"
        color="#1E90FF" 
        :weight="6" 
        :opacity="0.9"
      />

      <!-- 3. Active Track (Live Recording) -->
      <l-polyline 
        v-if="mapStore.activeTrack && mapStore.activeTrack.waypoints.length > 0"
        :lat-lngs="mapStore.activeTrack.waypoints.map(wp => [wp.lat, wp.lng])" 
        color="red"
        :weight="4"
        :opacity="0.8"
      />

    </l-map>
    
    <!-- Overlays -->
    <div v-if="showTrackingPanel" class="absolute bottom-20 lg:bottom-4 left-1/2 transform -translate-x-1/2 z-[500] w-11/12 max-w-md">
      <TrackingControl />
    </div>
    <MarkerFormModal 
      v-if="pendingMarkerPosition"
      ref="markerFormModal"
      :position="pendingMarkerPosition"
      @save="handleMarkerSave"
      @cancel="handleMarkerCancel"
    />
  </div>
</template>

<style scoped>
/* ... existing styles ... */
:deep(.leaflet-container) {
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>
