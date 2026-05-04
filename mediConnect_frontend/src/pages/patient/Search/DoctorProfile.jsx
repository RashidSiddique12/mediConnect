import { useEffect } from "react";
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
  Grid,
  Avatar,
} from "@chakra-ui/react";
import {
  MdStar,
  MdCalendarToday,
  MdLocalHospital,
  MdSchool,
  MdArrowForward,
  MdAccessTime,
  MdAttachMoney,
} from "react-icons/md";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import * as doctorSlice from "@/features/doctors/doctorSlice";
import * as doctorSelectors from "@/features/doctors/doctorSelectors";
import * as scheduleSlice from "@/features/schedules/scheduleSlice";
import * as scheduleSelectors from "@/features/schedules/scheduleSelectors";
import * as reviewSlice from "@/features/reviews/reviewSlice";
import * as reviewSelectors from "@/features/reviews/reviewSelectors";

function StarRating({ rating, size = 18, showValue = true }) {
  return (
    <Flex gap={0.5} align="center">
      {[1, 2, 3, 4, 5].map((n) => (
        <MdStar
          key={n}
          size={size}
          color={n <= Math.round(rating) ? "#F6AD55" : "#E2E8F0"}
        />
      ))}
      {showValue && (
        <Text fontSize="sm" fontWeight="700" ml={1}>
          {Number(rating).toFixed(1)}
        </Text>
      )}
    </Flex>
  );
}

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doctor = useSelector(doctorSelectors.selectCurrentDoctor);
  const schedules = useSelector(scheduleSelectors.selectSchedules);
  const reviews = useSelector(reviewSelectors.selectReviews);
  const loading = useSelector(doctorSelectors.selectDoctorsLoading);

  useEffect(() => {
    dispatch(doctorSlice.fetchDoctorByIdRequest(id));
    dispatch(scheduleSlice.fetchSchedulesRequest(id));
    dispatch(reviewSlice.fetchReviewsRequest({ doctorId: id }));
  }, [dispatch, id]);

  if (loading) return <Loader />;

  if (!doctor)
    return (
      <EmptyState
        title="Doctor not found"
        description="The doctor you are looking for does not exist or has been removed."
        actionLabel="Back to Doctors"
        onAction={() => navigate("/patient/doctors")}
      />
    );

  const doctorName = doctor.userId?.name || doctor.name || "Doctor";
  const hospital = doctor.hospitalId;
  const specialtyName =
    (doctor.specialtyIds || []).map((s) => s.name || s).join(", ") || "General";
  const avgRating = doctor.rating || 0;

  return (
    <Stack gap={6} w="100%">
      <PageHeader backTo="/patient/doctors" backLabel="Back to Doctors" />

      {/* Profile hero card */}
      <Card.Root shadow="lg" rounded="2xl" overflow="hidden">
        <Box
          h={3}
          bgGradient="to-r"
          gradientFrom="teal.400"
          gradientTo="teal.600"
        />
        <Card.Body p={{ base: 5, md: 8 }}>
          <Flex gap={{ base: 4, md: 6 }} wrap="wrap">
            <Avatar.Root size="2xl" bg="teal.500" flexShrink={0}>
              <Avatar.Fallback name={doctorName} fontSize="3xl" />
            </Avatar.Root>
            <Box flex={1} minW="200px">
              <Heading size={{ base: "lg", md: "xl" }}>{doctorName}</Heading>
              <Badge colorPalette="teal" size="md" mt={1} mb={2}>
                {specialtyName}
              </Badge>
              <StarRating rating={avgRating} />

              <Grid
                templateColumns={{
                  base: "repeat(2, 1fr)",
                  md: "repeat(3, auto)",
                }}
                gap={3}
                mt={4}
              >
                <Box textAlign="center" bg="teal.50" rounded="xl" px={4} py={3}>
                  <MdAccessTime
                    size={16}
                    color="#0d9488"
                    style={{ margin: "0 auto 4px" }}
                  />
                  <Text fontSize="xs" color="gray.500">
                    Experience
                  </Text>
                  <Text fontWeight="700" color="teal.700">
                    {doctor.experience || 0} yrs
                  </Text>
                </Box>
                <Box
                  textAlign="center"
                  bg="orange.50"
                  rounded="xl"
                  px={4}
                  py={3}
                >
                  <MdAttachMoney
                    size={16}
                    color="#ea580c"
                    style={{ margin: "0 auto 4px" }}
                  />
                  <Text fontSize="xs" color="gray.500">
                    Consult Fee
                  </Text>
                  <Text fontWeight="700" color="orange.600">
                    ${doctor.consultationFee || doctor.fee || 0}
                  </Text>
                </Box>
                <Box textAlign="center" bg="blue.50" rounded="xl" px={4} py={3}>
                  <MdStar
                    size={16}
                    color="#2563eb"
                    style={{ margin: "0 auto 4px" }}
                  />
                  <Text fontSize="xs" color="gray.500">
                    Reviews
                  </Text>
                  <Text fontWeight="700" color="blue.600">
                    {reviews.length}
                  </Text>
                </Box>
              </Grid>
            </Box>
            <Button
              colorPalette="teal"
              size="lg"
              alignSelf="center"
              onClick={() => navigate(`/patient/book/${id}`)}
              _hover={{ transform: "translateY(-2px)", shadow: "md" }}
              transition="all 0.2s"
            >
              Book Appointment <MdArrowForward />
            </Button>
          </Flex>
        </Card.Body>
      </Card.Root>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
        {/* Hospital info */}
        <Card.Root
          shadow="sm"
          rounded="xl"
          _hover={{ shadow: "md" }}
          transition="all 0.2s"
        >
          <Card.Body>
            <Flex align="center" gap={2} mb={3}>
              <Box color="teal.500">
                <MdLocalHospital size={20} />
              </Box>
              <Heading size="sm">Hospital</Heading>
            </Flex>
            <Text fontWeight="600">{hospital?.name || "N/A"}</Text>
            <Text fontSize="sm" color="gray.500">
              {hospital?.address?.city || ""}
            </Text>
            {hospital?.rating > 0 && (
              <Flex align="center" gap={1} mt={2}>
                <MdStar size={14} color="#F6AD55" />
                <Text fontSize="sm" color="gray.600">
                  {hospital.rating} rating
                </Text>
              </Flex>
            )}
          </Card.Body>
        </Card.Root>

        {/* Qualifications */}
        <Card.Root
          shadow="sm"
          rounded="xl"
          _hover={{ shadow: "md" }}
          transition="all 0.2s"
        >
          <Card.Body>
            <Flex align="center" gap={2} mb={3}>
              <Box color="teal.500">
                <MdSchool size={20} />
              </Box>
              <Heading size="sm">Qualifications</Heading>
            </Flex>
            <Text fontSize="sm">
              {doctor.qualification || `MBBS, MD — ${specialtyName}`}
            </Text>
            <Text fontSize="sm" color="gray.500" mt={1}>
              {doctor.experience || 0} years of practice
            </Text>
            {doctor.bio && (
              <Box bg="gray.50" rounded="lg" p={3} mt={3}>
                <Text fontSize="sm" color="gray.600">
                  {doctor.bio}
                </Text>
              </Box>
            )}
          </Card.Body>
        </Card.Root>
      </Grid>

      {/* Schedule */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body>
          <Flex align="center" justify="space-between" mb={4}>
            <Flex align="center" gap={2}>
              <Box color="teal.500">
                <MdCalendarToday size={20} />
              </Box>
              <Heading size="sm">Available Schedule</Heading>
            </Flex>
            <Button
              size="sm"
              colorPalette="teal"
              onClick={() => navigate(`/patient/book/${id}`)}
            >
              Book Now
            </Button>
          </Flex>
          {schedules.length === 0 ? (
            <EmptyState
              icon={<MdCalendarToday size={36} />}
              title="No schedules available"
              description="This doctor hasn't published any schedules yet."
              py={8}
              withCard={false}
            />
          ) : (
            <Grid
              templateColumns={{
                base: "1fr",
                sm: "repeat(auto-fill, minmax(200px, 1fr))",
              }}
              gap={3}
            >
              {schedules.map((s) => (
                <Box
                  key={s._id}
                  bg="teal.50"
                  rounded="xl"
                  p={4}
                  border="1px solid"
                  borderColor="teal.100"
                  _hover={{ borderColor: "teal.300", shadow: "sm" }}
                  transition="all 0.2s"
                >
                  <Text fontWeight="700" color="teal.700">
                    {s.day}
                  </Text>
                  <Flex align="center" gap={1} mt={1}>
                    <MdAccessTime size={13} color="#718096" />
                    <Text fontSize="xs" color="gray.500">
                      {s.startTime || s.start} – {s.endTime || s.end}
                    </Text>
                  </Flex>
                  {(s.slots || []).length > 0 && (
                    <Badge
                      colorPalette="teal"
                      variant="subtle"
                      size="sm"
                      mt={2}
                    >
                      {s.slots.length} slots
                    </Badge>
                  )}
                </Box>
              ))}
            </Grid>
          )}
        </Card.Body>
      </Card.Root>

      {/* Reviews */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body>
          <Flex align="center" justify="space-between" mb={4}>
            <Heading size="sm">Patient Reviews ({reviews.length})</Heading>
            {avgRating > 0 && <StarRating rating={avgRating} size={16} />}
          </Flex>
          {reviews.length === 0 ? (
            <EmptyState
              icon={<MdStar size={36} />}
              iconColor="orange.300"
              iconBg="orange.50"
              title="No reviews yet"
              description="Be the first to review after your appointment."
              py={8}
              withCard={false}
            />
          ) : (
            <Stack gap={3}>
              {reviews.map((r) => (
                <Box
                  key={r._id}
                  bg="gray.50"
                  p={4}
                  rounded="xl"
                  _hover={{ bg: "gray.100" }}
                  transition="all 0.2s"
                >
                  <Flex justify="space-between" align="center" mb={2}>
                    <Flex align="center" gap={2}>
                      <Avatar.Root size="xs" bg="teal.500">
                        <Avatar.Fallback
                          name={r.patientId?.name || "Patient"}
                        />
                      </Avatar.Root>
                      <Text fontWeight="600" fontSize="sm">
                        {r.patientId?.name || "Patient"}
                      </Text>
                    </Flex>
                    <Flex gap={0.5}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <MdStar
                          key={n}
                          size={13}
                          color={n <= r.rating ? "#F6AD55" : "#E2E8F0"}
                        />
                      ))}
                    </Flex>
                  </Flex>
                  {r.comment && (
                    <Text fontSize="sm" color="gray.600" fontStyle="italic">
                      "{r.comment}"
                    </Text>
                  )}
                  <Text fontSize="xs" color="gray.400" mt={2}>
                    {new Date(r.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </Box>
              ))}
            </Stack>
          )}
        </Card.Body>
      </Card.Root>
    </Stack>
  );
}
