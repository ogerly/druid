# Issue: Feldtest & Review des Vercel-Deployments

**Datum:** 2026-03-02

**Status:** Offen

**Zuständigkeit:** @ogerly

---

## 1. Zusammenfassung (Review)

Wir haben das DRUID-Frontend erfolgreich auf der Vercel-Plattform unter [druid-five.vercel.app](https://druid-five.vercel.app/) bereitgestellt. Dieser Meilenstein wurde durch eine Reihe von iterativen Korrekturen und Implementierungen erreicht, die im Rahmen der AAMS-Methodik dokumentiert wurden:

*   **Initiales Deployment:** Das Projekt wurde mit Vercel verbunden.
*   **Behebung von Build-Fehlern:** Ein Problem mit statischen Asset-Pfaden wurde durch eine Anpassung der `vite.config.ts` gelöst, um Vercel-Builds ohne Unterverzeichnis-Präfix zu ermöglichen.
*   **Korrektur der PWA-Pfade:** Hartcodierte Pfade in `manifest.json` und `sw.js` wurden entfernt, um 404-Fehler für App-Icons und den Service Worker zu beheben.
*   **Implementierung des API-Endpunkts:** Eine serverseitige Vercel-Funktion (`/api/auth/magic-link`) wurde in TypeScript implementiert, um die Magic-Link-Anfragen des Frontends an die Supabase-Authentifizierungs-API weiterzuleiten.
*   **Behebung des Deployment-Konflikts:** Ein kritischer Fehler wurde identifiziert, bei dem Vercel versuchte, von der falschen Git-Branch (`gh-pages`) zu deployen. Dies wurde durch die Einführung einer `vercel.json`-Konfigurationsdatei behoben, die `main` explizit als "Production Branch" festlegt.

**Ergebnis:** Die Anwendung ist jetzt live. Der Login-Prozess schlägt nicht mehr mit einem 404-Fehler fehl; die Anfrage erreicht erfolgreich die Serverless-Funktion.

## 2. Ziel des Feldtests

Der Zweck dieses Feldtests ist die **End-to-End-Validierung des Benutzer-Authentifizierungs-Workflows** über den versendeten Magic Link.

Es muss bestätigt werden, dass die von der Serverless-Funktion über Supabase ausgelöste E-Mail erfolgreich im Posteingang des Benutzers ankommt.

## 3. Testschritte (Acceptance Criteria)

1.  [ ] Navigiere zur Login-Seite der Live-Anwendung: [https://druid-five.vercel.app/login](https://druid-five.vercel.app/login)
2.  [ ] Öffne die Entwicklerkonsole des Browsers, um den Netzwerk-Tab zu beobachten.
3.  [ ] Gib eine gültige E-Mail-Adresse ein (z.B. `devmatrose@proton.me`).
4.  [ ] Klicke auf den Button, um den Login-Link anzufordern.
5.  [ ] **Verifiziere:** Die Netzwerkanfrage an `/api/auth/magic-link` wird mit einem `200 OK` oder einem ähnlichen Erfolgsstatus beantwortet.
6.  [ ] **Verifiziere:** Überprüfe das entsprechende E-Mail-Postfach (inklusive Spam-Ordner) auf den Eingang des Magic Links von Supabase.

## 4. Erwartete Ergebnisse & Nächste Schritte

*   **Erfolgsszenario:** Die E-Mail kommt an. Der Test ist bestanden. Das Issue kann geschlossen werden.
*   **Fehlerszenario:** Die E-Mail kommt nicht an. 
    *   **Analyse:** Dies deutet wahrscheinlich auf ein Problem mit der Zustellbarkeit der Standard-E-Mails von Supabase hin.
    *   **Nächster Schritt:** Ein neues technisches Ticket muss erstellt werden, um die Konfiguration eines benutzerdefinierten SMTP-Providers in den Supabase-Projekteinstellungen zu planen und durchzuführen, um die E-Mail-Zustellbarkeit zu gewährleisten.
