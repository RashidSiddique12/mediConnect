const cron = require('node-cron')
const Appointment = require('../models/Appointment')

// Expire unpaid appointments every 5 minutes
// Cancels appointments stuck in pending_payment for > 10 minutes to free time slots
cron.schedule('*/5 * * * *', async () => {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
    const result = await Appointment.updateMany(
      {
        status: 'pending_payment',
        createdAt: { $lt: tenMinutesAgo },
      },
      {
        status: 'cancelled',
        paymentStatus: 'pending',
      },
    )
    if (result.modifiedCount > 0) {
      console.log(
        `[Cron] Expired ${result.modifiedCount} unpaid appointment(s)`,
      )
    }
  } catch (error) {
    console.error('[Cron] Error expiring unpaid appointments:', error)
  }
})
