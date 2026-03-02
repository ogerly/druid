# Workpaper: 2026-02-09 - Track-Visualisierung und Intervall-Anpassung

## Ziel

Dieses Workpaper beschreibt die Umsetzung von zwei zentralen User-Feedbacks: Die Verkürzung des GPS-Tracking-Intervalls für präzisere Aufzeichnungen in städtischen Gebieten und die Visualisierung eines aufgezeichneten Tracks auf der Karte.

## User-Story & Anforderungen

Als Benutzer möchte ich:
1.  ein kürzeres Tracking-Intervall von 30 Sekunden auswählen können, um auch bei geringeren Geschwindigkeiten und häufigen Richtungswechseln (z.B. in der Stadt) eine genaue Route aufzuzeichnen.
2.  meine aufgezeichneten Tracks in einer Liste sehen.
3.  einen ausgewählten Track auf der Karte anzeigen lassen, um meinen Weg nachzuvollziehen.
4.  (Zukünftig) Der angezeigte Weg soll nicht nur aus geraden Linien bestehen, sondern dem tatsächlichen Straßenverlauf folgen ("Snap-to-Road").

## Aufgaben

### Phase 1: Anpassungen & Daten-Setup

- [✅] **JSON-Testdaten speichern:** Die bereitgestellte Datei `Test_1_9e904624.json` wurde im Verzeichnis `docs/example_data/` gespeichert.
- [✅] **Tracking-Intervall anpassen:** Die Komponente `src/components/TrackingControl.vue` wurde angepasst, um ein 30-Sekunden-Intervall zu ermöglichen.

### Phase 2: Track-Visualisierung (MVP)

- [✅] **Track-Liste erstellen:** `src/views/TracksView.vue` lädt jetzt einen Test-Track und zeigt ihn an.
- [✅] **Zustandsverwaltung für Tracks:** Der `mapStore` (`src/stores/mapStore.ts`) wurde um `trackToDisplay` und `displayTrack` erweitert.
- [✅] **Kartenansicht erweitern:** `src/views/MapView.vue` reagiert auf den `mapStore`, zeichnet den Track als Polyline und zoomt automatisch auf den Track.
- [✅] **Interaktion implementieren:** Der "Auf Karte anzeigen"-Button in `TracksView.vue` löst die Anzeige auf der Karte aus.

### Phase 3: Zukünftige Erweiterung (Snap-to-Road)

- [ ] **Recherche:** Evaluierung von Diensten für Snap-to-Road (z.B. OSRM, GraphHopper, Mapbox Matching API).
- [ ] **Implementierung:** Integration des ausgewählten Dienstes.
