# Native App & Background GPS-Tracking

**Datum:** 2025-01-30  
**Status:** 🚀 IN ARBEIT  
**Priorität:** HOCH (Core Feature für Wanderungen)

---

## Anforderungen

### Funktionale Anforderungen

1. **App-Installation**
   - [ ] App auf iPhone-Homescreen installierbar (PWA)
   - [ ] App auf Android-Homescreen installierbar (PWA)
   - [ ] App-Icon und Splash-Screen
   - [ ] Vollbild-Modus (ohne Browser-UI)

2. **GPS-Tracking**
   - [ ] Start/Stop-Button für Wanderung
   - [ ] Automatische Wegpunkte alle X Minuten (konfigurierbar: 1-5 min)
   - [ ] GPS funktioniert auch bei gesperrtem Bildschirm
   - [ ] GPS läuft im Hintergrund (App nicht aktiv)
   - [ ] Tracking stoppt nur bei explizitem Stop-Button

3. **Offline-Funktionalität**
   - [ ] GPS-Daten speichern ohne Internet-Verbindung
   - [ ] LocalStorage/IndexedDB für Persistierung
   - [ ] Später Synchronisierung wenn Internet verfügbar

4. **Intelligentes Speichern**
   - [ ] Keine doppelten Punkte bei gleicher Position
   - [ ] Distanz-Threshold (z.B. 10m Bewegung notwendig)
   - [ ] Zeit-Threshold (z.B. alle 1-2 Minuten)
   - [ ] Kombinierter Algorithmus (Zeit UND Distanz)

5. **Daten-Management**
   - [ ] Liste aller aufgezeichneten Tracks
   - [ ] Track-Statistiken (Distanz, Dauer, Höhe)
   - [ ] Export-Funktion (GPX, GeoJSON)
   - [ ] Löschen einzelner Tracks

---

## Technische Herausforderungen

### iOS-Limitierungen (KRITISCH!)

**Problem:** Safari und iOS PWAs haben STRIKTE Einschränkungen für Background-Prozesse.

**iOS PWA Einschränkungen:**
1. **Kein echtes Background-Tracking:** Wenn App in Hintergrund geht, werden JavaScript-Timer nach ~30 Sekunden pausiert
2. **Service Worker Limits:** Service Worker werden nach Inaktivität beendet
3. **GPS-Permission:** Nur "While Using App", kein "Always" wie bei nativen Apps
4. **Battery Optimization:** iOS aggressiv bei Power-Management

**Realität-Check:**
- ❌ **Unmöglich:** Stundenlanges Background-GPS in reiner PWA auf iOS
- ⚠️ **Begrenzt möglich:** Kurzzeitiges Background-Tracking (< 5 Minuten)
- ✅ **Möglich:** Foreground-Tracking mit Screen-On

**Lösungsansätze:**

#### Option 1: PWA mit Einschränkungen (Schnell, aber limitiert)
**Vorteile:**
- Keine App-Store-Submission
- Sofort nutzbar
- Eine Codebasis

**Nachteile:**
- ❌ Kein echtes Background-GPS auf iOS
- ❌ User muss App offen lassen
- ⚠️ Screen-Timeout verhindert Tracking

**Umsetzung:**
```typescript
// Foreground-Only Tracking
let trackingInterval: number;

const startTracking = () => {
  trackingInterval = setInterval(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => saveWaypoint(position),
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );
  }, 60000); // Alle 1 Minute
};
```

**Mitigation:**
- [ ] Wake-Lock API (verhindert Screen-Timeout)
- [ ] User-Hinweis: "Bitte App offen lassen während Wanderung"
- [ ] Vibration/Sound bei Wegpunkt-Speicherung (User-Feedback)

#### Option 2: Capacitor Native Wrapper (Empfohlen!)
**Was ist Capacitor?**
- Framework von Ionic Team
- Wrapper für Web-Apps → Echte native Apps
- Zugriff auf native APIs (Background GPS, Notifications, etc.)
- Deploy zu App Store / Google Play

**Vorteile:**
- ✅ Echtes Background-GPS auf iOS und Android
- ✅ "Always Allow Location"-Permission
- ✅ Native Background-Tasks
- ✅ Push-Notifications möglich
- ✅ Bessere Battery-Optimierung

**Nachteile:**
- 🔨 Mehr Setup-Aufwand (Xcode, Android Studio)
- 📱 App-Store-Submission notwendig
- 💰 Apple Developer Account ($99/Jahr)

**Umsetzung:**
```typescript
// Capacitor Geolocation Plugin
import { Geolocation } from '@capacitor/geolocation';
import { BackgroundGeolocation } from '@capacitor-community/background-geolocation';

// Background-Tracking starten
await BackgroundGeolocation.addWatcher({
  backgroundMessage: "DRUID zeichnet deinen Wanderweg auf",
  backgroundTitle: "Wanderung aktiv",
  requestPermissions: true,
  stale: false,
  distanceFilter: 10 // 10 Meter Mindestbewegung
}, (location) => {
  if (location) {
    saveWaypoint({
      lat: location.latitude,
      lng: location.longitude,
      timestamp: Date.now(),
      accuracy: location.accuracy
    });
  }
});
```

#### Option 3: Hybrid-Ansatz (Best of Both Worlds)
**Strategie:**
1. PWA für Desktop und schnelle Tests
2. Capacitor-Build für iOS/Android mit Background-GPS
3. Shared Codebase (Vue.js)

**Architecture:**
```
druid/
├── src/           # Vue.js App (funktioniert in Browser)
├── capacitor/     # Native Wrapper
│   ├── ios/       # Xcode Projekt
│   └── android/   # Android Studio Projekt
└── dist/          # Build für beide Targets
```

---

## Implementierungs-Plan

### Phase 1: PWA-Grundlagen (1-2 Tage)

#### 1.1 Manifest und Service Worker
- [ ] `manifest.json` erstellen
- [ ] Icons generieren (512x512, 192x192, etc.)
- [ ] Service Worker für Offline-Support
- [ ] Install-Prompt implementieren

**manifest.json:**
```json
{
  "name": "DRUID - Discover Ancient Sites",
  "short_name": "DRUID",
  "description": "Heritage Discovery & GPS Tracking",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#16213e",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### 1.2 Wake-Lock API
- [ ] Screen-Timeout verhindern während Tracking
- [ ] User-Feedback bei Aktivierung

**Implementation:**
```typescript
let wakeLock: WakeLockSentinel | null = null;

const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    console.log('Wake Lock aktiv - Screen bleibt an');
  } catch (err) {
    console.error('Wake Lock failed:', err);
  }
};

const releaseWakeLock = async () => {
  if (wakeLock) {
    await wakeLock.release();
    wakeLock = null;
  }
};
```

#### 1.3 Foreground-Tracking MVP
- [ ] Start/Stop-Button in UI
- [ ] Intervall-basiertes GPS-Polling
- [ ] Waypoints in IndexedDB speichern
- [ ] Track-Visualisierung auf Karte

### Phase 2: Intelligentes Wegpunkt-System (1 Tag)

#### 2.1 Algorithmus für Wegpunkt-Speicherung

**Anforderungen:**
1. **Zeit-Threshold:** Mindestens X Minuten seit letztem Punkt
2. **Distanz-Threshold:** Mindestens Y Meter Bewegung
3. **Genauigkeit-Check:** Nur Punkte mit < 50m Accuracy speichern

**Implementation:**
```typescript
interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  timestamp: number;
  accuracy: number;
  altitude?: number;
  speed?: number;
}

interface TrackingConfig {
  minTimeInterval: number; // Millisekunden (default: 60000 = 1 min)
  minDistance: number;     // Meter (default: 10)
  maxAccuracy: number;     // Meter (default: 50)
}

class TrackingEngine {
  private lastWaypoint: Waypoint | null = null;
  private config: TrackingConfig;

  shouldSaveWaypoint(newPosition: GeolocationPosition): boolean {
    const now = Date.now();
    const coords = newPosition.coords;

    // Check 1: Accuracy zu schlecht?
    if (coords.accuracy > this.config.maxAccuracy) {
      console.log('Position zu ungenau:', coords.accuracy);
      return false;
    }

    // Check 2: Erster Punkt?
    if (!this.lastWaypoint) {
      return true;
    }

    // Check 3: Mindestzeit vergangen?
    const timeDiff = now - this.lastWaypoint.timestamp;
    if (timeDiff < this.config.minTimeInterval) {
      return false;
    }

    // Check 4: Mindestdistanz zurückgelegt?
    const distance = this.calculateDistance(
      this.lastWaypoint.lat,
      this.lastWaypoint.lng,
      coords.latitude,
      coords.longitude
    );

    if (distance < this.config.minDistance) {
      console.log('Zu wenig Bewegung:', distance, 'm');
      return false;
    }

    return true;
  }

  // Haversine-Formel für Distanz in Metern
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
```

#### 2.2 IndexedDB für Offline-Speicherung

**Warum IndexedDB statt LocalStorage?**
- LocalStorage: Limit ~5-10 MB, synchron, blockiert UI
- IndexedDB: Limit ~50 MB - 1 GB, asynchron, strukturierte Daten

**Schema:**
```typescript
interface Track {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  waypoints: Waypoint[];
  distance?: number;
  duration?: number;
  status: 'recording' | 'completed';
}

// Dexie.js (IndexedDB Wrapper)
import Dexie from 'dexie';

class TrackDatabase extends Dexie {
  tracks!: Dexie.Table<Track, string>;

  constructor() {
    super('DruidTracksDB');
    this.version(1).stores({
      tracks: 'id, startTime, status'
    });
  }
}

const db = new TrackDatabase();
```

### Phase 3: Capacitor Integration (2-3 Tage)

#### 3.1 Capacitor Setup
```bash
# Capacitor installieren
npm install @capacitor/core @capacitor/cli

# Projekt initialisieren
npx cap init

# Platforms hinzufügen
npx cap add ios
npx cap add android

# Plugins installieren
npm install @capacitor/geolocation
npm install @capacitor-community/background-geolocation
```

#### 3.2 Background-Geolocation Plugin

**capacitor.config.ts:**
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.ogerly.druid',
  appName: 'DRUID',
  webDir: 'dist',
  plugins: {
    Geolocation: {
      permissions: {
        ios: {
          NSLocationAlwaysAndWhenInUseUsageDescription: 
            "DRUID nutzt GPS, um deine Wanderwege auch im Hintergrund aufzuzeichnen."
        },
        android: {
          ACCESS_FINE_LOCATION: true,
          ACCESS_COARSE_LOCATION: true,
          ACCESS_BACKGROUND_LOCATION: true
        }
      }
    }
  }
};

export default config;
```

**Background-Tracking Service:**
```typescript
import { BackgroundGeolocation } from '@capacitor-community/background-geolocation';
import { Capacitor } from '@capacitor/core';

class BackgroundTrackingService {
  private watcherId: string | null = null;

  async startBackgroundTracking(config: TrackingConfig) {
    // Check if native platform
    if (!Capacitor.isNativePlatform()) {
      console.warn('Background tracking nur auf nativen Plattformen');
      return this.startForegroundTracking(config);
    }

    // Request permissions
    const permission = await BackgroundGeolocation.requestPermissions();
    if (permission.location !== 'granted') {
      throw new Error('GPS-Permission verweigert');
    }

    // Start background watcher
    this.watcherId = await BackgroundGeolocation.addWatcher({
      backgroundMessage: "DRUID zeichnet deinen Wanderweg auf",
      backgroundTitle: "Wanderung aktiv",
      requestPermissions: true,
      stale: false,
      distanceFilter: config.minDistance,
      interval: config.minTimeInterval
    }, async (location) => {
      if (location) {
        const waypoint: Waypoint = {
          id: crypto.randomUUID(),
          lat: location.latitude,
          lng: location.longitude,
          timestamp: Date.now(),
          accuracy: location.accuracy,
          altitude: location.altitude,
          speed: location.speed
        };

        // Save to IndexedDB
        await this.saveWaypoint(waypoint);

        // Send to store (if app in foreground)
        useMapStore().addWaypointToActiveTrack(waypoint);
      }
    });
  }

  async stopBackgroundTracking() {
    if (this.watcherId) {
      await BackgroundGeolocation.removeWatcher({
        id: this.watcherId
      });
      this.watcherId = null;
    }
  }
}
```

#### 3.3 iOS-spezifische Konfiguration

**ios/App/App/Info.plist:**
```xml
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>DRUID zeichnet deine Wanderwege auf, auch wenn die App im Hintergrund läuft.</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>DRUID nutzt deinen Standort, um Wanderwege aufzuzeichnen.</string>

<key>UIBackgroundModes</key>
<array>
    <string>location</string>
</array>
```

**Wichtig:**
- `NSLocationAlwaysAndWhenInUseUsageDescription` ist Pflicht für Background-GPS
- Apple prüft bei App-Review die Begründung!
- User kann "Always Allow" erst nach "While Using" gewähren

### Phase 4: UI/UX für Tracking (1-2 Tage)

#### 4.1 TrackingControl Component

**Features:**
- [ ] Start/Stop-Button (prominent, groß)
- [ ] Live-Statistiken (Distanz, Dauer, Wegpunkte)
- [ ] Intervall-Einstellung (Slider: 1-5 min)
- [ ] Distanz-Threshold-Einstellung
- [ ] Battery-Warning bei High-Accuracy
- [ ] Pause-Button (optional)

**UI-Design:**
```vue
<template>
  <div class="tracking-control">
    <!-- Status Badge -->
    <div v-if="isTracking" class="badge badge-success gap-2">
      <span class="animate-pulse">●</span>
      Tracking aktiv
    </div>

    <!-- Live-Stats -->
    <div v-if="isTracking" class="stats">
      <div class="stat">
        <div class="stat-title">Distanz</div>
        <div class="stat-value">{{ formatDistance(totalDistance) }}</div>
      </div>
      <div class="stat">
        <div class="stat-title">Dauer</div>
        <div class="stat-value">{{ formatDuration(elapsedTime) }}</div>
      </div>
      <div class="stat">
        <div class="stat-title">Wegpunkte</div>
        <div class="stat-value">{{ waypointCount }}</div>
      </div>
    </div>

    <!-- Config (vor Start) -->
    <div v-if="!isTracking" class="form-control">
      <label class="label">
        <span class="label-text">Wegpunkt alle X Minuten</span>
      </label>
      <input 
        type="range" 
        min="1" 
        max="5" 
        v-model="intervalMinutes"
        class="range"
      />
      <div class="text-sm opacity-70">{{ intervalMinutes }} Minuten</div>
    </div>

    <!-- Start/Stop Button -->
    <button 
      @click="toggleTracking"
      class="btn btn-lg"
      :class="isTracking ? 'btn-error' : 'btn-success'"
    >
      <vue-feather :icon="isTracking ? 'square' : 'play'" />
      {{ isTracking ? 'Stoppen' : 'Wanderung starten' }}
    </button>

    <!-- Warnings -->
    <div v-if="!hasGPS" class="alert alert-error">
      <vue-feather icon="alert-circle" />
      <span>GPS nicht verfügbar</span>
    </div>
  </div>
</template>
```

#### 4.2 TrackList Component

**Features:**
- [ ] Liste aller aufgezeichneten Tracks
- [ ] Sortierung (Datum, Distanz, Name)
- [ ] Track-Details-Modal
- [ ] Löschen mit Bestätigung
- [ ] Export-Button (GPX)

#### 4.3 TrackDetail Modal

**Features:**
- [ ] Karte mit vollständigem Track
- [ ] Statistiken (Distanz, Dauer, Durchschnittsgeschwindigkeit)
- [ ] Höhenprofil (wenn Altitude-Daten)
- [ ] Wegpunkt-Liste mit Timestamps
- [ ] Edit-Name
- [ ] Export/Teilen-Optionen

---

## Testing-Strategie

### PWA-Tests (Alle Geräte)
- [ ] Installation auf iPhone (Safari)
- [ ] Installation auf Android (Chrome)
- [ ] Offline-Funktionalität (Flugmodus)
- [ ] Wake-Lock funktioniert
- [ ] IndexedDB speichert Daten
- [ ] Nach App-Reload Daten vorhanden

### Capacitor-Tests (Native)
- [ ] Xcode Build erfolgreich
- [ ] Android Studio Build erfolgreich
- [ ] Background-GPS auf iOS (Gerät, nicht Simulator!)
- [ ] Background-GPS auf Android
- [ ] Battery-Impact akzeptabel
- [ ] App bleibt stabil über mehrere Stunden

### Field-Tests (Wanderung)
- [ ] 2-Stunden-Wanderung im Wald
- [ ] Schlechter GPS-Empfang (Tal, Gebäude)
- [ ] Kein Mobilfunk (Offline-Test)
- [ ] Handy in Tasche (Screen off)
- [ ] Daten-Integrität nach Tracking

---

## Deployment-Strategie

### PWA (Sofort verfügbar)
- [x] GitHub Pages läuft bereits ✅
- [ ] Manifest hinzufügen
- [ ] Service Worker registrieren
- [ ] Icons generieren
- [ ] Install-Banner testen

### Native Apps (Später)
- [ ] Apple Developer Account anlegen
- [ ] Google Play Developer Account anlegen
- [ ] Xcode Archive & Upload
- [ ] Android AAB Build & Upload
- [ ] App-Review abwarten (iOS: 1-3 Tage)

---

## Offene Fragen

1. **Priorität:** Sollen wir mit PWA starten und später auf Capacitor upgraden?
2. **iOS Background:** Ist dem User bewusst, dass echtes Background-GPS nur mit nativer App funktioniert?
3. **Battery:** Welcher Tracking-Intervall ist der beste Kompromiss? (1 min = hoher Verbrauch)
4. **Export-Format:** GPX, GeoJSON oder beides?
5. **Cloud-Sync:** Tracks später auf Server synchronisieren? (Login notwendig)

---

## Nächste Schritte

### Jetzt sofort (Entscheidung nötig!):

**Option A: PWA-First (Schnell, aber eingeschränkt)**
1. Manifest + Service Worker erstellen
2. Wake-Lock implementieren
3. Foreground-Tracking MVP
4. User-Hinweis: "App offen lassen"

**Option B: Capacitor-First (Aufwändiger, aber richtig)**
1. Capacitor Setup
2. iOS/Android Projekte einrichten
3. Background-Geolocation Plugin
4. Native Builds testen

**Option C: Hybrid (Empfehlung!)**
1. Phase 1: PWA-MVP (diese Woche)
2. Phase 2: Capacitor-Integration (nächste Woche)
3. Phase 3: App-Store-Deployment (Woche 3)

---

**Meine Empfehlung:**
**Option C - Hybrid-Ansatz**

**Begründung:**
1. PWA erlaubt schnelles Testen der Logik (Algorithmus, UI)
2. Capacitor-Wrapper ist später einfach hinzuzufügen (gleiche Codebase)
3. Wir können PWA als Fallback behalten (keine App-Installation nötig)
4. iOS Background-GPS ist kritisch → Native App unvermeidbar für reale Nutzung

**Timeline:**
- **Tag 1-2:** PWA-Manifest + Wake-Lock + Foreground-Tracking
- **Tag 3-4:** IndexedDB + Intelligenter Algorithmus + UI
- **Tag 5-7:** Capacitor-Setup + Background-Plugin + Native Builds
- **Woche 2:** Field-Tests + Bugfixes + App-Store-Vorbereitung

---

**Autor:** GitHub Copilot  
**Letzte Aktualisierung:** 2025-01-30 (Workpaper erstellt)
