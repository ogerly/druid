# Blueprint: DRUID App

## 1. Vision & Markenkern

DRUID ist eine Webanwendung, die archäologische Daten mit moderner Naturspiritualität und einem historisch-astronomischen Kalendersystem verbindet. Das Alleinstellungsmerkmal ist das **Evidenz-Labeling-System**, das zwischen wissenschaftlichen Fakten und subjektiven Erfahrungen unterscheidet.

## 2. Aktueller Fokus: MVP-Entwicklung

Wir beginnen mit der Entwicklung des **Minimum Viable Product (MVP)**, das sich auf die folgenden Kernfunktionen konzentriert:

- **Interaktive Karte:** Eine Leaflet-basierte Karte zur Darstellung von POIs.
- **GPS-Funktionalität:** Setzen von Markern und Aufzeichnen von Wegen.
- **Offline-Fähigkeit:** Grundlegende Offline-Unterstützung wird von Anfang an mitgedacht.

## 3. Dateistruktur

```
/src
|-- /assets
|-- /components
|   |-- MapView.vue
|-- /composables
|   |-- useMap.js
|-- /stores
|-- /views
|-- App.vue
|-- main.ts
|-- style.css
```

## 4. Geplante Schritte

1. **Grundstruktur anlegen:** Erstellen der oben genannten Ordner und Dateien. (erledigt)
2. **Abhängigkeiten installieren:** Hinzufügen von `leaflet` und `@vue-leaflet/vue-leaflet`. (erledigt)
3. **Karten-Komponente erstellen:** Entwickeln einer `MapView.vue`-Komponente. (erledigt)
4. **Karten-Logik auslagern:** Erstellen eines `useMap.js`-Composables. (erledigt)
5. **Integration:** Einbinden der `MapView` in die `App.vue`. (erledigt)
6. **GPS-Zentrierung:** Button und Logik zum Zentrieren der Karte auf die aktuelle Benutzerposition hinzugefügt. (erledigt)
7. **Marker setzen:** Manuelles Setzen von Markern per Klick auf die Karte ermöglicht. (erledigt)
8. **Wegaufzeichnung:** Implementieren der Funktion zum Aufzeichnen und Anzeigen von Wegen.
