import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Heading,
  Text,
  Stack,
  Badge,
  Spinner,
  Center,
  Table,
  Card,
  Flex,
  Button,
  Avatar,
} from "@chakra-ui/react";
import {
  MdLocalHospital,
  MdPerson,
  MdPeople,
  MdEventNote,
  MdTrendingUp,
  MdCheckCircle,
  MdCancel,
  MdPending,
  MdArrowForward,
  MdStar,
  MdMedicalServices,
  MdCalendarToday,
} from "react-icons/md";
import * as dashboardSlice from "@/features/dashboard/dashboardSlice";

const STATUS_COLOR = {
  confirmed: "green",
  pending: "orange",
  completed: "teal",
  cancelled: "red",
};

const STATUS_ICON = {
  confirmed: MdCheckCircle,
  pending: MdPending,
  completed: MdCheckCircle,
  cancelled: MdCancel,
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StatusDistributionBar({ appointments }) {
  const total = appointments.length;
  if (!total) return null;
  const counts = appointments.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});
  const segments = Object.entries(counts).map(([status, count]) => ({
    status,
    count,
    pct: Math.round((count / total) * 100),
  }));
  const colorMap = { confirmed: "#38A169", pending: "#DD6B20", completed: "#0b9c9c", cancelled: "#E53E3E" };

  return (
    <Box>
      <Flex h="8px" rounded="full" overflow="hidden" bg="gray.100">
        {segments.map(({ status, pct }) => (
          <Box key={status} w={`${pct}%`} bg={colorMap[status] || "gray.300"} transition="width 0.4s" />
        ))}
      </Flex>
      <Flex mt={2} gap={4} wrap="wrap">
        {segments.map(({ status, count, pct }) => (
          <Flex key={status} align="center" gap={1.5}>
            <Box w="8px" h="8px" rounded="full" bg={colorMap[status] || "gray.300"} />
            <Text fontSize="xs" color="gray.500" textTransform="capitalize">
              {status} {count} ({pct}%)
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading } = useSelector((s) => s.dashboard);
  const user = useSelector((s) => s.auth.user);
  console.log({data});

  useEffect(() => {
    dispatch(dashboardSlice.fetchDashboardRequest());
  }, [dispatch]);

  if (loading)
    return (
      <Center h="60vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );

  const stats = data?.stats || {};
  const appointments = data?.recentAppointments || [];
  const hospitals = data?.hospitals || [];
  
  const STAT_CARDS = [
    {
      label: "Total Hospitals fsfsdf",
      value: stats.totalHospitals ?? 0,
      icon: MdLocalHospital,
      color: "teal",
      desc: "Registered on platform",
    },
    {
      label: "Total Doctors",
      value: stats.totalDoctors ?? 0,
      icon: MdPerson,
      color: "blue",
      desc: "Across all hospitals",
    },
    {
      label: "Total Patients",
      value: stats.totalPatients ?? 0,
      icon: MdPeople,
      color: "purple",
      desc: "Active patient accounts",
    },
    {
      label: "Total Appointments",
      value: stats.totalAppointments ?? 0,
      icon: MdEventNote,
      color: "orange",
      desc: "All time bookings",
    },
  ];

  const QUICK_ACTIONS = [
    {
      label: "Add Hospital",
      desc: "Register a new hospital",
      path: "/admin/hospitals",
      icon: MdLocalHospital,
      color: "teal",
    },
    {
      label: "Manage Users",
      desc: "View & manage accounts",
      path: "/admin/users",
      icon: MdPeople,
      color: "blue",
    },
    {
      label: "Specialties",
      desc: "Configure medical fields",
      path: "/admin/specialties",
      icon: MdMedicalServices,
      color: "purple",
    },
    {
      label: "Review Queue",
      desc: "Moderate patient reviews",
      path: "/admin/reviews",
      icon: MdStar,
      color: "orange",
    },
  ];

  return (
    <Stack gap={6}>
      {/* Welcome Banner */}
      <Card.Root
        shadow="sm"
        rounded="xl"
        bg="linear-gradient(135deg, var(--chakra-colors-brand-600) 0%, var(--chakra-colors-brand-800) 100%)"
        color="white"
        overflow="hidden"
        position="relative"
      >
        <Box
          position="absolute"
          right="-20px"
          top="-20px"
          w="140px"
          h="140px"
          bg="whiteAlpha.100"
          rounded="full"
        />
        <Box
          position="absolute"
          right="60px"
          bottom="-30px"
          w="100px"
          h="100px"
          bg="whiteAlpha.50"
          rounded="full"
        />
        <Card.Body py={6}>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Box>
              <Text fontSize="sm" color="brand.200" mb={1}>
                {formatDate()}
              </Text>
              <Heading size="lg" color="white" mb={1}>
                {getGreeting()}, {user?.name?.split(" ")[0] || "Admin"} 👋
              </Heading>
              <Text color="brand.200" fontSize="sm">
                Here&apos;s what&apos;s happening across your platform today.
              </Text>
            </Box>
            <Badge
              bg="whiteAlpha.200"
              color="white"
              px={3}
              py={1.5}
              rounded="full"
              fontSize="xs"
              fontWeight="600"
            >
              Super Admin
            </Badge>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* Stat Cards */}
      <Grid templateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={4}>
        {STAT_CARDS.map(({ label, value, icon: Icon, color, desc }) => (
          <Card.Root
            key={label}
            shadow="sm"
            rounded="xl"
            _hover={{ shadow: "md", transform: "translateY(-2px)" }}
            transition="all 0.2s"
            cursor="default"
          >
            <Card.Body>
              <Flex justify="space-between" align="flex-start" mb={3}>
                <Box
                  color={`${color}.500`}
                  bg={`${color}.50`}
                  p={2.5}
                  rounded="xl"
                >
                  <Icon size={22} />
                </Box>
              </Flex>
              <Heading size="2xl" color="gray.800" mb={1}>
                {value}
              </Heading>
              <Text fontSize="sm" fontWeight="600" color="gray.700">
                {label}
              </Text>
              <Text fontSize="xs" color="gray.400" mt={0.5}>
                {desc}
              </Text>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      {/* Hospitals + Appointments Grid */}
      <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={6}>
        {/* Registered Hospitals */}
        <Card.Root shadow="sm" rounded="xl">
          <Card.Header pb={2}>
            <Flex justify="space-between" align="center">
              <Flex align="center" gap={2}>
                <Box color="teal.500">
                  <MdLocalHospital size={20} />
                </Box>
                <Heading size="md">Hospitals</Heading>
                <Badge colorPalette="teal" rounded="full" size="sm">
                  {hospitals.length}
                </Badge>
              </Flex>
              <Button
                size="xs"
                variant="ghost"
                colorPalette="teal"
                onClick={() => navigate("/admin/hospitals")}
              >
                View All <MdArrowForward />
              </Button>
            </Flex>
          </Card.Header>
          <Card.Body pt={0}>
            {hospitals.length === 0 ? (
              <Box textAlign="center" py={8} color="gray.400">
                <MdLocalHospital size={36} style={{ margin: "0 auto 8px", opacity: 0.5 }} />
                <Text fontSize="sm">No hospitals registered yet</Text>
                <Button
                  size="sm"
                  colorPalette="teal"
                  variant="outline"
                  mt={3}
                  onClick={() => navigate("/admin/hospitals")}
                >
                  Add First Hospital
                </Button>
              </Box>
            ) : (
              <Stack gap={2}>
                {hospitals.slice(0, 5).map((h) => (
                  <Flex
                    key={h.id}
                    justify="space-between"
                    align="center"
                    p={3}
                    bg="gray.50"
                    rounded="lg"
                    _hover={{ bg: "brand.50" }}
                    transition="background 0.15s"
                    cursor="pointer"
                    onClick={() => navigate("/admin/hospitals")}
                  >
                    <Flex align="center" gap={3}>
                      <Avatar.Root size="sm" bg="teal.100">
                        <Avatar.Fallback color="teal.600" name={h.name} />
                      </Avatar.Root>
                      <Box>
                        <Text fontWeight="600" fontSize="sm">
                          {h.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {h.city}
                        </Text>
                      </Box>
                    </Flex>
                    <Flex gap={4} align="center">
                      <Box textAlign="center">
                        <Text fontSize="xs" color="gray.400">
                          Doctors
                        </Text>
                        <Text fontWeight="700" fontSize="sm" color="blue.500">
                          {h.totalDoctors}
                        </Text>
                      </Box>
                      <Flex align="center" gap={1} bg="orange.50" px={2} py={1} rounded="md">
                        <MdStar color="#F6AD55" size={12} />
                        <Text fontWeight="700" fontSize="xs" color="orange.500">
                          {h.rating}
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                ))}
              </Stack>
            )}
          </Card.Body>
        </Card.Root>

        {/* Recent Appointments */}
        <Card.Root shadow="sm" rounded="xl">
          <Card.Header pb={2}>
            <Flex justify="space-between" align="center">
              <Flex align="center" gap={2}>
                <Box color="orange.500">
                  <MdCalendarToday size={18} />
                </Box>
                <Heading size="md">Recent Appointments</Heading>
                <Badge colorPalette="orange" rounded="full" size="sm">
                  {appointments.length}
                </Badge>
              </Flex>
            </Flex>
          </Card.Header>
          <Card.Body pt={0}>
            {appointments.length === 0 ? (
              <Box textAlign="center" py={8} color="gray.400">
                <MdEventNote size={36} style={{ margin: "0 auto 8px", opacity: 0.5 }} />
                <Text fontSize="sm">No recent appointments</Text>
              </Box>
            ) : (
              <Stack gap={3}>
                {/* Status Distribution */}
                <StatusDistributionBar appointments={appointments} />

                <Box overflowX="auto">
                  <Table.Root size="sm">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>Patient</Table.ColumnHeader>
                        <Table.ColumnHeader>Doctor</Table.ColumnHeader>
                        <Table.ColumnHeader>Date</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="right">Status</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {appointments.slice(0, 6).map((a) => {
                        const StatusIcon = STATUS_ICON[a.status] || MdPending;
                        return (
                          <Table.Row key={a.id} _hover={{ bg: "gray.50" }}>
                            <Table.Cell>
                              <Flex align="center" gap={2}>
                                <Avatar.Root size="xs" bg="purple.100">
                                  <Avatar.Fallback color="purple.600" name={a.patientName} />
                                </Avatar.Root>
                                <Text fontSize="sm">{a.patientName}</Text>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell>
                              <Text fontSize="sm" color="gray.600">{a.doctorName}</Text>
                            </Table.Cell>
                            <Table.Cell>
                              <Text fontSize="sm" color="gray.500">{a.date}</Text>
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                              <Badge
                                colorPalette={STATUS_COLOR[a.status] || "gray"}
                                size="sm"
                                display="inline-flex"
                                alignItems="center"
                                gap={1}
                              >
                                <StatusIcon size={12} />
                                {a.status}
                              </Badge>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table.Root>
                </Box>
              </Stack>
            )}
          </Card.Body>
        </Card.Root>
      </Grid>

      {/* Quick Actions */}
      <Box>
        <Heading size="md" mb={3} color="gray.700">
          Quick Actions
        </Heading>
        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
          {QUICK_ACTIONS.map(({ label, desc, path, icon: Icon, color }) => (
            <Card.Root
              key={label}
              shadow="sm"
              rounded="xl"
              cursor="pointer"
              onClick={() => navigate(path)}
              _hover={{ shadow: "md", transform: "translateY(-2px)", borderColor: `${color}.300` }}
              transition="all 0.2s"
              borderWidth="1px"
              borderColor="gray.100"
            >
              <Card.Body>
                <Box color={`${color}.500`} bg={`${color}.50`} p={2.5} rounded="xl" w="fit-content" mb={3}>
                  <Icon size={20} />
                </Box>
                <Text fontWeight="700" fontSize="sm" color="gray.800" mb={0.5}>
                  {label}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {desc}
                </Text>
                <Flex align="center" gap={1} mt={3} color={`${color}.500`} fontSize="xs" fontWeight="600">
                  Go to {label} <MdArrowForward size={14} />
                </Flex>
              </Card.Body>
            </Card.Root>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
}
