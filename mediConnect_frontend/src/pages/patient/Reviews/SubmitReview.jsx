import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Heading,
  Text,
  Flex,
  Button,
  Card,
  Badge,
  Avatar,
  Textarea,
  Field,
  Spinner,
} from "@chakra-ui/react";
import { MdStar, MdCheckCircle, MdArrowForward } from "react-icons/md";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import * as appointmentSlice from "@/features/appointments/appointmentSlice";
import * as appointmentSelectors from "@/features/appointments/appointmentSelectors";
import * as reviewSlice from "@/features/reviews/reviewSlice";
import * as reviewSelectors from "@/features/reviews/reviewSelectors";

function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <Flex gap={1}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Box
          key={n}
          cursor="pointer"
          color={(hovered || value) >= n ? "orange.400" : "gray.300"}
          fontSize="4xl"
          transition="all 0.15s"
          _hover={{ transform: "scale(1.15)" }}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
        >
          <MdStar />
        </Box>
      ))}
    </Flex>
  );
}

const RATING_LABELS = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};
const RATING_COLORS = {
  1: "red",
  2: "orange",
  3: "yellow",
  4: "teal",
  5: "green",
};

export default function SubmitReview() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appointment = useSelector(
    appointmentSelectors.selectCurrentAppointment,
  );
  const loading = useSelector(appointmentSelectors.selectAppointmentsLoading);
  const submitting = useSelector(reviewSelectors.selectReviewSubmitting);
  const submitted = useSelector(reviewSelectors.selectReviewSubmitted);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    dispatch(appointmentSlice.fetchAppointmentByIdRequest(appointmentId));
    return () => dispatch(reviewSlice.resetReviewSubmission());
  }, [dispatch, appointmentId]);

  useEffect(() => {
    if (submitted) {
      setTimeout(() => navigate("/patient/appointments"), 2500);
    }
  }, [submitted, navigate]);

  if (loading) return <Loader />;

  if (!appointment)
    return (
      <EmptyState
        title="Appointment not found"
        description="The appointment you are trying to review does not exist."
        actionLabel="Back to Appointments"
        onAction={() => navigate("/patient/appointments")}
      />
    );

  const doctorName = appointment.doctorId?.name || "Doctor";
  const specialtyName = appointment.doctorId?.specialtyId?.name || "General";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || submitting) return;
    dispatch(
      reviewSlice.submitReviewRequest({
        appointmentId,
        doctorId: appointment.doctorId?._id || appointment.doctorId,
        hospitalId: appointment.hospitalId?._id || appointment.hospitalId,
        rating,
        comment,
      }),
    );
  };

  if (submitted)
    return (
      <Card.Root shadow="md" rounded="2xl" maxW="500px" mx="auto" mt={8}>
        <Card.Body py={12} textAlign="center">
          <Box
            color="teal.500"
            fontSize="6xl"
            display="flex"
            justifyContent="center"
            mb={4}
          >
            <MdCheckCircle />
          </Box>
          <Heading size="xl" color="teal.600" mb={2}>
            Review Submitted!
          </Heading>
          <Text color="gray.500" mb={3}>
            Thank you for your feedback
          </Text>
          <Flex justify="center" gap={1}>
            {[1, 2, 3, 4, 5].map((n) => (
              <MdStar
                key={n}
                size={24}
                color={n <= rating ? "#F6AD55" : "#E2E8F0"}
              />
            ))}
          </Flex>
          <Badge colorPalette={RATING_COLORS[rating]} size="lg" mt={2}>
            {RATING_LABELS[rating]}
          </Badge>
          <Box mt={6}>
            <Button
              colorPalette="teal"
              onClick={() => navigate("/patient/appointments")}
            >
              Back to Appointments <MdArrowForward />
            </Button>
          </Box>
        </Card.Body>
      </Card.Root>
    );

  return (
    <Stack gap={6} w="100%">
      <PageHeader
        title="Rate Your Visit"
        subtitle="Share your experience to help others"
        backTo="/patient/appointments"
        backLabel="Back"
      />

      {/* Doctor card */}
      <Card.Root
        shadow="md"
        rounded="2xl"
        overflow="hidden"
        bgGradient="to-br"
        gradientFrom="teal.600"
        gradientTo="teal.800"
        color="white"
      >
        <Card.Body p={{ base: 4, md: 6 }}>
          <Flex align="center" gap={4}>
            <Avatar.Root size="lg" bg="white" flexShrink={0}>
              <Avatar.Fallback
                name={doctorName}
                color="teal.700"
                fontSize="xl"
              />
            </Avatar.Root>
            <Box>
              <Text fontWeight="700" fontSize="lg">
                {doctorName}
              </Text>
              <Badge bg="whiteAlpha.300" color="white" size="sm">
                {specialtyName}
              </Badge>
              <Text opacity={0.7} fontSize="sm" mt={1}>
                {new Date(
                  appointment.appointmentDate || appointment.date,
                ).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </Box>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* Review form */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body>
          <Box as="form" onSubmit={handleSubmit}>
            <Stack gap={6}>
              {/* Rating */}
              <Box textAlign="center">
                <Text fontWeight="600" mb={3}>
                  How was your experience?
                </Text>
                <Flex justify="center">
                  <StarInput value={rating} onChange={setRating} />
                </Flex>
                {rating > 0 && (
                  <Badge colorPalette={RATING_COLORS[rating]} size="lg" mt={3}>
                    {RATING_LABELS[rating]}
                  </Badge>
                )}
              </Box>

              {/* Comment */}
              <Field.Root>
                <Field.Label>Write a Review (optional)</Field.Label>
                <Textarea
                  rows={4}
                  placeholder="Tell others about your experience with this doctor…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  resize="vertical"
                />
                <Text fontSize="xs" color="gray.400" mt={1}>
                  {comment.length}/1000 characters
                </Text>
              </Field.Root>

              <Box bg="blue.50" p={3} rounded="lg">
                <Text fontSize="xs" color="blue.600">
                  Your review will be moderated before being published. Thank
                  you for helping maintain quality healthcare.
                </Text>
              </Box>

              <Button
                type="submit"
                colorPalette="teal"
                size="lg"
                disabled={!rating || submitting}
                opacity={!rating ? 0.6 : 1}
              >
                {submitting ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <MdStar /> Submit Review
                  </>
                )}
              </Button>
            </Stack>
          </Box>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
}
