/**
 * @author Healthcare Appointment App
 * @description Appointment Details — hospital admin views patient details and uploads prescription.
 * JIRA: HAA-HOSP-009 #comment Appointment detail UI
 */

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Stack, Heading, Text, Flex, Button, Card, Badge, Grid, Separator,
} from '@chakra-ui/react'
import { MdArrowBack, MdPerson, MdLocalHospital, MdUpload } from 'react-icons/md'
import { MOCK_APPOINTMENTS, MOCK_PRESCRIPTIONS } from '@/services/mockApi'

const STATUS_COLOR = { confirmed: 'green', pending: 'orange', completed: 'teal', cancelled: 'red' }

export default function AppointmentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const appointment = MOCK_APPOINTMENTS.find((a) => a.id === id)
  const prescription = MOCK_PRESCRIPTIONS.find((p) => p.appointmentId === id)
  const [status, setStatus] = useState(appointment?.status)

  if (!appointment) return (
    <Box textAlign="center" py={12} color="gray.400">
      <Text>Appointment not found.</Text>
    </Box>
  )

  return (
    <Stack gap={6} maxW="800px">
      <Flex align="center" gap={3}>
        <Button variant="ghost" colorPalette="teal" onClick={() => navigate('/hospital/appointments')}>
          <MdArrowBack /> Back
        </Button>
        <Box>
          <Heading size="lg">Appointment Details</Heading>
          <Text color="gray.500" fontSize="sm">#{appointment.id}</Text>
        </Box>
      </Flex>

      {/* Status Banner */}
      <Card.Root shadow="sm" rounded="xl" borderLeft="4px solid" borderColor={`${STATUS_COLOR[status]}.400`}>
        <Card.Body>
          <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
            <Flex align="center" gap={3}>
              <Badge colorPalette={STATUS_COLOR[status] || 'gray'} size="lg" px={3} py={1}>
                {status?.toUpperCase()}
              </Badge>
              <Text fontSize="sm" color="gray.500">{appointment.date} at {appointment.time}</Text>
            </Flex>
            <Flex gap={2}>
              {status === 'pending' && (
                <Button size="sm" colorPalette="green" onClick={() => setStatus('confirmed')}>Confirm</Button>
              )}
              {status === 'confirmed' && (
                <Button size="sm" colorPalette="teal" onClick={() => setStatus('completed')}>Mark Complete</Button>
              )}
              {(status === 'pending' || status === 'confirmed') && (
                <Button size="sm" variant="outline" colorPalette="red" onClick={() => setStatus('cancelled')}>Cancel</Button>
              )}
            </Flex>
          </Flex>
        </Card.Body>
      </Card.Root>

      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
        {/* Patient */}
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body>
            <Flex align="center" gap={2} mb={4}>
              <Box bg="blue.100" p={2} rounded="lg" color="blue.600"><MdPerson size={20} /></Box>
              <Heading size="sm">Patient</Heading>
            </Flex>
            <Stack gap={3}>
              <InfoRow label="Name" value={appointment.patientName} />
              <InfoRow label="Appointment ID" value={appointment.id} />
              <InfoRow label="Fee" value={`$${appointment.fee}`} />
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Doctor */}
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body>
            <Flex align="center" gap={2} mb={4}>
              <Box bg="teal.100" p={2} rounded="lg" color="teal.600"><MdLocalHospital size={20} /></Box>
              <Heading size="sm">Doctor & Specialty</Heading>
            </Flex>
            <Stack gap={3}>
              <InfoRow label="Doctor" value={appointment.doctorName} />
              <InfoRow label="Specialty" value={appointment.specialty} />
              <InfoRow label="Hospital" value="City General Hospital" />
            </Stack>
          </Card.Body>
        </Card.Root>
      </Grid>

      {/* Prescription section */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="sm">Prescription</Heading>
            {status === 'completed' && (
              <Button size="sm" colorPalette="teal" onClick={() => navigate(`/hospital/prescriptions/upload/${id}`)}>
                <MdUpload /> Upload Prescription
              </Button>
            )}
          </Flex>

          {prescription ? (
            <Stack gap={3}>
              <Box bg="teal.50" p={4} rounded="lg">
                <Text fontWeight="700" color="teal.700" mb={1}>{prescription.diagnosis}</Text>
                <Text fontSize="sm" color="gray.600">{prescription.notes}</Text>
              </Box>
              {prescription.medicines.map((m, i) => (
                <Flex key={i} justify="space-between" align="center" bg="gray.50" p={3} rounded="md">
                  <Text fontWeight="600" fontSize="sm">{m.name}</Text>
                  <Text fontSize="xs" color="gray.500">{m.dosage} • {m.duration}</Text>
                </Flex>
              ))}
            </Stack>
          ) : (
            <Box textAlign="center" py={6} color="gray.400" border="2px dashed" borderColor="gray.200" rounded="lg">
              <Text fontSize="sm">No prescription uploaded yet</Text>
              {status === 'completed' && (
                <Text fontSize="xs" mt={1}>Click "Upload Prescription" to add one</Text>
              )}
            </Box>
          )}
        </Card.Body>
      </Card.Root>
    </Stack>
  )
}

function InfoRow({ label, value }) {
  return (
    <Flex justify="space-between" align="center">
      <Text fontSize="sm" color="gray.500">{label}</Text>
      <Text fontSize="sm" fontWeight="600">{value}</Text>
    </Flex>
  )
}
