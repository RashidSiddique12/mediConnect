import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { formatCurrency } from '@/utils/currency'
import {
  Box,
  Stack,
  Heading,
  Text,
  Flex,
  Button,
  Card,
  Badge,
  Grid,
  Avatar,
  Separator,
  Image,
  Dialog,
  IconButton,
} from '@chakra-ui/react'
import {
  MdLocalHospital,
  MdDescription,
  MdCalendarToday,
  MdAccessTime,
  MdCheckCircle,
  MdCancel,
  MdEmail,
  MdPhone,
  MdMedicalServices,
  MdNotes,
  MdArrowForward,
  MdZoomIn,
  MdZoomOut,
  MdClose,
  MdStar,
  MdLocationOn,
  MdSchool,
  MdWork,
  MdTranslate,
  MdVideocam,
  MdMale,
  MdHistory,
  MdInsertDriveFile,
  MdOpenInNew,
} from 'react-icons/md'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import Loader from '@/components/common/Loader'
import * as appointmentSlice from '@/features/appointments/appointmentSlice'
import {
  selectCurrentAppointment,
  selectAppointmentsLoading,
} from '@/features/appointments/appointmentSelectors'
import * as prescriptionSlice from '@/features/prescriptions/prescriptionSlice'
import { selectCurrentPrescription } from '@/features/prescriptions/prescriptionSelectors'

const STATUS_COLOR = { booked: 'green', completed: 'teal', cancelled: 'red' }
const STATUS_ICON = {
  booked: MdAccessTime,
  completed: MdCheckCircle,
  cancelled: MdCancel,
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function AppointmentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const appointment = useSelector(selectCurrentAppointment)
  const loading = useSelector(selectAppointmentsLoading)
  const prescription = useSelector(selectCurrentPrescription)
  const [imageOpen, setImageOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [cancelling, setCancelling] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    dispatch(appointmentSlice.fetchAppointmentByIdRequest(id))
    dispatch(prescriptionSlice.fetchPrescriptionByAppointmentRequest(id))
  }, [dispatch, id])

  const handleCancel = () => {
    setCancelling(true)
    dispatch(appointmentSlice.cancelAppointmentRequest(id))
    setTimeout(() => setCancelling(false), 2000)
  }

  if (loading) return <Loader />

  if (!appointment) {
    return (
      <EmptyState
        title="Appointment not found"
        description="The appointment you're looking for doesn't exist or has been removed"
        actionLabel="Back to Appointments"
        onAction={() => navigate('/patient/appointments')}
      />
    )
  }

  const { status } = appointment
  const StatusIcon = STATUS_ICON[status] || MdAccessTime
  const statusColor = STATUS_COLOR[status] || 'gray'

  return (
    <Stack gap={6} w="100%">
      <PageHeader
        title="Appointment Details"
        onBack={() => navigate(-1)}
        backLabel="Back"
      />

      {/* ─── Status Banner ─── */}
      <Card.Root
        shadow="sm"
        rounded="xl"
        overflow="hidden"
        borderTop="4px solid"
        borderColor={`${statusColor}.400`}
      >
        <Card.Body py={5} px={6}>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Flex align="center" gap={4}>
              <Box
                bg={`${statusColor}.100`}
                p={3}
                rounded="xl"
                color={`${statusColor}.600`}
              >
                <StatusIcon size={28} />
              </Box>
              <Box>
                <Badge
                  colorPalette={statusColor}
                  size="lg"
                  px={3}
                  py={1}
                  rounded="full"
                  variant="subtle"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  {status}
                </Badge>
                {appointment.paymentStatus && appointment.paymentStatus !== 'not_required' && (
                  <Badge
                    colorPalette={
                      appointment.paymentStatus === 'paid'
                        ? 'green'
                        : appointment.paymentStatus === 'refunded'
                          ? 'orange'
                          : 'yellow'
                    }
                    size="md"
                    px={2}
                    py={0.5}
                    rounded="full"
                    variant="subtle"
                    mt={1}
                  >
                    {appointment.paymentStatus === 'paid'
                      ? '✅ Paid'
                      : appointment.paymentStatus === 'refunded'
                        ? 'Refunded'
                        : 'Payment Pending'}
                  </Badge>
                )}
                <Flex align="center" gap={3} mt={2} color="gray.500">
                  <Flex align="center" gap={1}>
                    <MdCalendarToday size={14} />
                    <Text fontSize="sm">
                      {formatDate(appointment.appointmentDate)}
                    </Text>
                  </Flex>
                  <Flex align="center" gap={1}>
                    <MdAccessTime size={14} />
                    <Text fontSize="sm">{appointment.timeSlot}</Text>
                  </Flex>
                </Flex>
              </Box>
            </Flex>

            {/* Patient actions */}
            <Flex gap={2} wrap="wrap">
              {status === 'completed' && (
                <Button
                  size="sm"
                  colorPalette="orange"
                  variant="outline"
                  onClick={() =>
                    navigate(`/patient/review/${appointment._id}`)
                  }
                >
                  <MdStar /> Rate Doctor
                </Button>
              )}
              {status === 'booked' && (
                <>
                  <Button
                    size="sm"
                    colorPalette="teal"
                    onClick={() =>
                      navigate(
                        `/patient/book/${appointment.doctorId?._id}`,
                      )
                    }
                  >
                    Reschedule <MdArrowForward />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    onClick={handleCancel}
                    disabled={cancelling}
                  >
                    <MdCancel />{' '}
                    {cancelling ? 'Cancelling…' : 'Cancel'}
                  </Button>
                </>
              )}
            </Flex>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* ─── Doctor & Hospital Info ─── */}
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
        {/* Doctor Card */}
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body>
            <Flex align="center" gap={2} mb={4}>
              <Box bg="teal.100" p={2} rounded="lg" color="teal.600">
                <MdMedicalServices size={20} />
              </Box>
              <Heading size="sm">Doctor</Heading>
            </Flex>
            <Flex align="center" gap={3} mb={4}>
              <Avatar.Root size="lg" bg="teal.500" flexShrink={0}>
                <Avatar.Fallback
                  name={appointment.doctorId?.name || 'Doctor'}
                />
              </Avatar.Root>
              <Box>
                <Text fontWeight="700" fontSize="md">
                  {appointment.doctorId?.name || 'N/A'}
                </Text>
                <Flex gap={1} mt={0.5} wrap="wrap">
                  {(appointment.doctorId?.specialtyIds?.length
                    ? appointment.doctorId.specialtyIds
                    : [{ name: appointment.doctorId?.specialtyId?.name || 'General' }]
                  ).map((s, i) => (
                    <Badge
                      key={i}
                      colorPalette="teal"
                      size="sm"
                      variant="outline"
                    >
                      {s.name || s}
                    </Badge>
                  ))}
                </Flex>
              </Box>
            </Flex>
            <Separator mb={3} />
            <Stack gap={3}>
              {appointment.doctorId?.qualification && (
                <InfoRow
                  icon={MdSchool}
                  label="Qualification"
                  value={appointment.doctorId.qualification}
                />
              )}
              {appointment.doctorId?.experience > 0 && (
                <InfoRow
                  icon={MdWork}
                  label="Experience"
                  value={`${appointment.doctorId.experience} years`}
                />
              )}
              {/* {appointment.doctorId?.gender && (
                <InfoRow
                  icon={MdMale}
                  label="Gender"
                  value={appointment.doctorId.gender.charAt(0).toUpperCase() + appointment.doctorId.gender.slice(1)}
                />
              )} */}
              {appointment.doctorId?.consultationFee > 0 && (
                <InfoRow
                  icon={MdDescription}
                  label="Fee"
                  value={formatCurrency(appointment.doctorId.consultationFee, appointment.doctorId.currency)}
                />
              )}
              {appointment.doctorId?.email && (
                <InfoRow
                  icon={MdEmail}
                  label="Email"
                  value={appointment.doctorId.email}
                />
              )}
              {appointment.doctorId?.phone && (
                <InfoRow
                  icon={MdPhone}
                  label="Phone"
                  value={appointment.doctorId.phone}
                />
              )}
              {/* {appointment.doctorId?.languages?.length > 0 && (
                <InfoRow
                  icon={MdTranslate}
                  label="Languages"
                  value={appointment.doctorId.languages.join(', ')}
                />
              )} */}
              {/* {appointment.doctorId?.consultationTypes?.length > 0 && (
                <InfoRow
                  icon={MdVideocam}
                  label="Consult"
                  value={appointment.doctorId.consultationTypes
                    .map((t) => t.replace('_', ' '))
                    .join(', ')}
                />
              )} */}
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Hospital Card */}
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body>
            <Flex align="center" gap={2} mb={4}>
              <Box bg="blue.100" p={2} rounded="lg" color="blue.600">
                <MdLocalHospital size={20} />
              </Box>
              <Heading size="sm">Hospital</Heading>
            </Flex>
            <Text fontWeight="700" fontSize="md" mb={3}>
              {appointment.hospitalId?.name || 'N/A'}
            </Text>
            <Separator mb={3} />
            <Stack gap={3}>
              <InfoRow
                icon={MdLocationOn}
                label="Address"
                value={
                  appointment.hospitalId?.address
                    ? [
                        appointment.hospitalId.address.street,
                        appointment.hospitalId.address.city,
                        appointment.hospitalId.address.state,
                        appointment.hospitalId.address.zipCode,
                      ]
                        .filter(Boolean)
                        .join(', ')
                    : undefined
                }
              />
              <InfoRow
                icon={MdPhone}
                label="Phone"
                value={appointment.hospitalId?.phone}
              />
              <InfoRow
                icon={MdEmail}
                label="Email"
                value={appointment.hospitalId?.email}
              />
            </Stack>
          </Card.Body>
        </Card.Root>
      </Grid>

      {/* ─── Reason / Notes ─── */}
      {(appointment.reason || appointment.notes) && (
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body>
            <Flex align="center" gap={2} mb={3}>
              <Box bg="orange.100" p={2} rounded="lg" color="orange.600">
                <MdNotes size={20} />
              </Box>
              <Heading size="sm">Visit Details</Heading>
            </Flex>
            {appointment.reason && (
              <Box bg="orange.50" p={4} rounded="lg">
                <Text
                  fontSize="xs"
                  color="gray.500"
                  fontWeight="600"
                  mb={1}
                >
                  Reason for Visit
                </Text>
                <Text fontSize="sm" color="gray.700" lineHeight="tall">
                  {appointment.reason}
                </Text>
              </Box>
            )}
            {appointment.notes && (
              <Box bg="gray.50" p={4} rounded="lg" mt={appointment.reason ? 3 : 0}>
                <Text
                  fontSize="xs"
                  color="gray.500"
                  fontWeight="600"
                  mb={1}
                >
                  Notes
                </Text>
                <Text fontSize="sm" color="gray.700" lineHeight="tall">
                  {appointment.notes}
                </Text>
              </Box>
            )}
          </Card.Body>
        </Card.Root>
      )}

      {/* ─── Prescription ─── */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body>
          <Flex align="center" gap={2} mb={4}>
            <Box bg="purple.100" p={2} rounded="lg" color="purple.600">
              <MdDescription size={20} />
            </Box>
            <Heading size="sm">Prescription</Heading>
          </Flex>

          {prescription ? (
            <Box
              bg="teal.50"
              p={5}
              rounded="lg"
              borderLeft="4px solid"
              borderColor="teal.400"
            >
              <Flex align="center" gap={2} mb={2}>
                <Box
                  w={6}
                  h={6}
                  bg="teal.500"
                  color="white"
                  rounded="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xs"
                  fontWeight="700"
                  flexShrink={0}
                >
                  <MdCheckCircle size={16} />
                </Box>
                <Text fontWeight="700" color="teal.700">
                  Prescription available
                </Text>
              </Flex>
              {prescription.notes && (
                <Box bg="white" p={3} rounded="md" mt={3}>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    fontWeight="600"
                    mb={1}
                  >
                    Doctor&apos;s Notes
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    {prescription.notes}
                  </Text>
                </Box>
              )}
              {prescription.fileUrl && (
                <Box mt={3}>
                  {/\.(jpe?g|png)$/i.test(prescription.fileUrl) ? (
                    <>
                      <Image
                        src={prescription.fileUrl}
                        alt="Prescription"
                        maxH="400px"
                        mx="auto"
                        rounded="md"
                        objectFit="contain"
                        border="1px solid"
                        borderColor="gray.200"
                        cursor="pointer"
                        filter="brightness(1)"
                        _hover={{ filter: 'brightness(0.75)' }}
                        transition="filter 0.2s"
                        onClick={() => {
                          setZoom(1)
                          setImageOpen(true)
                        }}
                      />
                      <Text
                        fontSize="xs"
                        color="gray.400"
                        textAlign="center"
                        mt={1}
                      >
                        Click image to enlarge
                      </Text>
                    </>
                  ) : (
                    <Box
                      as="iframe"
                      src={prescription.fileUrl}
                      w="100%"
                      h="500px"
                      rounded="md"
                      border="1px solid"
                      borderColor="gray.200"
                    />
                  )}
                  <Flex justify="flex-end" mt={2} gap={2}>
                    <Button
                      size="xs"
                      variant="outline"
                      colorPalette="teal"
                      asChild
                    >
                      <a
                        href={prescription.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MdArrowForward /> Open in New Tab
                      </a>
                    </Button>
                  </Flex>
                </Box>
              )}
            </Box>
          ) : (
            <Box
              textAlign="center"
              py={8}
              color="gray.400"
              border="2px dashed"
              borderColor="gray.200"
              rounded="lg"
              bg="gray.50"
            >
              <MdDescription
                size={32}
                style={{ margin: '0 auto 8px' }}
              />
              <Text fontSize="sm" fontWeight="500">
                No prescription uploaded yet
              </Text>
              {status === 'booked' && (
                <Text fontSize="xs" mt={1} color="gray.500">
                  Your doctor will upload it after the visit
                </Text>
              )}
            </Box>
          )}
        </Card.Body>
      </Card.Root>

      {/* ─── Prescription Version History ─── */}
      {prescription?.history?.length > 0 && (
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body>
            <Flex
              align="center"
              justify="space-between"
              cursor="pointer"
              onClick={() => setShowHistory(!showHistory)}
            >
              <Flex align="center" gap={2}>
                <MdHistory size={18} color="var(--chakra-colors-gray-500)" />
                <Text fontWeight="600" fontSize="sm" color="gray.700">
                  Version History ({prescription.history.length})
                </Text>
              </Flex>
              <Text fontSize="xs" color="teal.600" fontWeight="500">
                {showHistory ? 'Hide' : 'Show'}
              </Text>
            </Flex>

            {showHistory && (
              <Stack gap={3} mt={4}>
                {[...prescription.history].reverse().map((entry, idx) => (
                  <Flex
                    key={idx}
                    align="center"
                    gap={3}
                    bg="gray.50"
                    rounded="lg"
                    p={3}
                  >
                    {/\.(jpe?g|png)(\?.*)?$/i.test(entry.fileUrl) ? (
                      <Image
                        src={entry.fileUrl}
                        alt={`Version ${prescription.history.length - idx}`}
                        boxSize="45px"
                        objectFit="cover"
                        rounded="md"
                      />
                    ) : (
                      <Box color="gray.400">
                        <MdInsertDriveFile size={28} />
                      </Box>
                    )}
                    <Box flex={1}>
                      <Flex align="center" gap={2}>
                        <Text fontSize="sm" fontWeight="600" color="gray.600">
                          Version {prescription.history.length - idx}
                        </Text>
                        <Badge size="sm" colorPalette="gray">
                          Replaced
                        </Badge>
                      </Flex>
                      <Text fontSize="xs" color="gray.400">
                        {formatDate(entry.changedAt)}
                      </Text>
                      {entry.updatedBy?.name && (
                        <Text fontSize="xs" color="gray.500" mt={0.5}>
                          Updated by: {entry.updatedBy.name}
                        </Text>
                      )}
                      {entry.notes && (
                        <Text fontSize="xs" color="gray.500" mt={0.5}>
                          {entry.notes}
                        </Text>
                      )}
                    </Box>
                    <Button
                      size="xs"
                      variant="ghost"
                      colorPalette="teal"
                      asChild
                    >
                      <a
                        href={entry.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MdOpenInNew />
                      </a>
                    </Button>
                  </Flex>
                ))}
              </Stack>
            )}
          </Card.Body>
        </Card.Root>
      )}

      {/* ─── Image Lightbox Modal ─── */}
      {prescription?.fileUrl &&
        /\.(jpe?g|png)$/i.test(prescription.fileUrl) && (
          <Dialog.Root
            open={imageOpen}
            onOpenChange={(e) => {
              if (!e.open) setImageOpen(false)
            }}
            size="cover"
          >
            <Dialog.Backdrop bg="blackAlpha.800" />
            <Dialog.Positioner>
              <Dialog.Content
                bg="transparent"
                shadow="none"
                maxW="95vw"
                maxH="95vh"
              >
                <Flex justify="center" align="center" gap={3} py={3}>
                  <IconButton
                    rounded="full"
                    size="sm"
                    bg="whiteAlpha.800"
                    color="gray.700"
                    _hover={{ bg: 'white' }}
                    onClick={() =>
                      setZoom((z) => Math.min(z + 0.25, 3))
                    }
                    aria-label="Zoom in"
                  >
                    <MdZoomIn size={20} />
                  </IconButton>
                  <Text
                    fontSize="sm"
                    color="whiteAlpha.700"
                    minW="40px"
                    textAlign="center"
                  >
                    {Math.round(zoom * 100)}%
                  </Text>
                  <IconButton
                    rounded="full"
                    size="sm"
                    bg="whiteAlpha.800"
                    color="gray.700"
                    _hover={{ bg: 'white' }}
                    onClick={() =>
                      setZoom((z) => Math.max(z - 0.25, 0.5))
                    }
                    aria-label="Zoom out"
                  >
                    <MdZoomOut size={20} />
                  </IconButton>
                  <Dialog.CloseTrigger asChild>
                    <IconButton
                      rounded="full"
                      size="sm"
                      bg="whiteAlpha.800"
                      color="gray.700"
                      _hover={{ bg: 'white' }}
                      aria-label="Close"
                      ml={4}
                    >
                      <MdClose size={20} />
                    </IconButton>
                  </Dialog.CloseTrigger>
                </Flex>
                <Flex
                  justify="center"
                  align="center"
                  w="100%"
                  h="90vh"
                  overflow="auto"
                >
                  <Image
                    src={prescription.fileUrl}
                    alt="Prescription"
                    maxW="90vw"
                    maxH="85vh"
                    objectFit="contain"
                    transform={`scale(${zoom})`}
                    transition="transform 0.2s ease"
                    rounded="md"
                  />
                </Flex>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
        )}
    </Stack>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <Flex align="center" gap={3}>
      <Box color="gray.400" flexShrink={0}>
        <Icon size={16} />
      </Box>
      <Text fontSize="sm" color="gray.500" minW="60px">
        {label}
      </Text>
      <Text fontSize="sm" fontWeight="600" color="gray.700">
        {value || 'N/A'}
      </Text>
    </Flex>
  )
}
