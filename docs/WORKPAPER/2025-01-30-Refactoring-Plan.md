# Refactoring-Plan: DRUID Map-Implementierung

**Datum:** 2025-01-30  
**Status:** Analyse abgeschlossen, Implementierung ausstehend

## Problem-Analyse

Die DRUID-Anwendung zeigt die Leaflet-Karte nicht an. Nach gründlicher Analyse wurden folgende kritische Probleme identifiziert:

### 1. Doppelte MapView-Komponenten

Es existieren **zwei verschiedene MapView-Komponenten** mit unterschiedlichen Implementierungen:

- **`src/views/MapView.vue`** (neuere Version)
  - Verwendet `@vue-leaflet/vue-leaflet` Komponenten
  - Nutzt Pinia Store (`mapStore`)
  - Nutzt `usePois` Composable
  - Hat rudimentäre Methoden (`centerOnUser`, `toggleRecording`, `clearPath`) ohne Implementierung

- **`src/components/MapView.vue`** (ältere Version)
  - Verwendet ebenfalls `@vue-leaflet/vue-leaflet`
  - Nutzt `useMap` Composable (JavaScript)
  - Hat funktionierende Implementierungen für Recording, Marker, Pfade
  - Wird aktuell **NICHT** verwendet

**Problem:** Der Router lädt `views/MapView.vue`, aber diese Komponente hat keine funktionierenden Implementierungen.

### 2. Inkonsistente State-Management-Architektur

Es gibt zwei parallele State-Management-Systeme, die nicht zusammenarbeiten:

#### System A: Pinia Store + usePois (TypeScript)
- **`stores/mapStore.ts`**: Verwaltet Karten-Center, Zoom, POI-Selektion
- **`composables/usePois.ts`**: Verwaltet POI-Daten und Icons
- Wird in `views/MapView.vue` verwendet
- **Vorteil:** TypeScript, moderne Best Practices
- **Nachteil:** Unvollständig, keine GPS-Funktionalität

#### System B: useMap Composable (JavaScript)
- **`composables/useMap.js`**: Verwaltet Map-Instanz, GPS, Recording, Pfade
- Wird in `components/MapView.vue` verwendet
- **Vorteil:** Vollständige GPS- und Recording-Funktionalität
- **Nachteil:** JavaScript, veraltetes Pattern

**Problem:** Beide Systeme arbeiten nicht zusammen. Es fehlt eine einheitliche State-Management-Strategie.

### 3. Fehlende GPS-Funktionalität in der aktiven View

Die `views/MapView.vue` hat leere Methoden:

```typescript
const centerOnUser = () => {
  // Implementation for centering on user can be added here
  // For example, using the Geolocation API
}

const toggleRecording = () => {
  // Implementation for toggling recording
}

const clearPath = () => {
  // Implementation for clearing a path
}
```

**Problem:** Die Navbar ruft diese Methoden auf, aber sie tun nichts.

### 4. App.vue Ref-Probleme

`App.vue` versucht, Methoden auf `mapViewRef.value` aufzurufen, aber:
- Der Ref wird auf das Router-View-Component gesetzt (generisch)
- Es gibt keine Garantie, dass die Methoden existieren
- Type-Safety fehlt komplett

```vue
const mapViewRef = ref(null);

const centerOnUser = () => {
  if (mapViewRef.value && mapViewRef.value.centerOnUser) {
    mapViewRef.value.centerOnUser();
  }
};
```

**Problem:** Fragiles Pattern, keine Type-Safety, funktioniert nicht zuverlässig.

### 5. Fehlende Leaflet CSS-Imports

Die Views importieren zwar `leaflet/dist/leaflet.css`, aber es ist nicht klar, ob dies korrekt in Vite gebaut wird.

### 6. POI-Daten unvollständig

Die `usePois.ts` hat nur Demo-Daten mit Koordinaten für London:
```typescript
{ id: 1, name: 'Historic Museum', coords: [51.51, -0.1], category: 'culture' }
```

**Problem:** Das passt nicht zur Deutschland-Fokussierung laut Whitepaper.

---

## Refactoring-Strategie

### Phase 1: Aufräumen und Konsolidieren (KRITISCH)

#### 1.1. MapView-Komponenten zusammenführen
- [ ] **LÖSCHEN:** `src/components/MapView.vue` (veraltet)
- [ ] **MIGRIEREN:** Funktionierende Logik nach `src/views/MapView.vue`
- [ ] **VEREINHEITLICHEN:** Eine einzige MapView-Komponente mit vollständiger Funktionalität

#### 1.2. State-Management vereinheitlichen
- [ ] **ENTSCHEIDEN:** Pinia Store als Single Source of Truth
- [ ] **MIGRIEREN:** GPS, Recording, Pfade in `mapStore.ts` integrieren
- [ ] **LÖSCHEN:** `composables/useMap.js` (redundant)
- [ ] **KONVERTIEREN:** `usePois.ts` → TypeScript-Integration mit Store

#### 1.3. App.vue-Architektur verbessern
- [ ] **ENTFERNEN:** Direkte Methoden-Aufrufe auf MapView-Ref
- [ ] **IMPLEMENTIEREN:** Event-Bus oder Pinia Store für Kommunikation
- [ ] **ALTERNATIVE:** Provide/Inject Pattern für Navbar → MapView Kommunikation

### Phase 2: Feature-Vervollständigung

#### 2.1. GPS-Funktionalität implementieren
- [ ] Geolocation API in `mapStore.ts` integrieren
- [ ] `centerOnUser()` korrekt implementieren
- [ ] User-Position als Marker auf Karte anzeigen
- [ ] Permission-Handling (Allow/Deny GPS)

#### 2.2. Recording-Funktionalität implementieren
- [ ] `toggleRecording()` in Store implementieren
- [ ] `clearPath()` in Store implementieren
- [ ] Pfad-Polyline auf Karte zeichnen
- [ ] Pfad-Daten speichern (localStorage oder Pinia-Persistence)

#### 2.3. Marker-Funktionalität implementieren
- [ ] Manuelle Marker auf Karte setzen (Klick-Event)
- [ ] Marker in Store persistieren
- [ ] Marker-Management (Löschen, Bearbeiten)

### Phase 3: Daten und UX

#### 3.1. POI-Daten kuratieren
- [ ] Deutsche POIs gemäß Whitepaper recherchieren
- [ ] 50-100 bedeutsame Orte sammeln:
  - Keltenwelt am Glauberg
  - Externsteine
  - Heuneburg
  - Weitere...
- [ ] Kategorisierung nach Evidenz-Level:
  - Archäologisch
  - Rekonstruiert
  - Natur & Mythos
- [ ] Datenstruktur mit Beschreibungen und Quellen

#### 3.2. POI-Detailansicht
- [ ] Sidebar/Modal für POI-Details
- [ ] "Ich war hier"-Button implementieren
- [ ] Quellenangaben anzeigen
- [ ] Bilder (optional, später)

#### 3.3. Filter-Funktionalität
- [ ] Filter-UI in Sidebar
- [ ] Kategorie-Filter für POIs
- [ ] Store-Integration für Filter-State

### Phase 4: Technische Verbesserungen

#### 4.1. TypeScript-Konsistenz
- [ ] Alle `.js` Dateien zu `.ts` konvertieren
- [ ] Interfaces für POIs, Marker, Paths definieren
- [ ] Type-Safety durchgängig gewährleisten

#### 4.2. Error Handling
- [ ] GPS-Fehlerbehandlung (Permission denied, Timeout)
- [ ] Karten-Lade-Fehler (Offline, Netzwerk)
- [ ] User-Feedback (Toasts, Notifications)

#### 4.3. Performance
- [ ] Lazy-Loading für POI-Marker (zu viele Marker)
- [ ] Clustering für dichte POI-Gebiete
- [ ] Offline-Karten vorbereiten (PWA, später)

---

## Empfohlene Implementierungs-Reihenfolge

### Sprint 1: Kritische Fixes (1-2 Tage)
1. MapView-Komponenten konsolidieren
2. State-Management auf Pinia Store migrieren
3. GPS-Funktionalität in Store implementieren
4. Karte zum Laufen bringen (Minimal Viable Product)

### Sprint 2: Feature-Komplettierung (2-3 Tage)
5. Recording und Pfade vollständig implementieren
6. Marker-Management
7. App.vue Architektur verbessern
8. Error Handling

### Sprint 3: Daten und UX (3-5 Tage)
9. POI-Daten recherchieren und integrieren
10. POI-Detailansicht
11. Filter-Funktionalität
12. UI-Polish (Animationen, Feedback)

---

## Technische Entscheidungen

### Store-Struktur (Empfehlung)

```typescript
// stores/mapStore.ts
interface MapState {
  // Karten-Ansicht
  center: [number, number];
  zoom: number;
  
  // GPS
  userLocation: [number, number] | null;
  isLocating: boolean;
  
  // Recording
  isRecording: boolean;
  currentPath: [number, number][];
  savedPaths: Path[];
  
  // Marker
  userMarkers: Marker[];
  
  // POIs
  pois: POI[];
  selectedPoiId: string | null;
  activeFilters: string[];
}
```

### Kommunikation Navbar → MapView

**Option A: Store (Empfohlen)**
- Navbar ändert Store-State
- MapView reagiert auf Store-Änderungen
- Entkoppelt, testbar

**Option B: Provide/Inject**
- MapView stellt Methoden via `provide()` bereit
- Navbar nutzt `inject()` zum Aufrufen
- Vue-idiomatisch, aber enger gekoppelt

**Entscheidung:** Option A (Store) für bessere Testbarkeit und Wartbarkeit.

---

## Offene Fragen

1. **Offline-Modus:** Wann soll dies implementiert werden? (Post-MVP?)
2. **POI-Datenquelle:** Manuelle Kuration oder API-Integration?
3. **Deployment:** GitHub Pages Base-Path korrekt konfiguriert?
4. **Design-System:** DaisyUI Theme anpassen an "Night Mode"-Ästhetik?

---

## Nächste Schritte

1. **Bestätigung:** Refactoring-Plan mit Team/Lead abstimmen
2. **Backup:** Git-Branch für Refactoring erstellen
3. **Implementierung:** Mit Sprint 1 beginnen
4. **Testing:** Nach jedem Sprint manuell testen
5. **Dokumentation:** README.md aktualisieren

---

## Abhängigkeiten und Risiken

### Abhängigkeiten
- Keine neuen npm-Pakete nötig
- Leaflet und Vue-Leaflet bereits installiert
- TypeScript-Konfiguration bereits vorhanden

### Risiken
- **Migrations-Komplexität:** Store-Migration könnte unerwartete Bugs verursachen
- **GPS-Permissions:** Browser-Permissions können problematisch sein
- **Performance:** Viele POIs könnten Karte verlangsamen (Clustering notwendig)

### Mitigationen
- Schrittweise Migration mit Tests
- Error-Handling für GPS frühzeitig implementieren
- Performance-Testing mit vielen POIs vor Produktiv-Daten

---

**Autor:** GitHub Copilot  
**Letzte Aktualisierung:** 2025-01-30
