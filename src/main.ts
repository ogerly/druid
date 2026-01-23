import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

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

createApp(App).mount('#app')
