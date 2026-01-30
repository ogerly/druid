<template>
  <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
    <!-- Sidebar content here -->
    <li><a class="text-xl font-bold font-serif">DRUID</a></li>
    <li v-for="link in navLinks" :key="link.name">
      <router-link :to="link.path" @click="closeSidebar">
        <vue-feather :type="link.icon" class="nav-icon" />
        {{ link.name }}
      </router-link>
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue';
import VueFeather from 'vue-feather';

const emit = defineEmits(['close']);

const navLinks = ref([
  { name: 'Map', path: '/', icon: 'map' },
  { name: 'Track', path: '/tracking', icon: 'activity' },
  { name: 'Places', path: '/places', icon: 'list' },
  { name: 'Calendar', path: '/calendar', icon: 'calendar' },
  { name: 'Profile', path: '/profile', icon: 'user' },
]);

const closeSidebar = () => {
  emit('close');
};
</script>
