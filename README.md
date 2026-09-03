# Pension Flow

Full-stack application for managing administrative processes in a pension management environment.

🌐 **[Live Demo](https://pension-flow-theta.vercel.app)**

---

## About

Pension Flow is a full-stack web application designed to manage administrative processes from creation to completion.

The project was built to demonstrate the development of a complete application — from the React frontend and REST API to persistent MongoDB storage and cloud deployment.

The application is fully deployed and can be tested directly through the live demo.

---

## Features

- Create, view, edit and delete processes
- Manage process status and priority
- Assign processes to employees
- Persistent data storage
- RESTful API
- Responsive web interface
- Production deployment

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- Java
- Spring Boot
- Spring Data MongoDB
- REST API
- Gradle

### Database & Infrastructure

- MongoDB Atlas
- Docker
- Git / GitHub

### Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

## Architecture

```text
                 ┌────────────────────┐
                 │       Vercel       │
                 │  React + TypeScript│
                 └─────────┬──────────┘
                           │
                         REST
                           │
                           ▼
                 ┌────────────────────┐
                 │       Render       │
                 │    Spring Boot     │
                 └─────────┬──────────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │    MongoDB Atlas   │
                 └────────────────────┘
````

The backend follows a simple layered architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
MongoDB
```

This keeps API handling, business logic and data access separated.

---

## REST API

| Method | Endpoint                     | Description           |
| ------ | ---------------------------- | --------------------- |
| GET    | `/api/processes`             | Get all processes     |
| GET    | `/api/processes/{id}`        | Get a process         |
| POST   | `/api/processes`             | Create a process      |
| PUT    | `/api/processes/{id}`        | Update a process      |
| PATCH  | `/api/processes/{id}/status` | Update process status |
| DELETE | `/api/processes/{id}`        | Delete a process      |

---

## Testing

The backend includes automated tests and the REST API was tested using IntelliJ IDEA's HTTP Client.

The complete CRUD workflow was tested against the deployed backend.

---

## Deployment

The application is deployed as three separate components:

**Frontend**
Vercel

**Backend**
Render

**Database**
MongoDB Atlas

The production frontend communicates with the deployed Spring Boot REST API over HTTPS.

---

## Local Development

### Backend

```bash
./gradlew bootRun
```

### Frontend

```bash
npm install
npm run dev
```

The frontend is then available at:

```text
http://localhost:5173
```
