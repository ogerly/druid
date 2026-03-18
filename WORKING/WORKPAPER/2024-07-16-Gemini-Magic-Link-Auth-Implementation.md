# WORKPAPER: Magic-Link-Authentifizierung Implementierung & Debugging

- **DATE:** 2024-07-16
- **AGENT:** Gemini
- **STATUS:** Closed

## SESSION GOAL

Das Ziel dieser Sitzung war die Implementierung einer vollständigen, sicheren und passwortlosen Benutzerauthentifizierung mittels "Magic Links" unter Verwendung von Supabase. Dies umfasste das Backend-Setup, die Frontend-UI, die Zustandsverwaltung und die Behebung aller auftretenden Probleme, insbesondere des Problems, dass Benutzer nach dem Login nicht korrekt weitergeleitet wurden.

## OUTCOME

Die Magic-Link-Authentifizierung wurde erfolgreich implementiert, debuggt und ist nun voll funktionsfähig. Der Prozess umfasste die Erstellung einer serverseitigen Funktion, die Zentralisierung der Frontend-Authentifizierungslogik und die Korrektur einer serverseitigen Konfiguration in Supabase. Die gesamte Arbeit wurde im Code-Repository und in der Supabase-Konfiguration umgesetzt.

## WORK LOG

### 1. Problemidentifikation

- **Ausgangslage:** Benutzer konnten einen Magic Link anfordern, aber nach dem Klick auf den Link blieben sie auf der Login-Seite (`/login`) stecken. Sie wurden nicht zur Hauptanwendung weitergeleitet, obwohl die URL die Authentifizierungs-Tokens enthielt.

### 2. Backend API: Vercel Serverless Function

- **Aktion:** Eine serverseitige Funktion unter `/api/auth/magic-link` wurde erstellt, um die E-Mail des Benutzers zu empfangen.
- **Implementierung:** Diese Funktion verwendet den Supabase Admin Client (`supabase-js/server`), um die Methode `signInWithOtp` sicher aufzurufen. Der sensible `SERVICE_ROLE_KEY` wird dabei niemals im Frontend preisgegeben.
- **Schlüsselentscheidung:** Die Option `emailRedirectTo` wurde explizit auf die Produktions-URL der Login-Seite (`https://druid-five.vercel.app/login`) gesetzt. Dies war ein entscheidender Schritt, um Supabase das korrekte Weiterleitungsziel nach der Authentifizierung mitzuteilen.

### 3. Frontend-Implementierung & Debugging

- **Zentraler Supabase Client:** Eine Datei `src/lib/supabaseClient.ts` wurde erstellt, um den Supabase-Client an einem einzigen Ort zu initialisieren. Dieser Client liest die `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` aus der `.env.local`-Datei.

- **Zustandsverwaltung (Pinia):** Ein globaler `authStore` wurde verwendet, um den Authentifizierungsstatus des Benutzers in der gesamten Anwendung zu verwalten. Dieser Store enthält die `onAuthStateChange`-Logik, die auf Änderungen des Benutzerstatus lauscht.

- **Debugging Phase 1: Race Condition in Vue Components**
    - **Problem:** Sowohl die `App.vue` als auch die `LoginView.vue` enthielten Logik zur Überwachung des Authentifizierungsstatus. Dies führte zu einer "Race Condition", die unvorhersehbares Weiterleitungsverhalten verursachte.
    - **Lösung:** Die Authentifizierungslogik wurde aus `LoginView.vue` entfernt und ausschließlich in der Wurzelkomponente `App.vue` zentralisiert. `App.vue` beobachtet nun den `auth.user` aus dem Pinia-Store und ist allein für die Weiterleitung nach dem Login (von `/login` zu `/`) oder dem Logout (zu `/login`) verantwortlich.

- **Debugging Phase 2: Supabase URL Whitelist**
    - **Problem:** Trotz der korrekten Code-Logik schlug die Weiterleitung immer noch fehl.
    - **Ursache:** Die Analyse der Supabase-Projekteinstellungen ergab, dass die Whitelist für `Redirect URLs` leer war.
    - **Lösung:** Aus Sicherheitsgründen erfordert Supabase, dass jede URL, die als `emailRedirectTo` verwendet wird, explizit in der Liste der erlaubten Weiterleitungs-URLs im Supabase Dashboard (Authentication -> URL Configuration) eingetragen ist.
    - **Aktion:** Die URL `https://druid-five.vercel.app/login` wurde zur Whitelist hinzugefügt, wodurch das Problem endgültig gelöst wurde.

## KEY LEARNINGS & MEMORY INGESTION

- **Supabase Magic Link Flow:** Der Magic-Link-Prozess erfordert eine korrekte Konfiguration an drei Stellen: der serverseitige API-Aufruf (`emailRedirectTo`), die clientseitige `onAuthStateChange`-Logik und die `Redirect URL`-Whitelist im Supabase-Dashboard.
- **Architektur-Pattern (Vue):** Authentifizierungs-Weiterleitungslogik sollte in einer globalen Komponente (wie `App.vue`) zentralisiert werden, um Race Conditions und unvorhersehbares Verhalten zu vermeiden. Ein globaler Store (Pinia) ist ideal, um den Authentifizierungsstatus zu verwalten.
- **Sicherheit:** Sensible Schlüssel (`SERVICE_ROLE_KEY`) MÜSSEN in serverseitigen Funktionen oder sicheren Umgebungsvariablen auf dem Host (Vercel) aufbewahrt werden und dürfen NIEMALS im clientseitigen Code landen. Client-Code sollte nur den `anon` Key verwenden.

_End of Workpaper._
