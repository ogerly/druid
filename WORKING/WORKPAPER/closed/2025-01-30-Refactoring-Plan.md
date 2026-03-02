# Refactoring-Plan: DRUID Map-Implementierung

**Datum:** 2025-01-30  
**Status:** ✅ Sprint 1 abgeschlossen, GitHub Pages deployed, App funktionsfähig

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
- [x] **GELÖSCHT:** `src/components/MapView.vue` (veraltet) ✅
- [x] **MIGRIERT:** Funktionierende Logik nach `src/views/MapView.vue` ✅
- [x] **VEREINHEITLICHT:** Eine einzige MapView-Komponente mit vollständiger Funktionalität ✅

#### 1.2. State-Management vereinheitlichen
- [x] **ENTSCHIEDEN:** Pinia Store als Single Source of Truth ✅
- [x] **MIGRIERT:** GPS, Recording, Pfade in `mapStore.ts` integriert ✅
- [x] **GELÖSCHT:** `composables/useMap.js` (redundant) ✅
- [x] **INTEGRIERT:** `poisStore.ts` erstellt (von Gemini parallel) mit Kategorien und Icons ✅

#### 1.3. App.vue-Architektur verbessern
- [x] **ENTFERNT:** Direkte Methoden-Aufrufe auf MapView-Ref ✅
- [x] **IMPLEMENTIERT:** Pinia Store für Kommunikation Navbar ↔ MapView ✅
- [x] **PATTERN:** Store-basierte Architektur statt Ref-Zugriff ✅

### Phase 2: Feature-Vervollständigung

#### 2.1. GPS-Funktionalität implementieren
- [x] Geolocation API in `mapStore.ts` integriert ✅
- [x] `centerOnUser()` korrekt implementiert ✅
- [x] User-Position als Marker auf Karte angezeigt ✅
- [ ] Permission-Handling verbessern (Error-UI für Allow/Deny GPS)

#### 2.2. Recording-Funktionalität implementieren
- [x] `toggleRecording()` in Store implementiert ✅
- [x] `clearPath()` in Store implementiert ✅
- [x] Pfad-Polyline auf Karte gezeichnet ✅
- [x] Gespeicherte Pfade werden angezeigt ✅
- [ ] Pfad-Daten speichern (localStorage oder Pinia-Persistence)

#### 2.3. Marker-Funktionalität implementieren
- [x] Manuelle Marker auf Karte setzen (Klick-Event) ✅
- [x] Marker in Store persistiert ✅
- [x] Marker-Removal implementiert ✅
- [ ] Marker-Management UI (Bearbeiten, Liste)

### Phase 3: Daten und UX

#### 3.1. POI-Daten kuratieren
- [x] Deutsche POIs gemäß Whitepaper recherchiert ✅
- [x] Erste 3 bedeutsame Orte integriert: ✅
  - Keltenwelt am Glauberg (Hessen)
  - Externsteine (NRW)
  - Heuneburg (Baden-Württemberg)
- [x] Kategorisierung implementiert (culture, nature, food) ✅
- [x] Farbcodierte Marker nach Kategorie (blau, grün, orange) ✅
- [ ] Weitere 47-97 POIs sammeln und integrieren
- [ ] Datenstruktur mit Beschreibungen und Quellen erweitern

#### 3.2. POI-Detailansicht
- [x] PlacesView zeigt POI-Liste ✅
- [x] "Show on Map" Button navigiert zur Karte ✅
- [x] Kategorie-Badges angezeigt ✅
- [ ] Sidebar/Modal für erweiterte POI-Details
- [ ] "Ich war hier"-Button implementieren
- [ ] Quellenangaben anzeigen
- [ ] Bilder (optional, später)

#### 3.3. Filter-Funktionalität
- [ ] Filter-UI in Sidebar
- [ ] Kategorie-Filter für POIs
- [ ] Store-Integration für Filter-State

### Phase 4: Technische Verbesserungen

#### 4.1. TypeScript-Konsistenz
- [x] Alle `.js` Dateien zu `.ts` konvertiert ✅
- [x] Interfaces für POIs, Marker, Paths definiert ✅
- [x] Type-Safety durchgängig gewährleistet ✅

#### 4.2. Error Handling
- [x] TypeScript-Compiler-Errors behoben ✅
- [ ] GPS-Fehlerbehandlung verbessern (Permission denied, Timeout)
- [ ] Karten-Lade-Fehler (Offline, Netzwerk)
- [ ] User-Feedback (Toasts, Notifications)

#### 4.3. Performance
- [ ] Lazy-Loading für POI-Marker (zu viele Marker)
- [ ] Clustering für dichte POI-Gebiete
- [ ] Offline-Karten vorbereiten (PWA, später)

#### 4.4. Deployment ✅
- [x] GitHub Pages Workflow eingerichtet ✅
- [x] Vite Base-Path für Subpath konfiguriert ✅
- [x] Router Base-URL für Navigation gefixt ✅
- [x] Auto-Deploy bei Push auf `main` ✅
- [x] **Live unter:** `https://ogerly.github.io/druid/` ✅

---

## Empfohlene Implementierungs-Reihenfolge

### Sprint 1: Kritische Fixes ✅ ABGESCHLOSSEN
1. ✅ MapView-Komponenten konsolidiert
2. ✅ State-Management auf Pinia Store migriert
3. ✅ GPS-Funktionalität in Store implementiert
4. ✅ Recording & Marker-Funktionalität implementiert
5. ✅ Karte läuft (MVP erreicht)
6. ✅ GitHub Pages Deployment eingerichtet
7. ✅ TypeScript-Errors behoben

**Ergebnis:** App funktionsfähig unter `https://ogerly.github.io/druid/`

### Sprint 2: Feature-Komplettierung (TODO)
5. [ ] Error Handling für GPS/Karten-Fehler
6. [ ] Persistence für Pfade/Marker (localStorage)
7. [ ] Marker-Management UI
8. [ ] User-Feedback (Toasts/Notifications)

### Sprint 3: Daten und UX (TODO)
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
3. ~~**Deployment:** GitHub Pages Base-Path korrekt konfiguriert?~~ ✅ ERLEDIGT
4. **Design-System:** DaisyUI Theme anpassen an "Night Mode"-Ästhetik?

---

## Aktuelle Erfolge (30.01.2025)

### Gelöste Probleme
1. ✅ **Infinite Loop Bug:** Watch + v-model Konflikt behoben
2. ✅ **Store-Regression:** Volle GPS/Recording/Marker-Funktionalität wiederhergestellt
3. ✅ **Merge-Konflikt:** Gemini's poisStore erfolgreich integriert
4. ✅ **TypeScript-Errors:** Alle Build-Fehler behoben
5. ✅ **GitHub Pages:** Auto-Deployment funktioniert
6. ✅ **Router-Basepath:** Navigation auf GitHub Pages korrigiert

### Implementierte Features
- 🗺️ Leaflet-Karte mit OpenStreetMap
- 📍 GPS-Lokalisierung (User Location)
- 🎙️ Recording-Modus (Pfade aufzeichnen)
- 📌 User-Marker setzen (Klick auf Karte)
- 🏛️ 3 POIs mit Kategorien und farbigen Markern
- 🎨 DaisyUI-basiertes UI
- 📱 Responsive Layout
- 🚀 Auto-Deploy bei Git Push

---

## Nächste Schritte

1. ~~**Bestätigung:** Refactoring-Plan mit Team/Lead abstimmen~~ ✅ ERLEDIGT
2. ~~**Backup:** Git-Branch für Refactoring erstellen~~ ✅ ERLEDIGT (main Branch)
3. ~~**Implementierung:** Mit Sprint 1 beginnen~~ ✅ ABGESCHLOSSEN
4. ~~**Testing:** Nach jedem Sprint manuell testen~~ ✅ VALIDIERT
5. ~~**Dokumentation:** README.md aktualisieren~~ (Optional)
6. **Sprint 2 starten:** Error Handling und Persistence
7. **Sprint 3 planen:** Mehr POI-Daten kuratieren

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
