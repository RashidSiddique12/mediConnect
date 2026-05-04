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
  Grid,
  Avatar,
  Input,
  Field,
  Spinner,
} from "@chakra-ui/react";
import {
  MdCalendarToday,
  MdAccessTime,
  MdCheckCircle,
  MdArrowForward,
} from "react-icons/md";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import * as doctorSlice from "@/features/doctors/doctorSlice";
import * as doctorSelectors from "@/features/doctors/doctorSelectors";
import * as scheduleSlice from "@/features/schedules/scheduleSlice";
import * as scheduleSelectors from "@/features/schedules/scheduleSelectors";
import * as appointmentSlice from "@/features/appointments/appointmentSlice";
import * as appointmentSelectors from "@/features/appointments/appointmentSelectors";

function toDateKey(d) {
  if (typeof d === "string") return d.split("T")[0];
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${yr}-${mo}-${da}`;
}

function formatDateDisplay(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function generateSlots(startTime, endTime, duration) {
  const slots = [];
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  let current = sh * 60 + sm;
  const end = eh * 60 + em;
  while (current + duration <= end) {
    const h = String(Math.floor(current / 60)).padStart(2, "0");
    const m = String(current % 60).padStart(2, "0");
    const nh = String(Math.floor((current + duration) / 60)).padStart(2, "0");
    const nm = String((current + duration) % 60).padStart(2, "0");
    slots.push(`${h}:${m}-${nh}:${nm}`);
    current += duration;
  }
  return slots;
}

function StepBadge({ step, active }) {
  return (
    <Flex
      align="center"
      justify="center"
      rounded="full"
      w={7}
      h={7}
      fontSize="sm"
      fontWeight="700"
      bg={active ? "teal.500" : "gray.200"}
      color={active ? "white" : "gray.500"}
      flexShrink={0}
    >
      {step}
    </Flex>
  );
}

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const doctor = useSelector(doctorSelectors.selectCurrentDoctor);
  const schedules = useSelector(scheduleSelectors.selectSchedules);
  const loading = useSelector(doctorSelectors.selectDoctorsLoading);
  const bookingLoading = useSelector(appointmentSelectors.selectBookingLoading);
  const booked = useSelector(appointmentSelectors.selectBooked);

  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState("");

  const todayKey = toDateKey(new Date());

  useEffect(() => {
    dispatch(doctorSlice.fetchDoctorByIdRequest(doctorId));
    dispatch(scheduleSlice.fetchSchedulesRequest({ doctorId }));
    return () => dispatch(appointmentSlice.resetBooking());
  }, [dispatch, doctorId]);

  useEffect(() => {
    if (booked) {
      setTimeout(() => navigate("/patient/appointments"), 2500);
    }
  }, [booked, navigate]);

  const upcomingSchedules = schedules
    .filter((s) => toDateKey(s.date) >= todayKey)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

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

  const handleBook = () => {
    if (!selectedSchedule || !selectedSlot || bookingLoading) return;
    dispatch(
      appointmentSlice.bookAppointmentRequest({
        doctorId,
        hospitalId: hospital?._id || hospital,
        appointmentDate: toDateKey(selectedSchedule.date),
        timeSlot: selectedSlot,
        notes,
      }),
    );
  };

  if (booked)
    return (
      <Card.Root shadow="md" rounded="2xl" maxW="500px" mx="auto" mt={8}>
        <Card.Body py={12} textAlign="center">
          <Box
            color="teal.500"
            fontSize="6xl"
            mb={4}
            display="flex"
            justifyContent="center"
          >
            <MdCheckCircle />
          </Box>
          <Heading size="xl" color="teal.600" mb={2}>
            Appointment Booked!
          </Heading>
          <Text color="gray.500" mb={1}>
            With{" "}
            <Text as="span" fontWeight="700">
              {doctorName}
            </Text>
          </Text>
          <Text color="gray.500">
            {formatDateDisplay(selectedSchedule?.date)} at {selectedSlot}
          </Text>
          <Button
            colorPalette="teal"
            mt={6}
            onClick={() => navigate("/patient/appointments")}
          >
            View My Appointments <MdArrowForward />
          </Button>
        </Card.Body>
      </Card.Root>
    );

  const currentStep = selectedSlot ? 3 : selectedSchedule ? 2 : 1;

  return (
    <Stack gap={6} w="100%">
      <PageHeader
        title="Book Appointment"
        subtitle="Select a date and time slot to confirm your visit"
        backTo={`/patient/doctors/${doctorId}`}
        backLabel="Back"
      />

      {/* Doctor summary */}
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
          <Flex align="center" gap={4} wrap="wrap">
            <Avatar.Root size="lg" bg="white" flexShrink={0}>
              <Avatar.Fallback
                name={doctorName}
                color="teal.700"
                fontSize="xl"
              />
            </Avatar.Root>
            <Box flex={1} minW="150px">
              <Heading size="md" color="white">
                {doctorName}
              </Heading>
              <Badge bg="whiteAlpha.300" color="white" mt={1}>
                {specialtyName}
              </Badge>
              <Text opacity={0.8} fontSize="sm" mt={1}>
                {hospital?.name || "N/A"}
              </Text>
            </Box>
            <Box textAlign={{ base: "left", md: "right" }}>
              <Text opacity={0.7} fontSize="xs">
                Consultation Fee
              </Text>
              <Heading size="lg" color="white">
                ${doctor.consultationFee || doctor.fee || 0}
              </Heading>
            </Box>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* Progress indicator */}
      <Flex align="center" gap={2} px={2}>
        {[
          { step: 1, label: "Choose Date" },
          { step: 2, label: "Choose Time" },
          { step: 3, label: "Confirm" },
        ].map(({ step, label }, i) => (
          <Flex key={step} align="center" gap={2} flex={i < 2 ? 1 : "unset"}>
            <StepBadge step={step} active={currentStep >= step} />
            <Text
              fontSize="xs"
              fontWeight="600"
              color={currentStep >= step ? "teal.600" : "gray.400"}
            >
              {label}
            </Text>
            {i < 2 && (
              <Box
                flex={1}
                h="2px"
                bg={currentStep > step ? "teal.400" : "gray.200"}
                rounded="full"
              />
            )}
          </Flex>
        ))}
      </Flex>

      {/* Step 1: Choose date */}
      <Card.Root
        shadow="sm"
        rounded="xl"
        borderWidth={currentStep === 1 ? "2px" : "1px"}
        borderColor={currentStep === 1 ? "teal.200" : "gray.100"}
      >
        <Card.Body>
          <Flex align="center" gap={2} mb={4}>
            <Box color="teal.500">
              <MdCalendarToday size={18} />
            </Box>
            <Heading size="sm">Choose Date</Heading>
          </Flex>
          {upcomingSchedules.length === 0 ? (
            <EmptyState
              icon={<MdCalendarToday size={36} />}
              title="No schedules available"
              description="This doctor has no upcoming schedules at the moment."
              py={8}
              withCard={false}
            />
          ) : (
            <Grid
              templateColumns={{
                base: "repeat(2, 1fr)",
                md: "repeat(auto-fill, minmax(180px, 1fr))",
              }}
              gap={3}
            >
              {upcomingSchedules.map((s) => {
                const isSelected = selectedSchedule?._id === s._id;
                return (
                  <Box
                    key={s._id}
                    border="2px solid"
                    borderColor={isSelected ? "teal.500" : "gray.200"}
                    bg={isSelected ? "teal.50" : "white"}
                    p={3}
                    rounded="lg"
                    cursor="pointer"
                    transition="all 0.15s"
                    _hover={{
                      borderColor: "teal.300",
                      bg: isSelected ? "teal.50" : "gray.50",
                    }}
                    onClick={() => {
                      setSelectedSchedule(s);
                      setSelectedSlot(null);
                    }}
                  >
                    <Text
                      fontWeight="700"
                      fontSize="sm"
                      color={isSelected ? "teal.700" : "gray.800"}
                    >
                      {formatDateDisplay(s.date)}
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {s.startTime} – {s.endTime}
                    </Text>
                    {isSelected && (
                      <Badge
                        colorPalette="teal"
                        size="sm"
                        mt={2}
                        variant="subtle"
                      >
                        Selected
                      </Badge>
                    )}
                  </Box>
                );
              })}
            </Grid>
          )}
        </Card.Body>
      </Card.Root>

      {/* Step 2: Choose time slot */}
      {selectedSchedule && (
        <Card.Root
          shadow="sm"
          rounded="xl"
          borderWidth={currentStep === 2 ? "2px" : "1px"}
          borderColor={currentStep === 2 ? "teal.200" : "gray.100"}
        >
          <Card.Body>
            <Flex align="center" gap={2} mb={4}>
              <Box color="teal.500">
                <MdAccessTime size={18} />
              </Box>
              <Heading size="sm">Choose Time Slot</Heading>
              <Text fontSize="xs" color="gray.400" ml="auto">
                {formatDateDisplay(selectedSchedule.date)}
              </Text>
            </Flex>
            <Flex gap={2} wrap="wrap">
              {generateSlots(
                selectedSchedule.startTime,
                selectedSchedule.endTime,
                selectedSchedule.slotDuration || 30,
              ).map((slot) => {
                const isBooked = (selectedSchedule.bookedSlots || []).includes(
                  slot,
                );
                const isSelected = selectedSlot === slot;
                return (
                  <Box
                    key={slot}
                    border="2px solid"
                    borderColor={
                      isSelected
                        ? "teal.500"
                        : isBooked
                          ? "red.200"
                          : "gray.200"
                    }
                    bg={isSelected ? "teal.500" : isBooked ? "red.50" : "white"}
                    color={
                      isSelected ? "white" : isBooked ? "red.300" : "gray.700"
                    }
                    px={3}
                    py={2}
                    rounded="lg"
                    fontSize="sm"
                    fontWeight="600"
                    cursor={isBooked ? "not-allowed" : "pointer"}
                    opacity={isBooked ? 0.6 : 1}
                    transition="all 0.15s"
                    _hover={
                      !isBooked
                        ? {
                            borderColor: "teal.400",
                            bg: isSelected ? "teal.500" : "teal.50",
                          }
                        : {}
                    }
                    onClick={() => !isBooked && setSelectedSlot(slot)}
                    title={isBooked ? "This slot is already booked" : ""}
                  >
                    {slot}
                    {isBooked && (
                      <Text fontSize="2xs" color="red.400" mt={0.5}>
                        Booked
                      </Text>
                    )}
                  </Box>
                );
              })}
            </Flex>
          </Card.Body>
        </Card.Root>
      )}

      {/* Step 3: Notes & Confirm */}
      {selectedSlot && (
        <Card.Root
          shadow="sm"
          rounded="xl"
          borderWidth="2px"
          borderColor="teal.200"
        >
          <Card.Body>
            <Heading size="sm" mb={4}>
              Confirm Booking
            </Heading>

            <Box bg="gray.50" rounded="lg" p={4} mb={4}>
              <Stack gap={3}>
                <Flex justify="space-between">
                  <Text color="gray.500" fontSize="sm">
                    Doctor
                  </Text>
                  <Text fontWeight="600" fontSize="sm">
                    {doctorName}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.500" fontSize="sm">
                    Hospital
                  </Text>
                  <Text fontWeight="600" fontSize="sm">
                    {hospital?.name || "N/A"}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.500" fontSize="sm">
                    Date
                  </Text>
                  <Text fontWeight="600" fontSize="sm">
                    {formatDateDisplay(selectedSchedule.date)}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.500" fontSize="sm">
                    Time Slot
                  </Text>
                  <Badge colorPalette="teal" size="sm">
                    {selectedSlot}
                  </Badge>
                </Flex>
                <Flex justify="space-between" borderTopWidth="1px" pt={3}>
                  <Text color="gray.500" fontSize="sm">
                    Consultation Fee
                  </Text>
                  <Text fontWeight="700" color="teal.600" fontSize="md">
                    ${doctor.consultationFee || doctor.fee || 0}
                  </Text>
                </Flex>
              </Stack>
            </Box>

            <Field.Root mb={4}>
              <Field.Label>Notes (optional)</Field.Label>
              <Input
                placeholder="Describe your concern briefly…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Text fontSize="xs" color="gray.400" mt={1}>
                {notes.length}/500 characters
              </Text>
            </Field.Root>

            <Button
              w="full"
              colorPalette="teal"
              size="lg"
              onClick={handleBook}
              disabled={bookingLoading}
            >
              {bookingLoading ? <Spinner size="sm" /> : "Confirm Appointment"}
            </Button>
          </Card.Body>
        </Card.Root>
      )}
    </Stack>
  );
}
