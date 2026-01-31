<template>
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Einstellungen</h1>
    
    <!-- PWA Installation Section -->
    <div class="card bg-base-200 shadow-xl mb-6">
      <div class="card-body">
        <h2 class="card-title">
          <vue-feather icon="download" size="24" />
          App-Installation
        </h2>
        <p class="text-sm opacity-70 mb-4">
          Installiere DRUID als native App auf deinem Gerät für den schnellen Zugriff und Offline-Funktionalität.
        </p>
        
        <!-- Install Button (nur sichtbar wenn installierbar) -->
        <button 
          v-if="isInstallable"
          @click="installApp"
          class="btn btn-primary btn-lg w-full"
        >
          <vue-feather icon="smartphone" size="20" />
          Auf Homescreen installieren
        </button>

        <!-- Bereits installiert -->
        <div v-else-if="isInstalled" class="alert alert-success">
          <vue-feather icon="check-circle" size="20" />
          <span>App ist bereits installiert!</span>
        </div>

        <!-- iOS-spezifische Anleitung -->
        <div v-else-if="isIOS" class="alert alert-info">
          <vue-feather icon="info" size="20" />
          <div>
            <p class="font-semibold">iOS Installation:</p>
            <ol class="list-decimal list-inside text-sm mt-2">
              <li>Tippe auf das <strong>Teilen-Symbol</strong> in Safari</li>
              <li>Scrolle runter und wähle <strong>"Zum Home-Bildschirm"</strong></li>
              <li>Bestätige mit <strong>"Hinzufügen"</strong></li>
            </ol>
          </div>
        </div>

        <!-- Nicht verfügbar -->
        <div v-else class="alert alert-warning">
          <vue-feather icon="alert-circle" size="20" />
          <span>Installation ist in diesem Browser nicht verfügbar. Öffne die App in Chrome oder Safari.</span>
        </div>

        <!-- PWA Features -->
        <div class="divider">Features</div>
        <ul class="space-y-2 text-sm">
          <li class="flex items-center gap-2">
            <vue-feather icon="check" size="16" class="text-success" />
            <span>Offline-Karten und GPS-Tracking</span>
          </li>
          <li class="flex items-center gap-2">
            <vue-feather icon="check" size="16" class="text-success" />
            <span>Schneller Zugriff vom Homescreen</span>
          </li>
          <li class="flex items-center gap-2">
            <vue-feather icon="check" size="16" class="text-success" />
            <span>Vollbild ohne Browser-UI</span>
          </li>
          <li class="flex items-center gap-2">
            <vue-feather icon="check" size="16" class="text-success" />
            <span>Automatische Updates</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- App Info -->
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">
          <vue-feather icon="info" size="24" />
          App-Info
        </h2>
        <div class="stats stats-vertical lg:stats-horizontal shadow">
          <div class="stat">
            <div class="stat-title">Version</div>
            <div class="stat-value text-xl">1.0.0</div>
            <div class="stat-desc">PWA Phase 1</div>
          </div>
          <div class="stat">
            <div class="stat-title">Build</div>
            <div class="stat-value text-xl">{{ buildDate }}</div>
            <div class="stat-desc">GitHub Pages</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import VueFeather from 'vue-feather';

// PWA Install Prompt
let deferredPrompt: any = null;
const isInstallable = ref(false);
const isInstalled = ref(false);
const isIOS = ref(false);
const buildDate = new Date().toLocaleDateString('de-DE');

onMounted(() => {
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    isInstalled.value = true;
  }

  // Check if iOS
  const userAgent = window.navigator.userAgent.toLowerCase();
  isIOS.value = /iphone|ipad|ipod/.test(userAgent);

  // Listen for install prompt (Chrome/Edge/Android)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    isInstallable.value = true;
    console.log('✅ PWA installierbar');
  });

  // Listen for successful installation
  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installiert');
    isInstalled.value = true;
    isInstallable.value = false;
    deferredPrompt = null;
  });
});

const installApp = async () => {
  if (!deferredPrompt) {
    console.warn('⚠️ Install prompt not available');
    return;
  }

  // Show install prompt
  deferredPrompt.prompt();

  // Wait for user response
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response: ${outcome}`);

  if (outcome === 'accepted') {
    console.log('✅ User accepted installation');
  } else {
    console.log('❌ User dismissed installation');
  }

  // Clear prompt
  deferredPrompt = null;
  isInstallable.value = false;
};
</script>

<style scoped>
.alert {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}
</style>
