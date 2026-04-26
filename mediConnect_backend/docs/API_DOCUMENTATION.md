# MediConnect API Documentation

Base URL: `http://localhost:8000/api/v1`

---

## Table of Contents

- [Authentication](#authentication)
- [Hospitals](#hospitals)
- [Doctors](#doctors)
- [Specialties](#specialties)
- [Schedules](#schedules)
- [Appointments](#appointments)
- [Prescriptions](#prescriptions)
- [Reviews](#reviews)
- [Dashboard](#dashboard)
- [Patients](#patients)
- [Health Check](#health-check)

---

## Authentication

### Register

```
POST /auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

**Response:** `201`
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "patient",
      "phone": "9876543210"
    },
    "accessToken": "eyJhb...",
    "refreshToken": "a1b2c3d4..."
  }
}
```

---

### Login

```
POST /auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "_id": "...", "name": "...", "email": "...", "role": "...", "phone": "..." },
    "accessToken": "eyJhb...",
    "refreshToken": "a1b2c3d4..."
  }
}
```

---

### Refresh Token

```
POST /auth/refresh
```

**Body:**
```json
{
  "refreshToken": "a1b2c3d4..."
}
```

**Response:** `200`
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhb..."
  }
}
```

---

### Logout

```
POST /auth/logout
```

**Body:**
```json
{
  "refreshToken": "a1b2c3d4..."
}
```

**Response:** `200`
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

---

## Hospitals

### List Hospitals

```
GET /hospitals
```

**Query Params:**
| Param | Type | Description |
|-------|------|------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `search` | string | Search by hospital name |
| `status` | string | Filter by `active` or `inactive` |

---

### Get Hospital by ID

```
GET /hospitals/:id
```

---

### Create Hospital

```
POST /hospitals
```

**Auth:** Required | **Role:** `super_admin`

**Body:**
```json
{
  "name": "City Hospital",
  "phone": "1234567890",
  "email": "city@hospital.com",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  },
  "description": "Multi-specialty hospital",
  "specialties": ["specialtyId1", "specialtyId2"],
  "hospitalAdminId": "userId"
}
```

---

### Update Hospital

```
PUT /hospitals/:id
```

**Auth:** Required | **Role:** `super_admin`, `hospital_admin`

**Body:** Same as create (all fields optional)

---

### Delete Hospital

```
DELETE /hospitals/:id
```

**Auth:** Required | **Role:** `super_admin`

---

### Toggle Hospital Status

```
PATCH /hospitals/:id/status
```

**Auth:** Required | **Role:** `super_admin`

Toggles between `active` and `inactive`.

---

### List Doctors by Hospital

```
GET /hospitals/:hospitalId/doctors
```

---

### List Reviews by Hospital

```
GET /hospitals/:hospitalId/reviews
```

Returns only approved reviews.

---

## Doctors

### List Doctors

```
GET /doctors
```

**Query Params:**
| Param | Type | Description |
|-------|------|------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `search` | string | Search by doctor name |
| `specialtyId` | ObjectId | Filter by specialty |
| `hospitalId` | ObjectId | Filter by hospital |
| `gender` | string | Filter by `male`, `female`, `other` |

---

### Get Doctor by ID

```
GET /doctors/:id
```

---

### Create Doctor

```
POST /doctors
```

**Auth:** Required | **Role:** `hospital_admin`, `super_admin`

**Body:**
```json
{
  "name": "Dr. Smith",
  "specialtyIds": ["specialtyId1", "specialtyId2"],
  "experience": 10,
  "consultationFee": 500,
  "qualification": "MBBS, MD",
  "gender": "male",
  "bio": "Experienced cardiologist"
}
```

> **Note:** `hospitalId` is auto-assigned for `hospital_admin` based on their linked hospital.

---

### Update Doctor

```
PUT /doctors/:id
```

**Auth:** Required | **Role:** `hospital_admin`, `super_admin`

**Body:** Same as create (all fields optional)

---

### Delete Doctor

```
DELETE /doctors/:id
```

**Auth:** Required | **Role:** `hospital_admin`, `super_admin`

---

### List Schedules by Doctor

```
GET /doctors/:doctorId/schedules
```

---

### Get Available Slots

```
GET /doctors/:doctorId/slots?date=2026-04-30
```

**Query Params:**
| Param | Type | Required | Description |
|-------|------|----------|------------|
| `date` | string | Yes | Date in `YYYY-MM-DD` format |

**Response:**
```json
{
  "success": true,
  "data": [
    { "time": "09:00-09:30", "isAvailable": true },
    { "time": "09:30-10:00", "isAvailable": false },
    { "time": "10:00-10:30", "isAvailable": true }
  ]
}
```

---

### List Appointments by Doctor

```
GET /doctors/:doctorId/appointments
```

**Auth:** Required | **Role:** `super_admin`, `hospital_admin`

---

### List Reviews by Doctor

```
GET /doctors/:doctorId/reviews
```

Returns only approved reviews.

---

## Specialties

### List Specialties

```
GET /specialties
```

**Query Params:**
| Param | Type | Description |
|-------|------|------------|
| `status` | string | Filter by `active` or `inactive` |

---

### Get Specialty by ID

```
GET /specialties/:id
```

---

### List Doctors by Specialty

```
GET /specialties/:specialtyId/doctors
```

---

### Create Specialty

```
POST /specialties
```

**Auth:** Required | **Role:** `super_admin`

**Body:**
```json
{
  "name": "Cardiology",
  "description": "Heart and cardiovascular system"
}
```

---

### Update Specialty

```
PUT /specialties/:id
```

**Auth:** Required | **Role:** `super_admin`

---

### Delete Specialty

```
DELETE /specialties/:id
```

**Auth:** Required | **Role:** `super_admin`

---

## Schedules

All schedule endpoints require authentication with `hospital_admin` or `super_admin` role.

### List Schedules

```
GET /schedules
```

---

### Create Schedule

```
POST /schedules
```

**Body:**
```json
{
  "doctorId": "doctorObjectId",
  "dayOfWeek": 1,
  "startTime": "09:00",
  "endTime": "17:00",
  "slotDuration": 30
}
```

| dayOfWeek | Day |
|-----------|-----|
| 0 | Sunday |
| 1 | Monday |
| 2 | Tuesday |
| 3 | Wednesday |
| 4 | Thursday |
| 5 | Friday |
| 6 | Saturday |

> **Constraint:** One schedule per doctor per day (unique index on `doctorId + dayOfWeek`).

---

### Update Schedule

```
PUT /schedules/:id
```

---

### Delete Schedule

```
DELETE /schedules/:id
```

---

## Appointments

### List Appointments

```
GET /appointments
```

**Auth:** Required

**Query Params:**
| Param | Type | Description |
|-------|------|------------|
| `page` | number | Page number |
| `limit` | number | Items per page |
| `status` | string | `booked`, `completed`, `cancelled` |

---

### Get Appointment by ID

```
GET /appointments/:id
```

**Auth:** Required

---

### Book Appointment

```
POST /appointments
```

**Auth:** Required | **Role:** `patient`

**Body:**
```json
{
  "doctorId": "doctorObjectId",
  "hospitalId": "hospitalObjectId",
  "appointmentDate": "2026-04-30",
  "timeSlot": "09:00-09:30",
  "reason": "Regular checkup"
}
```

> **Constraint:** Prevents double booking (unique index on `doctorId + appointmentDate + timeSlot`).

---

### Update Appointment

```
PUT /appointments/:id
```

**Auth:** Required | **Role:** `hospital_admin`, `super_admin`

**Body:**
```json
{
  "status": "completed",
  "notes": "Patient visit completed successfully"
}
```

---

### Cancel Appointment

```
PATCH /appointments/:id/cancel
```

**Auth:** Required

Patients can only cancel their own appointments. Cannot cancel completed appointments.

---

### Get Prescription by Appointment

```
GET /appointments/:appointmentId/prescription
```

**Auth:** Required

---

## Prescriptions

### List Prescriptions

```
GET /prescriptions
```

**Auth:** Required

---

### Get Prescription by ID

```
GET /prescriptions/:id
```

**Auth:** Required

---

### Upload Prescription

```
POST /prescriptions/upload
```

**Auth:** Required | **Role:** `hospital_admin`

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `file` | File | Yes | JPEG, PNG, or PDF (max 5MB) |
| `appointmentId` | string | Yes | Appointment ObjectId |
| `notes` | string | No | Additional notes |

**Response:**
```json
{
  "success": true,
  "message": "Prescription uploaded successfully",
  "data": {
    "_id": "...",
    "fileUrl": "/uploads/prescriptions/prescription-1234567890.pdf",
    "notes": "Take medication twice daily",
    "appointmentId": { ... },
    "doctorId": { ... },
    "patientId": { ... }
  }
}
```

---

## Reviews

### List Reviews

```
GET /reviews
```

**Query Params:**
| Param | Type | Description |
|-------|------|------------|
| `page` | number | Page number |
| `limit` | number | Items per page |
| `status` | string | `pending`, `approved`, `rejected` |

---

### Create Review

```
POST /reviews
```

**Auth:** Required | **Role:** `patient`

**Body:**
```json
{
  "doctorId": "doctorObjectId",
  "hospitalId": "hospitalObjectId",
  "rating": 5,
  "comment": "Excellent doctor!"
}
```

Rating: 1-5 stars. New reviews default to `pending` status.

---

### Update Review

```
PUT /reviews/:id
```

**Auth:** Required (patients can only update their own)

---

### Delete Review

```
DELETE /reviews/:id
```

**Auth:** Required

---

### Approve Review

```
PATCH /reviews/:id/approve
```

**Auth:** Required | **Role:** `super_admin`

---

### Reject Review

```
PATCH /reviews/:id/reject
```

**Auth:** Required | **Role:** `super_admin`

---

## Dashboard

### Get Statistics

```
GET /dashboard/stats
```

**Auth:** Required | **Role:** `super_admin`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalHospitals": 25,
    "totalDoctors": 150,
    "totalPatients": 5000,
    "totalAppointments": 12000,
    "activeHospitals": 22,
    "recentAppointments": [...]
  }
}
```

---

### List Users

```
GET /dashboard/users
```

**Auth:** Required | **Role:** `super_admin`

**Query Params:**
| Param | Type | Description |
|-------|------|------------|
| `page` | number | Page number |
| `limit` | number | Items per page |
| `role` | string | `super_admin`, `hospital_admin`, `patient` |
| `search` | string | Search by name |

---

## Patients

### List Patient Appointments

```
GET /patients/:patientId/appointments
```

**Auth:** Required

**Query Params:**
| Param | Type | Description |
|-------|------|------------|
| `page` | number | Page number |
| `limit` | number | Items per page |
| `status` | string | `booked`, `completed`, `cancelled` |

---

### List Patient Prescriptions

```
GET /patients/:patientId/prescriptions
```

**Auth:** Required

---

## Health Check

```
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "MediConnect API is running"
}
```

---

## Error Codes

| Status | Meaning |
|--------|---------|
| `400` | Bad Request — validation error or invalid input |
| `401` | Unauthorized — missing or expired token |
| `403` | Forbidden — insufficient role/permissions |
| `404` | Not Found — resource doesn't exist |
| `409` | Conflict — duplicate entry (email, booking, etc.) |
| `429` | Too Many Requests — rate limit exceeded |
| `500` | Internal Server Error |

---

## Database Models

### User
| Field | Type | Notes |
|-------|------|-------|
| name | String | Required, max 100 |
| email | String | Required, unique |
| password | String | Required, min 6, hashed |
| role | String | `super_admin`, `hospital_admin`, `patient` |
| phone | String | Optional |
| status | String | `active`, `inactive` |
| avatar | String | Optional |

### Hospital
| Field | Type | Notes |
|-------|------|-------|
| name | String | Required |
| address | Object | street, city, state, zipCode |
| phone | String | Required |
| email | String | Required |
| hospitalAdminId | ObjectId → User | |
| specialties | [ObjectId → Specialty] | |
| status | String | `active`, `inactive` |
| description | String | Max 1000 |
| logo | String | Optional |

### Doctor
| Field | Type | Notes |
|-------|------|-------|
| hospitalId | ObjectId → Hospital | Required |
| name | String | Required |
| specialtyIds | [ObjectId → Specialty] | Array (multiple specialties) |
| experience | Number | Years |
| consultationFee | Number | |
| qualification | String | |
| gender | String | `male`, `female`, `other` |
| status | String | `active`, `inactive` |
| bio | String | Max 1000 |
| avatar | String | Optional |

### Specialty
| Field | Type | Notes |
|-------|------|-------|
| name | String | Required, unique |
| description | String | Max 500 |
| status | String | `active`, `inactive` |

### Schedule
| Field | Type | Notes |
|-------|------|-------|
| doctorId | ObjectId → Doctor | Required |
| dayOfWeek | Number | 0 (Sun) – 6 (Sat) |
| startTime | String | `HH:mm` format |
| endTime | String | `HH:mm` format |
| slotDuration | Number | Minutes (default: 30) |
| isActive | Boolean | |

### Appointment
| Field | Type | Notes |
|-------|------|-------|
| patientId | ObjectId → User | Required |
| hospitalId | ObjectId → Hospital | Required |
| doctorId | ObjectId → Doctor | Required |
| appointmentDate | Date | Required |
| timeSlot | String | `"09:00-09:30"` |
| status | String | `booked`, `completed`, `cancelled` |
| reason | String | Max 500 |
| notes | String | Max 1000 |

### Prescription
| Field | Type | Notes |
|-------|------|-------|
| appointmentId | ObjectId → Appointment | Required |
| doctorId | ObjectId → Doctor | Required |
| patientId | ObjectId → User | Required |
| fileUrl | String | Required |
| notes | String | Max 1000 |

### Review
| Field | Type | Notes |
|-------|------|-------|
| patientId | ObjectId → User | Required |
| doctorId | ObjectId → Doctor | Required |
| hospitalId | ObjectId → Hospital | Required |
| rating | Number | 1–5 |
| comment | String | Max 1000 |
| status | String | `pending`, `approved`, `rejected` |

### RefreshToken
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId → User | Required |
| token | String | Unique |
| expiresAt | Date | TTL auto-delete |
