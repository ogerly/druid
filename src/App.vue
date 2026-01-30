<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" v-model="isSidebarOpen" />
    <div class="drawer-content flex flex-col items-center justify-center">
      <!-- Page content here -->
      <TheNavbar 
        @toggle-sidebar="toggleSidebar"
        @center-on-user="centerOnUser"
        @toggle-recording="toggleRecording"
        @clear-path="clearPath"
        :is-recording="isRecording"
      />
      <main class="w-full h-full">
        <router-view v-slot="{ Component }">
          <component ref="mapViewRef" :is="Component" />
        </router-view>
      </main>
    </div>
    <div class="drawer-side">
      <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
      <TheSidebar />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TheNavbar from './components/layout/TheNavbar.vue';
import TheSidebar from './components/layout/TheSidebar.vue';

const isSidebarOpen = ref(false);
const mapViewRef = ref(null);
const isRecording = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// --- Map control methods ---
const centerOnUser = () => {
  if (mapViewRef.value && mapViewRef.value.centerOnUser) {
    mapViewRef.value.centerOnUser();
  }
};

const toggleRecording = () => {
  if (mapViewRef.value && mapViewRef.value.toggleRecording) {
    isRecording.value = !isRecording.value;
    mapViewRef.value.toggleRecording();
  }
};

const clearPath = () => {
  if (mapViewRef.value && mapViewRef.value.clearPath) {
    mapViewRef.value.clearPath();
    isRecording.value = false;
  }
};
</script>

<style>
/* Remove the old global styles, as Tailwind handles this */
body {
  margin: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  background-color: #1a1a1a;
  overflow: hidden;
}
</style>
