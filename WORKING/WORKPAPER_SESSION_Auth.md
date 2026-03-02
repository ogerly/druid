# 📝 Workpaper: Worksession "Secure Auth via Backend API"

**Datum:** 2026-03-02

**Status:** _Überarbeitet nach Architektur-Review_

## 1. Ziel dieser Worksession

Das Ziel ist die Implementierung eines **sicheren Magic Link-Anmeldevorgangs**, bei dem alle Anfragen an Supabase über eine dedizierte **Backend-API (Middleware)** laufen. Dies stellt sicher, dass keine sensiblen Schlüssel oder direkten Datenbankverbindungen im Frontend-Code exponiert werden, und setzt unsere "Security-First"-Architektur korrekt um.

## 2. Rationale & Einordnung

Diese Vorgehensweise ist eine direkte Umsetzung der in den Gründungsdokumenten festgelegten Drei-Schichten-Architektur (Frontend, Middleware, Datenbank). Indem wir von Anfang an einen API-Layer aufbauen, schaffen wir eine saubere, sichere und skalierbare Grundlage für alle zukünftigen Funktionen.

## 3. Geplanter Implementierungs-Flow

| Schritt | Aktion | Ziel | Status |
| :--- | :--- | :--- | :--- |
| **1** | **Backend-Verzeichnis erstellen** | Ein neues Verzeichnis `server/` im Projektstamm anlegen, um den Backend-Code vom Frontend zu trennen. | `[ ]` |
| **2** | **Backend-Abhängigkeiten installieren** | Im `server/`-Verzeichnis die Pakete `express`, `cors`, `dotenv` und `@supabase/supabase-js` installieren. | `[ ]` |
| **3** | **Minimalen API-Server erstellen** | Eine `server/index.ts` erstellen, die einen Express-Server startet, CORS und das Laden von Umgebungsvariablen konfiguriert. | `[ ]` |
| **4** | **Sicheren Supabase-Client im Backend erstellen** | Eine `server/lib/supabaseClient.ts` erstellen, die den **Admin-Supabase-Client** initialisiert. Die Schlüssel werden sicher aus einer `.env`-Datei im `server/`-Verzeichnis geladen. | `[ ]` |
| **5** | **API-Endpunkt für Magic Link erstellen** | In `server/index.ts` einen Endpunkt `POST /api/auth/magic-link` definieren. Dieser empfängt die E-Mail vom Frontend und ruft die `signInWithOtp`-Methode des Admin-Supabase-Clients auf. | `[ ]` |
| **6** | **Proxy-Konfiguration in Vite** | `vite.config.ts` anpassen, um alle Anfragen von `/api/*` an den lokalen Backend-Server (z.B. `http://localhost:3001`) weiterzuleiten. | `[ ]` |
| **7** | **Frontend-Login-Logik anpassen** | Die zu erstellende `LoginView.vue` wird einen `fetch`-Aufruf an den Endpunkt `/api/auth/magic-link` senden, anstatt direkt Supabase-Funktionen aufzurufen. | `[ ]` |
| **8** | **Auth-Store und Callback-Handling** | Den `authStore` und das Callback-Handling wie im ursprünglichen Plan implementieren. Das Handling der Session aus dem URL-Hash nach dem Klick auf den Magic Link kann sicher im Client stattfinden. | `[ ]` |

## 4. Erwartetes Ergebnis am Ende der Session

1.  Ein `server/`-Verzeichnis existiert mit einem lauffähigen Express-Server.
2.  Ein Nutzer kann in der `LoginView` seine E-Mail eingeben. 
3.  Das Frontend sendet die E-Mail an `POST /api/auth/magic-link`.
4.  Das Backend sendet die Anfrage sicher an Supabase weiter.
5.  Der Nutzer erhält eine E-Mail und kann sich erfolgreich anmelden.
6.  **Architektonische Integrität:** Das System folgt von Anfang an dem sicheren Drei-Schichten-Modell.

---

**Nächster Schritt:** Warten auf Freigabe zur Abarbeitung dieses überarbeiteten, sicheren Workpapers.