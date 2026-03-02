# Navigation-Konsolidierung & Tracking-Integration

**Datum:** 2025-01-08  
**Update:** 2026-01-31  
**Status:** ✅ Abgeschlossen  
**Phase:** PWA Phase 1 - Architecture Simplification

## Problem

### 1. Navigation Maintenance Issue
- Sidebar und Bottom Navigation hatten **duplicate arrays** für Nav-Links
- Änderungen mussten an **zwei Stellen** vorgenommen werden
- **Hohes Risiko** für Inkonsistenzen zwischen Desktop und Mobile

### 2. Route Fragmentation
- Separate `/tracking` Route mit TrackingView.vue
- TrackingView war nur ein **Wrapper** um MapView + TrackingControl
- **Duplicate Map-Rendering** (ineffizient)
- **Fragmentierte UX:** Nutzer müssen zwischen Map und Tracking wechseln
- **5 Navigation-Punkte** in Mobile Bottom Nav (zu viele für mobile UX)

## Lösung

### Phase 1: Zentrale Navigation-Konfiguration

**Datei:** `src/config/navigation.ts`

```typescript
/**
 * Zentrale Navigation-Konfiguration
 * ⚠️ WICHTIG: Diese Datei ist die EINZIGE Quelle für Navigation-Links!
 */

export interface NavLink {
  name: string;
  path: string;
  icon: string;
  description?: string;
}

export const navLinks: NavLink[] = [
  { name: 'Map', path: '/', icon: 'map', description: 'Karte mit POIs, Markern und GPS-Tracking' },
  { name: 'Places', path: '/places', icon: 'list' },
  { name: 'Calendar', path: '/calendar', icon: 'calendar' },
  { name: 'Profile', path: '/profile', icon: 'user' }
];

export const settingsLink: NavLink = {
  name: 'Settings',
  path: '/settings',
  icon: 'settings'
};
```

**Vorteile:**
- ✅ **Single Source of Truth**
- ✅ TypeScript-Interface für Type Safety
- ✅ Automatische Synchronisation zwischen Sidebar und Bottom Nav
- ✅ Einfache Wartbarkeit

### Phase 2: Route Consolidation

**Entfernt:**
- ❌ `/tracking` Route aus `router/index.ts`
- ❌ `TrackingView.vue` (gelöscht)
- ❌ "Track" Link aus Navigation

**Integration:**
- ✅ TrackingControl direkt in MapView.vue integriert
- ✅ Floating Button für Tracking Toggle (rechts oben)
- ✅ Floating Panel mit TrackingControl (unten zentriert)

## Implementierung

### 1. MapView.vue - Tracking Integration

**Template:**
```vue
<template>
  <div class="w-full h-full relative">
    <!-- Leaflet Map -->
    <l-map>...</l-map>
    
    <!-- Tracking Toggle Button (Floating) -->
    <button
      @click="showTrackingPanel = !showTrackingPanel"
      class="btn btn-circle btn-lg shadow-xl absolute top-20 right-4 z-[400]"
      :class="mapStore.isRecording ? 'btn-error' : 'btn-primary'"
    >
      <vue-feather :type="mapStore.isRecording ? 'square' : 'activity'" size="24" />
    </button>
    
    <!-- Tracking Control Panel (Floating) -->
    <div
      v-if="showTrackingPanel"
      class="absolute bottom-20 lg:bottom-4 left-1/2 transform -translate-x-1/2 z-[500] w-11/12 max-w-md"
    >
      <TrackingControl />
    </div>
  </div>
</template>
```

**Script:**
```typescript
import TrackingControl from '@/components/TrackingControl.vue';
import VueFeather from 'vue-feather';

const showTrackingPanel = ref(false);
```

**Z-Index Hierarchy:**
- `z-[1]` - Leaflet Map
- `z-[400]` - Tracking Toggle Button
- `z-[500]` - Tracking Control Panel

### 2. TheSidebar.vue - Settings Link

**Vorher:** Nur navLinks (Map, Track, Places, Calendar, Profile)  
**Nachher:** navLinks + settingsLink (Settings nur Desktop)

```vue
<script setup>
import { navLinks, settingsLink } from '@/config/navigation';
</script>

<template>
  <ul class="menu">
    <li v-for="link in navLinks" :key="link.name">...</li>
    <!-- Settings Link (nur Desktop) -->
    <li>
      <router-link :to="settingsLink.path">
        <vue-feather :type="settingsLink.icon" />
        {{ settingsLink.name }}
      </router-link>
    </li>
  </ul>
</template>
```

### 3. Router - Simplified Routes

**Vorher (6 Routes):**
```typescript
const routes = [
  { path: '/', name: 'Map', ... },
  { path: '/tracking', name: 'Tracking', ... },  // ❌ Entfernt
  { path: '/places', ... },
  { path: '/calendar', ... },
  { path: '/profile', ... },
  { path: '/settings', ... }
];
```

**Nachher (5 Routes):**
```typescript
const routes = [
  { path: '/', name: 'Map', ... },
  { path: '/places', ... },
  { path: '/calendar', ... },
  { path: '/profile', ... },
  { path: '/settings', ... }
];
```

## Vorteile der Konsolidierung

### UX Improvements
1. **Unified Map Experience**  
   Alle Funktionen (POIs, Markers, Tracking) auf EINER Karte
   
2. **Einfachere Navigation**  
   Mobile Bottom Nav: 4 Buttons statt 5  
   Mehr Platz pro Button (bessere Touch-Targets)
   
3. **Kontextuelle Controls**  
   Tracking-Controls nur sichtbar wenn auf Map  
   Reduziert cognitive load
   
4. **Mobile-First**  
   Floating Button (rechts oben) für schnellen Zugriff  
   Panel erscheint nur on-demand (mehr Screen Space für Map)

### Technical Improvements
1. **No Duplicate Rendering**  
   Nur EINE Map-Instanz (nicht mehr separate in TrackingView)
   
2. **Better State Management**  
   mapStore.activeTrack ist direkt an Map gebunden  
   Live-Updates von Polyline während Tracking
   
3. **Maintainability**  
   Navigation: Single source of truth  
   Weniger Komponenten (TrackingView gelöscht)
   
4. **Performance**  
   Weniger Route-Transitions  
   Leaflet-Map bleibt mounted (kein Re-Init beim Wechsel)

## Breaking Changes

### ⚠️ URL-Änderung
- `/tracking` URL ist **nicht mehr verfügbar**
- Tracking-Funktionen jetzt über **Floating Button** auf Map (`/`)

### Migration für Nutzer
- Kein Breaking Change für installierte PWAs (Manifest unverändert)
- Bookmark auf `/tracking` führt zu 404 → Nutzer gehen zu `/`
- Shortcut im Manifest zeigt weiterhin auf `/map?action=start-tracking` (wird später implementiert)

## Nächste Schritte

### Phase 2 (Optional)
- [ ] Query Parameter Support: `/map?action=start-tracking`  
      → Automatisches Öffnen des Tracking-Panels via URL
      
- [ ] Deep Link für PWA Shortcut:  
      → "Start Tracking" Shortcut in Manifest funktionsfähig machen

### Phase 3: Enhanced UI
- [ ] Navbar Integration für Desktop (TheNavbar.vue)  
      → Tracking Start/Stop auch in Desktop-Navbar anzeigen
      
- [ ] Keyboard Shortcuts:  
      → `T` = Toggle Tracking Panel  
      → `Space` = Start/Stop Tracking (wenn Panel offen)

### Phase 4: State Persistence
- [ ] LocalStorage: `showTrackingPanel` State speichern  
      → Nutzer-Präferenz persistieren zwischen Sessions

## Learnings

### Architecture Decision
**Problem:** Feature-based Routing (separate routes für Map, Tracking, Places)  
**Solution:** Context-based UI (eine Map mit kontextuellen Controls)

**Rationale:**
- Mobile-First: Weniger Navigation = bessere UX
- Fokussierte Experience: Alles auf einer Seite
- Progressive Disclosure: Controls erscheinen on-demand

### Design Pattern
**From:** Separate Views für separate Features  
**To:** Single View mit Feature-Toggles

**Vergleich mit nativen Apps:**
- ✅ Google Maps: Eine Karte mit Floating Controls
- ✅ Komoot: Track-Recording direkt auf Map
- ❌ Separate Tracking-Screen (unüblich in Navigation-Apps)

### Mobile UX Principle
> "Minimize navigation, maximize context"

**Angewandt:**
- Tracking ist KEIN eigenständiges Feature → gehört zur Map
- Settings ist KEIN Hauptfeature → nur in Sidebar (nicht Mobile Bottom Nav)
- 4 Hauptfunktionen reichen für Bottom Nav (Map, Places, Calendar, Profile)

## Testing Checklist

- [x] Navigation Links synchron (Sidebar + Bottom Nav)
- [x] `/tracking` Route entfernt
- [x] TrackingView.vue gelöscht
- [x] TrackingControl in MapView integriert
- [x] Floating Button entfernt (2026-01-31)
- [x] Tracking Button in Navbar integriert (2026-01-31)
- [x] Recording Button entfernt (2026-01-31)
- [x] Settings aus Navigation entfernt (2026-01-31)
- [x] Settings über Navbar erreichbar (2026-01-31)
- [x] Navbar auf allen Seiten sichtbar (2026-01-31)
- [x] Kontextabhängige Navbar-Controls (2026-01-31)
- [x] PWA Development Setup (sw.dev.js, manifest.dev.json) (2026-01-31)
- [x] Z-Index korrekt (Panel über Map, unter Bottom Nav)
- [x] Mobile: Panel positioniert über Bottom Nav (`bottom-20`)
- [x] Desktop: Panel positioniert unten (`bottom-4`)
- [x] TypeScript Compilation (bekannte Errors: Store-Imports)

## Update 2026-01-31: Navbar als Untermenü-System

### Weitere Optimierungen

**1. Settings aus Hauptnavigation entfernt**
- ❌ Nicht mehr in Mobile Bottom Nav (4 statt 5 Buttons)
- ❌ Nicht mehr in Desktop Sidebar
- ✅ Nur noch über Navbar erreichbar (kontextabhängig)

**2. Navbar auf allen Seiten aktiv**

**Vorher:**
- Navbar nur auf `/` (Map) sichtbar
- Andere Seiten: Keine Navbar

**Nachher:**
- Navbar auf ALLEN Seiten sichtbar
- **Kontextabhängige Controls:**
  - `/` (Map) → GPS, Tracking, Clear Path
  - Alle anderen → Settings Icon

```vue
// App.vue
const showMapControls = computed(() => route.path === '/');
const showSettingsControl = computed(() => route.path !== '/');
```

**3. Tracking-Integration optimiert**

**Entfernt:**
- ❌ Floating Button (rechts oben auf Karte)
- ❌ Recording Button (Duplikat zu Tracking)

**Hinzugefügt:**
- ✅ Tracking Button in Navbar (Blitz-Icon)
- ✅ Animierter Ping-Indicator bei aktivem Tracking
- ✅ Panel-State über Parent (App.vue) verwaltet

```vue
<!-- TheNavbar.vue -->
<button 
  class="btn btn-ghost btn-circle" 
  @click="emit('toggle-tracking')" 
  :class="{ 'text-error': isTracking }"
>
  <svg><!-- Blitz-Icon --></svg>
  <span v-if="isTracking" class="absolute top-1 right-1 flex h-3 w-3">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
    <span class="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
  </span>
</button>
```

**4. Navigation finale Struktur**

**Mobile Bottom Nav (4 Buttons):**
- Map
- Places
- Calendar
- Profile

**Desktop Sidebar (4 Links):**
- Map
- Places
- Calendar
- Profile

**Navbar (kontextabhängig):**
- Auf `/`: GPS + Tracking + Clear
- Auf anderen: Settings Icon

### PWA Development vs Production Setup

**Problem:** Hardcoded `/druid/` Pfade funktionierten nicht lokal

**Lösung:** Environment-basierte Konfiguration

**Development (localhost):**
```javascript
// sw.dev.js - ohne /druid/ prefix
const CACHE_NAME = 'druid-dev-v1';
const urlsToCache = ['/', '/index.html', '/manifest.dev.json'];
```

**manifest.dev.json:**
```json
{
  "start_url": "/",
  "scope": "/",
  "icons": [{ "src": "/icons/icon-192.png", ... }]
}
```

**Production (GitHub Pages):**
```javascript
// sw.js - mit /druid/ prefix
const CACHE_NAME = 'druid-v1';
const urlsToCache = ['/druid/', '/druid/index.html', '/druid/manifest.json'];
```

**manifest.json:**
```json
{
  "start_url": "/druid/",
  "scope": "/druid/",
  "icons": [{ "src": "/druid/icons/icon-192.png", ... }]
}
```

**Automatische Auswahl:**
```javascript
// main.ts
const isDev = window.location.hostname === 'localhost' || 
              window.location.hostname === '127.0.0.1';
const base = isDev ? '/' : '/druid/';
const swFile = isDev ? 'sw.dev.js' : 'sw.js';
```

```html
<!-- index.html -->
<script>
  if (window.location.hostname === 'localhost') {
    document.getElementById('manifest-link').href = '/manifest.dev.json';
  }
</script>
```

## Finale Architektur

### Navigation-Hierarchie

```
┌─────────────────────────────────────────┐
│         Navbar (Kontext-Untermenü)      │
│  Map: GPS + Tracking + Clear            │
│  Andere: Settings                       │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│                                         │
│          Main Content Area              │
│        (Router View: /)                 │
│                                         │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│     Mobile Bottom Nav (Hauptmenü)       │
│  Map | Places | Calendar | Profile      │
└─────────────────────────────────────────┘
```

### Button-Verteilung

| Feature | Mobile Bottom | Desktop Sidebar | Navbar |
|---------|---------------|-----------------|--------|
| Map | ✅ | ✅ | - |
| Places | ✅ | ✅ | - |
| Calendar | ✅ | ✅ | - |
| Profile | ✅ | ✅ | - |
| Settings | ❌ | ❌ | ✅ (auf Unterseiten) |
| GPS | ❌ | ❌ | ✅ (auf Map) |
| Tracking | ❌ | ❌ | ✅ (auf Map) |
| Clear Path | ❌ | ❌ | ✅ (auf Map) |

**Total Buttons:**
- Mobile Bottom Nav: 4 (weniger = bessere Touch-Targets)
- Desktop Sidebar: 4 (fokussierte Hauptfunktionen)
- Navbar: 1-3 (kontextabhängig)

## Commit Message

```
refactor(navigation): consolidate tracking into unified map experience

BREAKING CHANGE: Remove /tracking route, integrate TrackingControl into MapView

- Create centralized navigation config (src/config/navigation.ts)
- Remove duplicate nav arrays from Sidebar and App.vue
- Delete TrackingView.vue (obsolete wrapper component)
- Add floating tracking controls to MapView
- Simplify navigation: 4 main routes instead of 5
- Improve mobile UX: more space in bottom nav, contextual controls

Rationale: Mobile-first architecture - minimize navigation, maximize context.
All map-related features (POIs, markers, tracking) now unified on single map.
```

## References

- [Navigation Config](../config/navigation.ts)
- [MapView Integration](../views/MapView.vue)
- [TrackingControl Component](../components/TrackingControl.vue)
- [Router Config](../router/index.ts)
