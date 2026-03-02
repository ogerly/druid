# 📝 Workpaper: Full Vercel Deployment Fix & API Implementation

**Datum:** 2026-03-02

**Status:** _Abgeschlossen_

## 1. Ziel dieser Worksession

Behebung zweier kritischer Fehler nach dem ersten Vercel-Deployment: 
1. 404-Fehler für PWA-Assets (Icons, Manifest, Service Worker).
2. 404-Fehler beim Aufruf des nicht existierenden API-Endpunkts für die Magic-Link-Authentifizierung.

Ziel ist es, die Anwendung unter `druid-five.vercel.app` vollständig lauffähig zu machen, inklusive des Login-Prozesses.

## 2. Rationale & Fehleranalyse

Nach dem Hotfix der `vite.config.ts` und dem erfolgreichen Laden der Haupt-JS/CSS-Assets traten zwei neue, erwartete Fehler auf:

1.  **PWA-Asset-Fehler:** Die Browser-Konsole meldete weiterhin `404 Not Found`-Fehler für PWA-spezifische Ressourcen wie `.../druid/icons/icon-144.png` und den Service Worker `.../druid/sw.js`. Die Ursache war, dass die statischen PWA-Konfigurationsdateien (`manifest.json`, `sw.js`) hartcodierte Pfade mit dem alten `/druid/`-Präfix enthielten, die von der vorherigen Korrektur in `vite.config.ts` nicht betroffen waren.

2.  **API-Endpunkt-Fehler:** Die Login-Seite sendete eine `POST`-Anfrage an `/api/auth/magic-link`, die mit einem `404 Not Found` beantwortet wurde. Dies war korrekt, da dieser Endpunkt serverseitig noch nicht implementiert war.

## 3. Implementierungs-Flow (Durchgeführte Schritte)

### Teil 1: Korrektur der PWA-Pfade

1.  **Analyse:** Die Dateien `public/manifest.json` und `public/sw.js` wurden als fehlerhaft identifiziert.
2.  **Korrektur `manifest.json`:** Alle Vorkommen des Pfad-Präfixes `/druid/` wurden in den Feldern `start_url`, `scope`, `icons.src`, `screenshots.src` und `shortcuts.url` entfernt und durch `/` ersetzt.
3.  **Korrektur `sw.js`:** Die Pfade in der `STATIC_ASSETS`-Liste sowie der Fallback-Pfad `caches.match('/druid/index.html')` wurden ebenfalls auf Root-Pfade (z.B. `'/'`, `'/index.html'`) korrigiert.

### Teil 2: Implementierung des Magic-Link-API-Endpunkts

1.  **Struktur angelegt:** Die für Vercel notwendige Verzeichnisstruktur `api/auth/` wurde im Projekt-Root erstellt.
2.  **Serverless-Funktion erstellt:** Die Datei `magic-link.ts` wurde unter `api/auth/magic-link.ts` angelegt.
3.  **Abhängigkeiten hinzugefügt:** `@supabase/supabase-js` (für die Kommunikation mit Supabase) und `@vercel/node` (für die TypeScript-Typen in Vercel-Funktionen) wurden zu den `devDependencies` in `package.json` hinzugefügt.
4.  **`npm install` ausgeführt:** Um die neuen Abhängigkeiten zu installieren und die `package-lock.json` zu aktualisieren.
5.  **Code-Implementierung:** Die Serverless-Funktion wurde implementiert. Sie:
    *   Akzeptiert nur `POST`-Requests.
    *   Lädt die Supabase-Zugangsdaten (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`) sicher aus den Vercel-Umgebungsvariablen.
    *   Initialisiert den Supabase-Client.
    *   Extrahiert die E-Mail-Adresse aus dem Request-Body.
    *   Ruft die Supabase-Methode `auth.signInWithOtp` auf, um den Versand des Magic Links auszulösen.
    *   Sendet eine entsprechende Erfolgs- oder Fehlermeldung als JSON-Antwort an das Frontend.

## 4. Ergebnis am Ende der Session

1.  **PWA-Konfiguration repariert:** Alle PWA-bezogenen Pfade sind nun für ein Root-Deployment auf Vercel korrekt konfiguriert.
2.  **API-Endpunkt implementiert:** Der kritische Endpunkt für die Nutzer-Authentifizierung ist erstellt und bereit für das Deployment.
3.  **AAMS-Konformität:** Der gesamte Prozess wurde in diesem Workpaper dokumentiert.

---

**Nächster Schritt:** Committen und Pushen aller Änderungen, um das finale, voll funktionsfähige Deployment auf Vercel auszulösen.
