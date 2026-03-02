# 📜 Projekt-Konzept: DRUID

**Die lunisolare Navigations-Plattform für historische und moderne Naturspiritualität**

## 1. Vision & Markenkern

**DRUID** (Arbeitstitel) ist eine High-End-Webanwendung und App, die eine Brücke zwischen archäologischer Präzision und moderner Naturerfahrung schlägt. Das Ziel ist es, Wissen über keltische Traditionen (Druidentum) und deren Kalendersysteme in einer zeitgemäßen, mobilen UX zugänglich zu machen.

### Differenzierung durch Seriosität

Ein zentrales Alleinstellungsmerkmal ist das **Evidenz-Labeling-System**. Es schützt die App vor dem Ruf einer "08/15-Esoterik-App", indem es klar zwischen gesicherten Fakten und subjektiven Eindrücken unterscheidet.

---

## 2. Kernfunktionen (MVP-Scope)

### 2.1 Die interaktive Karte (Home-Screen)

Die Karte ist das zentrale Einstiegselement und vermittelt sofort einen Entdecker-Charakter.

* 
**Archäologische & Natur-POIs:** Darstellung von Fundstätten, Kraftorten und Naturdenkmälern.


* 
**GPS-Fokus & Navigation:** Ein „Fokus-Button“ zentriert die Karte auf den Standort des Nutzers.


* 
**User-Generated Content (UGC):** Nutzer können über einen schwebenden Plus-Button neue Orte markieren.


* 
**Social Interaction:** Community-Mitglieder können Orte kommentieren, Fotos hochladen und einen „Ich war hier“-Status setzen.



### 2.2 Das "Calendar Wheel" (Jahresrad)

Ein visuelles Highlight, das Zeit als Zyklus statt als lineare Liste darstellt.

* 
**Drei-Ebenen-Design:** Ein fixer Außenring für Sonnenfeste, ein dynamischer Mittelring für die 12–13 Mondmonate und ein innerer Kern für die aktuelle Mondphase.


* 
**Interaktive Bedienung:** Pinch-to-Zoom für Details und eine animierte „Kuchenstück-Expansion“ beim Tippen auf einzelne Monate.


* 
**Snap-Back-Rotation:** Nutzer können durch die Zeit scrollen; beim Loslassen springt das Rad zum aktuellen Datum zurück.



---

## 3. Datenmodell & Evidenz-System

Um die Qualität der Inhalte zu gewährleisten, wird jeder Point of Interest (POI) kategorisiert:

| Level | Bezeichnung | Beschreibung |
| --- | --- | --- |
| **1** | **Archäologisch** | Wissenschaftlich belegte Grabungen und Funde (z.B. Glauberg).

 |
| **2** | **Rekonstruiert** | Historisch vermutete oder traditionell überlieferte Orte (z.B. Externsteine).

 |
| **3** | **Modern / Natur** | Subjektive Kraftorte, moderne Treffpunkte oder reine Naturwunder.

 |

---

## 4. Technische Architektur (Security-First)

Die Anwendung folgt einer strikten Trennung zwischen Datenhaltung und Präsentation, um maximale Sicherheit zu gewährleisten.

* **Frontend:** Mobile-First Design (z.B. React Native oder Flutter). Keine direkten Datenbankzugriffe oder Geheimnisse in der Client-Umgebung.
* **Backend-Middleware:** Eine Node.js/Express- oder Python-Schicht, in der alle `.env`-Geheimnisse (API-Keys) sicher liegen. Sie validiert alle Anfragen, bevor sie an die Datenbank gehen.
* 
**Supabase (Datenbank):** Nutzung von PostgreSQL mit der **PostGIS-Erweiterung** für performante geografische Umkreissuchen und Clustering von Markern.


* 
**Kalender-Engine:** Das Backend berechnet die lunisolaren Zyklen (Coligny-Modus) inklusive der Kennzeichnungen **MAT** (günstig) und **ANM** (ungünstig).



---

## 5. Monetarisierung & Wachstum

Nach dem Launch des MVP sind folgende Ausbaustufen geplant:

* 
**Event-Marktplatz:** Ein „Event-Ticker“ im unteren Bereich der Karte zeigt Termine (Workshops, Rituale) in der Nähe an. Veranstalter zahlen für die Platzierung (Paid Placement).


* 
**Premium-Layer:** Kostenpflichtige Abonnements für tiefergehende astronomische Analysen und historische Tagesprognosen.


* 
**Gimmicks:** Integration eines Ogham-Translators zur spielerischen Nutzung der keltischen Baumsprache.



---

## 6. Zusammenfassung der Namensvorschläge

Favoriten für ein einprägsames Branding:

1. 
**NEMETON** (Fachbegriff für heiligen Hain – hohe Seriosität).


2. 
**DRUID** (Klarer SEO-Vorteil, breite Zielgruppe).


3. 
**ANNWN** (Mystisch, High-End-Charakter).



**Nächster Schritt:** Dieses Dokument kann nun als Grundlage für das Lastenheft der technischen Umsetzung dienen. Möchtest du, dass wir als Nächstes die genauen User-Rollen (Admin, Redakteur, User) definieren?