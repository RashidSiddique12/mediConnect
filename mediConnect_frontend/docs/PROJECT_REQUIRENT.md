# 🏥 Healthcare Appointment \& Hospital Management System

## Project Name (Suggested)

**MediConnect**

A centralized healthcare platform that connects **Patients**, **Hospitals**, and **Doctors**, enabling appointment booking, medical record storage, and hospital management through a unified system.

\---

# 📌 Project Overview

## Objective

Build a centralized platform where:

* Patients can search hospitals and doctors
* Patients can book appointments easily
* Hospitals can manage doctors and schedules
* Prescriptions and visit history are stored digitally
* Super Admin controls hospitals and system data

This system will be built using:

* **Single Frontend**
* **Single Backend**
* **MongoDB Database**
* Mobile apps can be added later using same APIs.

\---

# 👥 User Roles

There are **three main user roles**:

|Role|Description|
|-|-|
|**Super Admin**|Platform owner managing hospitals, specialties, users|
|**Hospital Admin**|Hospital-side management of doctors and appointments|
|**Patient**|End user booking appointments and viewing prescriptions|

\---

# ⭐ Features Table

## 🔴 Super Admin Features

|Feature|Description|
|-|-|
|Add Hospital|Create new hospital records|
|Edit Hospital|Update hospital details|
|Activate/Deactivate Hospital|Control hospital status|
|View All Hospitals|List of registered hospitals|
|Manage Specialties|Add/edit specialties like Cardiology|
|View Users|View patients and hospital admins|
|Manage Reviews|Approve or reject reviews|
|Dashboard Analytics|View total hospitals, users, appointments|

\---

## 🏥 Hospital Admin Features

|Feature|Description|
|-|-|
|Hospital Profile Management|Update hospital details|
|Add Doctor|Create doctor records|
|Edit Doctor|Update doctor info|
|Delete Doctor|Remove doctor|
|Manage Doctor Schedule|Set availability|
|Generate Slots|Create appointment slots|
|View Appointments|See all bookings|
|Update Appointment Status|Completed / Cancelled|
|Upload Prescription|Upload medical files|
|View Patient Details|Access patient visit data|

\---

## 👤 Patient Features

|Feature|Description|
|-|-|
|Register/Login|Create patient account|
|Update Profile|Edit personal details|
|Search Hospital|Search by name|
|Search Doctor|Search by specialty|
|Filter Doctors|Filter by hospital/specialty|
|View Doctor Profile|See doctor details|
|Book Appointment|Select doctor and slot|
|Cancel Appointment|Cancel booking|
|View Appointment History|See past visits|
|Upload Documents|Upload medical files|
|View Prescriptions|Download prescription|
|Rate Doctor|Submit rating|
|Review Hospital|Provide feedback|

\---

# 🧭 User Journey

## 👤 Patient Journey

1. Patient registers
2. Logs into system
3. Searches hospital or doctor
4. Views doctor profile
5. Selects available slot
6. Books appointment
7. Visits hospital
8. Hospital uploads prescription
9. Patient views prescription
10. Patient submits review

\---

## 🏥 Hospital Journey

1. Super Admin creates hospital
2. Hospital admin logs in
3. Hospital sets profile
4. Adds doctors
5. Creates schedules
6. Views patient bookings
7. Uploads prescription
8. Marks appointment completed

\---

## 🔴 Super Admin Journey

1. Login to admin dashboard
2. Add hospital
3. Add specialties
4. Monitor users
5. Manage hospitals
6. Monitor system usage

\---

# 🏗️ System Architecture

## High-Level Architecture

```
Frontend (React)

 ├── Super Admin Dashboard
 ├── Hospital Dashboard
 ├── Patient Portal

          │
          │ REST API
          ▼

Backend (Node.js + Express)

 ├── Authentication Module
 ├── Hospital Module
 ├── Doctor Module
 ├── Appointment Module
 ├── Prescription Module
 ├── Review Module

          │
          ▼

MongoDB Database
```

\---

# 📁 Frontend Architecture

Single frontend supports all roles.

```
src/

├── auth/
│   ├── Login.jsx
│   ├── Register.jsx
│
├── admin/
│   ├── Dashboard.jsx
│   ├── Hospitals.jsx
│   ├── Users.jsx
│   ├── Specialties.jsx
│
├── hospital/
│   ├── Dashboard.jsx
│   ├── Doctors.jsx
│   ├── Schedules.jsx
│   ├── Appointments.jsx
│
├── patient/
│   ├── Home.jsx
│   ├── SearchDoctors.jsx
│   ├── BookAppointment.jsx
│   ├── MyAppointments.jsx
│
├── components/
├── services/
├── store/
└── routes/
```

\---

# ⚙️ Backend Architecture

```
backend/

├── models/
├── controllers/
├── routes/
├── middleware/
├── services/
├── utils/
└── server.js
```

\---

# 🗄️ Database Architecture (MongoDB)

## Collections Overview

```
users
hospitals
doctors
specialties
schedules
appointments
prescriptions
reviews
```

\---

# users Collection

```
{
 \\\\\\\_id,
 name,
 email,
 password,
 role,
 phone,
 status,
 createdAt
}
```

Roles:

* super\_admin
* hospital\_admin
* patient

\---

# hospitals Collection

```
{
 \\\\\\\_id,
 name,
 address,
 phone,
 email,
 hospitalAdminId,
 specialties,
 status,
 createdAt
}
```

\---

# doctors Collection

```
{
 \\\\\\\_id,
 hospitalId,
 name,
 specialtyId,
 experience,
 consultationFee,
 qualification,
 gender,
 status
}
```

\---

# schedules Collection

```
{
 \\\\\\\_id,
 doctorId,
 dayOfWeek,
 startTime,
 endTime,
 slotDuration
}
```

\---

# appointments Collection

```
{
 \\\\\\\_id,
 patientId,
 hospitalId,
 doctorId,
 appointmentDate,
 timeSlot,
 status,
 reason
}
```

Status:

* booked
* completed
* cancelled

\---

# prescriptions Collection

```
{
 \\\\\\\_id,
 appointmentId,
 doctorId,
 patientId,
 fileUrl,
 notes
}
```

\---

# reviews Collection

```
{
 \\\\\\\_id,
 patientId,
 doctorId,
 hospitalId,
 rating,
 comment,
 status
}
```

Review status:

* pending
* approved
* rejected

\---

# 🔗 Database Relationships

```
Hospital → Doctors
Doctor → Schedule
Doctor → Appointment
Appointment → Prescription
Patient → Appointment
Patient → Review
```

\---

# 🧩 System Modules

|Module|Responsibility|
|-|-|
|Auth Module|Login and registration|
|Hospital Module|Hospital data management|
|Doctor Module|Doctor management|
|Schedule Module|Doctor availability|
|Appointment Module|Booking system|
|Prescription Module|Medical file handling|
|Review Module|Ratings system|
|Admin Module|Super Admin controls|

\---

# 🔄 Appointment Booking Flow

```
Patient selects doctor
        ↓
System shows available slots
        ↓
Patient selects slot
        ↓
Appointment created
        ↓
Hospital views booking
        ↓
Appointment completed
        ↓
Prescription uploaded
```

\---

# 📊 Dashboard Metrics

Super Admin Dashboard shows:

* Total Hospitals
* Total Doctors
* Total Patients
* Total Appointments
* Active Hospitals

\---

# 🛠️ Technology Stack

## Frontend

* React (Vite)
* Redux Toolkit
* React Query
* Chakra UI

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## File Storage

* Local Storage (initial)
* AWS S3 (future)

\---

# 🚀 Development Phases

## Phase 1 — Core Setup

* Setup backend
* Setup frontend
* Connect MongoDB
* Create user authentication

\---

## Phase 2 — Super Admin

* Add specialty
* Add hospital
* Manage hospitals

\---

## Phase 3 — Hospital Features

* Add doctor
* Create schedules
* Manage appointments

\---

## Phase 4 — Patient Features

* Search doctors
* Book appointments
* View appointment history

\---

## Phase 5 — Medical Records

* Upload prescription
* View prescription
* Add reviews

\---


\---

# 📌 Future Enhancements
* Nearby hospital map
* AI doctor recommendation

\---

# 🎯 Key System Highlights

* Multi-role architecture
* Role-based dashboards
* Single frontend
* Single backend
* Scalable MongoDB structure
* Modular system design
* Real-world healthcare workflow

\---

# 📚 Final Notes

This project demonstrates:

* Full-stack architecture design
* Role-based system
* Real-world booking workflow
* Database modeling
* API-driven development

This is a **portfolio-grade production-style project** suitable for:

* System Design interviews
* Full-stack developer portfolios
* SaaS architecture demonstrations

\---

