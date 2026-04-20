# MediConnect - Project Documentation

## 📁 Folder Structure

```
src/
├── app/                    # Redux store configuration
│   ├── rootReducer.js      # Combines all reducers
│   ├── rootSaga.js         # Combines all sagas
│   └── store.js            # Store configuration
│
├── assets/                 # Static files
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── components/             # Reusable components
│   ├── common/             # Generic UI components
│   ├── cards/              # Card components
│   └── forms/              # Form components
│
├── constants/              # App constants
│   ├── apiEndpoints.js     # All API endpoints
│   ├── roles.js            # User roles & permissions
│   ├── appointmentStatus.js
│   └── index.js
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.js
│   └── useDebounce.js
│
├── layout/                 # Layout components
│   ├── MainLayout.jsx
│   ├── Header.jsx
│   └── Sidebar.jsx
│
├── pages/                  # Feature modules (slice + saga per module)
│   ├── auth/               # Authentication
│   ├── admin/              # Super Admin features
│   ├── hospital/           # Hospital Admin features
│   └── patient/            # Patient features
│
├── routes/                 # Route configuration
│   ├── AppRoutes.jsx
│   ├── ProtectedRoute.jsx
│   ├── AdminRoutes.jsx
│   ├── HospitalRoutes.jsx
│   └── PatientRoutes.jsx
│
├── services/               # API services
│   ├── api.js              # Axios instance
│   ├── authService.js
│   ├── hospitalService.js
│   ├── doctorService.js
│   ├── appointmentService.js
│   ├── prescriptionService.js
│   └── reviewService.js
│
├── styles/                 # Styling
│   └── theme.js
│
└── utils/                  # Utility functions
    ├── helpers.js
    ├── validators.js
    ├── dateUtils.js
    └── storage.js
```

---

## 👥 User Roles

| Role | Route Prefix | Description |
|------|--------------|-------------|
| `super_admin` | `/admin` | Platform owner, manages hospitals |
| `hospital_admin` | `/hospital` | Hospital manager, manages doctors |
| `patient` | `/patient` | End user, books appointments |

---

## 🔗 API Endpoints Reference

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/login` | POST | User login |
| `/api/v1/auth/register` | POST | Patient registration |
| `/api/v1/auth/logout` | POST | User logout |
| `/api/v1/auth/refresh` | POST | Refresh token |

### Hospitals
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/hospitals` | GET | List all hospitals |
| `/api/v1/hospitals/:id` | GET | Get hospital by ID |
| `/api/v1/hospitals` | POST | Create hospital |
| `/api/v1/hospitals/:id` | PUT | Update hospital |
| `/api/v1/hospitals/:id/status` | PATCH | Toggle status |

### Doctors
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/doctors` | GET | List all doctors |
| `/api/v1/doctors/:id` | GET | Get doctor by ID |
| `/api/v1/hospitals/:id/doctors` | GET | Doctors by hospital |
| `/api/v1/specialties/:id/doctors` | GET | Doctors by specialty |

### Appointments
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/appointments` | GET/POST | List/Create appointments |
| `/api/v1/appointments/:id` | GET/PUT | Get/Update appointment |
| `/api/v1/appointments/:id/cancel` | PATCH | Cancel appointment |
| `/api/v1/doctors/:id/slots` | GET | Available slots |

### Prescriptions
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/prescriptions` | GET | List prescriptions |
| `/api/v1/prescriptions/upload` | POST | Upload prescription |
| `/api/v1/appointments/:id/prescription` | GET | Get by appointment |

### Reviews
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/reviews` | GET/POST | List/Create reviews |
| `/api/v1/reviews/:id/approve` | PATCH | Approve review |
| `/api/v1/reviews/:id/reject` | PATCH | Reject review |

---

## 📊 Entity Relationships

```
Hospital (1) ──── (N) Doctor
Doctor (1) ──── (N) Schedule
Doctor (1) ──── (N) Appointment
Appointment (1) ──── (1) Prescription
Patient (1) ──── (N) Appointment
Patient (1) ──── (N) Review
Doctor (1) ──── (N) Review
Hospital (1) ──── (N) Review
```

---

## 🗄️ MongoDB Collections

| Collection | Key Fields |
|------------|------------|
| `users` | _id, name, email, password, role, phone, status |
| `hospitals` | _id, name, address, hospitalAdminId, specialties, status |
| `doctors` | _id, hospitalId, name, specialtyId, experience, consultationFee |
| `schedules` | _id, doctorId, dayOfWeek, startTime, endTime, slotDuration |
| `appointments` | _id, patientId, hospitalId, doctorId, appointmentDate, timeSlot, status |
| `prescriptions` | _id, appointmentId, doctorId, patientId, fileUrl, notes |
| `reviews` | _id, patientId, doctorId, hospitalId, rating, comment, status |
| `specialties` | _id, name, description |

---

## 🔐 Security Considerations (OWASP)

- [ ] Input validation on all forms
- [ ] Password hashing (bcrypt)
- [ ] JWT token with refresh mechanism
- [ ] Role-based access control (RBAC)
- [ ] CSRF protection
- [ ] XSS prevention (input sanitization)
- [ ] Rate limiting on auth endpoints
- [ ] Secure file upload validation
- [ ] HTTPS in production

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📝 Development Notes

- State Management: Redux Toolkit + Redux Saga
- UI Framework: React + Vite
- Routing: React Router DOM v6
- API Client: Axios

---

*Last Updated: 2026-04-15*
