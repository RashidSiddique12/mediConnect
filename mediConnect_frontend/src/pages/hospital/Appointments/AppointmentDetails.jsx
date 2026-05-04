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
  Separator,
} from "@chakra-ui/react";
import {
  MdPerson,
  MdLocalHospital,
  MdUpload,
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
} from "react-icons/md";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import * as appointmentSlice from "@/features/appointments/appointmentSlice";
import {
  selectCurrentAppointment,
  selectAppointmentsLoading,
} from "@/features/appointments/appointmentSelectors";
import * as prescriptionSlice from "@/features/prescriptions/prescriptionSlice";
import { selectCurrentPrescription } from "@/features/prescriptions/prescriptionSelectors";

const STATUS_COLOR = { booked: "green", completed: "teal", cancelled: "red" };
const STATUS_ICON = {
  booked: MdAccessTime,
  completed: MdCheckCircle,
  cancelled: MdCancel,
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appointment = useSelector(selectCurrentAppointment);
  const loading = useSelector(selectAppointmentsLoading);
  const prescription = useSelector(selectCurrentPrescription);

  useEffect(() => {
    dispatch(appointmentSlice.fetchAppointmentByIdRequest(id));
    dispatch(prescriptionSlice.fetchPrescriptionByAppointmentRequest(id));
  }, [dispatch, id]);

  const handleUpdateStatus = (status) =>
    dispatch(appointmentSlice.updateAppointmentRequest({ id, status }));

  const handleCancel = () =>
    dispatch(appointmentSlice.cancelAppointmentRequest(id));

  if (loading) return <Loader />;

  if (!appointment) {
    return (
      <EmptyState
        title="Appointment not found"
        description="The appointment you're looking for doesn't exist or has been removed"
        actionLabel="Back to Appointments"
        onAction={() => navigate("/hospital/appointments")}
      />
    );
  }

  const { status } = appointment;
  const StatusIcon = STATUS_ICON[status] || MdAccessTime;
  const statusColor = STATUS_COLOR[status] || "gray";

  return (
    <Stack gap={6} w="100%">
      <PageHeader
        title="Appointment Details"
        subtitle={`ID: ${appointment._id}`}
        backTo="/hospital/appointments"
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
            {status === "booked" && (
              <Flex gap={2}>
                <Button
                  size="sm"
                  colorPalette="teal"
                  onClick={() => handleUpdateStatus("completed")}
                >
                  <MdCheckCircle /> Mark Complete
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  colorPalette="red"
                  onClick={handleCancel}
                >
                  <MdCancel /> Cancel
                </Button>
              </Flex>
            )}
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* ─── Patient & Doctor Info ─── */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
        {/* Patient Card */}
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body>
            <Flex align="center" gap={2} mb={4}>
              <Box bg="blue.100" p={2} rounded="lg" color="blue.600">
                <MdPerson size={20} />
              </Box>
              <Heading size="sm">Patient</Heading>
            </Flex>
            <Flex align="center" gap={3} mb={4}>
              <Avatar.Root size="lg" bg="blue.500" flexShrink={0}>
                <Avatar.Fallback
                  name={appointment.patientId?.name || "Patient"}
                />
              </Avatar.Root>
              <Box>
                <Text fontWeight="700" fontSize="md">
                  {appointment.patientId?.name || "N/A"}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Patient
                </Text>
              </Box>
            </Flex>
            <Separator mb={3} />
            <Stack gap={3}>
              <InfoRow
                icon={MdEmail}
                label="Email"
                value={appointment.patientId?.email}
              />
              <InfoRow
                icon={MdPhone}
                label="Phone"
                value={appointment.patientId?.phone}
              />
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Doctor & Hospital Card */}
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body>
            <Flex align="center" gap={2} mb={4}>
              <Box bg="teal.100" p={2} rounded="lg" color="teal.600">
                <MdLocalHospital size={20} />
              </Box>
              <Heading size="sm">Doctor & Hospital</Heading>
            </Flex>
            <Flex align="center" gap={3} mb={4}>
              <Avatar.Root size="lg" bg="teal.500" flexShrink={0}>
                <Avatar.Fallback
                  name={appointment.doctorId?.name || "Doctor"}
                />
              </Avatar.Root>
              <Box>
                <Text fontWeight="700" fontSize="md">
                  {appointment.doctorId?.name || "N/A"}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Doctor
                </Text>
              </Box>
            </Flex>
            <Separator mb={3} />
            <Stack gap={3}>
              <InfoRow
                icon={MdLocalHospital}
                label="Hospital"
                value={appointment.hospitalId?.name}
              />
              <InfoRow
                icon={MdMedicalServices}
                label="Specialty"
                value={appointment.doctorId?.specialtyId?.name}
              />
            </Stack>
          </Card.Body>
        </Card.Root>
      </Grid>

      {/* ─── Reason / Notes ─── */}
      {appointment.reason && (
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body>
            <Flex align="center" gap={2} mb={3}>
              <Box bg="orange.100" p={2} rounded="lg" color="orange.600">
                <MdNotes size={20} />
              </Box>
              <Heading size="sm">Reason for Visit</Heading>
            </Flex>
            <Box bg="orange.50" p={4} rounded="lg">
              <Text fontSize="sm" color="gray.700" lineHeight="tall">
                {appointment.reason}
              </Text>
            </Box>
          </Card.Body>
        </Card.Root>
      )}

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
            {status === "completed" && (
              <Button
                size="sm"
                colorPalette="teal"
                onClick={() => navigate(`/hospital/prescriptions/upload/${id}`)}
              >
                <MdUpload /> Upload Prescription
              </Button>
            )}
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
                  Prescription uploaded
                </Text>
              </Flex>
              {prescription.notes && (
                <Box bg="white" p={3} rounded="md" mt={3}>
                  <Text fontSize="xs" color="gray.500" fontWeight="600" mb={1}>
                    Notes
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    {prescription.notes}
                  </Text>
                </Box>
              )}
              {prescription.fileUrl && (
                <Flex align="center" gap={2} mt={3}>
                  <MdDescription size={16} color="#319795" />
                  <Text fontSize="sm" color="teal.600" fontWeight="500">
                    {prescription.fileUrl}
                  </Text>
                  <Button
                    size="xs"
                    variant="ghost"
                    colorPalette="teal"
                    ml="auto"
                  >
                    <MdArrowForward /> View
                  </Button>
                </Flex>
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
              <MdDescription size={32} style={{ margin: "0 auto 8px" }} />
              <Text fontSize="sm" fontWeight="500">
                No prescription uploaded yet
              </Text>
              {status === "completed" && (
                <Text fontSize="xs" mt={1} color="gray.500">
                  Click &ldquo;Upload Prescription&rdquo; to add one
                </Text>
              )}
            </Box>
          )}
        </Card.Body>
      </Card.Root>
    </Stack>
  );
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
        {value || "N/A"}
      </Text>
    </Flex>
  );
}
