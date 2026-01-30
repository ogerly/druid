<template>
  <div class="drawer lg:drawer-open app-container">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" v-model="isSidebarOpen" />
    <div class="drawer-content">
      <!-- Map Controls Navbar - auf Map-Route sichtbar -->
      <TheNavbar 
        v-if="isMapRoute"
        @center-on-user="handleCenterOnUser"
        @toggle-recording="handleToggleRecording"
        @clear-path="handleClearPath"
        :is-recording="mapStore.isRecording"
      />
      <main>
        <router-view />
      </main>
      
      <!-- Mobile Bottom Dock Navigation -->
      <div class="btm-nav lg:hidden">
        <button 
          v-for="link in navLinks" 
          :key="link.name"
          @click="navigateTo(link.path)"
          :class="{ 'active': isActiveRoute(link.path) }"
        >
          <vue-feather :type="link.icon" size="20" />
          <span class="btm-nav-label text-xs">{{ link.name }}</span>
        </button>
      </div>
    </div>
    
    <!-- Desktop Sidebar -->
    <div class="drawer-side z-40">
      <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
      <TheSidebar @close="closeSidebar" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMapStore } from './stores/mapStore';
import TheNavbar from './components/layout/TheNavbar.vue';
import TheSidebar from './components/layout/TheSidebar.vue';
import VueFeather from 'vue-feather';

const router = useRouter();
const route = useRoute();
const mapStore = useMapStore();
const isSidebarOpen = ref(false);

const navLinks = ref([
  { name: 'Map', path: '/', icon: 'map' },
  { name: 'Track', path: '/tracking', icon: 'activity' },
  { name: 'Places', path: '/places', icon: 'list' },
  { name: 'Calendar', path: '/calendar', icon: 'calendar' },
  { name: 'Profile', path: '/profile', icon: 'user' },
]);

// Nur auf Map-Route Navbar anzeigen
const isMapRoute = computed(() => route.path === '/');

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const navigateTo = (path) => {
  router.push(path);
  closeSidebar();
};

const isActiveRoute = (path) => {
  return route.path === path;
};

// Map control methods using store
const handleCenterOnUser = async () => {
  try {
    await mapStore.centerOnUser();
  } catch (error) {
    console.error('GPS Error:', error);
  }
};

const handleToggleRecording = () => {
  mapStore.toggleRecording();
};

const handleClearPath = () => {
  mapStore.clearPath();
};
</script>

<style>
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  background-color: #1a1a1a;
}

#app {
  height: 100%;
  width: 100%;
}

.app-container {
  height: 100%;
  width: 100%;
}

.drawer-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-side {
  z-index: 40;
}

.drawer-overlay {
  z-index: 39;
}

/* Navbar */
.navbar {
  flex-shrink: 0;
  height: 4rem;
}

/* Main Content Area */
main {
  flex: 1;
  overflow: hidden;
  position: relative;
  width: 100%;
  min-height: 0; /* Wichtig für flex-child */
}

/* Bottom Navigation */
.btm-nav {
  flex-shrink: 0;
  height: 4rem;
  z-index: 100 !important;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

/* Active Route Highlight */
.btm-nav button.active {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-primary);
}
</style>
