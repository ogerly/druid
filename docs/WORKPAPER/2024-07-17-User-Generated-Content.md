# WORKPAPER: User-Generated Content - Hinzufügen von Orten

**Datum:** 2024-07-17

**Ziel:** Implementierung der Funktion, dass Benutzer neue Orte auf der Karte durch einen Klick hinzufügen können. Die Speicherung erfolgt temporär im Frontend-Store.

## 1. Anforderungen im Detail

### 1.1. Interaktion auf der Karte

-   **Trigger:** Ein einfacher Klick (oder "Long-Press" auf mobilen Geräten) auf eine beliebige Stelle auf der Karte, die noch keinen Marker hat.
-   **Feedback:** Unmittelbar nach dem Klick soll ein temporärer Marker an der geklickten Position erscheinen, um dem Benutzer zu zeigen, wo der neue Ort erstellt wird.
-   **Koordinaten erfassen:** Die Längen- und Breitengrade der geklickten Position werden erfasst und als Grundlage für den neuen Ort verwendet.

### 1.2. Rechte Seitenleiste (Sidebar)

-   **Öffnen:** Sobald der Klick auf der Karte erfolgt, öffnet sich eine Seitenleiste auf der rechten Seite des Bildschirms. Wenn bereits eine Sidebar (z.B. für Detailansichten) offen ist, wird deren Inhalt durch das neue Formular ersetzt.
-   **Inhalt:** Die Sidebar enthält ein Formular zum Erstellen eines neuen Ortes.

### 1.3. Formular zum Hinzufügen von Orten

Das Formular soll in dieser ersten Iteration einfach gehalten sein:

-   **Titel:** "Neuen Ort erstellen"
-   **Koordinaten-Anzeige:** Die erfassten Koordinaten (Längengrad/Breitengrad) werden schreibgeschützt angezeigt.
-   **Eingabefeld (Text):** Ein einfaches Textfeld mit dem Label "Beschreibung". Hier kann der Benutzer erste Informationen zum Ort eingeben.
-   **Button "Speichern":** Ein Button, der den neuen Ort zum Store hinzufügt.
-   **Button "Abbrechen":** Schließt die Sidebar und entfernt den temporären Marker von der Karte.

### 1.4. Datenspeicherung (Temporär)

-   **Store (Pinia):** Wir verwenden einen Pinia-Store, um die Liste der Orte zu verwalten.
-   **Aktion `addPlace`:** Beim Klick auf "Speichern" wird eine Aktion im Store aufgerufen, die ein neues "Place"-Objekt zum Array der Orte hinzufügt.
-   **Struktur des Place-Objekts:**
    ```typescript
    interface Place {
      id: number; // Eindeutige ID, z.B. über einen Zähler generiert
      coordinates: { lat: number; lng: number; };
      description: string;
      // Weitere Felder wie 'name', 'category' kommen später hinzu
    }
    ```
-   **Persistenz:** Es wird bewusst in Kauf genommen, dass die Daten bei einem Neuladen der Seite verloren gehen. Dies dient als Zwischenschritt, bis eine echte Datenbank angebunden ist.

### 1.5. Karten-Zentrierung und Fokus

-   **Initialer Kartenausschnitt:** Die Karte wird standardmäßig auf einen zentralen, keltenträchtigen Ort in Deutschland zentriert. Ein guter Kandidat hierfür ist der **Glauberg in Hessen**.
-   **Fokus:** Die Anwendung ist primär auf den deutschen Raum ausgerichtet. Die Interaktion zum Hinzufügen von Orten soll hier reibungslos funktionieren.

## 2. Technischer Plan (MVP)

1.  **Pinia Store erstellen/anpassen:**
    -   Einen `usePlacesStore` erstellen oder den bestehenden `usePois` Store anpassen.
    -   Einen `state` für die Liste der Orte definieren.
    -   Eine `action` `addPlace(placeData)` implementieren.
2.  **Karten-Interaktion in `MapView.vue`:**
    -   Einen Event-Listener für Klicks auf der Kartenkomponente (z.B. Leaflet, Mapbox) hinzufügen.
    -   In der Callback-Funktion:
        -   Koordinaten aus dem Klick-Event extrahieren.
        -   Den Status für die Sichtbarkeit der rechten Sidebar auf `true` setzen.
        -   Die erfassten Koordinaten an eine neue Komponente `AddPlaceSidebar.vue` übergeben.
3.  **`AddPlaceSidebar.vue` Komponente erstellen:**
    -   Die Komponente wird über `v-if` in `App.vue` oder `MapView.vue` gesteuert.
    -   Sie erhält die Koordinaten als Prop.
    -   Sie enthält das beschriebene Formular.
    -   Bei "Speichern" ruft sie die `addPlace` Aktion im Pinia-Store auf und schließt sich danach selbst.
    -   Bei "Abbrechen" schließt sie sich einfach.
4.  **Standard-Ausgangsort festlegen:**
    -   In der `MapView.vue` oder der `useMap.js` Composable die initialen Koordinaten auf die des Glaubergs setzen.

---
