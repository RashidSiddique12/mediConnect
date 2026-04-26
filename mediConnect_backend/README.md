# MediConnect Backend

A RESTful API backend for **MediConnect** — a centralized healthcare platform connecting Patients, Hospitals, and Doctors for appointment booking, medical records, and hospital management.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (Atlas) + Mongoose ODM |
| Auth | JWT (Access + Refresh Tokens) |
| Validation | express-validator |
| File Upload | Multer (local disk) |
| Security | Helmet, CORS, express-rate-limit |
| Logging | Morgan |

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Clone and navigate
cd mediConnect_backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Edit `.env` with your values:

```env
PORT=8000
NODE_ENV=development

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mediconnect?retryWrites=true&w=majority

JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

CORS_ORIGIN=http://localhost:5173
```

### Seed Super Admin

```bash
npm run seed
```

Default credentials:
- **Email:** `admin@mediconnect.com`
- **Password:** `Admin@123`

### Run the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:8000`

---

## Project Structure

```
mediConnect_backend/
├── config/
│   ├── db.js               # MongoDB connection
│   └── env.js              # Environment variables
├── controllers/
│   ├── appointmentController.js
│   ├── authController.js
│   ├── dashboardController.js
│   ├── doctorController.js
│   ├── hospitalController.js
│   ├── prescriptionController.js
│   ├── reviewController.js
│   ├── scheduleController.js
│   └── specialtyController.js
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── errorHandler.js      # Global error handler
│   ├── roleCheck.js         # Role-based access control
│   ├── upload.js            # Multer file upload
│   └── validate.js          # Request validation runner
├── models/
│   ├── Appointment.js
│   ├── Doctor.js
│   ├── Hospital.js
│   ├── Prescription.js
│   ├── RefreshToken.js
│   ├── Review.js
│   ├── Schedule.js
│   ├── Specialty.js
│   └── User.js
├── routes/
│   ├── appointmentRoutes.js
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── doctorRoutes.js
│   ├── hospitalRoutes.js
│   ├── patientRoutes.js
│   ├── prescriptionRoutes.js
│   ├── reviewRoutes.js
│   ├── scheduleRoutes.js
│   └── specialtyRoutes.js
├── seeds/
│   └── superAdmin.js        # Seed script
├── utils/
│   ├── apiResponse.js       # Standardized responses
│   ├── constants.js         # Enums & constants
│   └── generateToken.js     # JWT token helpers
├── validators/
│   ├── appointmentValidator.js
│   ├── authValidator.js
│   ├── doctorValidator.js
│   ├── hospitalValidator.js
│   ├── prescriptionValidator.js
│   ├── reviewValidator.js
│   ├── scheduleValidator.js
│   └── specialtyValidator.js
├── uploads/                  # Local file uploads (gitignored)
├── server.js                 # Entry point
├── package.json
├── .env.example
└── .gitignore
```

---

## User Roles

| Role | Key | Description |
|------|-----|------------|
| Super Admin | `super_admin` | Platform owner — manages hospitals, specialties, users, reviews |
| Hospital Admin | `hospital_admin` | Hospital manager — manages doctors, schedules, appointments, prescriptions |
| Patient | `patient` | End user — books appointments, views prescriptions, writes reviews |

---

## Authentication

The API uses **JWT-based authentication** with access and refresh tokens.

| Token | Lifetime | Storage |
|-------|---------|---------|
| Access Token | 15 minutes | Client-side (localStorage) |
| Refresh Token | 7 days | Server-side (MongoDB with TTL) |

**Request Header:**
```
Authorization: Bearer <access_token>
```

**Token Refresh Flow:**
1. Access token expires → client gets 401
2. Client sends refresh token to `POST /api/v1/auth/refresh`
3. Server returns new access token

---

## API Response Format

All responses follow a consistent structure:

**Success:**
```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

**Paginated:**
```json
{
  "success": true,
  "message": "Success",
  "data": [ ... ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start` | Start in production mode |
| `npm run seed` | Seed default super admin |

---

## Security Features

- **Helmet** — HTTP security headers
- **CORS** — Configurable origin whitelist
- **Rate Limiting** — 100 requests per 15 minutes per IP
- **JWT Auth** — Stateless authentication with refresh rotation
- **bcryptjs** — Password hashing (12 salt rounds)
- **Input Validation** — express-validator on all write endpoints
- **Role-Based Access Control** — Middleware-enforced permissions

---

