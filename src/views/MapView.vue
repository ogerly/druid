<script setup lang="ts">
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup, LPolyline } from "@vue-leaflet/vue-leaflet";
import { useMapStore, type Track } from '@/stores/mapStore';
import { usePoisStore } from '@/stores/poisStore';
import MarkerFormModal from '@/components/MarkerFormModal.vue';
import TrackingControl from '@/components/TrackingControl.vue';
import L from 'leaflet';

const props = defineProps({
  showTrackingPanel: Boolean
});

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

const flyToTrackBounds = (track: Track) => {
  if (!track || track.waypoints.length === 0 || !mapComponent.value) return;

  const waypoints = track.waypoints.map(wp => [wp.lat, wp.lng] as [number, number]);
  const bounds = L.latLngBounds(waypoints);

  if (bounds.isValid()) {
    mapComponent.value.leafletObject.flyToBounds(bounds, { padding: [50, 50] });
  }
};

// Watch for track to display
watch(() => mapStore.trackToDisplay, (newTrack) => {
  if (newTrack) {
    flyToTrackBounds(newTrack);
  }
});


// Expose methods for potential parent component usage
defineExpose({
  centerOnUser,
});

onMounted(() => {
  // Ensure map size is correct on mount
  nextTick(() => {
    if (mapComponent.value?.leafletObject) {
      mapComponent.value.leafletObject.invalidateSize();
    }
    // If a track was selected before map was mounted, fly to it now
    if (mapStore.trackToDisplay) {
      flyToTrackBounds(mapStore.trackToDisplay);
    }
  });
});

onUnmounted(() => {
  // Clear the displayed track when leaving the map view
  mapStore.trackToDisplay = null;
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
        <l-popup>Deine Position</l-popup>
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

      <!-- Displayed Track Polyline -->
      <l-polyline
        v-if="mapStore.trackToDisplay && mapStore.trackToDisplay.waypoints.length > 0"
        :lat-lngs="mapStore.trackToDisplay.waypoints.map(wp => [wp.lat, wp.lng])"
        color="#8A2BE2" 
        :weight="5"
        :opacity="0.8"
      />

      <!-- Active Track Polyline (Live Recording) -->
      <l-polyline 
        v-if="mapStore.activeTrack && mapStore.activeTrack.waypoints.length > 0"
        :lat-lngs="mapStore.activeTrack.waypoints.map(wp => [wp.lat, wp.lng])" 
        color="red"
        :weight="4"
        :opacity="0.8"
      />

    </l-map>
    
    <!-- Tracking Control Panel (Floating) -->
    <div
      v-if="showTrackingPanel"
      class="absolute bottom-20 lg:bottom-4 left-1/2 transform -translate-x-1/2 z-[500] w-11/12 max-w-md"
    >
      <TrackingControl />
    </div>
    
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
.w-full.h-full {
  width: 100%;
  height: 100%;
}

.relative {
  position: relative;
}

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
