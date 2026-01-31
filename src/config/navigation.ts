/**
 * Zentrale Navigation-Konfiguration
 * 
 * ⚠️ WICHTIG: Diese Datei ist die EINZIGE Quelle für Navigation-Links!
 * 
 * Verwendet von:
 * - src/components/layout/TheSidebar.vue (Desktop Sidebar)
 * - src/App.vue (Mobile Bottom Navigation)
 * 
 * Beim Hinzufügen/Ändern/Entfernen von Navigation-Items:
 * ✅ NUR HIER ÄNDERN - beide Menüs werden automatisch aktualisiert!
 * ❌ NICHT in TheSidebar.vue oder App.vue direkt ändern!
 */

export interface NavLink {
  name: string;
  path: string;
  icon: string;
  description?: string;
}

/**
 * Haupt-Navigation Links
 * Reihenfolge bestimmt die Anzeige in Sidebar und Bottom Nav
 */
export const navLinks: NavLink[] = [
  {
    name: 'Map',
    path: '/',
    icon: 'map',
    description: 'Karte mit POIs, Markern und GPS-Tracking'
  },
  {
    name: 'Places',
    path: '/places',
    icon: 'list',
    description: 'Liste aller Points of Interest'
  },
  {
    name: 'Tracks',
    path: '/tracks',
    icon: 'activity',
    description: 'Meine GPS-Wanderungen'
  },
  {
    name: 'Calendar',
    path: '/calendar',
    icon: 'calendar',
    description: 'Kalender für Touren'
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: 'user',
    description: 'Benutzerprofil und Statistiken'
  }
];

/**
 * Settings-Link (nur in Sidebar, nicht in Mobile Bottom Nav)
 */
export const settingsLink: NavLink = {
  name: 'Settings',
  path: '/settings',
  icon: 'settings',
  description: 'App-Einstellungen'
};
