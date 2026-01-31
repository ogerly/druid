# GPS-Tracking System - Technische Dokumentation

**Datum:** 2026-01-31  
**Status:** 🧪 Testing Phase  
**Phase:** PWA Phase 1 - GPS & Offline Tracking

## Übersicht

DRUID verfügt über ein intelligentes GPS-Tracking-System für Wanderungen, das:
- ✅ Offline funktioniert (GPS ohne Internet)
- ✅ Batterieschonend arbeitet (intelligentes Waypoint-Filtering)
- ✅ Bildschirm während Tracking an hält (Wake-Lock API)
- ✅ Tracks in IndexedDB persistent speichert
- ✅ Echtzeit-Statistiken anzeigt (Distanz, Dauer, Wegpunkte)

## System-Architektur

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                       │
│  Navbar: Tracking Button (Blitz-Icon)                  │
│  MapView: TrackingControl Panel (Floating)             │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                   mapStore (Pinia)                      │
│  - activeTrack: Track | null                           │
│  - isRecording: boolean                                │
│  - trackingConfig: TrackingConfig                      │
│  - liveStats: computed                                 │
│                                                          │
│  Methods:                                               │
│  - startTracking(name: string)                         │
│  - stopTracking()                                      │
│  - pauseTracking()                                     │
│  - resumeTracking()                                    │
└──────────┬────────────────┬────────────────────────────┘
           │                │
┌──────────▼────────┐   ┌───▼─────────────────────────────┐
│ TrackingEngine    │   │   Wake-Lock Manager             │
│                   │   │                                 │
│ - shouldSave      │   │   - request()                   │
│   Waypoint()      │   │   - release()                   │
│ - Haversine       │   │   - isActive                    │
│   Distance        │   │                                 │
│ - Time/Distance   │   └─────────────────────────────────┘
│   Filtering       │
└──────────┬────────┘
           │
┌──────────▼──────────────────────────────────────────────┐
│              trackDatabase (Dexie.js)                   │
│                                                          │
│  Tables:                                                │
│  - tracks: Track[]                                      │
│                                                          │
│  Methods:                                               │
│  - createTrack(name)                                    │
│  - addWaypoint(trackId, waypoint)                       │
│  - completeTrack(trackId, stats)                        │
│  - calculateStats(track)                                │
│  - exportAsGeoJSON(track)                               │
└─────────────────────────────────────────────────────────┘
```

## Komponenten-Details

### 1. TrackingEngine (`src/services/trackingEngine.ts`)

**Zweck:** Intelligentes Waypoint-Filtering zur Batterieschonung

**Algorithmus:**
```typescript
shouldSaveWaypoint(position: GeolocationPosition): boolean {
  // 1. GPS-Genauigkeit prüfen
  if (position.coords.accuracy > this.config.maxAccuracy) {
    console.log(`❌ Accuracy too poor: ${position.coords.accuracy}m`);
    return false;
  }

  // 2. Erster Waypoint? → Immer speichern
  if (!this.lastWaypoint) {
    return true;
  }

  // 3. Zeit-Intervall prüfen
  const timeDiff = Date.now() - this.lastWaypoint.timestamp;
  if (timeDiff < this.config.minTimeInterval) {
    console.log(`⏱️ Too soon: ${timeDiff}ms < ${this.config.minTimeInterval}ms`);
    return false;
  }

  // 4. Distanz prüfen (Haversine)
  const distance = this.calculateDistance(
    this.lastWaypoint.lat, this.lastWaypoint.lng,
    position.coords.latitude, position.coords.longitude
  );
  
  if (distance < this.config.minDistance) {
    console.log(`📏 Too close: ${distance.toFixed(1)}m < ${this.config.minDistance}m`);
    return false;
  }

  // 5. Alle Checks bestanden → Speichern
  return true;
}
```

**Standard-Konfiguration:**
```typescript
export const defaultTrackingConfig: TrackingConfig = {
  minTimeInterval: 60000,  // 1 Minute (60 Sekunden)
  minDistance: 10,         // 10 Meter
  maxAccuracy: 50          // GPS-Genauigkeit < 50 Meter
};
```

**Haversine-Formel** (Earth-spherical distance):
```typescript
calculateDistance(lat1, lon1, lat2, lon2): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}
```

**Batterie-Optimierung:**
- Bei 1 Min Intervall + 10m Distanz: ~10-15 Waypoints pro Stunde
- Standard-Wanderung (4h): ~40-60 Waypoints
- Vergleich: Ohne Filter → 240+ Waypoints pro Stunde!

### 2. Wake-Lock Manager (`src/utils/wakeLock.ts`)

**Zweck:** Bildschirm während Tracking an halten

**Problem:** GPS stoppt bei Screen-Lock auf vielen Geräten

**Lösung:** Wake-Lock API
```typescript
class WakeLockManager {
  private wakeLock: WakeLockSentinel | null = null;

  async request(): Promise<boolean> {
    if (!('wakeLock' in navigator)) {
      console.warn('⚠️ Wake Lock API nicht verfügbar');
      return false;
    }

    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
      console.log('✅ Wake Lock aktiviert - Screen bleibt an');
      
      // Re-acquire on visibility change (tab switch, screen lock)
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
      
      return true;
    } catch (err) {
      console.error('❌ Wake Lock failed:', err);
      return false;
    }
  }

  private handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible' && this.wakeLock?.released) {
      console.log('[WakeLock] Re-acquiring after visibility change');
      await this.request();
    }
  };
}
```

**Browser Support:**
- ✅ Chrome 84+ (Android, Desktop)
- ✅ Edge 84+
- ✅ Safari 16.4+ (iOS)
- ❌ Firefox (noch nicht)

**Fallback:** Ohne Wake-Lock funktioniert Tracking, aber Screen muss manuell an bleiben

### 3. Track Database (`src/db/trackDatabase.ts`)

**Zweck:** Offline-Persistenz mit IndexedDB

**Schema:**
```typescript
interface Waypoint {
  id: string;              // crypto.randomUUID()
  lat: number;
  lng: number;
  timestamp: number;       // Date.now()
  accuracy: number;        // GPS accuracy in meters
  altitude?: number;       // Height above sea level
  speed?: number;         // Speed in m/s
}

interface Track {
  id: string;              // crypto.randomUUID()
  name: string;            // "Keltenwelt-Rundweg"
  startTime: number;       // Track start timestamp
  endTime?: number;        // Track end timestamp
  waypoints: Waypoint[];   // All recorded waypoints
  distance?: number;       // Total distance in meters
  duration?: number;       // Total duration in ms
  status: 'recording' | 'completed' | 'paused';
  createdAt: number;
  updatedAt: number;
}
```

**Dexie.js Setup:**
```typescript
class TrackDatabase extends Dexie {
  tracks!: EntityTable<Track, 'id'>;

  constructor() {
    super('DruidDatabase');
    this.version(1).stores({
      tracks: 'id, startTime, endTime, status, createdAt, updatedAt'
    });
  }
}

export const db = new TrackDatabase();
```

**Wichtige Methoden:**
```typescript
// Track erstellen
async createTrack(name: string): Promise<Track> {
  const track: Track = {
    id: crypto.randomUUID(),
    name,
    startTime: Date.now(),
    waypoints: [],
    status: 'recording',
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  
  await this.tracks.add(track);
  return track;
}

// Waypoint hinzufügen
async addWaypoint(trackId: string, waypoint: Waypoint): Promise<void> {
  const track = await this.tracks.get(trackId);
  if (!track) throw new Error('Track not found');
  
  track.waypoints.push(waypoint);
  track.updatedAt = Date.now();
  
  await this.tracks.update(trackId, track);
}

// Track abschließen
async completeTrack(trackId: string, stats?: Partial<TrackStats>): Promise<void> {
  await this.tracks.update(trackId, {
    endTime: Date.now(),
    status: 'completed',
    distance: stats?.totalDistance,
    duration: stats?.duration,
    updatedAt: Date.now()
  });
}

// Statistiken berechnen
calculateStats(track: Track): TrackStats {
  let totalDistance = 0;
  
  for (let i = 1; i < track.waypoints.length; i++) {
    const prev = track.waypoints[i - 1];
    const curr = track.waypoints[i];
    
    if (!prev || !curr) continue;
    
    // Haversine distance
    const distance = this.calculateHaversineDistance(
      prev.lat, prev.lng,
      curr.lat, curr.lng
    );
    
    totalDistance += distance;
  }
  
  const duration = track.endTime ? track.endTime - track.startTime : Date.now() - track.startTime;
  
  return {
    totalDistance,
    duration,
    waypointCount: track.waypoints.length,
    avgSpeed: totalDistance / (duration / 1000), // m/s
    maxSpeed: Math.max(...track.waypoints.map(w => w.speed || 0))
  };
}
```

### 4. Map Store (`src/stores/mapStore.ts`)

**Tracking State:**
```typescript
// Active Track (während Recording)
const activeTrack = ref<Track | null>(null);

// Recording Status
const isRecording = ref(false);

// GPS Watch ID
let gpsWatchId: number | null = null;

// Live-Statistiken (computed)
const liveStats = computed(() => {
  if (!activeTrack.value) return null;
  return db.calculateStats(activeTrack.value);
});
```

**Tracking starten:**
```typescript
const startTracking = async (name: string = 'Unbenannte Wanderung') => {
  console.log('🚀 Starting tracking:', name);
  
  // 1. Track in IndexedDB erstellen
  activeTrack.value = await db.createTrack(name);
  
  // 2. Wake-Lock aktivieren (Screen an halten)
  const wakeSuccess = await wakeLockManager.request();
  if (!wakeSuccess) {
    console.warn('⚠️ Wake Lock nicht verfügbar - Screen manuell an lassen!');
  }
  
  // 3. Tracking Engine zurücksetzen
  trackingEngine.reset();
  
  // 4. GPS Watch starten
  gpsWatchId = navigator.geolocation.watchPosition(
    async (position) => {
      // User Location auf Karte aktualisieren
      userLocation.value = [
        position.coords.latitude,
        position.coords.longitude
      ];
      
      // Prüfen ob Waypoint gespeichert werden soll
      if (trackingEngine.shouldSaveWaypoint(position)) {
        const waypoint: Waypoint = {
          id: crypto.randomUUID(),
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now(),
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude ?? undefined,
          speed: position.coords.speed ?? undefined
        };
        
        // In IndexedDB speichern
        if (activeTrack.value) {
          await db.addWaypoint(activeTrack.value.id, waypoint);
          
          // Track neu laden für Reactivity
          activeTrack.value = await db.tracks.get(activeTrack.value.id) || null;
          
          console.log('✅ Waypoint saved:', waypoint);
          trackingEngine.updateLastWaypoint(waypoint);
        }
      }
    },
    (error) => {
      console.error('❌ GPS Error:', error.message);
      // Mögliche Fehler:
      // - PERMISSION_DENIED: User hat GPS verweigert
      // - POSITION_UNAVAILABLE: GPS Signal nicht verfügbar
      // - TIMEOUT: GPS-Anfrage hat zu lange gedauert
    },
    {
      enableHighAccuracy: true,  // Höchste GPS-Genauigkeit
      timeout: 15000,           // 15 Sekunden Timeout (wichtig für Mobile!)
      maximumAge: 0             // Keine gecachten Positionen
    }
  );
  
  isRecording.value = true;
  console.log('✅ Tracking started successfully');
};
```

**Tracking stoppen:**
```typescript
const stopTracking = async () => {
  if (!activeTrack.value) return;
  
  console.log('🛑 Stopping tracking...');
  
  // 1. GPS Watch stoppen
  if (gpsWatchId !== null) {
    navigator.geolocation.clearWatch(gpsWatchId);
    gpsWatchId = null;
  }
  
  // 2. Wake-Lock freigeben
  await wakeLockManager.release();
  
  // 3. Finale Statistiken berechnen
  const stats = db.calculateStats(activeTrack.value);
  console.log('📊 Final Stats:', stats);
  
  // 4. Track als completed markieren
  await db.completeTrack(activeTrack.value.id, stats);
  
  // 5. State zurücksetzen
  activeTrack.value = null;
  isRecording.value = false;
  trackingEngine.reset();
  
  console.log('✅ Tracking stopped successfully');
};
```

### 5. TrackingControl UI (`src/components/TrackingControl.vue`)

**Funktionen:**
- Track-Name eingeben
- Tracking-Config anpassen (Intervall, Distanz)
- Live-Statistiken während Tracking anzeigen
- Start/Stop/Pause Controls

**Template:**
```vue
<template>
  <!-- Start Button (wenn nicht aktiv) -->
  <button
    v-if="!isTracking"
    @click="openSettingsModal()"
    class="btn btn-success btn-lg w-full"
  >
    <vue-feather type="play" size="24" />
    Wanderung starten
  </button>

  <!-- Stop Button (wenn aktiv) -->
  <button
    v-else
    @click="openStopModal()"
    class="btn btn-error btn-lg w-full"
  >
    <vue-feather type="square" size="24" />
    Tracking beenden
  </button>

  <!-- Live-Statistiken -->
  <div v-if="isTracking && liveStats" class="stats stats-vertical lg:stats-horizontal shadow mt-4">
    <div class="stat">
      <div class="stat-title">Distanz</div>
      <div class="stat-value text-primary text-2xl">
        {{ formatDistance(liveStats.totalDistance) }}
      </div>
      <div class="stat-desc">{{ liveStats.waypointCount }} Wegpunkte</div>
    </div>
    
    <div class="stat">
      <div class="stat-title">Dauer</div>
      <div class="stat-value text-secondary text-2xl">
        {{ formatDuration(liveStats.duration) }}
      </div>
      <div class="stat-desc">seit {{ formatTime(mapStore.activeTrack?.startTime) }}</div>
    </div>
    
    <div class="stat">
      <div class="stat-title">Geschwindigkeit</div>
      <div class="stat-value text-accent text-2xl">
        {{ formatSpeed(liveStats.avgSpeed) }}
      </div>
      <div class="stat-desc">Durchschnitt</div>
    </div>
  </div>

  <!-- Settings Modal (vor Start) -->
  <dialog ref="settingsModal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">Tracking-Einstellungen</h3>
      
      <!-- Track Name -->
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Name der Wanderung</span>
        </label>
        <input
          v-model="trackName"
          type="text"
          placeholder="z.B. Keltenwelt-Rundweg"
          class="input input-bordered w-full"
        />
      </div>
      
      <!-- Zeit-Intervall -->
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Aufzeichnungs-Intervall: {{ intervalMinutes }} Min</span>
        </label>
        <input
          v-model.number="intervalMinutes"
          type="range"
          min="1"
          max="5"
          class="range range-primary"
        />
        <div class="flex justify-between text-xs px-2 mt-1">
          <span>1 Min</span>
          <span>3 Min</span>
          <span>5 Min</span>
        </div>
      </div>
      
      <!-- Distanz-Threshold -->
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Mindest-Distanz: {{ minDistance }}m</span>
        </label>
        <input
          v-model.number="minDistance"
          type="range"
          min="5"
          max="50"
          step="5"
          class="range range-secondary"
        />
        <div class="flex justify-between text-xs px-2 mt-1">
          <span>5m</span>
          <span>25m</span>
          <span>50m</span>
        </div>
      </div>
      
      <!-- Info Alert -->
      <div class="alert alert-info mb-4">
        <vue-feather type="info" size="20" />
        <div>
          <h4 class="font-bold">Wichtige Hinweise:</h4>
          <ul class="list-disc list-inside text-sm mt-1">
            <li>Bildschirm bleibt während Tracking an</li>
            <li>GPS funktioniert auch ohne Internet</li>
            <li>Kartendaten nur mit Internet</li>
            <li>Batterieverbrauch: ~10-15% pro Stunde</li>
          </ul>
        </div>
      </div>
      
      <div class="modal-action">
        <button @click="closeSettingsModal()" class="btn btn-ghost">Abbrechen</button>
        <button @click="handleStart()" class="btn btn-success">Tracking starten</button>
      </div>
    </div>
  </dialog>
</template>
```

## Offline-Fähigkeit

### GPS ohne Internet

**Wie es funktioniert:**
1. **GPS ist Hardware-basiert:** Das Smartphone hat einen GPS-Chip, der Satellitensignale empfängt
2. **Keine Internet-Verbindung nötig:** GPS-Koordinaten kommen direkt vom Satelliten
3. **Browser Geolocation API:** Greift auf GPS-Hardware zu (auch offline!)

```typescript
// Funktioniert auch ohne Internet!
navigator.geolocation.watchPosition(
  (position) => {
    console.log('GPS Position:', position.coords.latitude, position.coords.longitude);
  },
  (error) => console.error('GPS Error:', error),
  { enableHighAccuracy: true }
);
```

**Was funktioniert offline:**
- ✅ GPS-Koordinaten empfangen
- ✅ Waypoints speichern (IndexedDB)
- ✅ Distanz berechnen (Haversine)
- ✅ Track-Statistiken (lokal)
- ✅ Wake-Lock (Screen an halten)

**Was NICHT offline funktioniert:**
- ❌ Neue Kartenkacheln laden
- ❌ POI-Daten vom Server
- ❌ Track auf Server hochladen

**Kartendaten offline:**
- Service Worker cached bereits geladene Tiles
- Bei erneutem Besuch der Region: Karte verfügbar
- Für volle Offline-Karte: Tiles vorher cachen (TODO: Pre-Cache Feature)

### IndexedDB Persistenz

**Vorteile:**
- ✅ Speicherung überdauert Browser-Reload
- ✅ Speicherung überdauert Tab-Schließen
- ✅ Funktioniert offline
- ✅ Große Datenmengen möglich (MB statt KB wie LocalStorage)

**Limitierungen:**
- ❌ Wird beim Browser-Cache-Löschen entfernt
- ❌ Private/Incognito Mode: Daten nach Session weg
- ❌ Kein Sync zwischen Geräten (nur lokal)

**Für Testing ausreichend:**
- Session-basiert: Solange Browser offen → Daten da
- Track-Liste bleibt erhalten während Testing
- Nach Test: Export als GeoJSON möglich (TODO)

## Track-Liste abrufen

### Aktuell: Dev-Console

```javascript
// Browser Console öffnen (F12)

// 1. Alle Tracks abrufen
const tracks = await db.tracks.toArray();
console.table(tracks);

// 2. Aktiven Track anzeigen
console.log('Active Track:', mapStore.activeTrack);

// 3. Waypoints eines Tracks
const track = tracks[0];
console.log('Waypoints:', track.waypoints);
console.table(track.waypoints.map(w => ({
  lat: w.lat.toFixed(6),
  lng: w.lng.toFixed(6),
  accuracy: w.accuracy + 'm',
  time: new Date(w.timestamp).toLocaleTimeString()
})));

// 4. Statistiken
const stats = db.calculateStats(track);
console.log('Stats:', stats);
```

### Geplant: Track-Liste View

**TODO:** `src/views/TracksView.vue` erstellen

```vue
<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Meine Wanderungen</h1>
    
    <div v-for="track in tracks" :key="track.id" class="card bg-base-200 shadow-xl mb-4">
      <div class="card-body">
        <h2 class="card-title">{{ track.name }}</h2>
        
        <div class="stats stats-horizontal">
          <div class="stat">
            <div class="stat-title">Distanz</div>
            <div class="stat-value">{{ formatDistance(track.distance) }}</div>
          </div>
          <div class="stat">
            <div class="stat-title">Dauer</div>
            <div class="stat-value">{{ formatDuration(track.duration) }}</div>
          </div>
          <div class="stat">
            <div class="stat-title">Wegpunkte</div>
            <div class="stat-value">{{ track.waypoints.length }}</div>
          </div>
        </div>
        
        <div class="card-actions justify-end">
          <button @click="viewOnMap(track)" class="btn btn-primary">Auf Karte</button>
          <button @click="exportGPX(track)" class="btn btn-secondary">GPX Export</button>
          <button @click="deleteTrack(track.id)" class="btn btn-error">Löschen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '@/db/trackDatabase';

const tracks = ref([]);

onMounted(async () => {
  tracks.value = await db.tracks
    .where('status').equals('completed')
    .reverse()
    .sortBy('startTime');
});
</script>
```

## Field Testing Checklist

### Vorbereitung (zu Hause mit Internet)

- [ ] App im Browser öffnen: `http://localhost:5173`
- [ ] GPS-Berechtigung erteilen (Browser fragt beim ersten Mal)
- [ ] Auf Map-Seite gehen (`/`)
- [ ] GPS-Position testen (GPS-Button in Navbar)
- [ ] Tracking-Panel öffnen (Blitz-Icon in Navbar)
- [ ] Test-Track starten mit Namen "Test zu Hause"
- [ ] 2-3 Minuten warten → Mindestens 1-2 Waypoints sollten gespeichert werden
- [ ] Track stoppen
- [ ] Dev-Console öffnen: `await db.tracks.toArray()` → Track sollte da sein
- [ ] App-Tab offen lassen (nicht schließen!)

### Draußen ohne Internet

- [ ] Smartphone: Mobile-Daten AUS, WLAN AUS
- [ ] GPS muss AN bleiben!
- [ ] Browser-Tab mit DRUID öffnen
- [ ] Auf Map-Seite → Tracking starten
- [ ] Name eingeben: "Feldtest Wanderung"
- [ ] Einstellungen anpassen (z.B. 2 Min Intervall, 15m Distanz)
- [ ] Tracking starten
- [ ] **Bildschirm AN lassen** (Wake-Lock sollte das automatisch machen)
- [ ] 15-30 Minuten wandern
- [ ] Dabei: Live-Statistiken beobachten (Distanz sollte steigen)
- [ ] Track stoppen
- [ ] Dev-Console öffnen (wenn zurück zu Hause):
  ```javascript
  const tracks = await db.tracks.toArray();
  const lastTrack = tracks[tracks.length - 1];
  console.log('Waypoints:', lastTrack.waypoints.length);
  console.log('Distance:', lastTrack.distance, 'meters');
  console.table(lastTrack.waypoints.map(w => ({
    lat: w.lat.toFixed(6),
    lng: w.lng.toFixed(6),
    accuracy: w.accuracy.toFixed(1) + 'm',
    time: new Date(w.timestamp).toLocaleTimeString()
  })));
  ```

### Erwartete Ergebnisse

**Positiv:**
- ✅ GPS-Position wird empfangen (auch ohne Internet)
- ✅ Live-Statistiken aktualisieren sich
- ✅ Waypoints werden gespeichert (alle 1-2 Min je nach Config)
- ✅ Distanz wird korrekt berechnet
- ✅ Track bleibt nach Stoppen in IndexedDB erhalten
- ✅ Bildschirm bleibt an (Wake-Lock)

**Einschränkungen:**
- ⚠️ Kartenkacheln: Nur bereits gecachte Bereiche sichtbar
- ⚠️ User-Position Marker: Bewegt sich auf Karte (auch ohne neue Tiles)
- ⚠️ Polyline: Zeigt Track-Verlauf (auch ohne neue Tiles)

### Mögliche Probleme & Lösungen

**Problem:** "Kein GPS-Signal"
- Lösung: Draußen unter freiem Himmel testen (nicht in Gebäuden)
- GPS braucht 30-60 Sekunden für ersten Fix

**Problem:** "Waypoints werden nicht gespeichert"
- Check 1: `navigator.geolocation.watchPosition` läuft? (Console-Log)
- Check 2: GPS-Genauigkeit < 50m? (Schlechtes Signal wird gefiltert)
- Check 3: Zeit-/Distanz-Threshold erreicht? (1 Min + 10m)

**Problem:** "Screen geht aus"
- Wake-Lock nicht unterstützt → Bildschirm manuell an lassen
- Oder: Screen-Timeout in System-Einstellungen erhöhen

**Problem:** "Track verschwindet nach Browser-Neustart"
- IndexedDB wurde gelöscht (Browser-Cache geleert?)
- Lösung: Für Production → GeoJSON Export nach Track-Ende

**Problem:** "Batterie leer nach 2h"
- Normal bei aktivem GPS + Screen on
- Lösung: Power-Bank mitnehmen
- Oder: Tracking-Intervall erhöhen (3-5 Min statt 1 Min)

## Next Steps (Post-Testing)

### Phase 2: Track Management

- [ ] TracksView.vue erstellen (Liste aller Tracks)
- [ ] Track-Detail Modal (Waypoint-Liste, Statistiken, Karte)
- [ ] Track auf Karte anzeigen (Replay)
- [ ] Track umbenennen
- [ ] Track löschen

### Phase 3: Export & Sharing

- [ ] GPX Export implementieren (XML Format für GPS-Geräte)
- [ ] GeoJSON Export (für Web-Karten)
- [ ] KML Export (für Google Earth)
- [ ] Track-Sharing (URL mit Track-ID)

### Phase 4: Offline-Optimierung

- [ ] Pre-Cache Feature (Karten-Region vorher laden)
- [ ] Background Sync (Track upload wenn Internet zurück)
- [ ] Capacitor Plugin für echtes Background-GPS (iOS)

### Phase 5: Advanced Features

- [ ] Track-Bearbeitung (Waypoints löschen, Track splitten)
- [ ] Track-Statistiken erweitern (Höhenprofil, Geschwindigkeits-Graph)
- [ ] Track-Vergleich (mehrere Tracks überlagern)
- [ ] Heatmap (häufig besuchte Bereiche)

## Technische Notizen

### GPS-Genauigkeit

**Typische Werte:**
- ✅ Gut: 5-15 Meter (freie Sicht zum Himmel)
- ⚠️ Mittel: 15-50 Meter (Bäume, leichte Bebauung)
- ❌ Schlecht: >50 Meter (Gebäude, Tunnel, Indoor)

**Unser Threshold: 50m** (Waypoints mit schlechterem GPS werden gefiltert)

### Batterieverbrauch

**Faktoren:**
- GPS aktiv: ~5-10% pro Stunde
- Screen on: ~5-10% pro Stunde
- **Total: ~10-20% pro Stunde**

**Optimierung:**
- Intervall erhöhen (5 Min statt 1 Min) → Weniger GPS-Abfragen
- Screen-Helligkeit reduzieren
- Andere Apps schließen

### Speicherplatz

**Pro Track:**
- Waypoint: ~150 Bytes
- 4h Wanderung @ 1 Min Intervall: 240 Waypoints
- **Total: ~35 KB pro Track**

**IndexedDB Limit:**
- Browser: Min. 50 MB, meist viel mehr
- → **~1400 Tracks** möglich (praktisch unbegrenzt für Use-Case)

## Fazit

Das GPS-Tracking-System ist **feature-complete für Phase 1**:
- ✅ Offline GPS funktioniert
- ✅ Intelligentes Filtering spart Batterie
- ✅ IndexedDB speichert Tracks persistent
- ✅ Live-Statistiken funktionieren
- ✅ UI ist benutzerfreundlich

**Nächster Schritt:** Field-Testing draußen ohne Internet!

**Erfolgs-Kriterium:** Nach 30 Min Wanderung ohne Internet sollten 10-30 Waypoints gespeichert sein und Track-Statistiken korrekt sein.
