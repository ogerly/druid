import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // Import router

// Import Leaflet CSS globally
import 'leaflet/dist/leaflet.css';

// FIX: Set up Leaflet's default icon path
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

const app = createApp(App);
app.use(router); // Use router
app.mount('#app');
