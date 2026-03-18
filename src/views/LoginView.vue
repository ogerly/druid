<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-full max-w-sm shadow-2xl bg-base-100">
      <div class="card-body">
        <h1 class="text-2xl font-bold text-center mb-4">Anmelden oder Registrieren</h1>
        <p class="text-center mb-6">Gib deine E-Mail-Adresse ein, um einen Magic Link für den Zugang zu erhalten.</p>
        <form @submit.prevent="handleLogin">
          <div class="form-control">
            <label class="label">
              <span class="label-text">E-Mail</span>
            </label>
            <input 
              type="email" 
              placeholder="deine.email@example.com" 
              class="input input-bordered" 
              v-model="email"
              :disabled="loading"
              required
            />
          </div>
          <div class="form-control mt-6">
            <button class="btn btn-primary" type="submit" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner"></span>
              <span v-else>Magic Link anfordern</span>
            </button>
          </div>
        </form>
        <div v-if="message" class="alert alert-success mt-4">
          <span>{{ message }}</span>
        </div>
        <div v-if="error" class="alert alert-error mt-4">
          <span>{{ error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient'; // KORREKTER IMPORT

const router = useRouter();
const email = ref('');
const loading = ref(false);
const message = ref('');
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  message.value = '';
  error.value = '';

  try {
    const response = await fetch('/api/auth/magic-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ein Fehler ist aufgetreten.');
    }

    message.value = data.message || 'Prüfe dein Postfach für den Magic Link!';

  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

// Lifecycle hook, der ausgeführt wird, wenn die Komponente geladen wird.
onMounted(() => {
  // Lausche auf Änderungen des Authentifizierungsstatus.
  supabase.auth.onAuthStateChange((event, session) => {
    // Das 'SIGNED_IN'-Event wird ausgelöst, nachdem der Benutzer
    // auf den Magic Link geklickt hat und zur App zurückkehrt.
    if (event === 'SIGNED_IN') {
      console.log('✅ User signed in, redirecting...');
      // Leite den Benutzer zur Hauptansicht (oder einer anderen geschützten Seite) weiter.
      router.push('/');
    }
  });
});
</script>

<style scoped>
/* Optional: Spezifische Styles für die Login-Ansicht können hier hinzugefügt werden */
</style>
