import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Text,
  Flex,
  Badge,
  Button,
  Card,
  Grid,
  Avatar,
  Heading,
} from "@chakra-ui/react";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdEdit,
  MdMedicalServices,
  MdBadge,
  MdLanguage,
  MdVideoCall,
  MdCalendarMonth,
} from "react-icons/md";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import * as doctorSlice from "@/features/doctors/doctorSlice";
import {
  selectCurrentDoctor,
  selectDoctorsLoading,
} from "@/features/doctors/doctorSelectors";

const CONSULTATION_LABELS = {
  in_person: "In Person",
  video: "Video",
  phone: "Phone",
};

function InfoCard({ icon: Icon, iconBg, iconColor, title, children }) {
  return (
    <Card.Root shadow="sm" rounded="xl">
      <Card.Body>
        <Flex align="center" gap={2} mb={4}>
          <Box bg={iconBg} p={2} rounded="lg" color={iconColor}>
            <Icon size={20} />
          </Box>
          <Heading size="sm">{title}</Heading>
        </Flex>
        {children}
      </Card.Body>
    </Card.Root>
  );
}

function InfoRow({ label, value }) {
  return (
    <Flex justify="space-between" align="center">
      <Text fontSize="sm" color="gray.500">
        {label}
      </Text>
      <Text fontSize="sm" fontWeight="600">
        {value || "—"}
      </Text>
    </Flex>
  );
}

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doctor = useSelector(selectCurrentDoctor);
  const loading = useSelector(selectDoctorsLoading);

  useEffect(() => {
    dispatch(doctorSlice.fetchDoctorByIdRequest(id));
    return () => dispatch(doctorSlice.clearCurrentDoctor());
  }, [dispatch, id]);

  if (loading) return <Loader />;

  if (!doctor && !loading) {
    return (
      <EmptyState
        title="Doctor not found"
        description="The doctor you're looking for doesn't exist or has been removed"
        actionLabel="Back to Doctors"
        onAction={() => navigate("/hospital/doctors")}
      />
    );
  }

  return (
    <Stack gap={6}>
      <PageHeader
        title="Doctor Details"
        subtitle={doctor?.name}
        backTo="/hospital/doctors"
        actions={[
          <Button
            key="edit"
            colorPalette="teal"
            size="sm"
            onClick={() => navigate(`/hospital/doctors/edit/${id}`)}
          >
            <MdEdit /> Edit Doctor
          </Button>,
          <Button
            key="schedule"
            variant="outline"
            colorPalette="teal"
            size="sm"
            onClick={() => navigate(`/hospital/schedules/slots/${id}`)}
          >
            <MdCalendarMonth /> Manage Schedule
          </Button>,
        ]}
      />

      {/* ─── Profile Header Card ─── */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body>
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "center", md: "flex-start" }}
            gap={5}
          >
            <Avatar.Root size="2xl" bg="teal.500">
              <Avatar.Fallback name={doctor?.name} />
            </Avatar.Root>

            <Box flex={1} textAlign={{ base: "center", md: "left" }}>
              <Heading size="lg">{doctor?.name}</Heading>
              {doctor?.qualification && (
                <Text color="gray.500" fontSize="sm" mt={1}>
                  {doctor.qualification}
                </Text>
              )}
              <Flex
                gap={2}
                mt={2}
                wrap="wrap"
                justify={{ base: "center", md: "flex-start" }}
              >
                <Badge colorPalette="teal" size="md">
                  {doctor?.specialtyIds?.[0]?.name || "General"}
                </Badge>
                <Badge
                  colorPalette={doctor?.status === "active" ? "green" : "red"}
                  size="md"
                  variant="subtle"
                >
                  {doctor?.status}
                </Badge>
              </Flex>

              {doctor?.bio && (
                <Text fontSize="sm" color="gray.600" mt={3} lineClamp={4}>
                  {doctor.bio}
                </Text>
              )}
            </Box>

            {/* Quick Stats */}
            <Grid
              templateColumns="repeat(3, 1fr)"
              gap={3}
              minW={{ md: "240px" }}
            >
              <Box textAlign="center" bg="gray.50" rounded="lg" py={3} px={2}>
                <Text fontSize="xs" color="gray.400">
                  Experience
                </Text>
                <Text fontWeight="700" fontSize="lg">
                  {doctor?.experience || 0}y
                </Text>
              </Box>
              <Box textAlign="center" bg="gray.50" rounded="lg" py={3} px={2}>
                <Text fontSize="xs" color="gray.400">
                  Fee
                </Text>
                <Text fontWeight="700" fontSize="lg" color="teal.600">
                  ${doctor?.consultationFee || 0}
                </Text>
              </Box>
              <Box textAlign="center" bg="gray.50" rounded="lg" py={3} px={2}>
                <Text fontSize="xs" color="gray.400">
                  Gender
                </Text>
                <Text fontWeight="700" fontSize="sm" textTransform="capitalize">
                  {doctor?.gender || "—"}
                </Text>
              </Box>
            </Grid>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* ─── Detail Cards ─── */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
        {/* Contact Info */}
        <InfoCard
          icon={MdPerson}
          iconBg="blue.100"
          iconColor="blue.600"
          title="Contact Information"
        >
          <Stack gap={3}>
            <InfoRow label="Email" value={doctor?.email} />
            <InfoRow label="Phone" value={doctor?.phone} />
            <InfoRow label="Gender" value={doctor?.gender} />
          </Stack>
        </InfoCard>

        {/* Professional Info */}
        <InfoCard
          icon={MdMedicalServices}
          iconBg="teal.100"
          iconColor="teal.600"
          title="Professional Info"
        >
          <Stack gap={3}>
            <InfoRow
              label="Specialty"
              value={doctor?.specialtyIds?.[0]?.name}
            />
            <InfoRow label="Qualification" value={doctor?.qualification} />
            <InfoRow
              label="Experience"
              value={
                doctor?.experience ? `${doctor.experience} years` : undefined
              }
            />
            <InfoRow
              label="Consultation Fee"
              value={
                doctor?.consultationFee
                  ? `$${doctor.consultationFee}`
                  : undefined
              }
            />
          </Stack>
        </InfoCard>

        {/* Registration & License */}
        <InfoCard
          icon={MdBadge}
          iconBg="purple.100"
          iconColor="purple.600"
          title="Registration & License"
        >
          <Stack gap={3}>
            <InfoRow label="License Number" value={doctor?.licenseNumber} />
            <InfoRow
              label="Registration Council"
              value={doctor?.registrationCouncil}
            />
            <InfoRow
              label="Registration Year"
              value={doctor?.registrationYear}
            />
          </Stack>
        </InfoCard>

        {/* Consultation & Languages */}
        <InfoCard
          icon={MdLanguage}
          iconBg="orange.100"
          iconColor="orange.600"
          title="Consultation & Languages"
        >
          <Stack gap={4}>
            <Box>
              <Text fontSize="sm" color="gray.500" mb={2}>
                Consultation Types
              </Text>
              <Flex gap={2} wrap="wrap">
                {doctor?.consultationTypes?.length > 0 ? (
                  doctor.consultationTypes.map((type) => (
                    <Badge
                      key={type}
                      colorPalette="blue"
                      size="sm"
                      variant="outline"
                    >
                      <MdVideoCall size={12} />{" "}
                      {CONSULTATION_LABELS[type] || type}
                    </Badge>
                  ))
                ) : (
                  <Text fontSize="sm" fontWeight="600">
                    —
                  </Text>
                )}
              </Flex>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500" mb={1}>
                Languages Spoken
              </Text>
              <Flex gap={2} wrap="wrap">
                {doctor?.languages?.length > 0 ? (
                  doctor.languages.map((lang) => (
                    <Badge
                      key={lang}
                      colorPalette="green"
                      size="sm"
                      variant="subtle"
                    >
                      {lang}
                    </Badge>
                  ))
                ) : (
                  <Text fontSize="sm" fontWeight="600">
                    —
                  </Text>
                )}
              </Flex>
            </Box>
          </Stack>
        </InfoCard>
      </Grid>
    </Stack>
  );
}
