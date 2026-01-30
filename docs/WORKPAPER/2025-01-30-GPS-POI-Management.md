# GPS & POI Management: User-Generated Content

**Datum:** 2025-01-30  
**Status:** 🚀 In Arbeit  
**Priorität:** HOCH

---

## Ziel

Implementierung eines vollständigen User-Generated-Content-Systems für DRUID:
- GPS-basierte Positionserfassung
- Punkt-Setzen auf der Karte (Click & GPS)
- Verwaltung von User-Markern und Pfaden
- Speicherung im Pinia Store (Session-based, kein LocalStorage zunächst)
- Array-basierte Datenstrukturen für multiple Punkte

---

## Aktueller Stand (Ist-Zustand)

### ✅ Bereits Implementiert

**GPS-Funktionalität:**
- ✅ `centerOnUser()` in mapStore - holt aktuelle Position
- ✅ `userLocation` State - speichert GPS-Koordinaten
- ✅ User-Location-Marker auf Karte angezeigt
- ✅ GPS-Button in Navbar funktioniert
- ✅ Timeout für Mobile (15 Sekunden)

**Recording-Funktionalität:**
- ✅ `toggleRecording()` - Recording an/aus
- ✅ `currentPath` Array - sammelt Punkte während Recording
- ✅ `savedPaths` Array - speichert abgeschlossene Pfade
- ✅ `addPointToPath()` - fügt Punkt zu aktuellem Pfad hinzu
- ✅ Pfade werden als Polylines auf Karte gezeichnet
- ✅ Recording-Indicator in Navbar (roter Punkt)

**User-Marker-Funktionalität:**
- ✅ `addUserMarker()` - fügt Marker an Position hinzu
- ✅ `removeUserMarker(id)` - löscht spezifischen Marker
- ✅ `userMarkers` Array - speichert alle User-Marker
- ✅ Click-Event auf Karte setzt Marker (wenn nicht Recording)
- ✅ Marker-Popup mit Delete-Button

**POI-System:**
- ✅ `poisStore` mit 3 deutschen Heritage Sites
- ✅ Kategorien: culture, nature, food
- ✅ Farbcodierte Marker (blau, grün, orange)
- ✅ POI-Auswahl in PlacesView
- ✅ "Show on Map" Navigation

### ❌ Fehlende Features

**GPS-Integration:**
- [ ] GPS-Position automatisch tracken (nicht nur auf Knopfdruck)
- [ ] GPS-Pfad während Bewegung aufzeichnen
- [ ] Genauigkeits-Anzeige (accuracy circle)
- [ ] Battery-Optimierung (GPS nur wenn nötig)

**User-Marker:**
- [ ] Benutzerdefinierte Beschriftungen/Namen für Marker
- [ ] Zeitstempel für jeden Marker
- [ ] Kategorisierung von User-Markern
- [ ] Marker-Icon-Auswahl
- [ ] Foto-Upload zu Markern (später)

**Pfad-Management:**
- [ ] Pfad-Namen/Beschreibungen
- [ ] Pfad-Statistiken (Länge, Dauer)
- [ ] Pfad-Farbe änderbar
- [ ] Pfad-Export (GPX, später)

**UI/UX:**
- [ ] Liste aller User-Marker
- [ ] Liste aller gespeicherten Pfade
- [ ] Marker/Pfad bearbeiten
- [ ] Bulk-Delete Funktionen
- [ ] Visual Feedback beim Punkt setzen

---

## Datenstrukturen (Store-Schema)

### Aktuelle Implementierung

```typescript
// stores/mapStore.ts

interface UserMarker {
  id: number;
  position: [number, number];
}

interface SavedPath {
  id: number;
  points: [number, number][];
}

// State
userLocation: Ref<[number, number] | null>
currentPath: Ref<[number, number][]>
savedPaths: Ref<SavedPath[]>
userMarkers: Ref<UserMarker[]>
isRecording: Ref<boolean>
```

### Erweiterte Strukturen (Geplant)

```typescript
// Erweiterte User-Marker mit Metadaten
interface UserMarker {
  id: number;
  position: [number, number];
  label?: string;              // User-definierter Name
  description?: string;        // Notizen
  timestamp: number;           // Wann erstellt (Date.now())
  category?: string;           // z.B. 'personal', 'waypoint', 'photo'
  accuracy?: number;           // GPS-Genauigkeit in Metern
  icon?: string;               // Icon-Type für Custom-Icons
}

// Erweiterte Pfade mit Metadaten
interface SavedPath {
  id: number;
  name?: string;               // Pfad-Name
  points: PathPoint[];         // Statt nur Koordinaten
  timestamp: number;           // Wann aufgezeichnet
  color?: string;              // Pfad-Farbe (default: 'blue')
  distance?: number;           // Berechnte Distanz in km
  duration?: number;           // Aufnahme-Dauer in Sekunden
}

interface PathPoint {
  coords: [number, number];
  timestamp: number;           // Wann Punkt aufgezeichnet
  accuracy?: number;           // GPS-Genauigkeit
}

// GPS-Tracking State
interface GPSState {
  isTracking: boolean;         // GPS-Tracking aktiv?
  watchId: number | null;      // Geolocation.watchPosition ID
  accuracy: number | null;     // Aktuelle Genauigkeit
  heading: number | null;      // Bewegungsrichtung
  speed: number | null;        // Geschwindigkeit in m/s
}
```

---

## Feature-Anforderungen

### 1. GPS-Position setzen & tracken

**User Story:** Als User möchte ich sehen wo ich bin und meine Bewegung tracken können.

**Funktionen:**
- [x] GPS-Button holt einmalig Position
- [ ] **GPS-Tracking:** Continuous Position Tracking
- [ ] **Accuracy Circle:** Zeige GPS-Genauigkeit als Kreis
- [ ] **Auto-Center:** Optional Karte mit User-Position mitbewegen
- [ ] **Kompass-Rotation:** Karten-Rotation basierend auf Heading (optional)

**Implementierung:**
```typescript
// mapStore.ts

const gpsState = ref<GPSState>({
  isTracking: false,
  watchId: null,
  accuracy: null,
  heading: null,
  speed: null
});

const startTracking = () => {
  if (!navigator.geolocation) return;
  
  gpsState.value.isTracking = true;
  gpsState.value.watchId = navigator.geolocation.watchPosition(
    (position) => {
      userLocation.value = [
        position.coords.latitude, 
        position.coords.longitude
      ];
      gpsState.value.accuracy = position.coords.accuracy;
      gpsState.value.heading = position.coords.heading;
      gpsState.value.speed = position.coords.speed;
      
      // Optional: Auto-center
      if (autoCenter.value) {
        center.value = userLocation.value;
      }
    },
    (error) => console.error('GPS Error:', error),
    {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 30000
    }
  );
};

const stopTracking = () => {
  if (gpsState.value.watchId) {
    navigator.geolocation.clearWatch(gpsState.value.watchId);
    gpsState.value.isTracking = false;
    gpsState.value.watchId = null;
  }
};
```

### 2. User-Marker mit Metadaten

**User Story:** Als User möchte ich Marker mit Namen und Beschreibungen setzen können.

**Funktionen:**
- [x] Click auf Karte setzt Marker
- [ ] **Modal/Form:** Marker-Details eingeben (Name, Beschreibung)
- [ ] **Timestamps:** Automatisch beim Erstellen
- [ ] **GPS-Koordinaten anzeigen:** In Popup oder Modal
- [ ] **Kategorien:** Auswahl aus Preset-Kategorien

**UI-Flow:**
1. User klickt auf Karte
2. Modal öffnet sich: "Neuen Marker erstellen?"
3. Eingabefelder: Name (optional), Beschreibung (optional), Kategorie
4. "Speichern" → Marker wird in Array gespeichert
5. "Abbrechen" → Kein Marker

**Implementierung:**
```typescript
// mapStore.ts

const addUserMarkerWithMetadata = (
  position: [number, number],
  label?: string,
  description?: string,
  category?: string
) => {
  const marker: UserMarker = {
    id: nextMarkerId++,
    position,
    label,
    description,
    timestamp: Date.now(),
    category: category || 'personal',
    accuracy: gpsState.value.accuracy || undefined
  };
  userMarkers.value.push(marker);
};

// Optional: Vom aktuellen GPS-Standort
const addMarkerAtCurrentLocation = (label?: string, description?: string) => {
  if (!userLocation.value) {
    throw new Error('GPS location not available');
  }
  addUserMarkerWithMetadata(userLocation.value, label, description);
};
```

### 3. Pfad-Recording mit Statistiken

**User Story:** Als User möchte ich meine Wanderungen aufzeichnen und Details sehen (Distanz, Dauer).

**Funktionen:**
- [x] Recording Start/Stop
- [x] Punkte sammeln in `currentPath`
- [ ] **Pfad-Namen vergeben:** Beim Stoppen eingeben
- [ ] **Distanz berechnen:** Haversine-Formel
- [ ] **Dauer tracken:** Recording-Start bis Stop
- [ ] **Echtzeit-Anzeige:** Aktuelle Distanz während Recording

**Implementierung:**
```typescript
// mapStore.ts

const recordingStartTime = ref<number | null>(null);

const startRecording = () => {
  isRecording.value = true;
  currentPath.value = [];
  recordingStartTime.value = Date.now();
};

const stopRecording = (pathName?: string) => {
  if (currentPath.value.length > 0) {
    const duration = recordingStartTime.value 
      ? (Date.now() - recordingStartTime.value) / 1000 
      : 0;
    
    const distance = calculatePathDistance(currentPath.value);
    
    savedPaths.value.push({
      id: nextPathId++,
      name: pathName || `Path ${nextPathId}`,
      points: currentPath.value.map(coords => ({
        coords,
        timestamp: Date.now() // Vereinfacht, idealerweise pro Punkt
      })),
      timestamp: Date.now(),
      color: 'blue',
      distance,
      duration
    });
    
    currentPath.value = [];
  }
  isRecording.value = false;
  recordingStartTime.value = null;
};

// Haversine Distance Calculation
const calculatePathDistance = (points: [number, number][]): number => {
  let totalDistance = 0;
  for (let i = 0; i < points.length - 1; i++) {
    totalDistance += haversineDistance(points[i], points[i + 1]);
  }
  return totalDistance; // in km
};

const haversineDistance = (
  point1: [number, number], 
  point2: [number, number]
): number => {
  const R = 6371; // Earth radius in km
  const lat1 = point1[0] * Math.PI / 180;
  const lat2 = point2[0] * Math.PI / 180;
  const deltaLat = (point2[0] - point1[0]) * Math.PI / 180;
  const deltaLon = (point2[1] - point1[1]) * Math.PI / 180;
  
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};
```

### 4. Management-Views (UI)

**User Story:** Als User möchte ich all meine Marker und Pfade sehen und verwalten können.

**Neue Views/Komponenten:**
- [ ] **MarkerList Component:** Liste aller User-Marker
- [ ] **PathList Component:** Liste aller gespeicherten Pfade
- [ ] **MarkerDetailModal:** Marker bearbeiten/löschen
- [ ] **PathDetailModal:** Pfad anzeigen/umbenennen/löschen

**UI-Konzept:**

```vue
<!-- components/MarkerList.vue -->
<template>
  <div class="card bg-base-200">
    <div class="card-body">
      <h2 class="card-title">Meine Marker ({{ markers.length }})</h2>
      
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Koordinaten</th>
              <th>Erstellt</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="marker in markers" :key="marker.id">
              <td>{{ marker.label || 'Unnamed' }}</td>
              <td>{{ formatCoords(marker.position) }}</td>
              <td>{{ formatDate(marker.timestamp) }}</td>
              <td>
                <button @click="showOnMap(marker)" class="btn btn-xs btn-primary">
                  Auf Karte
                </button>
                <button @click="editMarker(marker)" class="btn btn-xs btn-ghost">
                  Bearbeiten
                </button>
                <button @click="deleteMarker(marker.id)" class="btn btn-xs btn-error">
                  Löschen
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
```

---

## Implementierungs-Plan

### Phase 1: Erweiterte Marker-Funktionalität (JETZT)
**Geschätzte Zeit:** 2-3 Stunden

1. [ ] **Erweitere UserMarker Interface**
   - Füge `label`, `description`, `timestamp`, `category` hinzu
   - Update Store-Methoden

2. [ ] **Marker-Modal erstellen**
   - Component: `MarkerFormModal.vue`
   - Inputs: Name, Beschreibung, Kategorie-Dropdown
   - Integration in MapView Click-Handler

3. [ ] **Popup-Improvement**
   - Zeige alle Marker-Metadaten in Popup
   - Edit-Button im Popup

4. [ ] **Testing:**
   - Marker mit Metadaten erstellen
   - Anzeige prüfen
   - Löschen prüfen

### Phase 2: GPS-Tracking (Nächster Schritt)
**Geschätzte Zeit:** 2-3 Stunden

5. [ ] **watchPosition implementieren**
   - `startTracking()`, `stopTracking()`
   - GPS-State Management

6. [ ] **Accuracy Circle**
   - L.Circle Component für Genauigkeit
   - Dynamisch an userLocation gebunden

7. [ ] **Auto-Center Toggle**
   - Button in Navbar
   - State im Store

8. [ ] **Testing:**
   - GPS-Tracking starten/stoppen
   - Genauigkeits-Kreis prüfen
   - Auto-Center funktioniert

### Phase 3: Pfad-Erweiterungen
**Geschätzte Zeit:** 3-4 Stunden

9. [ ] **PathPoint mit Timestamps**
   - Erweitere Datenstruktur
   - Recording mit Timestamps

10. [ ] **Distanz-Berechnung**
    - Haversine-Formel implementieren
    - Echtzeit-Anzeige während Recording

11. [ ] **Pfad-Namen-Modal**
    - Beim Stop Recording öffnet sich Modal
    - User gibt Namen ein

12. [ ] **Testing:**
    - Pfad aufzeichnen
    - Distanz korrekt?
    - Namen vergeben

### Phase 4: Management-UI
**Geschätzte Zeit:** 4-6 Stunden

13. [ ] **MarkerList Component**
    - Tabellen-View aller Marker
    - Filter/Sortierung

14. [ ] **PathList Component**
    - Liste aller Pfade
    - Statistiken anzeigen

15. [ ] **Detail-Modals**
    - MarkerDetail mit Edit
    - PathDetail mit Statistiken

16. [ ] **Integration in Navigation**
    - Neue View "Meine Punkte" oder in ProfileView

17. [ ] **Testing:**
    - Liste wird korrekt angezeigt
    - Bearbeiten funktioniert
    - Löschen funktioniert

### Phase 5: Polish & UX (Optional)
**Geschätzte Zeit:** 2-3 Stunden

18. [ ] **Visual Feedback**
    - Toast-Notifications beim Speichern
    - Loading-States
    - Animations

19. [ ] **Keyboard Shortcuts**
    - M = Marker setzen
    - R = Recording toggle
    - ESC = Modal schließen

20. [ ] **Error Handling**
    - GPS nicht verfügbar
    - Permission denied
    - User-friendly Messages

---

## Technische Entscheidungen

### Speicherung: Pinia Store (Session-Based)

**Warum kein LocalStorage (zunächst)?**
- Einfacher zu debuggen
- Keine Serialisierungs-Komplexität
- Schnellere Iteration während Entwicklung
- Bei Reload → Fresh Start (ist OK für MVP)

**Später Migration zu LocalStorage:**
```typescript
// stores/mapStore.ts

// Mit Pinia Persistence Plugin
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useMapStore = defineStore('map', () => {
  // State
  const userMarkers = useLocalStorage<UserMarker[]>('druid-markers', []);
  const savedPaths = useLocalStorage<SavedPath[]>('druid-paths', []);
  
  // ... Rest des Stores
});
```

### Array-Management

**Best Practices:**
- IDs inkrementell (nicht UUID für einfacheren Debug)
- `Array.push()` für neue Items
- `Array.filter()` für Löschen
- `Array.map()` für Updates

**Performance:**
- Aktuell keine Pagination nötig (< 100 Items erwartet)
- Später bei vielen Markern: Virtual Scrolling in Listen

---

## Offene Fragen

1. **Kategorien:** Welche Standard-Kategorien für User-Marker?
   - Vorschlag: 'waypoint', 'photo-spot', 'parking', 'campsite', 'danger', 'other'

2. **Pfad-Aufzeichnung:** Nur manuell oder auch automatisch während Bewegung?
   - Vorschlag: Beide Modi - "Auto-Track" und "Manual Points"

3. **Icons:** Sollen User-Marker eigene Icons bekommen?
   - Vorschlag: Ja, aber erst später (Phase 5)

4. **Fotos:** Upload-Funktionalität gewünscht?
   - Vorschlag: Nicht im MVP, aber Struktur vorbereiten (`photoUrl?: string`)

---

## Erfolgs-Kriterien

### Must-Have (MVP)
- ✅ User kann Marker mit Namen/Beschreibung setzen
- ✅ Marker werden in Array gespeichert
- ✅ Marker können gelöscht werden
- ✅ GPS-Position wird korrekt erfasst
- ✅ Recording speichert Pfade mit Metadaten
- ✅ Distanz-Berechnung funktioniert

### Nice-to-Have
- ⭐ GPS-Tracking (continuous)
- ⭐ Management-Listen-View
- ⭐ Pfad-Statistiken in Echtzeit
- ⭐ Marker-Kategorien mit Icons
- ⭐ Export als GPX (später)

---

## Nächster Schritt (JETZT)

**Phase 1 starten:** Erweiterte Marker-Funktionalität

1. UserMarker Interface erweitern
2. `addUserMarkerWithMetadata()` implementieren
3. MarkerFormModal.vue erstellen
4. MapView Click-Handler mit Modal integrieren

**Geschätzte Zeit:** 2-3 Stunden  
**Ziel:** User kann benannte Marker mit Beschreibungen erstellen

---

**Autor:** GitHub Copilot  
**Letzte Aktualisierung:** 2025-01-30 (GPS & POI Management Start)
