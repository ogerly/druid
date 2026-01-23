<template>
  <div id="app-container">
    <TheNavbar @toggle-sidebar="toggleSidebar" />
    <TheSidebar :is-open="isSidebarOpen" @close="closeSidebar" />
    <main class="main-content">
      <MapView />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TheNavbar from './components/layout/TheNavbar.vue';
import TheSidebar from './components/layout/TheSidebar.vue';
import MapView from './components/MapView.vue';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<style scoped>
#app-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.main-content {
  /* The map needs to fill the entire space, and the navbar sits on top */
  height: 100%;
  width: 100%;
}
</style>
