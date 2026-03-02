# Workpaper: 2026-02-10 - Recherche: Snap-to-Road

## Ziel

Dieses Dokument dient der Evaluierung und dem Vergleich verschiedener Dienste und Technologien, um eine "Snap-to-Road"-Funktionalität in der DRUID-App zu implementieren. Ziel ist es, eine aufgezeichnete GPS-Spur (eine Sequenz von Koordinaten) so zu verarbeiten, dass sie dem tatsächlichen Verlauf von Straßen und Wegen auf der Karte folgt.

## Anforderungen

- **Eingabe:** Eine Liste von GPS-Koordinaten (lat, lng) und optional Zeitstempel.
- **Ausgabe:** Eine geglättete Polylinie (Sequenz von Koordinaten), die auf das Straßennetz "eingerastet" ist.
- **Genauigkeit:** Sollte auch mit ungenauen GPS-Punkten und größeren Abständen zwischen den Punkten zuverlässig funktionieren.
- **Performance:** Die Verarbeitung sollte für typische Wanderrouten (mehrere hundert Punkte) in akzeptabler Zeit erfolgen.
- **Präferenz:** Eine Lösung, die idealerweise auf OpenStreetMap-Daten basiert, um Konsistenz mit der Basiskarte zu gewährleisten.

## Evaluierungskandidaten

Folgende Dienste und Bibliotheken werden untersucht:

1.  **OSRM (Open Source Routing Machine)**
2.  **GraphHopper**
3.  **Mapbox Matching API**

## Vergleichskriterien

- **Kosten:** Einmalige vs. laufende Kosten, Preis pro API-Aufruf.
- **Integrationsaufwand:** Wie komplex ist die Einbindung in unser Vue/TypeScript-Frontend?
- **Genauigkeit & Qualität:** Wie gut ist das Ergebnis der Routenanpassung?
- **Hosting:** Selbst-Hosting (Kontrolle, aber Aufwand) vs. Cloud Service (Einfachheit, aber Abhängigkeit & Kosten).
- **Datenquelle:** Auf welchen Kartendaten basiert der Dienst (z.B. OpenStreetMap)?
- **Limits:** Gibt es Beschränkungen bei der Anzahl der Punkte pro Anfrage oder der Anzahl der Anfragen pro Tag/Monat?

## Recherche-Ergebnisse

*(Dieser Abschnitt wird im Laufe der Recherche gefüllt)*

### 1. OSRM (Open Source Routing Machine)

- **Hosting:** Primär für Selbst-Hosting konzipiert. Benötigt einen eigenen Server, auf dem ein OSRM-Backend mit den Kartendaten (z.B. für Europa) läuft. Docker-Images sind verfügbar, was die Einrichtung vereinfacht, aber dennoch technisches Know-how erfordert.
- **Kosten:** Die Software ist kostenlos (Open Source). Kosten entstehen nur für den Betrieb des eigenen Servers.
- **API:** Bietet eine `match`-Service-Anfrage, die eine Liste von Koordinaten entgegennimmt. Die Dokumentation ist sehr technisch.
- **Vorteile:**
    - Volle Kontrolle über Daten und Infrastruktur.
    - Keine API-Limits oder laufenden Kosten pro Aufruf.
    - Sehr hohe Performance.
- **Nachteile:**
    - Hoher initialer Einrichtungs- und Wartungsaufwand.
    - Benötigt serverseitige Infrastruktur, was nicht zu unserem rein clientseitigen Ansatz passt. Müsste über eine separate (z.B. serverless) Funktion angesprochen werden.

### 2. GraphHopper

- **Hosting:** Bietet sowohl eine Open-Source-Variante zum Selbst-Hosting als auch eine kommerzielle "GraphHopper Directions API".
- **Kosten (API):** Bietet einen kostenlosen Plan mit bis zu 500 Anfragen/Tag für die "Map Matching API". Das ist für den Anfang und Tests sehr großzügig.
- **API:** Gut dokumentierte REST-API. Die Einbindung erfolgt über `POST`-Requests mit GPX- oder JSON-formatierten Daten.
- **Vorteile:**
    - Flexibles Modell (Start mit API, später ggf. Selbst-Hosting).
    - Guter kostenloser Plan für den Start.
    - Basiert auf OpenStreetMap-Daten.
- **Nachteile (API):**
    - Abhängigkeit von einem externen Dienst.

### 3. Mapbox Matching API

- **Hosting:** Reiner Cloud-Dienst.
- **Kosten:** Hat ein großzügiges kostenloses Kontingent (`requests` sind hier `traces`). Im "Free Tier" sind bis zu 100.000 "Map-Matching-Traces" pro Monat kostenlos enthalten. Eine "Trace" ist eine Anfrage mit bis zu 100 Koordinaten. Für längere Routen wären mehrere Anfragen nötig.
- **API:** Sehr moderne und gut dokumentierte API. Einfache Integration.
- **Vorteile:**
    - Sehr hohe Genauigkeit und Qualität der Ergebnisse.
    - Sehr einfach zu integrieren.
    - Großzügiger Free-Tier, der für unsere Anwendung lange ausreichen dürfte.
- **Nachteile:**
    - Starke Bindung an das Mapbox-Ökosystem.
    - Die Aufteilung in "Traces" à 100 Punkte könnte bei sehr langen Wanderungen zusätzliche Logik erfordern.

## Erste Einschätzung & Empfehlung

Für den schnellen Einstieg und ein qualitativ hochwertiges Ergebnis scheint die **Mapbox Matching API** am besten geeignet zu sein. Der Aufwand für die Integration ist gering, die Kosten sind durch den Free Tier abgedeckt und die Qualität ist bekanntlich sehr hoch. Der Nachteil der Aufteilung in 100-Punkte-Häppchen ist ein lösbares Problem.

**GraphHopper** ist eine exzellente Alternative, vor allem wegen des großzügigen kostenlosen Plans und der Open-Source-Option im Hintergrund. Es wäre der Plan B, falls Mapbox aus irgendwelchen Gründen nicht passt.

**OSRM** ist für unsere aktuelle Architektur (rein clientseitig, kein eigenes Backend) ein Overkill. Der Aufwand für Setup und Wartung steht in keinem Verhältnis zum Nutzen.

**Nächster Schritt:** Prototypische Implementierung eines Clients für die Mapbox Matching API, um einen Test-Track umzuwandeln.
