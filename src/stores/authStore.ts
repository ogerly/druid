import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import axios from 'axios';

// Definiert den Store für die Authentifizierung
export const useAuthStore = defineStore('auth', () => {
  // State: Speichert den aktuellen Benutzer. Null, wenn nicht eingeloggt.
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Speichert den Benutzer im LocalStorage, wenn er sich ändert.
  watch(user, (newUser) => {
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  });

  /**
   * Holt den aktuellen Benutzer vom Backend.
   * Nützlich, um die Session bei einem Neuladen der Seite zu überprüfen.
   */
  async function fetchUser() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.get('/api/auth/user');
      user.value = data;
    } catch (e) {
      user.value = null; // Wenn der API-Call fehlschlägt, ist der Benutzer nicht eingeloggt
    }
    loading.value = false;
  }

  /**
   * Meldet den Benutzer mit E-Mail und Passwort an, indem der Backend-Endpunkt aufgerufen wird.
   */
  async function signInWithPassword(email: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.post('/api/auth/signin', { email, password });
      user.value = data.user;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Anmeldung fehlgeschlagen.';
      user.value = null;
    }
    loading.value = false;
  }

  /**
   * Meldet den Benutzer ab, indem der Backend-Endpunkt aufgerufen wird.
   */
  async function signOut() {
    loading.value = true;
    error.value = null;
    try {
      await axios.post('/api/auth/signout');
      user.value = null;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Abmeldung fehlgeschlagen.';
    }
    loading.value = false;
  }

  return {
    user,
    loading,
    error,
    fetchUser,
    signInWithPassword,
    signOut,
  };
});
