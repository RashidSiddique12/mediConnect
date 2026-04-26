import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Stack, Heading, Text, Flex, Badge, Button, Card, Avatar, Spinner, Center,
} from '@chakra-ui/react'
import { MdCalendarToday, MdCancel, MdStar, MdArrowForward, MdSearch } from 'react-icons/md'
import * as appointmentSlice from '@/features/appointments/appointmentSlice'
import * as appointmentSelectors from '@/features/appointments/appointmentSelectors'

const STATUS_COLOR = { confirmed: 'green', pending: 'orange', completed: 'teal', cancelled: 'red' }

export default function MyAppointments() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const appointments = useSelector(appointmentSelectors.selectAppointments)
  const loading = useSelector(appointmentSelectors.selectAppointmentsLoading)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    dispatch(appointmentSlice.fetchAppointmentsRequest())
  }, [dispatch])

  if (loading) return <Center py={12}><Spinner size="xl" color="teal.500" /></Center>

  const filtered = appointments.filter((a) => {
    if (filter === 'upcoming') return a.status === 'confirmed' || a.status === 'pending'
    if (filter === 'completed') return a.status === 'completed'
    if (filter === 'cancelled') return a.status === 'cancelled'
    return true
  })

  const handleCancel = (id) => {
    dispatch(appointmentSlice.cancelAppointmentRequest(id))
  }

  const counts = {
    all: appointments.length,
    upcoming: appointments.filter((a) => ['confirmed', 'pending'].includes(a.status)).length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  }

  return (
    <Stack gap={6}>
      <Box>
        <Heading size="lg">My Appointments</Heading>
        <Text color="gray.500" fontSize="sm">Track all your medical visits</Text>
      </Box>

      {/* Summary */}
      <Flex gap={3} wrap="wrap">
        {[
          { label: 'Total', value: counts.all, color: 'gray' },
          { label: 'Upcoming', value: counts.upcoming, color: 'orange' },
          { label: 'Completed', value: counts.completed, color: 'teal' },
          { label: 'Cancelled', value: counts.cancelled, color: 'red' },
        ].map(({ label, value, color }) => (
          <Box key={label} bg={`${color}.50`} border="1px solid" borderColor={`${color}.200`} px={4} py={2} rounded="lg"
            cursor="pointer" onClick={() => setFilter(label === 'Total' ? '' : label.toLowerCase())}
            borderBottomWidth="3px" borderBottomColor={filter === label.toLowerCase() || (label === 'Total' && !filter) ? `${color}.400` : `${color}.200`}>
            <Text fontSize="xs" color={`${color}.600`} fontWeight="500">{label}</Text>
            <Text fontSize="xl" fontWeight="700" color={`${color}.600`}>{value}</Text>
          </Box>
        ))}
      </Flex>

      <Stack gap={4}>
        {filtered.map((a) => (
          <Card.Root key={a._id} shadow="sm" rounded="xl" borderLeft="4px solid"
            borderColor={`${STATUS_COLOR[a.status] || 'gray'}.400`}>
            <Card.Body>
              <Flex justify="space-between" align="flex-start" wrap="wrap" gap={3}>
                <Flex align="center" gap={4}>
                  <Avatar.Root size="md" bg="teal.500" flexShrink={0}>
                    <Avatar.Fallback name={a.doctorId?.name || 'Doctor'} />
                  </Avatar.Root>
                  <Box>
                    <Text fontWeight="700">{a.doctorId?.name || 'Doctor'}</Text>
                    <Badge colorPalette="teal" size="sm" variant="outline" mt={0.5}>{a.doctorId?.specialtyId?.name || 'General'}</Badge>
                    <Flex align="center" gap={2} mt={1}>
                      <MdCalendarToday size={13} color="#718096" />
                      <Text fontSize="xs" color="gray.500">{new Date(a.appointmentDate || a.date).toLocaleDateString()} at {a.timeSlot || a.time}</Text>
                    </Flex>
                  </Box>
                </Flex>
                <Flex align="center" gap={3}>
                  <Text fontWeight="700" color="teal.600">${a.fee || 0}</Text>
                  <Badge colorPalette={STATUS_COLOR[a.status] || 'gray'} size="md">{a.status}</Badge>
                </Flex>
              </Flex>

              <Flex gap={2} mt={4} justify="flex-end" wrap="wrap">
                {a.status === 'completed' && (
                  <Button size="sm" colorPalette="orange" variant="outline"
                    onClick={() => navigate(`/patient/review/${a._id}`)}>
                    <MdStar /> Rate Doctor
                  </Button>
                )}
                {(a.status === 'confirmed' || a.status === 'pending') && (
                  <Button size="sm" variant="outline" colorPalette="red"
                    onClick={() => handleCancel(a._id)}>
                    <MdCancel /> Cancel
                  </Button>
                )}
                {a.status === 'pending' && (
                  <Button size="sm" colorPalette="teal"
                    onClick={() => navigate(`/patient/book/${a.doctorId?._id}`)}>
                    Reschedule <MdArrowForward />
                  </Button>
                )}
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Stack>

      {filtered.length === 0 && (
        <Box textAlign="center" py={12} color="gray.400">
          <MdCalendarToday size={48} style={{ margin: '0 auto 8px' }} />
          <Text>No appointments in this category</Text>
          <Button mt={4} colorPalette="teal" onClick={() => navigate('/patient/doctors')}>
            <MdSearch /> Find a Doctor
          </Button>
        </Box>
      )}
    </Stack>
  )
}
