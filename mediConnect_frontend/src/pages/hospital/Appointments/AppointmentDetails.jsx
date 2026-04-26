import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Stack, Heading, Text, Flex, Button, Card, Badge, Grid,
} from '@chakra-ui/react'
import { MdPerson, MdLocalHospital, MdUpload, MdDescription } from 'react-icons/md'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import Loader from '@/components/common/Loader'
import * as appointmentSlice from '@/features/appointments/appointmentSlice'
import { selectCurrentAppointment, selectAppointmentsLoading } from '@/features/appointments/appointmentSelectors'
import * as prescriptionSlice from '@/features/prescriptions/prescriptionSlice'
import { selectCurrentPrescription } from '@/features/prescriptions/prescriptionSelectors'

const STATUS_COLOR = { booked: 'green', completed: 'teal', cancelled: 'red' }

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function AppointmentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const appointment = useSelector(selectCurrentAppointment)
  const loading = useSelector(selectAppointmentsLoading)
  const prescription = useSelector(selectCurrentPrescription)

  useEffect(() => {
    dispatch(appointmentSlice.fetchAppointmentByIdRequest(id))
    dispatch(prescriptionSlice.fetchPrescriptionByAppointmentRequest(id))
  }, [dispatch, id])

  const handleUpdateStatus = (status) =>
    dispatch(appointmentSlice.updateAppointmentRequest({ id, status }))

  const handleCancel = () =>
    dispatch(appointmentSlice.cancelAppointmentRequest(id))

  if (loading) return <Loader />

  if (!appointment) {
    return (
      <EmptyState
        title="Appointment not found"
        description="The appointment you're looking for doesn't exist or has been removed"
        actionLabel="Back to Appointments"
        onAction={() => navigate('/hospital/appointments')}
      />
    )
  }

  const { status } = appointment

  return (
    <Stack gap={6} maxW="800px">
      <PageHeader
        title="Appointment Details"
        subtitle={`#${appointment._id}`}
        backTo="/hospital/appointments"
      />

      {/* ─── Status Banner ─── */}
      <Card.Root
        shadow="sm"
        rounded="xl"
        borderLeft="4px solid"
        borderColor={`${STATUS_COLOR[status] || 'gray'}.400`}
      >
        <Card.Body>
          <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
            <Flex align="center" gap={3}>
              <Badge colorPalette={STATUS_COLOR[status] || 'gray'} size="lg" px={3} py={1}>
                {status?.toUpperCase()}
              </Badge>
              <Text fontSize="sm" color="gray.500">
                {formatDate(appointment.appointmentDate)} at {appointment.timeSlot}
              </Text>
            </Flex>
            {status === 'booked' && (
              <Flex gap={2}>
                <Button size="sm" colorPalette="teal" onClick={() => handleUpdateStatus('completed')}>
                  Mark Complete
                </Button>
                <Button size="sm" variant="outline" colorPalette="red" onClick={handleCancel}>
                  Cancel
                </Button>
              </Flex>
            )}
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* ─── Patient & Doctor Info ─── */}
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
        <InfoCard
          icon={MdPerson}
          iconBg="blue.100"
          iconColor="blue.600"
          title="Patient"
          rows={[
            { label: 'Name', value: appointment.patientId?.name },
            { label: 'Email', value: appointment.patientId?.email },
            { label: 'Phone', value: appointment.patientId?.phone },
          ]}
        />
        <InfoCard
          icon={MdLocalHospital}
          iconBg="teal.100"
          iconColor="teal.600"
          title="Doctor & Hospital"
          rows={[
            { label: 'Doctor', value: appointment.doctorId?.name },
            { label: 'Hospital', value: appointment.hospitalId?.name },
            { label: 'Reason', value: appointment.reason },
          ]}
        />
      </Grid>

      {/* ─── Prescription ─── */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body>
          <Flex justify="space-between" align="center" mb={4}>
            <Flex align="center" gap={2}>
              <Box bg="purple.100" p={2} rounded="lg" color="purple.600">
                <MdDescription size={20} />
              </Box>
              <Heading size="sm">Prescription</Heading>
            </Flex>
            {status === 'completed' && (
              <Button size="sm" colorPalette="teal" onClick={() => navigate(`/hospital/prescriptions/upload/${id}`)}>
                <MdUpload /> Upload Prescription
              </Button>
            )}
          </Flex>

          {prescription ? (
            <Box bg="teal.50" p={4} rounded="lg">
              <Flex align="center" gap={2} mb={1}>
                <Box
                  w={5} h={5} bg="teal.500" color="white" rounded="full"
                  display="flex" alignItems="center" justifyContent="center"
                  fontSize="xs" fontWeight="700" flexShrink={0}
                >
                  ✓
                </Box>
                <Text fontWeight="700" color="teal.700">Prescription uploaded</Text>
              </Flex>
              {prescription.notes && (
                <Text fontSize="sm" color="gray.600" mt={2}>{prescription.notes}</Text>
              )}
              {prescription.fileUrl && (
                <Text fontSize="sm" color="teal.600" mt={1}>File: {prescription.fileUrl}</Text>
              )}
            </Box>
          ) : (
            <Box
              textAlign="center"
              py={6}
              color="gray.400"
              border="2px dashed"
              borderColor="gray.200"
              rounded="lg"
            >
              <MdDescription size={28} style={{ margin: '0 auto 8px' }} />
              <Text fontSize="sm">No prescription uploaded yet</Text>
              {status === 'completed' && (
                <Text fontSize="xs" mt={1} color="gray.500">
                  Click &ldquo;Upload Prescription&rdquo; to add one
                </Text>
              )}
            </Box>
          )}
        </Card.Body>
      </Card.Root>
    </Stack>
  )
}

function InfoCard({ icon: Icon, iconBg, iconColor, title, rows }) {
  return (
    <Card.Root shadow="sm" rounded="xl">
      <Card.Body>
        <Flex align="center" gap={2} mb={4}>
          <Box bg={iconBg} p={2} rounded="lg" color={iconColor}>
            <Icon size={20} />
          </Box>
          <Heading size="sm">{title}</Heading>
        </Flex>
        <Stack gap={3}>
          {rows.map(({ label, value }) => (
            <Flex key={label} justify="space-between" align="center">
              <Text fontSize="sm" color="gray.500">{label}</Text>
              <Text fontSize="sm" fontWeight="600">{value || 'N/A'}</Text>
            </Flex>
          ))}
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}
