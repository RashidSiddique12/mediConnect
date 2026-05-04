import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Heading,
  Text,
  Stack,
  Card,
  Flex,
  Button,
  Badge,
  Avatar,
} from "@chakra-ui/react";
import {
  MdSearch,
  MdCalendarToday,
  MdDescription,
  MdStar,
  MdLocalHospital,
  MdPerson,
  MdArrowForward,
  MdAccessTime,
  MdUploadFile,
} from "react-icons/md";
import { FaHeartbeat } from "react-icons/fa";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import * as dashboardSlice from "@/features/dashboard/dashboardSlice";

const STATUS_COLOR = {
  confirmed: "green",
  pending: "orange",
  completed: "teal",
  cancelled: "red",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function PatientHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector((s) => s.dashboard);
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    dispatch(dashboardSlice.fetchDashboardRequest());
  }, [dispatch]);

  if (loading) return <Loader />;

  const stats = data?.stats || {};
  const appointments = data?.appointments || [];

  const STAT_CARDS = [
    {
      label: "Upcoming",
      value: stats.upcomingAppointments ?? 0,
      icon: MdCalendarToday,
      color: "teal",
      to: "/patient/appointments",
    },
    {
      label: "Completed",
      value: stats.completedAppointments ?? 0,
      icon: FaHeartbeat,
      color: "green",
      to: "/patient/appointments",
    },
    {
      label: "Prescriptions",
      value: stats.prescriptions ?? 0,
      icon: MdDescription,
      color: "blue",
      to: "/patient/prescriptions",
    },
    {
      label: "Reviews Given",
      value: stats.reviews ?? 0,
      icon: MdStar,
      color: "orange",
      to: "/patient/appointments",
    },
  ];

  const QUICK_ACTIONS = [
    {
      label: "Find Hospitals",
      path: "/patient/hospitals",
      icon: MdLocalHospital,
      color: "teal",
    },
    {
      label: "Find Doctors",
      path: "/patient/doctors",
      icon: MdPerson,
      color: "blue",
    },
    {
      label: "Appointments",
      path: "/patient/appointments",
      icon: MdCalendarToday,
      color: "orange",
    },
    {
      label: "Prescriptions",
      path: "/patient/prescriptions",
      icon: MdDescription,
      color: "purple",
    },
    {
      label: "History",
      path: "/patient/appointments/history",
      icon: MdAccessTime,
      color: "green",
    },
    {
      label: "Upload Docs",
      path: "/patient/documents/upload",
      icon: MdUploadFile,
      color: "red",
    },
  ];

  return (
    <Stack gap={{ base: 6, md: 8 }}>
      {/* Welcome Banner */}
      <Card.Root
        shadow="md"
        rounded="2xl"
        overflow="hidden"
        bgGradient="to-br"
        gradientFrom="teal.600"
        gradientTo="teal.800"
        color="white"
      >
        <Card.Body p={{ base: 5, md: 8 }}>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Box>
              <Text opacity={0.85} fontSize="sm" mb={1}>
                Welcome back,
              </Text>
              <Heading size={{ base: "lg", md: "xl" }} color="white">
                {user?.name || "Patient"} 👋
              </Heading>
              <Text opacity={0.7} mt={2} fontSize={{ base: "sm", md: "md" }}>
                Your health journey, simplified.
              </Text>
            </Box>
            <Flex gap={3} wrap="wrap">
              <Button
                bg="white"
                color="teal.700"
                _hover={{ bg: "teal.50", transform: "translateY(-1px)" }}
                transition="all 0.2s"
                size={{ base: "sm", md: "md" }}
                onClick={() => navigate("/patient/doctors")}
              >
                <MdSearch /> Find Doctor
              </Button>
              <Button
                variant="outline"
                borderColor="whiteAlpha.600"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                size={{ base: "sm", md: "md" }}
                onClick={() => navigate("/patient/appointments")}
              >
                My Appointments
              </Button>
            </Flex>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* Stats */}
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
        gap={{ base: 3, md: 4 }}
      >
        {STAT_CARDS.map(({ label, value, icon: Icon, color, to }) => (
          <Card.Root
            key={label}
            shadow="sm"
            rounded="xl"
            cursor="pointer"
            _hover={{ shadow: "lg", transform: "translateY(-3px)" }}
            transition="all 0.2s"
            onClick={() => navigate(to)}
            borderTop="3px solid"
            borderColor={`${color}.400`}
          >
            <Card.Body p={{ base: 3, md: 5 }}>
              <Flex justify="space-between" align="flex-start">
                <Box>
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                    {label}
                  </Text>
                  <Heading
                    size={{ base: "xl", md: "2xl" }}
                    color={`${color}.600`}
                    mt={1}
                  >
                    {value}
                  </Heading>
                </Box>
                <Box
                  color={`${color}.400`}
                  bg={`${color}.50`}
                  p={2}
                  rounded="lg"
                >
                  <Icon size={22} />
                </Box>
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Box>
        <Heading size="md" mb={4}>
          Quick Actions
        </Heading>
        <Grid
          templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(6, 1fr)" }}
          gap={3}
        >
          {QUICK_ACTIONS.map(({ label, path, icon: Icon, color }) => (
            <Button
              key={label}
              variant="outline"
              colorPalette={color}
              h="auto"
              py={{ base: 4, md: 5 }}
              flexDir="column"
              gap={2}
              onClick={() => navigate(path)}
              rounded="xl"
              _hover={{
                bg: `${color}.50`,
                transform: "translateY(-2px)",
                shadow: "sm",
              }}
              transition="all 0.2s"
            >
              <Icon size={24} />
              <Text fontSize="xs" fontWeight="600">
                {label}
              </Text>
            </Button>
          ))}
        </Grid>
      </Box>

      {/* Upcoming appointments */}
      <Box>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Upcoming Appointments</Heading>
          <Button
            size="sm"
            variant="ghost"
            colorPalette="teal"
            onClick={() => navigate("/patient/appointments")}
          >
            View All <MdArrowForward />
          </Button>
        </Flex>

        {appointments.length === 0 ? (
          <EmptyState
            icon={<MdCalendarToday size={36} />}
            title="No upcoming appointments"
            description="Find a doctor and book your first appointment"
            actionLabel="Find a Doctor"
            actionIcon={<MdSearch />}
            onAction={() => navigate("/patient/doctors")}
          />
        ) : (
          <Stack gap={3}>
            {appointments.slice(0, 5).map((a) => (
              <Card.Root
                key={a._id || a.id}
                shadow="sm"
                rounded="xl"
                borderLeft="4px solid"
                borderColor={`${STATUS_COLOR[a.status] || "gray"}.400`}
                _hover={{ shadow: "md" }}
                transition="all 0.2s"
                cursor="pointer"
                onClick={() => navigate("/patient/appointments")}
              >
                <Card.Body py={3} px={4}>
                  <Flex
                    justify="space-between"
                    align="center"
                    wrap="wrap"
                    gap={3}
                  >
                    <Flex align="center" gap={3}>
                      <Avatar.Root size="sm" bg="teal.500">
                        <Avatar.Fallback
                          name={a.doctorName || a.doctorId?.name}
                        />
                      </Avatar.Root>
                      <Box>
                        <Text fontWeight="700" fontSize="sm">
                          {a.doctorName || a.doctorId?.name || "Doctor"}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {a.specialty ||
                            a.doctorId?.specialtyId?.name ||
                            "General"}
                        </Text>
                      </Box>
                    </Flex>
                    <Flex align="center" gap={3}>
                      <Box textAlign="right">
                        <Text fontSize="sm" fontWeight="600">
                          {formatDate(a.date || a.appointmentDate)}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {a.time || a.timeSlot}
                        </Text>
                      </Box>
                      <Badge
                        colorPalette={STATUS_COLOR[a.status] || "gray"}
                        size="sm"
                        textTransform="capitalize"
                      >
                        {a.status}
                      </Badge>
                    </Flex>
                  </Flex>
                </Card.Body>
              </Card.Root>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
