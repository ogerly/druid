<template>
  <div id="app-container">
    <TheNavbar 
      @toggle-sidebar="toggleSidebar" 
      @center-on-user="centerOnUser"
      @toggle-recording="toggleRecording"
      @clear-path="clearPath"
      :is-recording="isRecording"
    />
    <TheSidebar :isOpen="isSidebarOpen" @close-sidebar="closeSidebar" />
    <main :class="{ 'sidebar-open': isSidebarOpen }">
      <router-view v-slot="{ Component }">
        <component ref="mapViewRef" :is="Component" />
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TheNavbar from './components/layout/TheNavbar.vue';
import TheSidebar from './components/layout/TheSidebar.vue';

const isSidebarOpen = ref(false);
const mapViewRef = ref(null);
const isRecording = ref(false); // Maintain recording state here

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

// --- Map control methods ---
const centerOnUser = () => {
  if (mapViewRef.value && mapViewRef.value.centerOnUser) {
    mapViewRef.value.centerOnUser();
  }
};

const toggleRecording = () => {
  if (mapViewRef.value && mapViewRef.value.toggleRecording) {
    isRecording.value = !isRecording.value; // Toggle state in App.vue
    mapViewRef.value.toggleRecording();
  }
};

const clearPath = () => {
  if (mapViewRef.value && mapViewRef.value.clearPath) {
    mapViewRef.value.clearPath();
    isRecording.value = false; // Reset recording state
  }
};

</script>

<style>
/* Global styles */
body {
  margin: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  background-color: #1a1a1a; /* Dark background */
  overflow: hidden; /* Prevent body scrolling */
}

#app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

main {
  flex-grow: 1; /* Allow main to fill available space */
  position: relative; /* For positioning children or stacking context */
  transition: transform 0.3s ease;
}

main.sidebar-open {
  transform: translateX(250px);
}
</style>
