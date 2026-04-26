const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MediConnect API',
      version: '1.0.0',
      description: 'Healthcare Appointment & Hospital Management System API',
      contact: {
        name: 'MediConnect Team',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API v1',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // ─── User ──────────────────────────────────────────────
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['super_admin', 'hospital_admin', 'patient'] },
            phone: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive'] },
            avatar: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ─── Hospital ──────────────────────────────────────────
        Hospital: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
              },
            },
            phone: { type: 'string' },
            email: { type: 'string', format: 'email' },
            hospitalAdminId: { type: 'string' },
            specialties: { type: 'array', items: { type: 'string' } },
            status: { type: 'string', enum: ['active', 'inactive'] },
            description: { type: 'string' },
            logo: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ─── Doctor ────────────────────────────────────────────
        Doctor: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            hospitalId: { type: 'string' },
            name: { type: 'string' },
            specialtyIds: { type: 'array', items: { type: 'string' } },
            experience: { type: 'number' },
            consultationFee: { type: 'number' },
            qualification: { type: 'string' },
            gender: { type: 'string', enum: ['male', 'female', 'other'] },
            status: { type: 'string', enum: ['active', 'inactive'] },
            bio: { type: 'string' },
            avatar: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ─── Specialty ─────────────────────────────────────────
        Specialty: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ─── Schedule ──────────────────────────────────────────
        Schedule: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            doctorId: { type: 'string' },
            dayOfWeek: { type: 'integer', minimum: 0, maximum: 6, description: '0=Sun, 6=Sat' },
            startTime: { type: 'string', example: '09:00' },
            endTime: { type: 'string', example: '17:00' },
            slotDuration: { type: 'integer', example: 30, description: 'Minutes' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ─── Appointment ───────────────────────────────────────
        Appointment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            patientId: { type: 'string' },
            hospitalId: { type: 'string' },
            doctorId: { type: 'string' },
            appointmentDate: { type: 'string', format: 'date' },
            timeSlot: { type: 'string', example: '09:00-09:30' },
            status: { type: 'string', enum: ['booked', 'completed', 'cancelled'] },
            reason: { type: 'string' },
            notes: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ─── Prescription ──────────────────────────────────────
        Prescription: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            appointmentId: { type: 'string' },
            doctorId: { type: 'string' },
            patientId: { type: 'string' },
            fileUrl: { type: 'string' },
            notes: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ─── Review ────────────────────────────────────────────
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            patientId: { type: 'string' },
            doctorId: { type: 'string' },
            hospitalId: { type: 'string' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            comment: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ─── Reusable Response Wrappers ────────────────────────
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'array', items: {} },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'integer' },
                page: { type: 'integer' },
                limit: { type: 'integer' },
                totalPages: { type: 'integer' },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication & registration' },
      { name: 'Hospitals', description: 'Hospital management' },
      { name: 'Doctors', description: 'Doctor management' },
      { name: 'Specialties', description: 'Specialty management' },
      { name: 'Schedules', description: 'Doctor schedule management' },
      { name: 'Appointments', description: 'Appointment booking & management' },
      { name: 'Prescriptions', description: 'Prescription uploads & retrieval' },
      { name: 'Reviews', description: 'Review & rating system' },
      { name: 'Dashboard', description: 'Admin dashboard & analytics' },
      { name: 'Patients', description: 'Patient-scoped data' },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
