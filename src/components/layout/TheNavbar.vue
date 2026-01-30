<template>
  <div class="navbar bg-base-300 shadow-lg">
    <div class="navbar-start">
      <!-- Leer lassen oder Logo -->
    </div>
    <div class="navbar-center">
      <a class="btn btn-ghost normal-case text-xl font-bold font-serif">DRUID</a>
    </div>
    <div class="navbar-end gap-1">
      <button class="btn btn-ghost btn-circle" @click="emit('center-on-user')" title="Center on Me">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      </button>
      <button class="btn btn-ghost btn-circle" @click="emit('toggle-recording')" :class="{ 'text-red-500': isRecording }" title="Start/Stop Recording">
        <div class="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="2" /><circle v-if="isRecording" cx="12" cy="12" r="3" fill="currentColor" /></svg>
          <span v-if="isRecording" class="indicator-item badge badge-secondary badge-xs"></span>
        </div>
      </button>
       <button class="btn btn-ghost btn-circle" @click="emit('clear-path')" title="Clear Path">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isRecording: Boolean
});
const emit = defineEmits(['center-on-user', 'toggle-recording', 'clear-path']);
</script>
