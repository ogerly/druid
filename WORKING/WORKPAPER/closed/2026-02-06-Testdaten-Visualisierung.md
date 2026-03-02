# Logpaper: 2026-02-06 - Verarbeitung und Visualisierung von Test-GPS-Daten

## Ziel

Die vom Benutzer bereitgestellten Test-GPS-Daten aus der Datei `Test_1_9e904624.json` sollen verarbeitet und auf einer OpenStreetMap-Karte visualisiert werden. Dies dient als Grundlage für die Entwicklung der GPS-Tracking-Anzeige in der DRUID-Anwendung.

## Anmerkungen aus dem User-Feedback

*   **Tracking-Intervall:** Das aktuelle 1-Minuten-Intervall ist für städtische Gebiete zu lang. Ein Intervall von 30 Sekunden wird für zukünftige Versionen empfohlen, um eine höhere Genauigkeit bei Abbiegungen zu erreichen. Für Wanderungen in der Natur scheint 1 Minute ausreichend.
*   **Weg-Visualisierung:** Der Wunsch besteht darin, den exakten Wegverlauf auf den Straßen nachzuzeichnen, anstatt nur gerade Linien zwischen den GPS-Punkten zu ziehen. Dieses Verfahren wird als "Map Matching" oder "Snap-to-Road" bezeichnet.

## Aufgaben

1.  **Datenintegration:** Die Test-JSON-Datei (`Test_1_9e904624.json`) wird in das Projekt verschoben, um einen einfachen Zugriff zu ermöglichen (z.B. nach `src/data/`).
2.  **Daten laden:** Einrichten der `MapView.vue`-Komponente, um die GPS-Daten aus der JSON-Datei zu laden und zu parsen.
3.  **Basisanzeige (Linien):**
    *   Darstellung der GPS-Punkte als Marker auf der Karte in `MapView.vue`.
    *   Zeichnen von geraden Linien (Polyline) zwischen den aufeinanderfolgenden GPS-Punkten, um die zurückgelegte Strecke darzustellen.
4.  **Recherche "Snap-to-Road":**
    *   Untersuchung von Open-Source-Bibliotheken oder APIs (z.B. OSRM, GraphHopper, Mapbox Matching API), um die GPS-Punkte auf das Straßennetz von OpenStreetMap zu "snappen".
    *   Dokumentation der Vor- und Nachteile der verschiedenen Optionen.
5.  **Implementierung (Optional/Nächster Schritt):** Basierend auf der Recherche, Implementierung einer Snap-to-Road-Funktionalität.
6.  **Blueprint Aktualisierung:** Das `blueprint.md` wird aktualisiert, um die neuen Funktionen zur Track-Visualisierung zu dokumentieren.
