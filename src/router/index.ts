import { createRouter, createWebHistory } from 'vue-router';
import MapView from '../views/MapView.vue';

const routes = [
  {
    path: '/',
    name: 'Map',
    component: MapView
  },
  {
    path: '/places',
    name: 'Places',
    // lazy-loaded component
    component: () => import('../views/PlacesView.vue')
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../views/CalendarView.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
