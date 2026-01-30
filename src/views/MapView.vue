<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup, LPolyline } from "@vue-leaflet/vue-leaflet";
import { useMapStore } from '@/stores/mapStore';
import { usePoisStore } from '@/stores/poisStore';
import MarkerFormModal from '@/components/MarkerFormModal.vue';
import L from 'leaflet';

const mapStore = useMapStore();
const poisStore = usePoisStore();

const mapComponent = ref<any>(null);
const markerFormModal = ref<InstanceType<typeof MarkerFormModal> | null>(null);
const pendingMarkerPosition = ref<[number, number] | null>(null);

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
  const latLng: [number, number] = [event.latlng.lat, event.latlng.lng];
  
  if (mapStore.isRecording) {
    // Add point to path while recording
    mapStore.addPointToPath(latLng);
  } else {
    // Show modal to add user marker with metadata
    pendingMarkerPosition.value = latLng;
    markerFormModal.value?.showModal();
  }
};

// Handle marker form submission
const handleMarkerSave = (data: { label?: string; description?: string; category: string }) => {
  if (pendingMarkerPosition.value) {
    mapStore.addUserMarker(
      pendingMarkerPosition.value,
      data.label,
      data.description,
      data.category
    );
    pendingMarkerPosition.value = null;
  }
};

// Handle marker form cancellation
const handleMarkerCancel = () => {
  pendingMarkerPosition.value = null;
};

// Format date for display
const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
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
      :options="{
        touchZoom: true,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        tap: true,
        tapTolerance: 15,
        dragging: true,
        zoomControl: true,
        attributionControl: true
      }"
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
          <div class="flex flex-col gap-2 min-w-[200px]">
            <div class="font-bold text-base">
              {{ marker.label || 'Unbenannter Marker' }}
            </div>
            
            <div v-if="marker.description" class="text-sm opacity-80">
              {{ marker.description }}
            </div>
            
            <div class="badge badge-sm">{{ marker.category }}</div>
            
            <div class="text-xs opacity-60 font-mono">
              {{ marker.position[0].toFixed(6) }}°, {{ marker.position[1].toFixed(6) }}°
            </div>
            
            <div class="text-xs opacity-50">
              {{ formatDate(marker.timestamp) }}
            </div>
            
            <button 
              @click="mapStore.removeUserMarker(marker.id)"
              class="btn btn-xs btn-error mt-2"
            >
              Löschen
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

      <!-- Active Track Polyline (from IndexedDB) -->
      <l-polyline 
        v-if="mapStore.activeTrack && mapStore.activeTrack.waypoints.length > 0"
        :lat-lngs="mapStore.activeTrack.waypoints.map(wp => [wp.lat, wp.lng])" 
        color="red"
        :weight="4"
        :opacity="0.8"
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
    
    <!-- Marker Form Modal -->
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
/* Map Container */
.w-full.h-full {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  touch-action: pan-x pan-y;
  z-index: 1;
}

/* Leaflet Container muss auch 100% sein */
:deep(.leaflet-container) {
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* Bessere Touch-Targets für Mobile */
:deep(.leaflet-control-zoom a) {
  min-width: 44px;
  min-height: 44px;
  line-height: 44px;
}

/* Popup Touch-Optimierung */
:deep(.leaflet-popup-content) {
  min-width: 200px;
  font-size: 14px;
}

/* Mobile-spezifische Anpassungen */
@media (max-width: 1023px) {
  :deep(.leaflet-control-zoom) {
    margin-top: 10px;
    margin-right: 10px;
  }
  
  :deep(.leaflet-popup-content-wrapper) {
    border-radius: 8px;
  }
}
</style>
