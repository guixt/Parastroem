
<p align="left">
  <img src="logo.gif" width="250">
</p>

Paraström ist eine minimalistische Task-App auf Basis von React und Tailwind. Sie hilft dir, viele parallele Aufgaben im Blick zu behalten, ohne ein kompliziertes Setup zu erfordern. Alle Daten bleiben lokal in deinem Browser gespeichert, sodass du sofort loslegen kannst.

## Idee
Paraström richtet sich an Nutzerinnen und Nutzer, die mehrere kleine Aufgaben gleichzeitig verwalten möchten. Statt einer überladenen Projektverwaltung setzt die App auf einfache Eingabeformulare, farblich gekennzeichnete Prioritäten und einen dynamischen Fortschrittsbalken. Durch den Verzicht auf ein Backend eignet sich Paraström auch für kurze Sessions oder zum Mitnehmen auf USB-Stick.
<br><br>
## Aktuelle Features
- Task-Eingabe mit Titel, Kategorie, Priorität, geplanter Dauer und optionalen Notizen
- Speicherung im Browser (LocalStorage / IndexedDB)
- Darstellung aller Tasks als Karten mit animiertem Fortschrittsbalken
- Erledigen oder Löschen einzelner Tasks
- JSON-Export und Import deiner Taskliste
- Desktop-Benachrichtigungen bei abgeschlossenem Task

## Roadmap


### Aktuelle Features
- Task-Eingabe mit Titel, Kategorie, Priorität, geplanter Dauer und optionalen Notizen
- Speicherung im Browser (LocalStorage / IndexedDB)
- Darstellung aller Tasks als Karten mit animiertem Fortschrittsbalken
- Erledigen oder Löschen einzelner Tasks
- JSON-Export und Import der Taskliste
- Desktop-Benachrichtigungen bei abgeschlossenem Task
- Anzeige hinterlegter Notizen zu jedem Task

### Phase 1 - Minimal Viable Product (MVP)
Bereits umgesetzt oder in Arbeit:
- Task-Eingabe mit Titel, Kategorie, Priorität, Dauer, Notizen
- Speicherung lokal (LocalStorage / IndexedDB)
- JSON-Export / Import
- Flow-Animation (Basis)
- Erledigt / Löschen von Tasks


*Technische Basis*: React + Tailwind, einfache Komponentenstruktur, komplett ohne Backend.

### Phase 2 – UI/UX-Optimierung
Ziele: responsives, modernes Layout und besserer Überblick
- Full-width Form-Layout (responsive Grid)
- Task-Visualisierung als flexible Cards (mit Farbcode für Priorität)
- Floating Action Button zum Anlegen neuer Tasks
- Mini-Dashboard oben: „x aktiv | y wartend | z erledigt“
- Dark Mode
- Animation bei Statusänderung (z.B. sanftes Ausblenden bei „Erledigt“)

### Phase 3 – Automatisierung & Intelligenz
Ziele: weniger manuelles Nachpflegen, smartere Nutzung
- Auto-Fortschritt-Balken basierend auf Startzeit + geplanter Dauer
- Timer/Alarm: Browser-Notification oder Sound bei Ablauf
- Wiederkehrende Tasks (Tages-/Wochenrhythmus)
- Task-Vorlagen (z.B. „Server-Check 10 min high“)

### Phase 4 – Vernetzung & Integration
Ziele: Paraström öffnet sich für Automationen & andere Tools
- Webhook-Trigger (z.B. an n8n / Zapier / IFTTT) bei Events
- API-Endpunkt lokal (z.B. via Express-Light-Server oder in Electron-Verpackung)
- Import aus ICS/Kalender, Trello, CSV
- Export auch als PDF

### Phase 5 – Analyse & Historie
Ziele: auswerten, lernen, verbessern
- Log der erledigten Tasks (z.B. letzte 100)
- Durchschnittliche Dauer pro Kategorie
- Heatmap: Welche Zeiträume sind bei dir am vollsten?
- Export der Statistik

### Phase 6 – Sicherheit & Sync
Ziele: Daten schützen und auf mehreren Geräten nutzen
- Passwort-geschützter Export
- Cloud-Sync-Option (Firebase, Supabase oder eigener kleiner Backend-Service)
- Mehrbenutzer-Unterstützung (optional später)

### Roadmap Visualisiert
| Phase | Inhalt | Ziel |
|-----|-----|-----|
|1|MVP (Task-Anlage + Flow + Speicher)|Grundfunktionalität|
|2|UI-Redesign + Dark Mode|Modernes Look & Feel|
|3|Auto-Fortschritt + Timer + Wiederkehrende Tasks|Weniger manuelles Nachpflegen|
|4|Webhooks + API + Import/Export erweitern|Integration in Automationen|
|5|Statistiken + Verlauf + Heatmap|Lernen & optimieren|
|6|Security + Cloud Sync|Paraström professionell absichern|

### Zusatzideen
- Animation beim Anlegen eines neuen Tasks (z.B. der Stream „fließt" ins Bild)
- Leichtes Hintergrundrauschen (dynamische Linien, subtil)
- Soundeffekt beim Erledigen eines Tasks (optional abschaltbar)

### Empfehlung zur Umsetzung
Um möglichst schnell ein rundes Produkt zu erhalten, können Phase 2 und 3 kombiniert und zuerst angegangen werden. Danach folgt die Integration (Phase 4). Statistiken und Synchronisation lassen sich später ergänzen.

## Starten
Öffne einfach die Datei `index.html` im Browser. React und Tailwind werden per CDN geladen, ein separater Build-Schritt ist nicht erforderlich.
