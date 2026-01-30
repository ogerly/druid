<script setup lang="ts">
import { usePois } from '@/composables/usePois';
import { useMapStore } from '@/stores/mapStore';
import { useRouter } from 'vue-router';

const { pois } = usePois();
const mapStore = useMapStore();
const router = useRouter();

const showOnMap = (poi: any) => {
  mapStore.selectPoi(poi.id, poi.coordinates);
  router.push('/');
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    stone_circle: 'badge-primary',
    burial_mound: 'badge-secondary',
    sacred_grove: 'badge-accent',
    ritual_site: 'badge-info',
  };
  return colors[category] || 'badge-neutral';
};
</script>

<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6">Places of Interest</h1>
    
    <div class="grid gap-4 md:grid-cols-2">
      <div 
        v-for="poi in pois" 
        :key="poi.id"
        class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
      >
        <div class="card-body">
          <h2 class="card-title">
            {{ poi.name }}
            <div class="badge" :class="getCategoryColor(poi.category)">
              {{ poi.category.replace('_', ' ') }}
            </div>
          </h2>
          
          <p class="text-sm opacity-70">{{ poi.description }}</p>
          
          <div class="text-xs opacity-50 mt-2">
            📍 {{ poi.coordinates[0].toFixed(4) }}, {{ poi.coordinates[1].toFixed(4) }}
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
