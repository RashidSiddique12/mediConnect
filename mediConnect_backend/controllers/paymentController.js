const crypto = require('crypto')
const razorpay = require('../config/razorpay')
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('../config/env')
const Payment = require('../models/Payment')
const Appointment = require('../models/Appointment')
const Doctor = require('../models/Doctor')
const { success, created } = require('../utils/apiResponse')
const { DEFAULT_CURRENCY } = require('../utils/constants')

// POST /api/v1/payments/create-order
// Creates a Razorpay order + appointment in pending_payment status
const createOrder = async (req, res, next) => {
  try {
    const { doctorId, hospitalId, appointmentDate, timeSlot, reason } = req.body

    // 1. Get doctor's consultation fee
    const doctor = await Doctor.findById(doctorId)
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: 'Doctor not found.' })
    }

    const amount = doctor.consultationFee
    const currency = doctor.currency || DEFAULT_CURRENCY
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Doctor has no consultation fee configured.',
      })
    }

    // 2. Check if slot is already taken
    const existingSlot = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      status: { $in: ['pending_payment', 'booked', 'completed'] },
    })

    if (existingSlot) {
      return res
        .status(409)
        .json({ success: false, message: 'This time slot is already booked.' })
    }

    // 3. Prevent same patient double-booking same doctor same day
    const patientDuplicate = await Appointment.findOne({
      patientId: req.user._id,
      doctorId,
      appointmentDate: new Date(appointmentDate),
      status: { $in: ['pending_payment', 'booked', 'completed'] },
    })

    if (patientDuplicate) {
      return res.status(409).json({
        success: false,
        message:
          'You already have an appointment with this doctor on the selected date.',
      })
    }

    // 4. Create Razorpay order (amount in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt: `appt_${Date.now()}`,
      notes: {
        patientId: req.user._id.toString(),
        doctorId,
        hospitalId,
      },
    })

    // 5. Create appointment with pending_payment status
    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      hospitalId,
      appointmentDate,
      timeSlot,
      reason,
      status: 'pending_payment',
      paymentStatus: 'pending',
    })

    // 6. Create payment record
    const payment = await Payment.create({
      appointmentId: appointment._id,
      patientId: req.user._id,
      amount,
      currency,
      razorpayOrderId: razorpayOrder.id,
      status: 'pending',
    })

    // 7. Link payment to appointment
    appointment.paymentId = payment._id
    await appointment.save()

    // 8. Return order details to frontend
    created(
      res,
      {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        appointmentId: appointment._id,
        keyId: RAZORPAY_KEY_ID,
        doctor: {
          name: doctor.name,
          fee: amount,
        },
      },
      'Payment order created successfully',
    )
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: 'This time slot is already booked.' })
    }
    next(error)
  }
}

// POST /api/v1/payments/verify
// Verifies Razorpay payment signature and confirms appointment
const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      appointmentId,
    } = req.body

    // 1. Verify signature using HMAC SHA256
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex')

    if (expectedSignature !== razorpaySignature) {
      // Mark payment as failed
      await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { status: 'failed' },
      )
      await Appointment.findByIdAndUpdate(appointmentId, {
        status: 'cancelled',
        paymentStatus: 'pending',
      })

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.',
      })
    }

    // 2. Update payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: 'paid',
      },
      { new: true },
    )

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: 'Payment record not found.' })
    }

    // 3. Confirm appointment
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: 'booked',
        paymentStatus: 'paid',
      },
      { new: true },
    )
      .populate('patientId', 'name email phone')
      .populate('hospitalId', 'name')
      .populate('doctorId', 'name')

    success(
      res,
      {
        appointment,
        payment: {
          id: payment._id,
          amount: payment.amount,
          status: payment.status,
          razorpayPaymentId: payment.razorpayPaymentId,
        },
      },
      'Payment verified and appointment booked successfully',
    )
  } catch (error) {
    next(error)
  }
}

// POST /api/v1/payments/refund
// Initiates refund for a paid appointment
const refundPayment = async (req, res, next) => {
  try {
    const { appointmentId } = req.body

    const payment = await Payment.findOne({ appointmentId, status: 'paid' })
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'No paid payment found for this appointment.',
      })
    }

    // Call Razorpay refund API (full refund, amount in paise)
    const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: payment.amount * 100,
      notes: { reason: 'Appointment cancelled' },
    })

    // Update payment record
    payment.status = 'refunded'
    payment.refundId = refund.id
    payment.refundedAt = new Date()
    await payment.save()

    // Update appointment payment status
    await Appointment.findByIdAndUpdate(appointmentId, {
      paymentStatus: 'refunded',
    })

    success(
      res,
      {
        refundId: refund.id,
        amount: payment.amount,
        status: 'refunded',
      },
      'Refund initiated successfully',
    )
  } catch (error) {
    next(error)
  }
}

// GET /api/v1/payments/:appointmentId
// Get payment details for an appointment
const getPaymentByAppointment = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({
      appointmentId: req.params.appointmentId,
    })

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: 'Payment not found.' })
    }

    success(res, payment)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createOrder,
  verifyPayment,
  refundPayment,
  getPaymentByAppointment,
}
