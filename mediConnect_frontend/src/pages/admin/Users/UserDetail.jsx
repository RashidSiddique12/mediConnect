import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Heading,
  Text,
  Flex,
  Button,
  Badge,
  Grid,
  Spinner,
  Center,
  Card,
  Avatar,
  Separator,
} from "@chakra-ui/react";
import {
  MdArrowBack,
  MdPerson,
  MdEmail,
  MdPhone,
  MdCalendarToday,
  MdLocalHospital,
  MdAdminPanelSettings,
  MdCheckCircle,
  MdBlock,
  MdMedicalServices,
  MdEventNote,
  MdDescription,
  MdStar,
  MdPeople,
  MdToggleOn,
  MdToggleOff,
} from "react-icons/md";
import * as userSlice from "@/features/users/userSlice";
import * as userSelectors from "@/features/users/userSelectors";

const ROLE_COLOR = {
  super_admin: "red",
  hospital_admin: "purple",
  patient: "teal",
};
const ROLE_LABEL = {
  super_admin: "Super Admin",
  hospital_admin: "Hospital Admin",
  patient: "Patient",
};
const ROLE_ICON = {
  super_admin: MdAdminPanelSettings,
  hospital_admin: MdLocalHospital,
  patient: MdPerson,
};

function InfoRow({ icon: Icon, label, value, color = "gray" }) {
  if (!value && value !== 0) return null;
  return (
    <Flex align="flex-start" gap={3}>
      <Flex
        align="center"
        justify="center"
        bg={`${color}.100`}
        color={`${color}.600`}
        rounded="lg"
        p={2}
        mt={0.5}
      >
        <Icon size={16} />
      </Flex>
      <Box>
        <Text fontSize="xs" color="gray.400" fontWeight="500">
          {label}
        </Text>
        <Text fontSize="sm" fontWeight="600">
          {value}
        </Text>
      </Box>
    </Flex>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Card.Root
      shadow="sm"
      rounded="xl"
      _hover={{ shadow: "md" }}
      transition="all 0.15s"
    >
      <Card.Body py={4} px={5}>
        <Flex align="center" gap={3}>
          <Box color={`${color}.500`} bg={`${color}.50`} p={2.5} rounded="xl">
            <Icon size={20} />
          </Box>
          <Box>
            <Text
              fontSize="2xl"
              fontWeight="700"
              color={`${color}.600`}
              lineHeight="1"
            >
              {value}
            </Text>
            <Text fontSize="xs" color="gray.500" mt={0.5}>
              {label}
            </Text>
          </Box>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(userSelectors.selectCurrentUser);
  const loading = useSelector(userSelectors.selectUserDetailLoading);

  useEffect(() => {
    dispatch(userSlice.fetchUserByIdRequest(id));
    return () => dispatch(userSlice.clearCurrentUser());
  }, [dispatch, id]);

  if (loading || !user) {
    return (
      <Center py={16}>
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  const RoleIcon = ROLE_ICON[user.role] || MdPerson;
  const isActive = user.status === "active";

  return (
    <Stack gap={6}>
      {/* Gradient Header */}
      <Card.Root
        shadow="sm"
        rounded="xl"
        bg="linear-gradient(135deg, var(--chakra-colors-teal-600) 0%, var(--chakra-colors-teal-800) 100%)"
        color="white"
        overflow="hidden"
        position="relative"
      >
        <Box
          position="absolute"
          right="-20px"
          top="-20px"
          w="120px"
          h="120px"
          bg="whiteAlpha.100"
          rounded="full"
        />
        <Box
          position="absolute"
          right="50px"
          bottom="-25px"
          w="80px"
          h="80px"
          bg="whiteAlpha.50"
          rounded="full"
        />
        <Card.Body py={5}>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Flex align="center" gap={4}>
              <Button
                variant="ghost"
                size="sm"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                onClick={() => navigate("/admin/users")}
              >
                <MdArrowBack />
              </Button>
              <Avatar.Root size="lg" bg="whiteAlpha.200">
                <Avatar.Fallback name={user.name} color="white" />
              </Avatar.Root>
              <Box>
                <Heading size="lg" color="white">
                  {user.name}
                </Heading>
                <Flex align="center" gap={2} mt={1}>
                  <Badge
                    bg="whiteAlpha.200"
                    color="white"
                    size="sm"
                    display="inline-flex"
                    alignItems="center"
                    gap={1}
                  >
                    <RoleIcon size={12} />
                    {ROLE_LABEL[user.role] || user.role}
                  </Badge>
                  <Badge
                    bg={isActive ? "green.400" : "red.400"}
                    color="white"
                    size="sm"
                    display="inline-flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Box w="6px" h="6px" rounded="full" bg="white" />
                    {user.status}
                  </Badge>
                </Flex>
              </Box>
            </Flex>
            {user.role !== "super_admin" && (
              <Button
                bg={isActive ? "whiteAlpha.200" : "green.400"}
                color="white"
                _hover={{ bg: isActive ? "whiteAlpha.300" : "green.500" }}
                size="sm"
                onClick={() => {
                  dispatch(userSlice.toggleUserStatusRequest(user._id));
                }}
              >
                {isActive ? (
                  <>
                    <MdToggleOff /> Deactivate
                  </>
                ) : (
                  <>
                    <MdToggleOn /> Activate
                  </>
                )}
              </Button>
            )}
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* User Information */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body py={5} px={6}>
            <Flex align="center" gap={2} mb={4}>
              <MdPerson size={18} color="var(--chakra-colors-teal-500)" />
              <Heading size="sm" color="teal.700">
                Personal Information
              </Heading>
            </Flex>
            <Stack gap={4}>
              <InfoRow
                icon={MdEmail}
                label="Email Address"
                value={user.email}
                color="teal"
              />
              <InfoRow
                icon={MdPhone}
                label="Phone Number"
                value={user.phone || "Not provided"}
                color="blue"
              />
              <InfoRow
                icon={MdCalendarToday}
                label="Account Created"
                value={formatDate(user.createdAt)}
                color="purple"
              />
              <InfoRow
                icon={MdCalendarToday}
                label="Last Updated"
                value={formatDate(user.updatedAt)}
                color="gray"
              />
              <Flex align="flex-start" gap={3}>
                <Flex
                  align="center"
                  justify="center"
                  bg={isActive ? "green.100" : "red.100"}
                  color={isActive ? "green.600" : "red.600"}
                  rounded="lg"
                  p={2}
                  mt={0.5}
                >
                  {isActive ? (
                    <MdCheckCircle size={16} />
                  ) : (
                    <MdBlock size={16} />
                  )}
                </Flex>
                <Box>
                  <Text fontSize="xs" color="gray.400" fontWeight="500">
                    Account Status
                  </Text>
                  <Badge colorPalette={isActive ? "green" : "red"} size="sm">
                    {user.status}
                  </Badge>
                </Box>
              </Flex>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Hospital Info - for hospital_admin */}
        {user.role === "hospital_admin" && user.hospital && (
          <Card.Root shadow="sm" rounded="xl">
            <Card.Body py={5} px={6}>
              <Flex align="center" gap={2} mb={4}>
                <MdLocalHospital
                  size={18}
                  color="var(--chakra-colors-purple-500)"
                />
                <Heading size="sm" color="purple.700">
                  Assigned Hospital
                </Heading>
              </Flex>
              <Stack gap={4}>
                <InfoRow
                  icon={MdLocalHospital}
                  label="Hospital Name"
                  value={user.hospital.name}
                  color="purple"
                />
                <InfoRow
                  icon={MdPerson}
                  label="City"
                  value={user.hospital.city}
                  color="blue"
                />
                <Flex align="flex-start" gap={3}>
                  <Flex
                    align="center"
                    justify="center"
                    bg="purple.100"
                    color="purple.600"
                    rounded="lg"
                    p={2}
                    mt={0.5}
                  >
                    <MdCheckCircle size={16} />
                  </Flex>
                  <Box>
                    <Text fontSize="xs" color="gray.400" fontWeight="500">
                      Hospital Status
                    </Text>
                    <Badge
                      colorPalette={
                        user.hospital.status === "active" ? "green" : "red"
                      }
                      size="sm"
                    >
                      {user.hospital.status}
                    </Badge>
                  </Box>
                </Flex>
                <InfoRow
                  icon={MdMedicalServices}
                  label="Total Doctors"
                  value={user.hospital.totalDoctors}
                  color="teal"
                />
              </Stack>
            </Card.Body>
          </Card.Root>
        )}

        {/* Activity Stats - for patient */}
        {user.role === "patient" && user.activity && (
          <Card.Root shadow="sm" rounded="xl">
            <Card.Body py={5} px={6}>
              <Flex align="center" gap={2} mb={4}>
                <MdEventNote size={18} color="var(--chakra-colors-teal-500)" />
                <Heading size="sm" color="teal.700">
                  Patient Activity
                </Heading>
              </Flex>
              <Grid templateColumns="1fr 1fr" gap={3}>
                <StatCard
                  icon={MdEventNote}
                  label="Total Appointments"
                  value={user.activity.totalAppointments}
                  color="teal"
                />
                <StatCard
                  icon={MdCheckCircle}
                  label="Completed"
                  value={user.activity.completedAppointments}
                  color="green"
                />
                <StatCard
                  icon={MdCalendarToday}
                  label="Upcoming"
                  value={user.activity.upcomingAppointments}
                  color="blue"
                />
                <StatCard
                  icon={MdDescription}
                  label="Prescriptions"
                  value={user.activity.totalPrescriptions}
                  color="purple"
                />
                <StatCard
                  icon={MdStar}
                  label="Reviews"
                  value={user.activity.totalReviews}
                  color="orange"
                />
              </Grid>
            </Card.Body>
          </Card.Root>
        )}

        {/* Super Admin - no extra info card, show a placeholder */}
        {user.role === "super_admin" && (
          <Card.Root shadow="sm" rounded="xl">
            <Card.Body py={5} px={6}>
              <Flex align="center" gap={2} mb={4}>
                <MdAdminPanelSettings
                  size={18}
                  color="var(--chakra-colors-red-500)"
                />
                <Heading size="sm" color="red.700">
                  Admin Privileges
                </Heading>
              </Flex>
              <Box bg="red.50" p={4} rounded="lg">
                <Text fontSize="sm" color="red.600" fontWeight="500">
                  This account has full platform access including user
                  management, hospital management, and system configuration.
                </Text>
              </Box>
            </Card.Body>
          </Card.Root>
        )}
      </Grid>
    </Stack>
  );
}
