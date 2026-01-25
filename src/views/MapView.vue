<template>
  <div class="map-container">
    <l-map 
      ref="mapComponentRef" 
      v-model:zoom="zoom"
      :center="[51.505, -0.09]" 
      @ready="onMapReady"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      ></l-tile-layer>
      
      <l-marker v-if="userLocation" :lat-lng="userLocation" :icon="userIcon">
        <l-popup>You are here</l-popup>
      </l-marker>

      <l-polyline :lat-lngs="path" color="blue"></l-polyline>

      <l-marker 
        v-for="poi in pois" 
        :key="poi.id" 
        :lat-lng="poi.coordinates"
        :icon="getMarkerIcon(poi.category)"
      >
        <l-popup>
          <b>{{ poi.name }}</b><br>{{ poi.description }}
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup, LPolyline } from "@vue-leaflet/vue-leaflet";
import { useMap } from '../composables/useMap';
import { usePois } from '../composables/usePois';
import L from 'leaflet';

// --- Refs and Composables ---
const mapComponentRef = ref(null); // Template ref for the LMap component

// Get state and methods from our central composable
const { 
  zoom, 
  userLocation, 
  path, 
  setMap, 
  centerOnUser, 
  toggleRecording, 
  clearPath 
} = useMap();

const { pois } = usePois();

// --- Lifecycle and Event Handlers ---

// This is the CRITICAL step. When the map component is ready...
const onMapReady = () => {
  // ...get the underlying Leaflet map object...
  const leafletMap = mapComponentRef.value.leafletObject;
  // ...and register it with our central composable state.
  setMap(mapComponentRef.value);
  
  // Now that we KNOW the map is ready and sized, invalidate its size.
  nextTick(() => {
    leafletMap.invalidateSize();
  });
};

// Expose the control methods so App.vue can call them
defineExpose({ centerOnUser, toggleRecording, clearPath });

// --- Iconography (No changes here) ---
const userIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createIcon = (color) => {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
}

const poiIcons = {
    'Archaeological': createIcon('blue'),
    'Reconstructed': createIcon('green'),
    'Nature & Mythos': createIcon('gold')
};

const getMarkerIcon = (category) => {
    return poiIcons[category] || createIcon('grey');
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>
