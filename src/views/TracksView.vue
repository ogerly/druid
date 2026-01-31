<template>
  <div class="p-4 max-w-6xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Meine Wanderungen</h1>
      <button @click="refreshTracks" class="btn btn-circle btn-ghost" title="Aktualisieren">
        <vue-feather type="refresh-cw" size="20" />
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Empty State -->
    <div v-else-if="tracks.length === 0" class="text-center py-12">
      <vue-feather type="map" size="64" class="mx-auto mb-4 opacity-30" />
      <h2 class="text-2xl font-bold mb-2">Noch keine Wanderungen</h2>
      <p class="text-base-content/60 mb-4">
        Starte dein erstes GPS-Tracking auf der Karte!
      </p>
      <router-link to="/" class="btn btn-primary">
        <vue-feather type="map" size="20" />
        Zur Karte
      </router-link>
    </div>

    <!-- Track List -->
    <div v-else class="space-y-4">
      <div
        v-for="track in tracks"
        :key="track.id"
        class="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow"
      >
        <div class="card-body">
          <!-- Header -->
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="card-title text-2xl">{{ track.name }}</h2>
              <div class="text-sm text-base-content/60 flex items-center gap-2 mt-1">
                <vue-feather type="calendar" size="14" />
                {{ formatDate(track.startTime) }}
                <span v-if="track.status === 'recording'" class="badge badge-error badge-sm">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                  Aktiv
                </span>
                <span v-else-if="track.status === 'paused'" class="badge badge-warning badge-sm">
                  Pausiert
                </span>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-ghost btn-circle btn-sm">
                <vue-feather type="more-vertical" size="20" />
              </label>
              <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a @click="viewOnMap(track)"><vue-feather type="map" size="16" />Auf Karte anzeigen</a></li>
                <li><a @click="exportGPX(track)"><vue-feather type="download" size="16" />GPX Export</a></li>
                <li><a @click="renameTrack(track)"><vue-feather type="edit" size="16" />Umbenennen</a></li>
                <li class="border-t mt-2 pt-2">
                  <a @click="deleteTrack(track.id)" class="text-error">
                    <vue-feather type="trash-2" size="16" />Löschen
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <!-- Statistics -->
          <div class="stats stats-vertical sm:stats-horizontal shadow">
            <div class="stat">
              <div class="stat-figure text-primary">
                <vue-feather type="navigation" size="24" />
              </div>
              <div class="stat-title">Distanz</div>
              <div class="stat-value text-primary text-lg sm:text-2xl">
                {{ formatDistance(track.distance || calculateDistance(track)) }}
              </div>
              <div class="stat-desc">{{ track.waypoints.length }} Wegpunkte</div>
            </div>

            <div class="stat">
              <div class="stat-figure text-secondary">
                <vue-feather type="clock" size="24" />
              </div>
              <div class="stat-title">Dauer</div>
              <div class="stat-value text-secondary text-lg sm:text-2xl">
                {{ formatDuration(track.duration || calculateDuration(track)) }}
              </div>
              <div class="stat-desc">{{ formatTimeRange(track) }}</div>
            </div>

            <div class="stat">
              <div class="stat-figure text-accent">
                <vue-feather type="zap" size="24" />
              </div>
              <div class="stat-title">∅ Geschw.</div>
              <div class="stat-value text-accent text-lg sm:text-2xl">
                {{ formatSpeed(calculateAvgSpeed(track)) }}
              </div>
              <div class="stat-desc">
                Max: {{ formatSpeed(calculateMaxSpeed(track)) }}
              </div>
            </div>
          </div>

          <!-- Waypoint Preview -->
          <div v-if="expandedTrack === track.id" class="mt-4">
            <div class="divider">Wegpunkte</div>
            <div class="overflow-x-auto max-h-64 overflow-y-auto">
              <table class="table table-zebra table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Zeit</th>
                    <th>Position</th>
                    <th>Genauigkeit</th>
                    <th>Höhe</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(wp, index) in track.waypoints" :key="wp.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ formatTime(wp.timestamp) }}</td>
                    <td class="font-mono text-xs">
                      {{ wp.lat.toFixed(6) }}, {{ wp.lng.toFixed(6) }}
                    </td>
                    <td>{{ wp.accuracy.toFixed(1) }}m</td>
                    <td>{{ wp.altitude ? wp.altitude.toFixed(0) + 'm' : '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="card-actions justify-end mt-4">
            <button
              @click="toggleExpand(track.id)"
              class="btn btn-sm btn-ghost"
            >
              <vue-feather :type="expandedTrack === track.id ? 'chevron-up' : 'chevron-down'" size="16" />
              {{ expandedTrack === track.id ? 'Weniger' : 'Details' }}
            </button>
            <button @click="viewOnMap(track)" class="btn btn-sm btn-primary">
              <vue-feather type="map" size="16" />
              Auf Karte
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import VueFeather from 'vue-feather';
import { db } from '@/db/trackDatabase';
import type { Track } from '@/db/trackDatabase';

const router = useRouter();
const tracks = ref<Track[]>([]);
const loading = ref(true);
const expandedTrack = ref<string | null>(null);

// Load tracks on mount
onMounted(async () => {
  await refreshTracks();
});

const refreshTracks = async () => {
  loading.value = true;
  try {
    // Get all tracks, sorted by start time (newest first)
    tracks.value = await db.tracks
      .orderBy('startTime')
      .reverse()
      .toArray();
    console.log('📋 Loaded tracks:', tracks.value.length);
  } catch (error) {
    console.error('❌ Failed to load tracks:', error);
  } finally {
    loading.value = false;
  }
};

const toggleExpand = (trackId: string) => {
  expandedTrack.value = expandedTrack.value === trackId ? null : trackId;
};

// Distance calculation (Haversine)
const calculateDistance = (track: Track): number => {
  let totalDistance = 0;
  
  for (let i = 1; i < track.waypoints.length; i++) {
    const prev = track.waypoints[i - 1];
    const curr = track.waypoints[i];
    
    if (!prev || !curr) continue;
    
    const R = 6371e3; // Earth radius in meters
    const φ1 = prev.lat * Math.PI / 180;
    const φ2 = curr.lat * Math.PI / 180;
    const Δφ = (curr.lat - prev.lat) * Math.PI / 180;
    const Δλ = (curr.lng - prev.lng) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    totalDistance += R * c;
  }
  
  return totalDistance;
};

const calculateDuration = (track: Track): number => {
  if (track.endTime) {
    return track.endTime - track.startTime;
  }
  return Date.now() - track.startTime;
};

const calculateAvgSpeed = (track: Track): number => {
  const distance = track.distance || calculateDistance(track);
  const duration = track.duration || calculateDuration(track);
  return distance / (duration / 1000); // m/s
};

const calculateMaxSpeed = (track: Track): number => {
  return Math.max(...track.waypoints.map(w => w.speed || 0));
};

// Formatters
const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const formatTimeRange = (track: Track): string => {
  const start = new Date(track.startTime).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  if (track.endTime) {
    const end = new Date(track.endTime).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${start} - ${end}`;
  }
  
  return `seit ${start}`;
};

const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters.toFixed(0)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
};

const formatDuration = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')} h`;
  }
  return `${minutes} min`;
};

const formatSpeed = (metersPerSecond: number): string => {
  const kmh = metersPerSecond * 3.6;
  return `${kmh.toFixed(1)} km/h`;
};

// Actions
const viewOnMap = (track: Track) => {
  // TODO: Implement map view with track overlay
  console.log('View track on map:', track.id);
  router.push('/');
};

const exportGPX = (track: Track) => {
  // TODO: Implement GPX export
  console.log('Export GPX:', track.name);
  
  // Quick JSON export for now
  const json = JSON.stringify(track, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${track.name.replace(/\s+/g, '_')}_${track.id.slice(0, 8)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const renameTrack = async (track: Track) => {
  const newName = prompt('Neuer Name:', track.name);
  if (newName && newName !== track.name) {
    try {
      await db.tracks.update(track.id, { name: newName, updatedAt: Date.now() });
      await refreshTracks();
      console.log('✅ Track renamed:', newName);
    } catch (error) {
      console.error('❌ Failed to rename track:', error);
    }
  }
};

const deleteTrack = async (trackId: string) => {
  if (!confirm('Wanderung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
    return;
  }
  
  try {
    await db.tracks.delete(trackId);
    await refreshTracks();
    console.log('✅ Track deleted:', trackId);
  } catch (error) {
    console.error('❌ Failed to delete track:', error);
  }
};
</script>

<style scoped>
.stat-value {
  font-size: clamp(1rem, 3vw, 2rem);
}

@media (max-width: 640px) {
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
