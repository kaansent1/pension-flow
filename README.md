# Pension Flow

Eine cloud-fähige Full-Stack-Anwendung zur transparenten Steuerung von Verwaltungsvorgängen im Umfeld der betrieblichen Altersvorsorge. Pension Flow bildet den Weg eines Vorgangs von der Anlage bis zum Abschluss ab – mit klaren Verantwortlichkeiten und nachvollziehbaren Statusübergängen.

🌐 **[Live Demo](https://pension-flow-theta.vercel.app)**

## Fachliche Funktionen

- Vorgänge anlegen, einsehen, bearbeiten und löschen
- Bearbeitungsstatus und Priorität pflegen, Vorgänge bei Bedarf stornieren
- Vorgänge Mitarbeitenden zuordnen
- Vorgänge nach Text, Status und Priorität filtern sowie sortieren
- Aktivitätsverlauf mit Akteur, Zeitstempel und Art der Änderung einsehen
- Demo-Rollen für Administration (inkl. Löschen), Sachbearbeitung und lesenden Zugriff testen
- Unzulässige Statuswechsel im Backend verhindern
- Responsive Oberfläche mit Lade-, Fehler- und Leerzuständen

## Technologie & Qualität

| Bereich | Technologien |
| --- | --- |
| Frontend | React, TypeScript, Vite, CSS |
| Backend | Java 21, Spring Boot, Spring Data MongoDB, REST, Gradle |
| Betrieb | Docker Compose, MongoDB, Spring Boot Actuator |
| Qualität | JUnit, Mockito, Testcontainers, GitHub Actions |
| Deployment | Vercel, Render, MongoDB Atlas |

## Architektur

```text
React + TypeScript (Vercel)
            │ REST/HTTPS
            ▼
Spring Boot Process Service (Render)
            │
            ▼
MongoDB Atlas
```

Im Service trennt eine klassische Schichtenarchitektur die Verantwortlichkeiten:

```text
Controller → Service → Repository → MongoDB
```

## REST-API

| Methode | Endpoint | Beschreibung |
| --- | --- | --- |
| GET | `/api/processes` | Alle Vorgänge laden |
| GET | `/api/processes/{id}` | Einzelnen Vorgang laden |
| POST | `/api/processes` | Vorgang anlegen |
| PUT | `/api/processes/{id}` | Vorgang bearbeiten |
| PATCH | `/api/processes/{id}/status` | Status ändern |
| DELETE | `/api/processes/{id}` | Vorgang löschen |

```

## Lokal starten

Voraussetzungen: Java 21, Node.js 22+ und Docker.

1. Beispielkonfiguration kopieren:

```bash
cp frontend/.env.example frontend/.env
```

2. Datenbank und Backend starten:

```bash
docker compose up --build
```

3. In einem zweiten Terminal das Frontend starten:

```bash
cd frontend
npm install
npm run dev
```

Danach ist die Anwendung unter `http://localhost:5173` verfügbar.