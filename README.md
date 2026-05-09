# MediConnect

**MediConnect** is a centralized healthcare platform that bridges the gap between patients, hospitals, and doctors. It simplifies the entire healthcare journey — from searching for the right doctor and booking appointments to receiving digital prescriptions and sharing feedback through reviews.

In many regions, booking a medical appointment still involves phone calls, long waits, and no visibility into doctor availability. MediConnect solves this by giving patients a single place to discover hospitals, view doctor schedules in real time, and book instantly — while giving hospitals modern tools to manage their doctors, appointments, and patient records digitally.

## Tech Stack

| Layer    | Technologies                                              |
| -------- | --------------------------------------------------------- |
| Frontend | React 19, Vite, Chakra UI v3, Redux Toolkit, Redux Saga  |
| Backend  | Node.js, Express, MongoDB, Mongoose, JWT, Cloudinary      |
| Docs     | Swagger (available at `/api-docs`)                        |
| Live     | [App](https://medi-connect-inky.vercel.app/login) · [API Docs](https://mediconnect-kpkj.onrender.com/api-docs/) |

## Project Structure

```
mediConnect/
├── mediConnect_frontend/   # React SPA
├── mediConnect_backend/    # Express REST API
└── AGENTS.md               # AI coding guidelines
```

## Features

- **Patients** — Search hospitals & doctors by specialty, book appointments online, view digital prescriptions, submit reviews
- **Hospital Admins** — Manage doctors & schedules, handle appointments, upload prescriptions, view patient records
- **Super Admin** — Onboard & manage hospitals, manage specialties, moderate reviews, view platform analytics

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB instance (local or Atlas)

### Backend

```bash
cd mediConnect_backend
npm install
# configure .env (see mediConnect_backend/README.md)
npm run dev
```

### Frontend

```bash
cd mediConnect_frontend
npm install
# configure .env (see mediConnect_frontend/README.md)
npm run dev
```

See individual README files for detailed setup:
- [Frontend README](mediConnect_frontend/README.md)
- [Backend README](mediConnect_backend/README.md)

## API Documentation

- Swagger UI (live): https://mediconnect-kpkj.onrender.com/api-docs/
- Swagger UI (local): `http://localhost:8000/api-docs`
- Markdown: [API_DOCUMENTATION.md](mediConnect_backend/docs/API_DOCUMENTATION.md)