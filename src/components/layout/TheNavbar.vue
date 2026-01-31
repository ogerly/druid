<template>
  <div class="navbar bg-base-300 shadow-lg">
    <div class="navbar-start">
      <!-- Leer lassen oder Logo -->
    </div>
    <div class="navbar-center">
      <a class="btn btn-ghost normal-case text-xl font-bold font-serif">DRUID</a>
    </div>
    <div class="navbar-end gap-1">
      <!-- Map Controls (nur auf /) -->
      <template v-if="showMapControls">
        <button class="btn btn-ghost btn-circle" @click="emit('center-on-user')" title="Center on Me">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
        
        <!-- Tracking Toggle Button -->
        <button 
          class="btn btn-ghost btn-circle" 
          @click="emit('toggle-tracking')" 
          :class="{ 'text-error': isTracking }" 
          title="GPS Tracking"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span v-if="isTracking" class="absolute top-1 right-1 flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
          </span>
        </button>
        
        <button class="btn btn-ghost btn-circle" @click="emit('clear-path')" title="Clear Path">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </template>
      
      <!-- Settings Control (auf anderen Routes) -->
      <template v-if="showSettingsControl">
        <button class="btn btn-ghost btn-circle" @click="emit('go-to-settings')" title="Settings">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  showMapControls: Boolean,
  showSettingsControl: Boolean,
  isTracking: Boolean
});
const emit = defineEmits(['center-on-user', 'toggle-tracking', 'clear-path', 'go-to-settings']);
</script>
