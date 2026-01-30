<template>
  <div class="sidebar">
    <h3>Add a New Place</h3>
    <form @submit.prevent="savePlace">
      <div>
        <label>Coordinates</label>
        <input type="text" :value="formattedCoordinates" disabled>
      </div>
      <div>
        <label for="description">Description</label>
        <textarea id="description" v-model="description" required></textarea>
      </div>
      <div class="actions">
        <button type="submit">Save</button>
        <button type="button" @click="closeSidebar">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePlacesStore } from '../stores/places';

const props = defineProps({
  coordinates: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

const placesStore = usePlacesStore();
const description = ref('');

const formattedCoordinates = computed(() => {
  if (!props.coordinates) return '';
  return `${props.coordinates.lat.toFixed(6)}, ${props.coordinates.lng.toFixed(6)}`;
});

const savePlace = () => {
  if (!description.value) return;

  placesStore.addPlace({
    coordinates: props.coordinates,
    description: description.value,
  });

  closeSidebar();
};

const closeSidebar = () => {
  emit('close');
};
</script>

<style scoped>
.sidebar {
  position: absolute;
  top: 60px; /* Position below the navbar */
  right: 0;
  width: 300px;
  height: calc(100% - 60px); /* Adjust height to fill remaining space */
  background: white;
  padding: 20px;
  box-shadow: -2px 0 5px rgba(0,0,0,0.1);
  z-index: 1050; /* Above map, below navbar */
  display: flex;
  flex-direction: column;
}

h3 {
  margin-top: 0;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.actions {
  display: flex;
  justify-content: space-between;
}
</style>
