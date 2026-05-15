# MediConnect — Payment Integration

Integrated payment system for doctor appointment bookings using **Razorpay** as the payment gateway. Patients pay the doctor's consultation fee at the time of booking, with full support for payment verification, automatic refunds on cancellation, and cleanup of abandoned payments.

---

## Table of Contents

- [Payment Flow](#payment-flow)
- [Architecture Overview](#architecture-overview)
- [Backend](#backend)
- [Frontend](#frontend)
- [Security](#security)
- [Appointment Lifecycle](#appointment-lifecycle)
- [Refund Handling](#refund-handling)
- [Abandoned Payment Cleanup](#abandoned-payment-cleanup)
- [Testing](#testing)

---

## Payment Flow

```
Patient selects doctor, date & time slot
         │
         ▼
 ┌──────────────────────┐
 │  POST /create-order   │  Backend creates Razorpay order +
 │                        │  appointment (status: pending_payment)
 └──────────┬─────────────┘
            │
            ▼
 ┌──────────────────────┐
 │  Razorpay Checkout    │  Razorpay modal opens in browser
 │  Modal (Client-side)  │  Patient completes payment
 └──────────┬─────────────┘
            │
            ▼
 ┌──────────────────────┐
 │  POST /verify         │  Backend verifies signature using
 │                        │  HMAC-SHA256, confirms appointment
 └──────────┬─────────────┘
            │
            ▼
    Appointment Booked ✓
    (status: booked, paymentStatus: paid)
```

If the patient closes the Razorpay modal without paying, the appointment remains in `pending_payment` status and is automatically cancelled by a cron job after 10 minutes.

---

## Architecture Overview

```
Frontend (React)                        Backend (Express)                  Razorpay
─────────────────                       ──────────────────                 ────────
                                                                          
BookAppointment Page                    Payment Controller                
  │                                       │                               
  ├─ dispatch(createOrderRequest) ──────► POST /create-order              
  │                                       ├─ Validate slot availability   
  │                                       ├─ Create appointment ──────────► orders.create()
  │                                       ├─ Create payment record        
  │                                       └─ Return orderId + keyId       
  │                                                                       
  ├─ Open Razorpay Checkout Modal ──────────────────────────────────────► Checkout UI
  │                                                                       
  ├─ dispatch(verifyPaymentRequest) ───► POST /verify                     
  │                                       ├─ HMAC-SHA256 signature check  
  │                                       ├─ Update payment (paid)        
  │                                       └─ Confirm appointment (booked) 
  │                                                                       
  └─ Navigate to appointments list                                        
                                                                          
Redux Store                             Mongoose Models                   
  ├─ paymentSlice                         ├─ Payment                      
  └─ paymentSaga                          └─ Appointment (updated)        
```

---

## Backend

### Payment Model (`models/Payment.js`)

Stores every payment transaction linked to an appointment — tracks Razorpay order/payment IDs, amount, status (`pending` → `paid` → `refunded` or `failed`), and refund details.

### Appointment Model Updates

Two new fields added: `paymentStatus` (`pending` | `paid` | `refunded` | `not_required`) and `paymentId` (ref to Payment). The status enum now includes `pending_payment` as the initial state during checkout.

### Payment Controller (`controllers/paymentController.js`)

- **`createOrder`** — Validates slot, creates Razorpay order, reserves appointment in `pending_payment`
- **`verifyPayment`** — Verifies HMAC-SHA256 signature, confirms appointment to `booked`
- **`refundPayment`** — Full refund via Razorpay API, updates payment + appointment
- **`getPaymentByAppointment`** — Returns payment details for an appointment

### Routes (`routes/paymentRoutes.js`)

All routes protected with `auth → roleCheck → validators → validate → controller`:

```
POST   /api/v1/payments/create-order      → patient only
POST   /api/v1/payments/verify            → patient only
POST   /api/v1/payments/refund            → patient, hospital_admin, super_admin
GET    /api/v1/payments/:appointmentId    → any authenticated user
```

### Razorpay Config

SDK initialized in `config/razorpay.js` using env variables (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`).

---

## Frontend

### State Management

Payment feature module at `src/features/payments/`:

| File | Purpose |
|---|---|
| `paymentSlice.js` | Actions: `createOrderRequest/Success/Failure`, `verifyPaymentRequest/Success/Failure`, `resetPayment` |
| `paymentSaga.js` | Handles API calls via `takeLatest` — calls `createPaymentOrder` and `verifyPayment` services |
| `paymentSelectors.js` | Selectors for order, loading, verifying, verified, and error states |

### Razorpay Checkout

Razorpay's `checkout.js` script is loaded dynamically on demand (`src/utils/loadRazorpay.js`) — no npm package needed. When the backend returns an order, a `useEffect` opens the checkout modal with the order details.

### Booking Flow (`BookAppointment.jsx`)

| Before | After |
|---|---|
| Click "Confirm" | Click "Pay ₹{fee} & Book" |
| `bookAppointmentRequest` dispatched | `createOrderRequest` → Razorpay modal → `verifyPaymentRequest` |
| Appointment created immediately | Appointment confirmed only after payment verification |

### Payment Status Display

Color-coded badges shown on My Appointments list (`Paid` / `Refunded` / `Payment Pending`) and payment info on the Appointment Details page.

---

## Security

### Signature Verification

Every payment is verified server-side using HMAC-SHA256 before confirming the appointment:

```
expected = HMAC-SHA256(razorpayOrderId + "|" + razorpayPaymentId, RAZORPAY_KEY_SECRET)
```

If the signature doesn't match, the payment is marked as `failed` and the appointment is cancelled. This prevents tampered payment confirmations.

### Slot Reservation

The appointment is created in `pending_payment` status **before** payment begins. A unique compound index on `(doctorId, appointmentDate, timeSlot)` with a partial filter prevents double-booking — the slot is reserved during checkout so no other patient can claim it.

### Input Validation

All payment endpoints use `express-validator` rules for:
- MongoDB ObjectId format validation on IDs
- ISO 8601 date format on appointment dates
- Regex pattern matching on time slots (`HH:MM-HH:MM`)
- Required field checks on all Razorpay response fields

---

## Appointment Lifecycle

```
                    ┌──────────────────┐
                    │  pending_payment  │ ← Created at checkout
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         Payment OK     Modal closed    Cron (10 min)
              │              │              │
              ▼              │              ▼
        ┌──────────┐        │        ┌───────────┐
        │  booked   │        └──────► │ cancelled  │
        └─────┬────┘                  └───────────┘
              │                             ▲
     ┌────────┼────────┐                   │
     │                 │                   │
  Completed      Cancelled by user ────────┘
     │           (auto-refund triggered)
     ▼
┌───────────┐
│ completed  │
└───────────┘
```

---

## Refund Handling

Refunds are triggered automatically when a paid appointment is cancelled:

1. Patient or admin cancels the appointment
2. Backend checks if `paymentStatus === 'paid'`
3. If yes, calls Razorpay's refund API for a full refund
4. Updates the payment record with `refundId` and `refundedAt`
5. Sets appointment `paymentStatus` to `refunded`
6. If the refund API call fails, the appointment is still cancelled but the payment is flagged for manual review

A standalone refund endpoint (`POST /api/v1/payments/refund`) is also available for admins to trigger refunds independently.

---

## Abandoned Payment Cleanup

A cron job runs every 5 minutes to clean up appointments stuck in `pending_payment` status:

- **Trigger:** Appointment in `pending_payment` for more than 10 minutes
- **Action:** Status updated to `cancelled`
- **Why:** If a patient opens the Razorpay modal but never completes payment (closes tab, network issue, etc.), the reserved slot needs to be freed for other patients

---

## Testing

### Razorpay Test Mode

Use Razorpay's test mode credentials (keys starting with `rzp_test_`) for development.

**Test Cards:**

| Card Number | Scenario |
|---|---|
| `4111 1111 1111 1111` | Successful payment |
| `4000 0000 0000 0002` | Card declined |

- **Expiry:** Any future date
- **CVV:** Any 3 digits
- **OTP:** `1234` (test mode)

**Test UPI:**

| UPI ID | Scenario |
|---|---|
| `success@razorpay` | Successful payment |
| `failure@razorpay` | Failed payment |

