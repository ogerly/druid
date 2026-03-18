# Druid Application Blueprint

## 1. Zweck & Funktionen

Druid ist eine moderne, karten-zentrierte Webanwendung, die für das Tracking, die Verwaltung und die Visualisierung von persönlichen Sonderzielen (Points of Interest, POIs) und Bewegungsprofilen konzipiert wurde. Die Anwendung nutzt ein Vue.js-Frontend, ein Supabase-Backend für Authentifizierung sowie Datenspeicherung und wird auf Vercel gehostet. Die App ist vollständig responsiv, um eine nahtlose Benutzererfahrung auf Desktop- und Mobilgeräten zu gewährleisten.

## 2. Kernfunktionen & Design

### Stil- & Designphilosophie

- **Modern & Klar:** Die Benutzeroberfläche verwendet moderne Komponenten, ein visuell ausgewogenes Layout und ausgefeilte Stile.
- **Farbpalette:** Eine lebendige und energiegeladene Farbpalette schafft ein visuell ansprechendes Erlebnis.
- **Typografie:** Ausdrucksstarke Typografie wird verwendet, um eine klare visuelle Hierarchie zu schaffen.
- **Ikonografie:** Icons verbessern das Verständnis und die Navigation.
- **Interaktivität:** Interaktive Elemente haben einen "Glow"-Effekt und Schatten, um ein Gefühl von Tiefe zu erzeugen.

### Implementierte Features

- **Karten-zentrierte Oberfläche:** Das Herzstück ist eine interaktive Karte (Mapbox).
- **Benutzerauthentifizierung:** Sichere, passwortlose Anmeldung und Registrierung über Magic Links, die von Supabase Auth verwaltet werden. Dieses System ist vollständig implementiert und funktionsfähig.
- **Echtzeit-Daten:** Daten werden in Echtzeit abgerufen und verwaltet.
- **GPS-Tracking & Pfad-Management:** Die Anwendung kann den Standort des Benutzers verfolgen und als Pfad speichern.
- **Responsive Design:** Das Layout passt sich an verschiedene Bildschirmgrößen an.
- **Routing:** Das clientseitige Routing wird von Vue Router übernommen.

## 3. Architektur & Technologie-Stack

- **Frontend:** Vue.js 3 mit Composition API und `<script setup>`
- **State Management:** Pinia (globale Stores für Authentifizierung und Kartendaten)
- **Routing:** Vue Router
- **Build-Tool:** Vite
- **Backend-as-a-Service (BaaS):** Supabase
    - **Authentifizierung:** Supabase Auth (Magic Links)
    - **Datenbank:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Serverless-Funktionen:** Vercel Functions für sichere Backend-Logik (z.B. Magic-Link-Anforderung).
- **Kartografie:** Mapbox GL JS

## 4. Implementierungs-Log: Magic-Link-Authentifizierung

Dieser Abschnitt dokumentiert den Prozess und die wichtigsten Entscheidungen bei der Implementierung des Authentifizierungssystems.

**Ziel:** Eine sichere, passwortlose Authentifizierung mittels "Magic Links" über Supabase zu realisieren.

**1. Backend API (`/api/auth/magic-link`):**
- Es wurde eine Vercel Serverless-Funktion erstellt, um Anmeldeanfragen sicher zu verarbeiten.
- Diese Funktion empfängt die E-Mail des Benutzers, verwendet den serverseitigen Supabase-Admin-Client und ruft die `signInWithOtp`-Methode auf.
- **Architekturentscheidung:** Die `emailRedirectTo`-Option wurde explizit auf die Login-Seite der Produktions-URL (`https://druid-five.vercel.app/login`) gesetzt. Dies ist eine entscheidende Sicherheitsmaßnahme, die Supabase mitteilt, wohin der Benutzer nach dem Klick auf den Link geleitet werden soll.
- **Sicherheit:** Der Supabase Admin Client verwendet den `SUPABASE_SERVICE_ROLE_KEY`, der sicher als Umgebungsvariable in Vercel gespeichert ist und niemals im Frontend preisgegeben wird.

**2. Frontend-Implementierung & Debugging-Prozess:**
- **Login-UI (`LoginView.vue`):** Eine einfache Benutzeroberfläche wurde erstellt, um die E-Mail des Benutzers zu erfassen und die Backend-API aufzurufen.

- **Problemstellung:** Nach dem Klick auf den Magic Link landeten die Benutzer zwar auf der `/login`-Seite, wurden aber nicht automatisch in die App eingeloggt und zur Hauptansicht weitergeleitet.

- **Debugging Schritt 1: Race Condition identifiziert:**
    - Der ursprüngliche Ansatz, die `onAuthStateChange`-Logik sowohl in der globalen `App.vue` als auch lokal in der `LoginView.vue` zu platzieren, führte zu einer "Race Condition" – einem Konflikt, bei dem beide Komponenten versuchten, die Weiterleitung zu steuern. Dies verursachte unvorhersehbares Verhalten.

- **Debugging Schritt 2: Zentralisierung der Auth-Logik:**
    - **Lösung:** Die gesamte Logik zur Überwachung des Authentifizierungsstatus und zur Steuerung von Weiterleitungen wurde in der Wurzelkomponente `App.vue` zentralisiert. Dies stellt ein sauberes und robustes Architekturmuster dar.
    - Der `authStore` (Pinia) lauscht nun global auf das `onAuthStateChange`-Event von Supabase.
    - `App.vue` beobachtet den Benutzerstatus aus dem `authStore`. Wenn ein Benutzer sich authentifiziert (während er auf `/login` ist), leitet `App.vue` ihn zuverlässig zur Hauptseite (`/`) weiter. Die redundante Logik in `LoginView.vue` wurde entfernt.

- **Debugging Schritt 3: Supabase-Konfiguration korrigiert:**
    - **Finale Blockade:** Trotz des korrekten Codes schlug die Weiterleitung weiterhin fehl.
    - **Ursachenanalyse:** Die Überprüfung der Supabase-Projekteinstellungen zeigte, dass die `Redirect URLs`-Whitelist leer war.
    - **Lösung:** Aus Sicherheitsgründen verlangt Supabase, dass jede URL, die in `emailRedirectTo` verwendet wird, explizit in der Whitelist der `Redirect URLs` im Auth-Konfigurationspanel eingetragen sein muss.
    - **Aktion:** Die URL `https://druid-five.vercel.app/login` wurde zur Whitelist hinzugefügt, was das Problem endgültig löste.

**Finaler Status:** Der Authentifizierungs-Flow ist nun sicher, robust und bietet eine nahtlose Benutzererfahrung.
