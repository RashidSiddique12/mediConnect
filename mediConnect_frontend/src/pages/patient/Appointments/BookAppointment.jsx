/**
 * @author Healthcare Appointment App
 * @description Book Appointment — patient selects date, slot, and confirms booking.
 * JIRA: HAA-PAT-006 #comment Book appointment UI
 */

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Stack, Heading, Text, Flex, Button, Card, Badge, Grid, Avatar, Input, Field,
} from '@chakra-ui/react'
import { MdArrowBack, MdCalendarToday, MdAccessTime, MdCheckCircle } from 'react-icons/md'
import { MOCK_DOCTORS, MOCK_HOSPITALS, MOCK_SCHEDULES } from '@/services/mockApi'

const DAY_MAP = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 0 }

function getNextDate(dayName) {
  const today = new Date()
  const targetDay = DAY_MAP[dayName]
  let diff = targetDay - today.getDay()
  if (diff <= 0) diff += 7
  const next = new Date(today)
  next.setDate(today.getDate() + diff)
  return next.toISOString().split('T')[0]
}

export default function BookAppointment() {
  const { doctorId } = useParams()
  const navigate = useNavigate()

  const doctor = MOCK_DOCTORS.find((d) => d.id === doctorId)
  const hospital = doctor ? MOCK_HOSPITALS.find((h) => h.id === doctor.hospitalId) : null
  const schedules = MOCK_SCHEDULES.filter((s) => s.doctorId === doctorId)

  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [notes, setNotes] = useState('')
  const [booked, setBooked] = useState(false)

  if (!doctor) return (
    <Box textAlign="center" py={12} color="gray.400">
      <Text>Doctor not found.</Text>
    </Box>
  )

  const handleBook = () => {
    if (!selectedSchedule || !selectedSlot) return
    setBooked(true)
    setTimeout(() => navigate('/patient/appointments'), 2000)
  }

  if (booked) return (
    <Box textAlign="center" py={16}>
      <Box color="teal.500" fontSize="6xl" mb={4} display="flex" justifyContent="center">
        <MdCheckCircle />
      </Box>
      <Heading size="xl" color="teal.600" mb={2}>Appointment Booked!</Heading>
      <Text color="gray.500">With {doctor.name} on {selectedSchedule?.day} at {selectedSlot}</Text>
      <Button colorPalette="teal" mt={6} onClick={() => navigate('/patient/appointments')}>
        View My Appointments
      </Button>
    </Box>
  )

  return (
    <Stack gap={6} maxW="700px">
      <Flex align="center" gap={3}>
        <Button variant="ghost" colorPalette="teal" onClick={() => navigate(`/patient/doctors/${doctorId}`)}>
          <MdArrowBack /> Back
        </Button>
        <Box>
          <Heading size="lg">Book Appointment</Heading>
          <Text color="gray.500" fontSize="sm">Select a slot to confirm your visit</Text>
        </Box>
      </Flex>

      {/* Doctor summary */}
      <Card.Root shadow="sm" rounded="xl" bg="teal.700" color="white">
        <Card.Body>
          <Flex align="center" gap={4}>
            <Avatar.Root size="lg" bg="white" flexShrink={0}>
              <Avatar.Fallback name={doctor.name} color="teal.700" fontSize="xl" />
            </Avatar.Root>
            <Box>
              <Heading size="md" color="white">{doctor.name}</Heading>
              <Badge bg="teal.500" color="white" mt={1}>{doctor.specialty}</Badge>
              <Text opacity={0.8} fontSize="sm" mt={1}>{hospital?.name}</Text>
            </Box>
            <Box ml="auto" textAlign="right">
              <Text opacity={0.7} fontSize="xs">Consultation Fee</Text>
              <Heading size="lg" color="white">${doctor.fee}</Heading>
            </Box>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* Step 1: Choose day */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body>
          <Flex align="center" gap={2} mb={4}>
            <Box color="teal.500"><MdCalendarToday size={18} /></Box>
            <Heading size="sm">Step 1: Choose Day</Heading>
          </Flex>
          {schedules.length === 0 ? (
            <Box textAlign="center" py={6} color="gray.400" border="2px dashed" borderColor="gray.200" rounded="lg">
              <Text>No schedules available for this doctor.</Text>
            </Box>
          ) : (
            <Grid templateColumns="repeat(auto-fill, minmax(180px, 1fr))" gap={3}>
              {schedules.map((s) => (
                <Box
                  key={s.id}
                  border="2px solid"
                  borderColor={selectedSchedule?.id === s.id ? 'teal.500' : 'gray.200'}
                  bg={selectedSchedule?.id === s.id ? 'teal.50' : 'white'}
                  p={3}
                  rounded="lg"
                  cursor="pointer"
                  transition="all 0.15s"
                  onClick={() => { setSelectedSchedule(s); setSelectedSlot(null) }}
                >
                  <Text fontWeight="700" color={selectedSchedule?.id === s.id ? 'teal.700' : 'gray.800'}>{s.day}</Text>
                  <Text fontSize="xs" color="gray.500">{s.start} – {s.end}</Text>
                  <Text fontSize="xs" color="teal.600" mt={1}>{getNextDate(s.day)}</Text>
                </Box>
              ))}
            </Grid>
          )}
        </Card.Body>
      </Card.Root>

      {/* Step 2: Choose time slot */}
      {selectedSchedule && (
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body>
            <Flex align="center" gap={2} mb={4}>
              <Box color="teal.500"><MdAccessTime size={18} /></Box>
              <Heading size="sm">Step 2: Choose Time Slot</Heading>
            </Flex>
            <Flex gap={2} wrap="wrap">
              {selectedSchedule.slots.map((slot) => (
                <Box
                  key={slot}
                  border="2px solid"
                  borderColor={selectedSlot === slot ? 'teal.500' : 'gray.200'}
                  bg={selectedSlot === slot ? 'teal.500' : 'white'}
                  color={selectedSlot === slot ? 'white' : 'gray.700'}
                  px={3}
                  py={2}
                  rounded="lg"
                  fontSize="sm"
                  fontWeight="600"
                  cursor="pointer"
                  transition="all 0.15s"
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </Box>
              ))}
            </Flex>
          </Card.Body>
        </Card.Root>
      )}

      {/* Step 3: Notes & Confirm */}
      {selectedSlot && (
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body>
            <Heading size="sm" mb={4}>Step 3: Confirm Booking</Heading>

            <Stack gap={4} mb={4}>
              <Flex justify="space-between">
                <Text color="gray.500">Doctor</Text>
                <Text fontWeight="600">{doctor.name}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text color="gray.500">Day & Time</Text>
                <Text fontWeight="600">{selectedSchedule.day} • {selectedSlot}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text color="gray.500">Date</Text>
                <Text fontWeight="600">{getNextDate(selectedSchedule.day)}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text color="gray.500">Fee</Text>
                <Text fontWeight="700" color="teal.600">${doctor.fee}</Text>
              </Flex>
            </Stack>

            <Field.Root mb={4}>
              <Field.Label>Notes (optional)</Field.Label>
              <Input
                placeholder="Describe your concern briefly…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Field.Root>

            <Button w="full" colorPalette="teal" size="lg" onClick={handleBook}>
              Confirm Appointment
            </Button>
          </Card.Body>
        </Card.Root>
      )}
    </Stack>
  )
}
