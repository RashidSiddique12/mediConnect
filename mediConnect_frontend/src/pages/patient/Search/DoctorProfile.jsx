import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Stack, Heading, Text, Flex, Button, Card, Badge, Grid, Avatar, Spinner, Center,
} from '@chakra-ui/react'
import { MdArrowBack, MdStar, MdCalendarToday, MdLocalHospital, MdSchool } from 'react-icons/md'
import * as doctorSlice from '@/features/doctors/doctorSlice'
import * as doctorSelectors from '@/features/doctors/doctorSelectors'
import * as scheduleSlice from '@/features/schedules/scheduleSlice'
import * as scheduleSelectors from '@/features/schedules/scheduleSelectors'
import * as reviewSlice from '@/features/reviews/reviewSlice'
import * as reviewSelectors from '@/features/reviews/reviewSelectors'

function StarRating({ rating }) {
  return (
    <Flex gap={1} align="center">
      {[1, 2, 3, 4, 5].map((n) => (
        <MdStar key={n} size={18} color={n <= Math.round(rating) ? '#F6AD55' : '#E2E8F0'} />
      ))}
      <Text fontSize="sm" fontWeight="700" ml={1}>{rating}</Text>
    </Flex>
  )
}

export default function DoctorProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const doctor = useSelector(doctorSelectors.selectCurrentDoctor)
  const schedules = useSelector(scheduleSelectors.selectSchedules)
  const reviews = useSelector(reviewSelectors.selectReviews)
  const loading = useSelector(doctorSelectors.selectDoctorsLoading)

  useEffect(() => {
    dispatch(doctorSlice.fetchDoctorByIdRequest(id))
    dispatch(scheduleSlice.fetchSchedulesRequest(id))
    dispatch(reviewSlice.fetchReviewsRequest({ doctorId: id }))
  }, [dispatch, id])

  if (loading) return <Center py={12}><Spinner size="xl" color="teal.500" /></Center>

  if (!doctor) return (
    <Box textAlign="center" py={12} color="gray.400">
      <Text>Doctor not found.</Text>
      <Button mt={4} colorPalette="teal" onClick={() => navigate('/patient/doctors')}>Back to Search</Button>
    </Box>
  )

  const doctorName = doctor.userId?.name || doctor.name || 'Doctor'
  const hospital = doctor.hospitalId
  const specialtyName = (doctor.specialtyIds || []).map((s) => s.name || s).join(', ') || 'General'

  return (
    <Stack gap={6} maxW="850px">
      <Button variant="ghost" colorPalette="teal" alignSelf="flex-start" onClick={() => navigate('/patient/doctors')}>
        <MdArrowBack /> Back to Doctors
      </Button>

      {/* Profile card */}
      <Card.Root shadow="md" rounded="2xl" overflow="hidden">
        <Box h={3} bg="teal.500" />
        <Card.Body>
          <Flex gap={6} wrap="wrap">
            <Avatar.Root size="2xl" bg="teal.500" flexShrink={0}>
              <Avatar.Fallback name={doctorName} fontSize="3xl" />
            </Avatar.Root>
            <Box flex={1}>
              <Heading size="xl">{doctorName}</Heading>
              <Badge colorPalette="teal" size="md" mt={1} mb={2}>{specialtyName}</Badge>
              <StarRating rating={doctor.rating || 0} />
              <Grid templateColumns="repeat(3, auto)" gap={4} mt={4}>
                <Box textAlign="center" bg="teal.50" rounded="lg" px={4} py={2}>
                  <Text fontSize="xs" color="gray.500">Experience</Text>
                  <Text fontWeight="700" color="teal.700">{doctor.experience || 0} yrs</Text>
                </Box>
                <Box textAlign="center" bg="orange.50" rounded="lg" px={4} py={2}>
                  <Text fontSize="xs" color="gray.500">Consult Fee</Text>
                  <Text fontWeight="700" color="orange.600">${doctor.consultationFee || doctor.fee || 0}</Text>
                </Box>
                <Box textAlign="center" bg="blue.50" rounded="lg" px={4} py={2}>
                  <Text fontSize="xs" color="gray.500">Reviews</Text>
                  <Text fontWeight="700" color="blue.600">{reviews.length}</Text>
                </Box>
              </Grid>
            </Box>
            <Button colorPalette="teal" size="lg" alignSelf="center" onClick={() => navigate(`/patient/book/${id}`)}>
              Book Appointment
            </Button>
          </Flex>
        </Card.Body>
      </Card.Root>

      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
        {/* Hospital info */}
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body>
            <Flex align="center" gap={2} mb={3}>
              <Box color="teal.500"><MdLocalHospital size={20} /></Box>
              <Heading size="sm">Hospital</Heading>
            </Flex>
            <Text fontWeight="600">{hospital?.name || 'N/A'}</Text>
            <Text fontSize="sm" color="gray.500">{hospital?.address?.city || ''}</Text>
            <Flex align="center" gap={1} mt={1}>
              <MdStar size={14} color="#F6AD55" />
              <Text fontSize="sm" color="gray.600">{hospital?.rating || 0}</Text>
            </Flex>
          </Card.Body>
        </Card.Root>

        {/* Qualifications */}
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body>
            <Flex align="center" gap={2} mb={3}>
              <Box color="teal.500"><MdSchool size={20} /></Box>
              <Heading size="sm">Qualifications</Heading>
            </Flex>
            <Text fontSize="sm">{doctor.qualification || `MBBS, MD — ${specialtyName}`}</Text>
            <Text fontSize="sm" color="gray.500" mt={1}>{doctor.experience || 0} years of practice</Text>
          </Card.Body>
        </Card.Root>
      </Grid>

      {/* Schedule */}
      {schedules.length > 0 && (
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body>
            <Flex align="center" gap={2} mb={4}>
              <Box color="teal.500"><MdCalendarToday size={20} /></Box>
              <Heading size="sm">Available Schedule</Heading>
            </Flex>
            <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={3}>
              {schedules.map((s) => (
                <Box key={s._id} bg="teal.50" rounded="lg" p={3}>
                  <Text fontWeight="700" color="teal.700">{s.day}</Text>
                  <Text fontSize="xs" color="gray.500">{s.startTime || s.start} – {s.endTime || s.end}</Text>
                  <Text fontSize="xs" color="teal.600" mt={1}>{(s.slots || []).length} slots available</Text>
                </Box>
              ))}
            </Grid>
          </Card.Body>
        </Card.Root>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body>
            <Heading size="sm" mb={4}>Patient Reviews</Heading>
            <Stack gap={3}>
              {reviews.map((r) => (
                <Box key={r._id} bg="gray.50" p={3} rounded="lg">
                  <Flex justify="space-between" align="center" mb={1}>
                    <Text fontWeight="600" fontSize="sm">{r.patientId?.name || 'Patient'}</Text>
                    <Flex gap={0.5}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <MdStar key={n} size={13} color={n <= r.rating ? '#F6AD55' : '#E2E8F0'} />
                      ))}
                    </Flex>
                  </Flex>
                  <Text fontSize="sm" color="gray.600" fontStyle="italic">"{r.comment}"</Text>
                  <Text fontSize="xs" color="gray.400" mt={1}>{new Date(r.createdAt).toLocaleDateString()}</Text>
                </Box>
              ))}
            </Stack>
          </Card.Body>
        </Card.Root>
      )}
    </Stack>
  )
}
