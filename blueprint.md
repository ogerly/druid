# Blueprint: Druid GPS-Tracker

## 1. Projektübersicht

**Druid** ist eine moderne, interaktive Web-Anwendung zum GPS-Tracking von Wanderungen. Die App ermöglicht es Benutzern, ihre Routen in Echtzeit auf einer Karte zu verfolgen, aufgezeichnete Tracks zu verwalten, Statistiken einzusehen und ihre Daten zu exportieren. Das Projekt ist als Single-Page-Application (SPA) mit Vue.js und einem optionalen, serverlosen Backend konzipiert.

### Kernfunktionen

- **Live-Tracking:** Position in Echtzeit auf einer interaktiven Leaflet-Karte anzeigen.
- **Track-Management:** Eine Liste aller vergangenen Wanderungen mit detaillierten Statistiken.
- **Interaktive Karte:** Anzeige von Routen, Wegpunkten und wichtigen Informationen.
- **Daten-Persistenz:** Speicherung der Tracking-Daten lokal im Browser mit `dexie.js` (IndexedDB).
- **Responsive Design:** Voll funktionsfähig auf mobilen Geräten und Desktops.

## 2. Technologiestack & Design

### Frontend

- **Framework:** Vue.js 3 mit Composition API (`<script setup>`)
- **Sprache:** TypeScript
- **Build-Tool:** Vite
- **Routing:** Vue Router
- **State Management:** Pinia
- **Karten-Bibliothek:** Leaflet & Vue-Leaflet
- **Datenbank:** `dexie.js` (für lokale IndexedDB)
- **Styling:** Tailwind CSS mit dem `daisyUI`-Plugin für eine moderne Komponenten-Ästhetik.
- **Icons:** `vue-feather` für klare und konsistente Ikonographie.

### Design-Philosophie

- **Modern & Sauber:** Einsatz von `daisyUI`-Komponenten (`card`, `btn`, `stats`, etc.) für ein schnelles und ansprechendes UI.
- **Visuelle Hierarchie:** Klare Abgrenzung von Sektionen durch Schatten (`shadow-xl`), Abstände und eine durchdachte Typografie.
- **Interaktivität:** Visuelles Feedback bei Aktionen durch Hover-Effekte (`hover:shadow-2xl`) und Ladeindikatoren (`loading-spinner`).
- **Farbpalette:** Verwendung der Standard-`daisyUI`-Themen (`primary`, `secondary`, `accent`) für eine konsistente Farbgebung.

## 3. Aktueller Projektstatus & Features

### Implementierte Ansichten

1.  **Map View (`/`):**
    - Zeigt eine Leaflet-Karte, zentriert auf einen Standardort.
    - Integriert Steuerelemente für Zoom.
    - Dient als Hauptansicht für das Live-Tracking.

2.  **Tracks View (`/tracks`):
    - Listet alle gespeicherten Wanderungen in einer Kartenansicht (`card`).
    - Zeigt für jeden Track detaillierte Statistiken an: Distanz, Dauer, Durchschnitts- und Maximalgeschwindigkeit.
    - Bietet Aktionen pro Track: Auf Karte anzeigen, Umbenennen, Exportieren (JSON) und Löschen.
    - Ein- und ausklappbare Detailansicht zur Anzeige aller Wegpunkte eines Tracks in einer Tabelle.
    - Implementierung eines Test-Tracks (`Test_1_9e904624.json`), der zur Laufzeit aus dem `public`-Ordner geladen wird, um das Build-System nicht zu blockieren.

### Navigation

- Eine persistente `BottomNavBar` am unteren Bildschirmrand für den schnellen Wechsel zwischen den Hauptansichten (Karte, Tracks, Orte, Kalender, Profil).

### Daten-Management

- **`trackDatabase.ts`:** Definiert die IndexedDB-Datenbank mit `dexie.js`, inklusive des `tracks`-Stores mit einem Schema für alle relevanten Tracking-Daten.
- **Lokale Daten:** Alle Tracks werden im Browser des Benutzers gespeichert, was die App offline-fähig macht.

## 4. Hosting & Deployment

### Phase 1: Statisches Frontend (Abgeschlossen)

- **Plattform:** GitHub Pages
- **Status:** Erfolgreich deployed.
- **Prozess:** Ein `deploy`-Skript in `package.json` (`gh-pages -d dist`) baut die Anwendung und veröffentlicht den `dist`-Ordner auf dem `gh-pages`-Branch.
- **Konfiguration:** `vite.config.ts` ist mit `base: '/druid/'` für das Deployment in einem Unterverzeichnis konfiguriert.

### Phase 2: Full-Stack-Anwendung (In Arbeit)

- **Plattform:** Vercel
- **Ziel:** Hosting der Vue.js-Frontend-Anwendung zusammen mit einem serverlosen Node.js-Backend zur Nutzung von sicheren API-Schlüsseln (z.B. für Supabase).
- **Aktueller Stand:**
    - Ein Vercel-Projekt wurde für das `druid`-GitHub-Repository erstellt.
    - **Problem:** Das initiale Deployment auf Vercel ist fehlgeschlagen.
    - **Grund:** Der Build-Prozess auf Vercel ist auf denselben TypeScript-Fehler (`TS2307: Cannot find module`) gestoßen, der zuvor lokal aufgetreten ist. Dies liegt daran, dass der `main`-Branch auf GitHub die letzten Korrekturen (Umstellung von JSON-Import auf `fetch`) noch nicht enthält.
- **Nächster Schritt:** Die lokalen, funktionierenden Code-Änderungen müssen in die `main`-Branch auf GitHub gepusht werden. Anschließend wird das Deployment auf Vercel automatisch neu angestoßen und sollte erfolgreich sein.
