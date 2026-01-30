<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" v-model="isSidebarOpen" />
    <div class="drawer-content flex flex-col">
      <!-- Map Controls Navbar - nur auf Map-Route sichtbar -->
      <TheNavbar 
        v-if="isMapRoute"
        @center-on-user="handleCenterOnUser"
        @toggle-recording="handleToggleRecording"
        @clear-path="handleClearPath"
        :is-recording="mapStore.isRecording"
      />
      <main class="flex-1 relative">
        <router-view />
      </main>
      
      <!-- Mobile Bottom Dock Navigation -->
      <div class="btm-nav lg:hidden z-50">
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
  { name: 'Places', path: '/places', icon: 'list' },
  { name: 'Calendar', path: '/calendar', icon: 'calendar' },
  { name: 'Profile', path: '/profile', icon: 'user' },
  { name: 'Settings', path: '/settings', icon: 'settings' },
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
body {
  margin: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  background-color: #1a1a1a;
  overflow: hidden;
}

/* Fixe z-index für Mobile */
.drawer-side {
  z-index: 40;
}

.drawer-overlay {
  z-index: 39;
}

.btm-nav {
  z-index: 50;
  height: 4rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Main Content Layout */
main {
  height: calc(100vh - 4rem); /* Platz für Bottom Nav */
  overflow: hidden;
}

/* Auf Map-Route mit Navbar */
main:has(+ .btm-nav) {
  height: calc(100vh - 4rem);
}

@media (min-width: 1024px) {
  main {
    height: 100vh;
  }
}

/* Active Route Highlight */
.btm-nav button.active {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-primary);
}
</style>
