# MediConnect — Frontend

A healthcare appointment management platform built with React. It connects patients with hospitals and doctors, enabling appointment booking, prescription management, and review submissions through role-based dashboards.

## Tech Stack

- **React 19** with Vite
- **Chakra UI v3** (component library & theming)
- **Redux Toolkit** + **Redux Saga** (state & async management)
- **React Router v7** (client-side routing)
- **Axios** (API communication)
- **React Icons** (iconography)

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or yarn/pnpm)
- Backend server running (see `mediConnect_backend/`)

## Getting Started

```bash
# 1. Navigate to the frontend directory
cd mediConnect_frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
```

Set the required environment variable in `.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

```bash
# 4. Start the dev server
npm run dev
```

The app runs at **http://localhost:5173** by default.

## Available Scripts

| Script          | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start dev server             |
| `npm run build` | Production build             |
| `npm run preview` | Preview production build   |
| `npm run lint`  | Run ESLint                   |

## Project Structure

```
src/
├── app/              # Redux store, root reducer & saga
├── assets/           # Fonts, icons, images
├── components/       # Shared/reusable components (DataTable, cards, forms)
├── constants/        # API endpoints, roles, status enums
├── features/         # Redux slices, sagas & selectors per feature
├── hooks/            # Custom hooks (useAuth, useDebounce)
├── layout/           # App shell (Header, Sidebar, Footer)
├── pages/            # Route pages grouped by role
│   ├── admin/        # Super admin pages
│   ├── hospital/     # Hospital admin pages
│   ├── patient/      # Patient pages
│   └── auth/         # Login & Register
├── routes/           # Route definitions & guards
├── services/         # Axios API instance
├── styles/           # Global theme config
└── utils/            # Helper utilities
```

## User Roles

| Role             | Base Route   | Key Capabilities                                           |
| ---------------- | ------------ | ---------------------------------------------------------- |
| Super Admin      | `/admin`     | Manage hospitals, specialties, users; moderate reviews      |
| Hospital Admin   | `/hospital`  | Manage doctors, schedules, appointments; upload prescriptions |
| Patient          | `/patient`   | Search & book appointments; view prescriptions; submit reviews |

## Import Alias

The project uses `@/` as an alias for `src/`. All imports should use this alias:

```js
import { hospitalSlice } from '@/features/hospitals/hospitalSlice'
```

## Key Conventions

- **Chakra UI only** — no custom CSS files or styled-components
- **Functional components** with default exports for pages
- **Redux Saga** for all async logic — no thunks
- **Lazy-loaded pages** via `React.lazy()` + `<Suspense>`