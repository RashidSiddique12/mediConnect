export const selectAppointments = (state) => state.appointments.list
export const selectAppointmentsLoading = (state) => state.appointments.loading
export const selectAppointmentsError = (state) => state.appointments.error
export const selectCurrentAppointment = (state) => state.appointments.current
export const selectBookingLoading = (state) => state.appointments.bookingLoading
export const selectBooked = (state) => state.appointments.booked
