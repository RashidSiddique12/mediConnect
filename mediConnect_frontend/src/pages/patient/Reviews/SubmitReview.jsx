import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Stack, Heading, Text, Flex, Button, Card, Badge, Avatar, Textarea, Field, Spinner, Center,
} from '@chakra-ui/react'
import { MdArrowBack, MdStar, MdCheckCircle } from 'react-icons/md'
import * as appointmentSlice from '@/features/appointments/appointmentSlice'
import * as appointmentSelectors from '@/features/appointments/appointmentSelectors'
import * as reviewSlice from '@/features/reviews/reviewSlice'
import * as reviewSelectors from '@/features/reviews/reviewSelectors'

function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <Flex gap={2}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Box
          key={n}
          cursor="pointer"
          color={(hovered || value) >= n ? 'orange.400' : 'gray.200'}
          fontSize="3xl"
          transition="color 0.1s"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
        >
          <MdStar />
        </Box>
      ))}
    </Flex>
  )
}

const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' }

export default function SubmitReview() {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const appointment = useSelector(appointmentSelectors.selectCurrentAppointment)
  const loading = useSelector(appointmentSelectors.selectAppointmentsLoading)
  const submitted = useSelector(reviewSelectors.selectReviewSubmitted)

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  useEffect(() => {
    dispatch(appointmentSlice.fetchAppointmentByIdRequest(appointmentId))
    return () => dispatch(reviewSlice.resetReviewSubmission())
  }, [dispatch, appointmentId])

  useEffect(() => {
    if (submitted) {
      setTimeout(() => navigate('/patient/appointments'), 2500)
    }
  }, [submitted, navigate])

  if (loading) return <Center py={12}><Spinner size="xl" color="teal.500" /></Center>

  if (!appointment) return (
    <Box textAlign="center" py={12} color="gray.400">
      <Text>Appointment not found.</Text>
    </Box>
  )

  const doctorName = appointment.doctorId?.name || 'Doctor'
  const specialtyName = appointment.doctorId?.specialtyId?.name || 'General'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!rating) return
    dispatch(reviewSlice.submitReviewRequest({
      appointmentId,
      doctorId: appointment.doctorId?._id || appointment.doctorId,
      hospitalId: appointment.hospitalId?._id || appointment.hospitalId,
      rating,
      comment,
    }))
  }

  if (submitted) return (
    <Box textAlign="center" py={16}>
      <Box color="teal.500" fontSize="6xl" display="flex" justifyContent="center" mb={4}>
        <MdCheckCircle />
      </Box>
      <Heading size="xl" color="teal.600" mb={2}>Review Submitted!</Heading>
      <Text color="gray.500">Thank you for your feedback</Text>
      <Flex justify="center" gap={1} mt={3}>
        {[1, 2, 3, 4, 5].map((n) => (
          <MdStar key={n} size={22} color={n <= rating ? '#F6AD55' : '#E2E8F0'} />
        ))}
      </Flex>
    </Box>
  )

  return (
    <Stack gap={6} maxW="600px">
      <Flex align="center" gap={3}>
        <Button variant="ghost" colorPalette="teal" onClick={() => navigate('/patient/appointments')}>
          <MdArrowBack /> Back
        </Button>
        <Box>
          <Heading size="lg">Rate Your Visit</Heading>
          <Text color="gray.500" fontSize="sm">Share your experience to help others</Text>
        </Box>
      </Flex>

      {/* Doctor card */}
      <Card.Root shadow="sm" rounded="xl" bg="teal.700" color="white">
        <Card.Body>
          <Flex align="center" gap={4}>
            <Avatar.Root size="lg" bg="white" flexShrink={0}>
              <Avatar.Fallback name={doctorName} color="teal.700" fontSize="xl" />
            </Avatar.Root>
            <Box>
              <Text fontWeight="700" fontSize="lg">{doctorName}</Text>
              <Badge bg="teal.500" color="white" size="sm">{specialtyName}</Badge>
              <Text opacity={0.7} fontSize="sm" mt={1}>{new Date(appointment.appointmentDate || appointment.date).toLocaleDateString()}</Text>
            </Box>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* Review form */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body>
          <Box as="form" onSubmit={handleSubmit}>
            <Stack gap={6}>
              <Box>
                <Text fontWeight="600" mb={3}>How was your experience?</Text>
                <StarInput value={rating} onChange={setRating} />
                {rating > 0 && (
                  <Text color="orange.500" fontWeight="700" mt={2}>{RATING_LABELS[rating]}</Text>
                )}
              </Box>

              <Field.Root required={false}>
                <Field.Label>Write a Review</Field.Label>
                <Textarea
                  rows={4}
                  placeholder="Tell others about your experience with this doctor…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Field.Root>

              <Box bg="blue.50" p={3} rounded="lg">
                <Text fontSize="xs" color="blue.600">
                  Your review will be reviewed by our team before being published. Thank you for helping maintain quality healthcare.
                </Text>
              </Box>

              <Button
                type="submit"
                colorPalette="teal"
                size="lg"
                isDisabled={!rating}
                opacity={!rating ? 0.6 : 1}
              >
                <MdStar /> Submit Review
              </Button>
            </Stack>
          </Box>
        </Card.Body>
      </Card.Root>
    </Stack>
  )
}
