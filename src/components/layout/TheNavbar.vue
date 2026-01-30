<template>
  <div class="navbar bg-base-300 shadow-lg">
    <div class="navbar-start">
      <label for="my-drawer-2" class="btn btn-square btn-ghost drawer-button lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </label>
    </div>
    <div class="navbar-center">
      <a class="btn btn-ghost normal-case text-xl font-bold font-serif">DRUID</a>
    </div>
    <div class="navbar-end">
      <button class="btn btn-ghost btn-circle" @click="emit('center-on-user')" title="Center on Me">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
      </button>
      <button class="btn btn-ghost btn-circle" @click="emit('toggle-recording')" :class="{ 'text-red-500': isRecording }" title="Start/Stop Recording">
        <div class="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.55 13.41A6.5 6.5 0 1113.41 15.55L12 12l3.55 1.41z" /></svg>
          <span v-if="isRecording" class="indicator-item badge badge-secondary badge-xs"></span>
        </div>
      </button>
       <button class="btn btn-ghost btn-circle" @click="emit('clear-path')" title="Clear Path">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isRecording: Boolean
});
const emit = defineEmits(['toggle-sidebar', 'center-on-user', 'toggle-recording', 'clear-path']);
</script>
