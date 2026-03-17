import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from './router'; // it will automatically look for index.ts

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount('#app');

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Use different SW for dev vs production
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const base = '/'; // Correct base path for both dev and prod
    const swFile = isDev ? 'sw.dev.js' : 'sw.js';
    const swPath = `${base}${swFile}`;
    
    navigator.serviceWorker
      .register(swPath, { scope: base })
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);
        console.log('🔧 Environment:', isDev ? 'Development' : 'Production');
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 New version available! Reload to update.');
                // Optional: Show update notification to user
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
        console.error('🔍 SW Path:', swPath);
      });
  });
}
