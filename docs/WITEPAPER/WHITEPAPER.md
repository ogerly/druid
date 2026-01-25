# DRUID Project Whitepaper

## 1. Vision & Einleitung

**DRUID** ist eine mobile Web-Anwendung, die eine Brücke zwischen der modernen digitalen Welt und dem alten Erbe Europas schlägt. In einer Zeit, in der sich viele Menschen nach Naturverbundenheit und authentischen Erlebnissen sehnen, bietet DRUID ein Werkzeug, um vergessene Pfade, heilige Orte und historische Stätten der keltischen und vorchristlichen Kultur neu zu entdecken.

Unsere Vision ist es, mehr als nur eine Navigations-App zu sein. DRUID soll ein interaktiver Begleiter für den modernen Entdecker werden – ein digitales Notizbuch, das historisches Wissen, persönliche Erlebnisse und die Mystik der Natur an einem Ort vereint.

**Zielgruppe:**
*   Geschichts- und Archäologie-Enthusiasten
*   Wanderer und Naturfreunde
*   Spirituell Suchende mit Interesse an europäischem Heidentum und Naturreligionen
*   Reisende, die abseits der ausgetretenen Pfade nach einzigartigen Orten suchen

## 2. Kernkonzept: Die Interaktive Karte

Das Herzstück der Anwendung ist eine immersive, interaktive Karte, die als primäre Benutzeroberfläche dient. Dieser "Map-First"-Ansatz macht die App sofort nützlich und weckt den Entdeckergeist.

Die Karte dient drei Hauptzwecken:

1.  **Orientierung:** Anzeige der eigenen Position und der Umgebung.
2.  **Entdeckung:** Visualisierung von Points of Interest (POIs) mit klaren Kategorien.
3.  **Dokumentation:** Aufzeichnung und Speicherung eigener Routen und Funde.

## 3. Geplante Features (MVP)

Um schnell einen Mehrwert zu schaffen und Feedback aus der Community zu sammeln, konzentriert sich das Minimum Viable Product (MVP) auf folgende Kernfunktionen:

*   **Interaktive Karte:**
    *   Darstellung von POIs mit drei Evidenz-Kategorien (Archäologisch, Rekonstruiert, Natur & Mythos).
    *   Filterung der POIs nach Kategorie.
    *   Funktion zur Zentrierung auf den eigenen Standort.

*   **Weg-Aufzeichnung:**
    *   Einfache Funktion zum Starten, Stoppen und Speichern der eigenen Wegstrecke als Polyline auf der Karte.

*   **Detail-Ansicht für POIs:**
    *   Beim Klick auf einen POI öffnet sich eine Detail-Ansicht mit:
        *   Name und Beschreibung.
        *   Quellenangaben (z.B. Wikipedia-Links, Literatur).
        *   Einem "Ich war hier"-Button, um den Besuch zu protokollieren.

*   **Content-Basis:**
    *   Zum Start wird die App eine kuratierte Datenbank von ca. 50-100 bedeutsamen Orten in Deutschland enthalten (z.B. Keltenwelt am Glauberg, Externsteine, Heuneburg).

## 4. Design-Philosophie & UI

Das Design ist "Mobile-First" und auf eine intuitive, ablenkungsfreie Nutzung im Freien ausgelegt.

*   **Layout:** Eine feste Navbar am oberen Rand bietet schnellen Zugriff auf Aktionen (Zentrieren, Aufnehmen) und ein Hamburger-Menü für weitere Optionen (Profil, Einstellungen). Eine ausklappbare Sidebar dient der Navigation.
*   **Atmosphäre:** Das UI wird eine dunkle, naturnahe Farbpalette verwenden ("Night Mode"-Ästhetik), um die Mystik des Themas zu unterstreichen und die Augen bei Dämmerung zu schonen.

## 5. Zukunftsvision (Post-MVP)

Nach einem erfolgreichen MVP-Launch sind folgende Erweiterungen denkbar:

*   **Wheel-of-the-Year-Kalender:** Ein radiales UI, das den Sonnen- und Mondzyklus visualisiert und mit Ritualen oder historischen Ereignissen verknüpft werden kann.
*   **Community-Features:** Nutzer können eigene Orte vorschlagen, die nach redaktioneller Prüfung freigeschaltet werden.
*   **Events-Modul:** Veranstalter können Feste, Rituale oder Workshops eintragen (Potenzial für Monetarisierung).
*   **Gamification:** Ein Ogham-Übersetzer oder das Sammeln von besuchten Orten könnte das Engagement steigern.

## 6. Technischer Stack

DRUID wird als moderne Single-Page-Application (SPA) mit folgenden Technologien entwickelt:

*   **Frontend:** Vue.js 3 (Composition API)
*   **Build-Tool:** Vite
*   **Karten:** Leaflet.js
*   **Sprache:** TypeScript
