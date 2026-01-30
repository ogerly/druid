<template>
  <dialog ref="modalRef" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">Neuen Marker erstellen</h3>
      
      <form @submit.prevent="handleSubmit">
        <!-- Koordinaten Anzeige -->
        <div class="alert alert-info mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <div class="text-xs">Koordinaten</div>
            <div class="font-mono text-sm">{{ formatCoords(position) }}</div>
          </div>
        </div>

        <!-- Name/Label -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Name (optional)</span>
          </label>
          <input 
            v-model="formData.label" 
            type="text" 
            placeholder="z.B. Parkplatz, Aussichtspunkt..."
            class="input input-bordered w-full"
            autofocus
          />
        </div>

        <!-- Beschreibung -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Beschreibung (optional)</span>
          </label>
          <textarea 
            v-model="formData.description"
            placeholder="Notizen zu diesem Ort..."
            class="textarea textarea-bordered h-20"
          ></textarea>
        </div>

        <!-- Kategorie -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Kategorie</span>
          </label>
          <select v-model="formData.category" class="select select-bordered w-full">
            <option value="personal">Persönlich</option>
            <option value="waypoint">Wegpunkt</option>
            <option value="parking">Parkplatz</option>
            <option value="campsite">Campingplatz</option>
            <option value="photo-spot">Foto-Spot</option>
            <option value="danger">Achtung/Gefahr</option>
            <option value="other">Sonstiges</option>
          </select>
        </div>

        <!-- Buttons -->
        <div class="modal-action">
          <button type="button" @click="handleCancel" class="btn">
            Abbrechen
          </button>
          <button type="submit" class="btn btn-primary">
            Marker speichern
          </button>
        </div>
      </form>
    </div>
    
    <!-- Backdrop to close -->
    <form method="dialog" class="modal-backdrop">
      <button type="button" @click="handleCancel">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

interface Props {
  position: [number, number];
}

interface Emits {
  (e: 'save', data: { label?: string; description?: string; category: string }): void;
  (e: 'cancel'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const modalRef = ref<HTMLDialogElement | null>(null);

const formData = reactive({
  label: '',
  description: '',
  category: 'personal'
});

const formatCoords = (coords: [number, number]) => {
  return `${coords[0].toFixed(6)}°, ${coords[1].toFixed(6)}°`;
};

const showModal = () => {
  modalRef.value?.showModal();
};

const hideModal = () => {
  modalRef.value?.close();
};

const handleSubmit = () => {
  emit('save', {
    label: formData.label || undefined,
    description: formData.description || undefined,
    category: formData.category
  });
  resetForm();
  hideModal();
};

const handleCancel = () => {
  emit('cancel');
  resetForm();
  hideModal();
};

const resetForm = () => {
  formData.label = '';
  formData.description = '';
  formData.category = 'personal';
};

// Expose methods for parent component
defineExpose({
  showModal,
  hideModal
});
</script>

<style scoped>
.modal-box {
  max-width: 500px;
}
</style>
