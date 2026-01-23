Das ist eine hervorragende und notwendige Schärfung. Deine Differenzierung zwischen archäologischer Evidenz, historischer Rekonstruktion und moderner Praxis ist genau das, was die App von einer "08/15-Esoterik-App" zu einem seriösen Tool für die Szene und Wissenschaftsinteressierte macht. Das Labeling-System (Evidenz-Stufen) ist der entscheidende UX-Hebel für Vertrauen.
Lass uns direkt in den MVP (Minimum Viable Product) einsteigen. Hier ist die technische und konzeptionelle Skizze für die Umsetzung:

1. Datenmodell für POIs (PostGIS-tauglich)
Um die Karte performant und filterbar zu machen, brauchen wir eine klare Struktur, die das "Evidenz-Labeling" direkt im Kern trägt.
Feld
Typ
Beschreibung
id
UUID
Eindeutige ID
geom
Geometry (Point)
Koordinaten (SRID 4326)
name
String
Name des Ortes
category
Enum
archaeology, nature, modern_ritual, mythology
evidence_level
Integer
1: Belegt (Grabung), 2: Rekonstruiert/Tradition, 3: Modern/Subjektiv
description
Text
Historische Fakten (redaktionell)
user_notes
JSONB
Subjektive Eindrücke, "Energien", Erfahrungsberichte
media_urls
Array (String)
Links zu Fotos/Videos
access_info
Text
Betretungsverbote, Naturschutzhinweise, Privatgrundstück?

2. Kalender-Engine: Der "Zwei-Layer-Ansatz"
Die Engine muss zwei Welten synchronisieren. Wir nutzen eine Date-Library (wie Day.js) als Basis und legen die keltischen Layer drüber.
Layer A: Astronomisch (Objektiv)
Berechnung: API-Anbindung an Mondphasen-Daten.
Anzeige: Aktuelle Phase, exakter Zeitpunkt von Neu-/Vollmond.
Events: Astronomische Sonnenwenden und Tag-und-Nacht-Gleichen (Sonnendaten).
Layer B: Rekonstruktiver Coligny-Modus
Algorithmus: Implementierung einer festen Rekonstruktionsregel (z. B. nach Monard oder Olmsted).
Logik: * Tageswechsel bei Dämmerung (berechnet nach GPS-Standort des Users).
Zuordnung der Monatsnamen (Samonios, Dumannios, etc.).
Notation von MAT und ANM als Informationstext pro Monat/Tag.

3. MVP-Scope (Umsetzung in 2–4 Wochen)
Um schnell an den Markt zu gehen und Feedback von der Community zu sammeln, fokusieren wir uns auf:
Core-Features (Prio 1)
1. Interaktive Map: Darstellung der POIs mit den 3 Evidenz-Labels. Filterung nach Kategorie.
2. Wheel-of-Year Calendar: Ein radiales UI-Element, das den aktuellen Stand im Sonnenjahr und im Mondzyklus anzeigt.
3. Detail-View: Zu jedem Ort gibt es Quellenangaben (Wikipedia-Link, Literatur) und einen "Ich war hier"-Button.
4. Einfaches User-Submission-Form: Nutzer können Orte vorschlagen (gehen aber erst nach Admin-Check live).
Content-Basis für Start in DE
Einpflegen von ca. 50-100 Top-POIs (z.B. Keltenwelt Glauberg, Heuneburg, Donnersberg, Externsteine, Staffelberg).

4. Monetarisierung & Ausbau (Post-MVP)
Events-Modul: Veranstalter können Rituale, Workshops oder Keltenfeste eintragen (Paid Placement).
Ogham-In-App-Translator: Als spielerisches Feature (Gimmick für das UI).
Premium-Layer: Astronomische "Tagesqualitäten" basierend auf historischen Deutungen für Abonnenten.

Mein nächster Schritt für dich:
Soll ich dir ein konkretes Wireframe-Konzept für das "Calendar Wheel" erstellen (wie man die 13 Monate und 8 Feste auf einem Smartphone-Screen intuitiv unterbringt)? Das ist oft der schwierigste Part im UI-Design für solche Projekte.








Das „Calendar Wheel“ (Jahresrad) ist das visuelle Alleinstellungsmerkmal der App. Auf einem Smartphone-Screen ist die Herausforderung, die zyklische Zeit (das Rad) mit der linearen Zeit (unserem Alltag) zu verbinden.
Hier ist das UX-Konzept für das Interface:

1. Das Visuelle Interface (Wireframe-Struktur)
Das UI besteht aus drei konzentrischen Kreisen, die sich unabhängig voneinander bewegen oder als statischer Kompass dienen, auf dem sich ein Zeiger (der „Jetzt-Punkt“) bewegt.
A. Der Äußere Ring: Das Sonnenjahr (Fix)
Inhalt: Die 8 Jahreskreisfeste (Samhain, Wintersonnenwende, Imbolc, etc.).
Logik: Dieser Ring ist fest mit dem gregorianischen Kalender verknüpft (z.B. Wintersonnenwende immer um den 21.12.).
Design: Dezente Markierungen oder Symbole für die Sonnenfeste.
B. Der Mittlere Ring: Die 12/13 Mondmonate (Dynamisch)
Inhalt: Die keltischen Monatsnamen (Samonios, Dumannios ...).
Logik: Da sich die Mondmonate jedes Jahr verschieben, „schwimmt“ dieser Ring unter dem äußeren Ring.
Feature: Im Falle eines Schaltjahres (Interkalation) erscheint hier ein extra Segment für den 13. Monat (Quimonios).
C. Der Innere Ring: Die Mondphase (Realzeit)
Inhalt: Die aktuelle Gestalt des Mondes.
Visualisierung: Eine fotorealistische oder stilisierte Mondscheibe in der Mitte, die sich füllt oder leert.

2. Interaktions-Logik (UX)
Der „Jetzt-Strahl“: Ein vertikaler Lichtstrahl von der Mitte nach oben zeigt immer auf den aktuellen Moment (Tag, Monat, Mondphase).
Rotation: Der User kann das Rad mit dem Finger drehen (Spin), um in die Zukunft oder Vergangenheit zu schauen. Sobald er loslässt, schnappt es (Snap-Back) auf das heutige Datum zurück.
Tap-to-Detail: Tippt der User auf einen Monatsnamen, öffnet sich ein Bottom-Sheet mit:
Bedeutung: „Samonios – Zeit der Saat/Versammlung“.
Qualität: „MAT (Günstig)“.
Baum-Zuordnung: (Optional, falls gewünscht).

3. Technisches Datenmodell für das UI
Um das Rad zu zeichnen, benötigst du für die App-Entwicklung (z.B. in Flutter oder React Native) ein Mapping-Objekt:
JavaScript
const druidWheelData = {
  currentDate: "2024-11-01",
  sunFestivals: [
    { id: "samhain", angle: 0, label: "Samhain", date: "Nov 01" },
    { id: "yule", angle: 45, label: "Wintersonnenwende", date: "Dec 21" }
  ],
  lunarMonths: [
    { name: "Samonios", type: "MAT", startDegree: 0, endDegree: 29 },
    // Die Gradzahlen ändern sich jährlich basierend auf der Mondberechnung
  ]
};

4. Die Karte: Integration ins UI
Da dein Kunde eine Karte möchte, sollte das Rad nicht die ganze App einnehmen.
Die „Dashboard-Ansicht“: Oben das Rad (als Header oder im oberen Drittel), darunter die „Karte der Umgebung“ mit den nächsten POIs.
Die „Immersiv-Ansicht“: Das Rad im Vollbild für Meditation oder Planung von Ritualen.

5. Nächster Schritt für das Projekt
Um dem Kunden etwas „Greifbares“ zu zeigen, schlage ich vor, als Nächstes die Content-Strategie für die POIs festzulegen. Ein leerer Kalender ohne Orte ist wertlos.
Soll ich dir eine Tabelle mit den 10 wichtigsten „Must-Have“ Orten in Deutschland erstellen, inklusive deren Evidenz-Level und einer kurzen Beschreibung für die App-Datenbank? (Damit hättest du direkt Demo-Content für den Prototyp).








Das ist ein sehr klarer, nativer Mobile-First-Ansatz. Die Karte als „Home-Screen“ zu setzen, macht die App sofort nützlich und gibt ihr einen Entdecker-Charakter.
Hier ist die verfeinerte UX-Struktur basierend auf deinem Feedback:
1. Der Flow (User Journey)
1. Splash-Screen (5 Sek.): Hochwertiges Logo, vielleicht dezent animiert (z.B. ein pulsierender Knoten oder ein Mondumlauf), um die Stimmung zu setzen.
2. Map-View (Main): Fullscreen-Karte (z.B. Mapbox oder Google Maps im „Night Mode“ oder „Nature“ Stil).
Oben Links: Dein Logo (klein, als Anker).
Oben Rechts: Hamburger-Menü (Profil, Einstellungen, Info).
Daneben: Ein prominenter Kalender-Icon (vielleicht ein stilisierter Mond oder ein Rad).
3. Calendar-View (Overlay/Full): Beim Klick öffnet sich das Rad.

2. Das Rad-Interface (Mobil-Optimiert)
Da ein Rad auf einem schmalen Handy-Screen oft zu klein ist, um Texte zu lesen, ist deine Idee mit dem Zoom und den Kuchenstücken (Segmenten) der Schlüssel:
Pinch-to-Zoom: Der User kann das Rad mit zwei Fingern großziehen. Die Details (Ogham-Zeichen, Monatsnamen, Tagesnotizen) werden erst beim Reinzoomen scharf eingeblendet.
Segment-Expansion (Kuchenstücke): * Wenn man auf ein Segment (z.B. den aktuellen Monat) tippt, schiebt sich dieses Stück ein Stück nach außen oder vergrößert sich (ähnlich wie bei einem interaktiven Tortendiagramm).
Gleichzeitig öffnet sich im unteren Drittel ein Detail-Panel, das die Infos zum Monat/Fest liefert, ohne dass man das Rad verlassen muss.
Rotation: Das Rad lässt sich intuitiv mit dem Daumen drehen, um durch die Monate zu „scrollen“.

3. Die 10 „Must-Have“ POIs für den Prototyp (Deutschland)
Damit die Karte beim ersten Start direkt beeindruckt, hier die Daten für deinen Demo-Content. Ich habe sie nach deinem gewünschten System (Evidenz-Level) sortiert:
Ort
Region
Evidenz-Level
App-Beschreibung (Snippet)
Glauberg
Hessen
1 (Archäologisch)
Fundort des „Keltenfürsten“. Weltbekanntes Zentrum mit rekonstruiertem Grabhügel und Museum.
Heidengraben
BW
1 (Archäologisch)
Eines der größten keltischen Oppida (Stadt) in Europa auf der Schwäbischen Alb.
Heuneburg
BW
1 (Archäologisch)
Älteste bekannte Stadt nördlich der Alpen mit beeindruckender rekonstruierter Lehmziegelmauer.
Otzenhausen
Saarland
1 (Archäologisch)
Mächtiger „Hunnenring“ – eine gewaltige keltische Befestigungsanlage (Treverer).
Externsteine
NRW
2 (Rekonstruiert)
Markante Felsformation. Astronomische Ausrichtung vermutet, als Kultort seit der Neuzeit hochverehrt.
Donnersberg
RLP
1 (Archäologisch)
Gewaltiges Oppidum mit rekonstruierter Mauersektion; wichtiger kultischer Bezugspunkt.
Staffelberg
Bayern
2 (Rekonstruiert)
„Berg der Franken“. Keltisches Oppidum Menosgada. Legendärer Ort mit weiter Sicht.
Ivenacker Eichen
Meck-Pomm
3 (Natur/Modern)
Uralte Eichen (über 1000 Jahre). Verkörpern den druidischen Baumkult (Duir) in Perfektion.
Tanzplatz (Harz)
Sachsen-Anhalt
3 (Modern/Mythos)
In der Nähe der Rosstrappe. Ort für moderne neu-heidnische Versammlungen und Mythen.
Blautopf
BW
3 (Natur/Mythos)
Tiefblaue Karstquelle. Solche Orte waren für Kelten heilige Eingänge zur Anderswelt.

4. Technischer Tipp für die Karte
Für die App solltest du Clustering verwenden. Wenn der User rauszoomt, werden die 100 Punkte in Deutschland zu Kreisen mit Zahlen (z.B. „12 Orte in Hessen“). Erst beim Reinzoomen erscheinen die individuellen Icons (Eiche für Natur, Helm für Archäologie, Feuer für Events).








Das ist ein sehr intuitiver, moderner App-Aufbau, der stark auf Community-Interaktion setzt. Durch den Fokus auf die aktuelle GPS-Position und das direkte Eintragen von Orten schaffst du eine lebendige Datenbank (User-Generated Content).
Hier ist das verfeinerte Layout und die Funktionsweise für diese Features:
1. Das Karten-Interface (Main Screen)
Zentrierter Fokus (GPS-Button): Ein Icon (meist ein Fadenkreuz oder eine Kompassnadel) über dem Plus-Button. Ein Tap zentriert die Karte sofort auf den Standort des Nutzers und schaltet den „Follow-Me“-Modus ein.
Plus-Button (Eintragen): Ein schwebender Button (Floating Action Button), zentral oder rechts unten.
Funktion: Beim Klick erscheint ein Marker in der Mitte des Screens (oder an der aktuellen GPS-Position). Der User kann den Marker noch feinjustieren (Drag & Drop).
Formular-Pop-up: Danach öffnet sich ein Formular mit folgenden Feldern:
Name des Ortes/Punktes
Kategorie (Kultplatz, Naturwunder, Treffpunkt, Kraftort)
Beschreibung
Foto-Upload
Sichtbarkeit (Öffentlich vs. Nur für Freunde)
Event-Ticker (Untern Bereich): Ein halbtransparentes „Sliding Panel“ oder eine horizontale Card-Liste am unteren Bildschirmrand.
Inhalt: „Nächste Termine in deiner Nähe“ (z.B. „Mondritual in 15km – heute 20:00 Uhr“).
Interaktion: Ein Wisch nach oben zieht das Panel hoch und öffnet die komplette Terminübersicht.
2. Social Feature: Kommentare & Austausch
Wenn ein User auf einen bestehenden Marker (z.B. die Externsteine oder einen privaten Treffpunkt) tippt, öffnet sich die Detailansicht:
Kommentarfunktion: Ähnlich wie bei Google Maps, aber mit Fokus auf die Community.
Features:
„Ich bin gerade hier“ – Statusmeldung.
Bildergalerie der User (aktuelle Fotos der Jahreszeiten).
Diskussionsstrang (z.B. Tipps zur Erreichbarkeit oder Berichte über die „Stimmung“ des Ortes).
3. Druidischer Kalender-Modus (Das Rad)
Da du erwähntest, dass das Kalenderrad im Ganzen erscheinen soll, aber zoombar sein muss, hier die mobile Umsetzung:
Initial-View: Das Rad passt sich der Bildschirmbreite an. In der Mitte ist die aktuelle Mondphase groß zu sehen.
Kuchenstück-Zoom: Tippt man z.B. auf das Segment des aktuellen Monats (z.B. Samonios), vergrößert sich dieses Stück animiert und schiebt die anderen zur Seite.
Detail-Anzeige: Im vergrößerten Stück werden dann die einzelnen Tage (1–30) sichtbar, inklusive der MAT / ANM Kennzeichnung.

Ein wichtiger Punkt für die Karte: Maps & Maps
Um die App für deinen Kunden technisch auf das nächste Level zu heben, können wir echte Kartendaten integrieren. Ich kann dir jetzt zeigen, wie wir:
1. Reale Orte finden: Sollen wir nach existierenden keltischen Museen oder archäologischen Parks in einer bestimmten Region suchen, um sie in deine Liste aufzunehmen?
2. Routenplanung: Willst du ein Feature, mit dem User direkt per Klick eine Navigation zu einem „druidischen Ort“ starten können?



















Für einen Namen, der sowohl die Tiefe der Geschichte als auch die moderne App-Nutzung abdeckt, brauchen wir etwas, das mystisch klingt, aber leicht zu merken und zu tippen ist.
Hier sind meine Vorschläge, kategorisiert nach dem „Vibe“, den sie vermitteln:
1. Die „One-Word“ Favoriten (Modern & Clean)
Diese Namen klingen nach einer hochwertigen Tech-App, behalten aber den Bezug zur Natur und zum Keltischen:
DRUID – Der Klassiker. Direkt, selbstbewusst, jeder weiß, worum es geht.
ANNWN (gesprochen: Annuun) – Der walisische Name für die „Anderswelt“. Klingt extrem mystisch und exklusiv.
LUMEN – Lateinisch für Licht (Bezug auf die Mondphasen), klingt sehr ästhetisch.
NEMETON – Das keltische Wort für einen „heiligen Hain“ oder Kraftort. Das ist der fachlich perfekteste Name für eine Karten-App mit heiligen Orten.
BELEN – Nach dem Lichtgott Belenus. Kurz, weich und positiv.
2. Kurz & Griffig (Social Media tauglich)
Diese Namen funktionieren perfekt als Icon auf dem Homescreen und als Hashtag:
LUNA – Fokus auf den Mondkalender.
RITUS – Fokus auf die Veranstaltungen und Treffen.
CELTA – Klarer Bezug zur Herkunft.
KRYPTA – Klingt nach Geheimnis und Entdeckung (gut für die Karte).
OGHAM – Nach der Baumsprache, sehr markant im Schriftbild.
3. Abstrakt & Modern
AVALON – Der wohl bekannteste mystische Ort. Zieht sofort.
VIBE – Modern, bezieht sich auf das „Spüren“ der Orte auf der Karte.
CIRCLE – Bezieht sich auf den Jahreskreis und die Community.

Meine Top 3 Empfehlungen:
1. NEMETON: Es ist der absolute Fachbegriff für das, was deine App macht (Orte in der Natur finden). Wer sich auskennt, liebt es; wer sich nicht auskennt, findet das Wort spannend.
2. DRUID: Wenn dein Kunde eine breite Masse ansprechen will, ist die Einfachheit nicht zu schlagen. SEO-technisch (Suchmaschinen) ist das Gold wert.
3. ANNWN: Wenn es eine „High-End“ App für echte Kenner sein soll. Es sieht grafisch (mit den zwei 'N') sehr symmetrisch und cool aus.
Kleiner Marketing-Tipp:
Prüf direkt bei der Namenswahl, ob die Domain (z.B. druid-app.de oder nemeton.io) noch frei ist.


Hier ist das Konzept-Board für DRUID (oder NEMETON):

? Konzept-Übersicht: Die Druiden-App
1. Die Vision: "History meets High-Tech"
Die App verbindet archäologische Präzision mit moderner Community-Interaktion und einem einzigartigen lunisolaren Zeitmanagement.
Säule
Beschreibung
Zielgruppe
Wissenschaft
Klares Labeling von Fundstätten nach Evidenz-Stufen.
Forscher & Bildungsinteressierte
Natur
Entdecken von Kraftorten und Naturphänomenen.
Wanderer & Achtsame
Community
User-Generated Content, Events und Austausch.
Neo-Paganismus & Gruppen

2. Die App-Architektur (Visualisierter Flow)
A. Der Einstieg (Atmosphäre)
Splash-Screen: 5 Sekunden Animation (Mondumlauf/Knoten-Logo).
Start-Ansicht: Sofortiger Fokus auf die Fullscreen-Karte im "Nature"-Stil.
B. Das Interface (Steuerung)
Oben Links: Marken-Logo.
Oben Rechts: Hamburger-Menü & prominenter Kalender-Button8.
Unten (Floating): Plus-Button zum Eintragen neuer Orte und GPS-Fokus-Button.
Bottom-Sheet: Dynamischer Event-Ticker für Termine in der Nähe.

3. Das Herzstück: Das "Calendar Wheel"
Ein radiales UI-Element, das Zeit nicht als Liste, sondern als Zyklus darstellt.
Äußerer Ring (Fix): Die 8 Sonnenfeste (z. B. Samhain, Jule).
Mittlerer Ring (Dynamisch): Die 12–13 keltischen Mondmonate (z. B. Samonios).
Innerer Kern: Echtzeit-Mondphase.
Interaktion: Pinch-to-Zoom für Tagesdetails (MAT/ANM Kennzeichnung) und haptische Rotation per Daumen.

4. Das Daten-Rückgrat (POI-System)
Jeder Ort auf der Karte ist nach einem strengen wissenschaftlichen Filter klassifiziert:
1. Level 1 (Archäologisch): Belegte Grabungen (z. B. Glauberg, Heuneburg).
2. Level 2 (Rekonstruiert): Historisch vermutete Kultorte (z. B. Externsteine).
3. Level 3 (Modern/Natur): Subjektive Kraftorte oder Naturdenkmäler.

5. Roadmap zum MVP (2–4 Wochen)
Schritt 1: Setup der PostGIS-Datenbank für POIs2.
Schritt 2: Implementierung der Mondphasen-API und des Coligny-Algorithmus.
Schritt 3: Design des interaktiven Jahresrads.
Schritt 4: Redaktionelle Befüllung mit den ersten 50 Top-Spots in Deutschland.

























Hier ist ein strukturiertes One-Pager-Exposé für die App DRUID (Arbeitstitel), das du direkt als Konzeptvorlage für deinen Kunden oder potenzielle Investoren nutzen kannst.

? Projekt-Exposé: DRUID – Die lunisolare Navigations-App
1. Vision & USP
DRUID ist die erste mobile Anwendung, die archäologische Fakten mit moderner Naturspiritualität und einem historisch-astronomischen Kalendersystem vereint. Im Gegensatz zu herkömmlichen Karten-Apps bietet DRUID eine wissenschaftlich fundierte Einordnung von Kraftorten durch ein einzigartiges Evidenz-Labeling-System.
2. Kernfunktionen (MVP)
Interaktive High-End Map: Fullscreen-Karte im Natur-Stil mit Fokus-Funktion auf die aktuelle GPS-Position des Nutzers.
Das "Calendar Wheel": Ein radiales, zoombares UI-Element, das den gregorianischen Kalender mit dem keltischen Mondjahr (Coligny-Modus) und 13 Mondphasen synchronisiert.
User-Generated Content: Nutzer können eigene Marker für Treffpunkte oder Naturphänomene setzen, Fotos hochladen und Orte kommentieren.
Content-Datenbank: Vorinstallierte Top-Spots in Deutschland (z. B. Glauberg, Heuneburg, Externsteine) mit redaktionell geprüften Hintergründen6666.
3. Monetarisierung & Business-Modell
B2B / Event-Marktplatz: Veranstalter von Kursen, Keltenfesten oder Workshops können Termine gegen Gebühr im Event-Ticker der App prominent platzieren.
Premium-Layer (Abo-Modell): Erweiterte astronomische Daten und historische "Tagesqualitäten" (MAT / ANM) als Ratgeber für Abonnenten.
Gimmicks & Branding: In-App-Features wie ein Ogham-Translator (Baumsprache) zur spielerischen Interaktion und Steigerung der User-Retention.
Werbeplätze: Gezielte Platzierung von Anzeigen für thematisch relevante Produkte (z. B. Outdoor-Ausrüstung, Literatur)10.
4. Technische Eckpfeiler
Backend: PostGIS-Datenbank für hochperformante, geografische Abfragen und Clustering von Markern.
Logik: Zwei-Layer-Kalender-Engine, die Echtzeit-Monddaten mit historischen Rekonstruktionsregeln (z. B. Monard/Olmsted) abgleicht12121212.
Frontend: Mobile-First Design mit intuitiver Zoom-Technik für komplexe grafische Elemente ("Kuchenstück-Expansion")131313131313131313.


Dieses Exposé bildet das logische Gerüst. 


Hier ist die detaillierte Spezifikation für das Eintrags-Formular, mit dem Nutzer neue Orte (POIs) in der App generieren können. Dieses Datenmodell stellt sicher, dass die Datenbank sauber bleibt und die Informationen für die Community wertvoll sind.
? Spezifikation: Formular "Neuen Ort eintragen"
Sobald ein Nutzer den Plus-Button auf der Karte drückt und den Marker platziert hat 1, öffnet sich dieses strukturierte Formular2:

1. Basis-Daten (Pflichtfelder)
Name des Ortes: Kurzer, prägnanter Titel für die Kartenansicht3.
Kategorie-Auswahl (Enum): 4
Kultplatz (historisch vermutet oder modern genutzt).
Naturwunder (besondere Quellen, alte Bäume, Formationen).
Treffpunkt (für Stammtische oder Rituale).
Kraftort (subjektive Erfahrung).
Beschreibung: Freitextfeld für Hintergrundinformationen oder Wegbeschreibungen5.
2. Evidenz- & Validierungs-Ebene
Um das Vertrauen in die App zu sichern6, werden neue User-Einträge standardmäßig mit folgendem Label versehen:
Evidenz-Level: Automatisch Stufe 3 (Modern/Subjektiv)777.
Hinweis: Höhere Stufen (1 & 2) können nur durch Administratoren nach redaktioneller Prüfung vergeben werden8.
Sichtbarkeit: Auswahl zwischen „Öffentlich“ (für alle sichtbar) oder „Nur für Freunde/Zirkel“9.
3. Media & Social Features
Foto-Upload: Integration der Smartphone-Kamera für aktuelle Aufnahmen des Ortes10.
Kommentar-Start: Der Ersteller kann einen ersten Kommentar hinterlassen (z. B. zur aktuellen „Stimmung“ oder Erreichbarkeit).
4. Technische Metadaten (Hintergrund)
Koordinaten: Automatischer Abgleich der Marker-Position (Lat/Long) mit dem PostGIS-Datenmodell121212.
Access-Info: Ein Feld für Hinweise auf Privatgrundstücke oder Naturschutzgebiete (wichtig für die rechtliche Absicherung)13.






Indem du Supabase als Datenbank-Infrastruktur nutzt, aber eine Backend-Middleware (z. B. Node.js/Express, Python/FastAPI oder Go) dazwischenschaltest, verhinderst du, dass kritische SUPABASE_SERVICE_ROLE_KEYs oder Datenbank-Passwörter jemals das Frontend erreichen.
Hier ist das Sicherheits- und Architektur-Schema für DRUID:
1. Die Architektur-Ebenen
Frontend (App/Web): Enthält nur Logik für UI/UX, Kartenvisualisierung und Kalenderberechnungen. Keine direkten Datenbank-Queries.
Backend (Middleware): Hier liegen die .env-Dateien mit den Geheimnissen333. Es authentifiziert den Nutzer, validiert die Eingaben (z. B. Formulare) und spricht per Service-Role mit Supabase.
Supabase: Dient als reiner Datenspeicher für POIs, Profile und Events.
2. API-Struktur (Beispiele)
Um das Projekt umzusetzen, definieren wir saubere Endpunkte im Backend, die das Frontend konsumiert:
Endpunkt
Methode
Funktion
/api/map/pois
GET
Liefert alle POIs inkl. Evidenz-Level6666. Das Backend filtert hier sensible Admin-Notizen heraus.
/api/map/poi/create
POST
Empfängt das Formular, validiert das access_info und speichert in Supabase.
/api/calendar/current
GET
Das Backend berechnet die Coligny-Monats-Notation (MAT/ANM) und liefert das JSON ans Wheel.
/api/events/nearby
GET
Führt eine PostGIS-Umkreissuche basierend auf den GPS-Daten des Users durch.
3. Sicherheit & Validierung im Backend
Da alle Eingaben über deine API laufen, können wir das von dir gewünschte Moderationsmodell perfekt umsetzen:
Sanitizing: Das Backend prüft, ob im Formular schädlicher Code (SQL Injection) steht, bevor es an Supabase geht10101010.
Evidenz-Logic: Wenn ein User einen Ort anlegt, setzt das Backend das Feld evidence_level im Hintergrund fest auf 3 (Modern/Subjektiv), egal was das Frontend sendet.
Rate Limiting: Du verhinderst, dass Bots deine Karte mit Fake-Markern fluten.
4. Datenmodell-Vorteil mit PostGIS
Da Supabase auf PostgreSQL basiert, nutzen wir die PostGIS-Erweiterung für die Karte:
Das Backend sendet dem Frontend nur die Marker, die sich im aktuellen Sichtfeld befinden (BBox-Query)12.
Das schont das Datenvolumen des Nutzers und macht die App extrem schnell.

Indem du Supabase als Datenbank-Infrastruktur nutzt, aber eine Backend-Middleware (z. B. Node.js/Express, Python/FastAPI oder Go) dazwischenschaltest, verhinderst du, dass kritische SUPABASE_SERVICE_ROLE_KEYs oder Datenbank-Passwörter jemals das Frontend erreichen.
Hier ist das Sicherheits- und Architektur-Schema für DRUID:
1. Die Architektur-Ebenen
Frontend (App/Web): Enthält nur Logik für UI/UX, Kartenvisualisierung und Kalenderberechnungen. Keine direkten Datenbank-Queries.
Backend (Middleware): Hier liegen die .env-Dateien mit den Geheimnissen. Es authentifiziert den Nutzer, validiert die Eingaben (z. B. Formulare) und spricht per Service-Role mit Supabase.
Supabase: Dient als reiner Datenspeicher für POIs, Profile und Events.
2. API-Struktur (Beispiele)
Um das Projekt umzusetzen, definieren wir saubere Endpunkte im Backend, die das Frontend konsumiert:
Endpunkt
Methode
Funktion
/api/map/pois
GET
Liefert alle POIs inkl. Evidenz-Level. Das Backend filtert hier sensible Admin-Notizen heraus.
/api/map/poi/create
POST
Empfängt das Formular, validiert das access_info und speichert in Supabase.
/api/calendar/current
GET
Das Backend berechnet die Coligny-Monats-Notation (MAT/ANM) und liefert das JSON ans Wheel.
/api/events/nearby
GET
Führt eine PostGIS-Umkreissuche basierend auf den GPS-Daten des Users durch.
3. Sicherheit & Validierung im Backend
Da alle Eingaben über deine API laufen, können wir das von dir gewünschte Moderationsmodell perfekt umsetzen:
Sanitizing: Das Backend prüft, ob im Formular schädlicher Code (SQL Injection) steht, bevor es an Supabase geht.
Evidenz-Logic: Wenn ein User einen Ort anlegt, setzt das Backend das Feld evidence_level im Hintergrund fest auf 3 (Modern/Subjektiv), egal was das Frontend sendet.
Rate Limiting: Du verhinderst, dass Bots deine Karte mit Fake-Markern fluten.
4. Datenmodell-Vorteil mit PostGIS
Da Supabase auf PostgreSQL basiert, nutzen wir die PostGIS-Erweiterung für die Karte:
Das Backend sendet dem Frontend nur die Marker, die sich im aktuellen Sichtfeld befinden (BBox-Query).
Das schont das Datenvolumen des Nutzers und macht die App extrem schnell.












































Hier ist das technische Spezifikations-Dokument für die API-Schnittstellen deiner DRUID-App. Die Trennung zwischen Frontend und Backend über eine Middleware stellt sicher, dass alle sensiblen Supabase-Zugangsdaten geschützt bleiben.

? API-Spezifikation (Backend-Middleware)
1. POI-Schnittstellen (Karten-Logik)
Diese Endpunkte steuern die Interaktion mit der Karte und nutzen die PostGIS-Erweiterung von Supabase im Hintergrund.
GET /api/v1/map/pois
Zweck: Liefert alle Orte innerhalb eines Kartenausschnitts (Bounding Box).
Query-Parameter: lat_min, lng_min, lat_max, lng_max, categories[].
Response: Ein Array von POIs inklusive der Evidenz-Level (1: Archäologisch, 2: Rekonstruiert, 3: Modern).
POST /api/v1/map/poi/create
Zweck: Verarbeitet das Formular für neue Nutzereinträge.
Payload: name, category, description, coordinates, media_urls[], access_info.
Backend-Logik: Das Middleware-Backend setzt das evidence_level automatisch auf "3" (Modern/Subjektiv) und schickt die Daten validiert an Supabase.
POST /api/v1/map/poi/{id}/comment
Zweck: Erlaubt Nutzern, Kommentare oder "Ich war hier"-Meldungen zu hinterlassen.
2. Kalender-Schnittstellen (Synchronisation)
Das Backend berechnet hierbei die komplexen lunisolaren Daten, damit das Frontend lediglich die UI rendern muss.
GET /api/v1/calendar/wheel
Zweck: Liefert die Daten für das Calendar Wheel (Jahresrad) basierend auf dem aktuellen Datum oder einem gewählten Zeitpunkt.
Response (JSON):
sun_festivals[]: Liste der 8 Jahreskreisfeste mit berechnetem Winkel für das Rad.
lunar_months[]: Die 12 bis 13 Monate (z. B. Samonios) inkl. Start-/Enddatum und der Notation MAT/ANM.
current_moon_phase: Aktueller Status (0.0 bis 1.0) für das zentrale Mond-Icon.
3. Event-Schnittstellen (Community & Monetarisierung)
GET /api/v1/events/nearby
Zweck: Speist den Event-Ticker im unteren Bereich der App.
Logik: Führt eine radiale Umkreissuche (z. B. 50km) um die aktuelle GPS-Position des Nutzers durch.
POST /api/v1/events/promotion
Zweck: Schnittstelle für bezahlte Event-Einträge (Paid Placement).

? Sicherheits-Framework
Key-Management: Alle Supabase API-Keys (SERVICE_ROLE_KEY) befinden sich ausschließlich in der .env-Datei des Backends.
Validierung: Das Backend nutzt ein Schema-Validierungs-Tool (z. B. Joi oder Zod), um sicherzustellen, dass keine fehlerhaften Daten in die Datenbank gelangen.
Rate-Limiting: Schutz der API vor Massenregistrierungen von Fake-Orten.
