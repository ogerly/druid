<template>
  <div style="height:100%; width:100%">
    <l-map ref="mapRef" v-model:zoom="zoom" :center="center" @click="onMapClick">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>

      <l-marker v-if="userLocation" :lat-lng="userLocation"></l-marker>

      <l-marker v-for="(marker, index) in markers" :key="index" :lat-lng="marker">
        <l-icon :icon-url="markerIconUrl" :icon-size="iconSize" />
      </l-marker>

      <l-polyline :lat-lngs="path" color="blue"></l-polyline>
    </l-map>

    <!-- The buttons are now moved to the navbar -->
  </div>
</template>

<script setup>
import { LMap, LTileLayer, LMarker, LIcon, LPolyline } from "@vue-leaflet/vue-leaflet";
import { ref, defineExpose } from "vue";
import { useMap } from "../composables/useMap";

const zoom = ref(13);
const center = ref([47.41322, -1.219482]);
const userLocation = ref(null);
const mapRef = ref(null);

const markerIconUrl = ref('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png');
const iconSize = ref([25, 41]);

const { 
  getUserLocation, 
  markers, 
  addMarker, 
  path, 
  addPointToPath, 
  isRecording, 
  toggleRecording, 
  clearPath 
} = useMap();

const centerOnUser = async () => {
  try {
    const location = await getUserLocation();
    userLocation.value = location;
    // Use map instance to fly to the new location for a smooth animation
    mapRef.value.leafletObject.flyTo(location, 15);
  } catch (error) {
    console.error("Error getting user location:", error);
    alert(error.message);
  }
};

const onMapClick = (event) => {
  if (isRecording.value) {
    addPointToPath(event.latlng);
  } else {
    addMarker(event.latlng);
  }
};

// Expose functions and state for the parent component
defineExpose({
  centerOnUser,
  toggleRecording,
  clearPath,
  isRecording
});

</script>

<!-- Scoped styles for this component -->
<style scoped>
/* The old button-container styles are removed */
</style>
