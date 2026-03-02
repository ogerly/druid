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

### Phase 1: Statisches Frontend (Veraltet)

- **Plattform:** GitHub Pages
- **Status:** Abgelöst durch Vercel.

### Phase 2: Full-Stack-Anwendung (Aktiv)

- **Plattform:** Vercel
- **Live-URL:** [**https://druid-five.vercel.app**](https://druid-five.vercel.app)
- **Status:** **Erfolgreich deployed.**
- **Prozess:** Jeder Push auf die `main`-Branch löst automatisch ein neues Build- und Deployment-Verfahren auf Vercel aus. Die Plattform baut das Vite-Projekt und stellt das Ergebnis unter der primären Domain bereit.
- **Ziel:** Hosting der Vue.js-Frontend-Anwendung zusammen mit einem serverlosen Node.js-Backend zur Nutzung von sicheren API-Schlüsseln (z.B. für Supabase).
- **Nächster Schritt:** Aufbau des `/api`-Backends auf Vercel, Einrichten der Environment Variables (Secrets) und Implementierung der ersten sicheren Serverless-Funktion.
