import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabaseClient'; // Import our centralized Supabase client
import type { User } from '@supabase/supabase-js';

// Define the store for authentication
export const useAuthStore = defineStore('auth', () => {
  // State: holds the current user. Null if not logged in.
  const user = ref<User | null>(null);
  const loading = ref(true); // Start with loading true until the session is checked.

  /**
   * Sets up the listener for Supabase authentication state changes.
   * This is the core of our authentication system.
   */
  const initializeAuthListener = () => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth Event:', event);
      const currentUser = session?.user || null;
      user.value = currentUser;
      
      // Important: Stop loading only after the initial session check is complete.
      // The INITIAL_SESSION event is the one we wait for on page load.
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        loading.value = false;
      }
    });
  };

  /**
   * Logs the user out by calling Supabase.
   * The onAuthStateChange listener will automatically handle setting the user to null.
   */
  async function signOut() {
    loading.value = true;
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
    // No need to set user.value to null here, the listener will do it.
    loading.value = false;
  }

  // When the store is first used, immediately set up the listener.
  initializeAuthListener();

  return {
    user,
    loading,
    signOut,
  };
});
