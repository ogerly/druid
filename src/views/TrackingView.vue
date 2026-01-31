<script setup lang="ts">
import TrackingControl from '@/components/TrackingControl.vue';
import MapView from './MapView.vue';
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Map Section (uses shared MapView) -->
    <div class="flex-1 relative">
      <MapView />
    </div>

    <!-- Tracking Control Section (bottom panel) -->
    <div class="bg-base-200 p-4 border-t border-base-300">
      <div class="container mx-auto max-w-4xl">
        <TrackingControl />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure map fills available space */
.flex-1 {
  position: relative;
  overflow: hidden;
}
</style>
