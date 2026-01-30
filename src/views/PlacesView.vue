
<script setup lang="ts">
import { usePoisStore } from '@/stores/poisStore';
import { useMapStore } from '@/stores/mapStore';
import { useRouter } from 'vue-router';
import type { POI } from '@/stores/poisStore';

const poisStore = usePoisStore();
const mapStore = useMapStore();
const router = useRouter();

const showOnMap = (poi: POI) => {
  const coords = poi.coordinates as [number, number];
  mapStore.selectPoi(String(poi.id), coords);
  router.push('/'); // Assuming '/' is the MapView
};

const getCategoryClass = (category: POI['category']) => {
  const colors: Record<string, string> = {
    culture: 'badge-primary',
    nature: 'badge-secondary',
    food: 'badge-accent',
  };
  return colors[category] || 'badge-neutral';
};
</script>

<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6">Places of Interest</h1>
    
    <div class="grid gap-4 md:grid-cols-2">
      <div 
        v-for="poi in poisStore.pois" 
        :key="poi.id"
        class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
      >
        <div class="card-body">
          <h2 class="card-title">
            {{ poi.name }}
            <div class="badge" :class="getCategoryClass(poi.category)">
              {{ poi.category.replace('_', ' ') }}
            </div>
          </h2>
          
          <p class="text-sm opacity-70">{{ poi.description }}</p>
          
          <div class="text-xs opacity-50 mt-2">
            📍 {{ (poi.coordinates as [number, number])[0].toFixed(4) }}, {{ (poi.coordinates as [number, number])[1].toFixed(4) }}
          </div>
          
          <div class="card-actions justify-end mt-4">
            <button 
              @click="showOnMap(poi)"
              class="btn btn-primary btn-sm"
            >
              Show on Map
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
