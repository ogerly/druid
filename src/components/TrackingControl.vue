<template>
  <div>
    <!-- Tracking Button -->
    <button
      @click="isTracking ? handleStop() : openSettingsModal()"
      class="btn btn-lg"
      :class="isTracking ? 'btn-error' : 'btn-success'"
    >
      <vue-feather :icon="isTracking ? 'square' : 'play'" size="20" />
      <span class="ml-2">
        {{ isTracking ? 'Stoppen' : 'Wanderung starten' }}
      </span>
    </button>

    <!-- Live Stats während Tracking -->
    <div v-if="isTracking && liveStats" class="stats stats-vertical lg:stats-horizontal shadow mt-4">
      <div class="stat">
        <div class="stat-figure text-primary">
          <vue-feather icon="navigation" size="24" />
        </div>
        <div class="stat-title">Distanz</div>
        <div class="stat-value text-primary text-2xl">
          {{ formatDistance(liveStats.totalDistance) }}
        </div>
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary">
          <vue-feather icon="clock" size="24" />
        </div>
        <div class="stat-title">Dauer</div>
        <div class="stat-value text-secondary text-2xl">
          {{ formatDuration(liveStats.duration) }}
        </div>
      </div>

      <div class="stat">
        <div class="stat-figure text-accent">
          <vue-feather icon="map-pin" size="24" />
        </div>
        <div class="stat-title">Wegpunkte</div>
        <div class="stat-value text-accent text-2xl">
          {{ liveStats.waypointCount }}
        </div>
      </div>
    </div>

    <!-- Tracking Settings Modal -->
    <dialog ref="settingsModal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Tracking-Einstellungen</h3>

        <!-- Track Name -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Name der Wanderung</span>
          </label>
          <input
            v-model="trackName"
            type="text"
            placeholder="z.B. Keltenwelt-Rundweg"
            class="input input-bordered"
          />
        </div>

        <!-- Intervall Slider -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Wegpunkt-Intervall</span>
            <span class="label-text-alt">{{ selectedInterval.label }}</span>
          </label>
          <input
            v-model.number="selectedIntervalIndex"
            type="range"
            min="0"
            :max="intervals.length - 1"
            class="range range-primary"
            step="1"
          />
          <div class="w-full flex justify-between text-xs px-2 mt-1">
            <span>30s</span>
            <span>1m</span>
            <span>2m</span>
            <span>3m</span>
            <span>4m</span>
            <span>5m</span>
          </div>
        </div>

        <!-- Distanz Threshold -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Mindestbewegung</span>
            <span class="label-text-alt">{{ minDistance }} Meter</span>
          </label>
          <input
            v-model.number="minDistance"
            type="range"
            min="5"
            max="50"
            class="range range-secondary"
            step="5"
          />
          <div class="w-full flex justify-between text-xs px-2 mt-1">
            <span>5m</span>
            <span>25m</span>
            <span>50m</span>
          </div>
        </div>

        <!-- GPS Accuracy Warning -->
        <div class="alert alert-info mb-4">
          <vue-feather icon="info" size="20" />
          <div class="text-sm">
            <p class="font-semibold">GPS-Tracking Hinweise:</p>
            <ul class="list-disc list-inside mt-1">
              <li>Bildschirm bleibt während Tracking an</li>
              <li>GPS funktioniert offline</li>
              <li>Batterieverbrauch: ~10-15%/Stunde</li>
            </ul>
          </div>
        </div>

        <!-- Buttons -->
        <div class="modal-action">
          <button @click="closeSettingsModal()" class="btn btn-ghost">
            Abbrechen
          </button>
          <button @click="handleStart()" class="btn btn-success">
            <vue-feather icon="play" size="20" />
            Tracking starten
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <!-- Stop Confirmation Modal -->
    <dialog ref="stopModal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Tracking beenden?</h3>
        <p class="py-4">
          Deine Wanderung wird gespeichert.
        </p>

        <div v-if="liveStats" class="stats stats-vertical shadow mb-4">
          <div class="stat">
            <div class="stat-title">Distanz</div>
            <div class="stat-value text-sm">{{ formatDistance(liveStats.totalDistance) }}</div>
          </div>
          <div class="stat">
            <div class="stat-title">Dauer</div>
            <div class="stat-value text-sm">{{ formatDuration(liveStats.duration) }}</div>
          </div>
          <div class="stat">
            <div class="stat-title">Wegpunkte</div>
            <div class="stat-value text-sm">{{ liveStats.waypointCount }}</div>
          </div>
        </div>

        <div class="modal-action">
          <button @click="closeStopModal()" class="btn btn-ghost">
            Weitermachen
          </button>
          <button @click="confirmStop()" class="btn btn-error">
            Tracking stoppen
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMapStore } from '@/stores/mapStore';
import VueFeather from 'vue-feather';

const mapStore = useMapStore();

// Refs
const settingsModal = ref<HTMLDialogElement | null>(null);
const stopModal = ref<HTMLDialogElement | null>(null);
const trackName = ref('Unbenannte Wanderung');
const minDistance = ref(10);

// Interval settings
const intervals = ref([
  { value: 0.5, label: '30 Sek' },
  { value: 1, label: '1 Min' },
  { value: 2, label: '2 Min' },
  { value: 3, label: '3 Min' },
  { value: 4, label: '4 Min' },
  { value: 5, label: '5 Min' },
]);
const selectedIntervalIndex = ref(1); // Default to 1 min (index 1)

// Computed
const isTracking = computed(() => mapStore.isRecording);
const liveStats = computed(() => mapStore.liveStats);
const selectedInterval = computed(() => intervals.value[selectedIntervalIndex.value]);

// Format helpers
const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters.toFixed(0)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
};

const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}:${remainingMinutes.toString().padStart(2, '0')} h`;
  }

  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')} min`;
  }

  return `${seconds} s`;
};

// Modal functions
const openSettingsModal = () => {
  settingsModal.value?.showModal();
};

const closeSettingsModal = () => {
  settingsModal.value?.close();
};

const closeStopModal = () => {
  stopModal.value?.close();
};

// Actions
const handleStart = async () => {
  closeSettingsModal();

  // Update tracking config
  mapStore.updateTrackingConfig({
    minTimeInterval: selectedInterval.value.value * 60 * 1000, // convert minutes to ms
    minDistance: minDistance.value
  });

  // Start tracking
  try {
    await mapStore.startTracking(trackName.value);
    console.log('✅ Tracking gestartet');
  } catch (error: any) {
    console.error('❌ Tracking-Start fehlgeschlagen:', error.message);
    alert('GPS konnte nicht gestartet werden. Bitte aktiviere GPS in deinen Einstellungen.');
  }
};

const handleStop = () => {
  stopModal.value?.showModal();
};

const confirmStop = async () => {
  closeStopModal();
  await mapStore.stopTracking();
  console.log('✅ Tracking gestoppt');
  
  // Reset form
  trackName.value = 'Unbenannte Wanderung';
  selectedIntervalIndex.value = 1;
  minDistance.value = 10;
};
</script>
