<template>
  <div :class="['sidebar-container', { 'is-open': isOpen }]">
    <div class="sidebar-backdrop" @click="emit('close')"></div>
    <aside class="sidebar">
      <div class="sidebar-header">
        <h3>Menu</h3>
      </div>
      <ul class="nav-links">
        <li><a href="#">Profile</a></li>
        <li><a href="#">My Paths</a></li>
        <li><a href="#">Settings</a></li>
        <li><a href="#">Logout</a></li>
      </ul>
    </aside>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close']);
</script>

<style scoped>
.sidebar-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1200;
  pointer-events: none; /* Allow clicks to pass through when closed */
}

.sidebar-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  width: 280px;
  height: 100%;
  background-color: #2c3e50;
  color: #ecf0f1;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
}

.sidebar-container.is-open {
  pointer-events: auto; /* Enable clicks when open */
}

.sidebar-container.is-open .sidebar-backdrop {
  opacity: 1;
}

.sidebar-container.is-open .sidebar {
  transform: translateX(0);
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #34495e;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.8rem;
}

.nav-links {
  list-style: none;
  padding: 1rem 0;
  margin: 0;
}

.nav-links li a {
  display: block;
  padding: 1rem 1.5rem;
  color: #ecf0f1;
  text-decoration: none;
  font-size: 1.1rem;
  transition: background-color 0.2s;
}

.nav-links li a:hover {
  background-color: #34495e;
}
</style>
