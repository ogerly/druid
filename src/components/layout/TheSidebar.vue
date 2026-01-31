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
import VueFeather from 'vue-feather';
import { navLinks } from '@/config/navigation';

/**
 * ⚠️ WICHTIG: Navigation-Links werden aus @/config/navigation.ts importiert!
 * Änderungen an der Navigation NUR DORT vornehmen.
 */

const emit = defineEmits(['close']);

const closeSidebar = () => {
  emit('close');
};
</script>
