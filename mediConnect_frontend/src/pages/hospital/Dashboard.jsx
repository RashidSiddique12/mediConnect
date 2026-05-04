import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Text,
  Stack,
  Badge,
  Table,
  Card,
  Flex,
  Button,
  Avatar,
} from "@chakra-ui/react";
import {
  MdPerson,
  MdEventNote,
  MdPeople,
  MdCalendarToday,
  MdSchedule,
  MdCheckCircle,
  MdArrowForward,
} from "react-icons/md";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import * as dashboardSlice from "@/features/dashboard/dashboardSlice";

const STATUS_COLOR = {
  booked: "green",
  pending: "orange",
  completed: "teal",
  cancelled: "red",
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function HospitalDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading } = useSelector((s) => s.dashboard);
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    dispatch(dashboardSlice.fetchDashboardRequest());
  }, [dispatch]);

  if (loading) return <Loader />;

  const stats = data?.stats || {};
  const appointments = data?.recentAppointments || [];
  const doctors = data?.doctors || [];
  const hospitalName = data?.hospital?.name || user?.name || "Hospital";

  const STAT_CARDS = [
    {
      label: "Total Doctors",
      value: stats.totalDoctors ?? 0,
      icon: MdPerson,
      color: "blue",
    },
    {
      label: "Today's Appointments",
      value: stats.todayAppointments ?? 0,
      icon: MdCalendarToday,
      color: "teal",
    },
    {
      label: "Pending",
      value: stats.pendingAppointments ?? 0,
      icon: MdEventNote,
      color: "orange",
    },
    {
      label: "Total Patients",
      value: stats.totalPatients ?? 0,
      icon: MdPeople,
      color: "purple",
    },
  ];

  return (
    <Stack gap={8}>
      <PageHeader
        title={`${getGreeting()}, ${hospitalName}`}
        subtitle="Here's an overview of your hospital today"
        actions={[
          <Button
            key="add"
            size="sm"
            colorPalette="teal"
            onClick={() => navigate("/hospital/doctors/add")}
          >
            + Add Doctor
          </Button>,
          <Button
            key="appts"
            size="sm"
            variant="outline"
            colorPalette="teal"
            onClick={() => navigate("/hospital/appointments")}
          >
            View All Appointments
          </Button>,
        ]}
      />

      {/* ─── Stat Cards ─── */}
      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
        {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
          <Card.Root
            key={label}
            shadow="sm"
            rounded="xl"
            borderTop="3px solid"
            borderColor={`${color}.400`}
            _hover={{ shadow: "md", transform: "translateY(-2px)" }}
            transition="all 0.2s"
          >
            <Card.Body>
              <Flex justify="space-between" align="flex-start">
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>
                    {label}
                  </Text>
                  <Text
                    fontSize="3xl"
                    fontWeight="800"
                    color={`${color}.500`}
                    lineHeight="1"
                  >
                    {value}
                  </Text>
                </Box>
                <Box
                  color={`${color}.400`}
                  bg={`${color}.50`}
                  p={2.5}
                  rounded="lg"
                >
                  <Icon size={24} />
                </Box>
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={6}>
        {/* ─── Doctors Panel ─── */}
        <Card.Root shadow="sm" rounded="xl">
          <Card.Header>
            <Flex justify="space-between" align="center">
              <Text fontWeight="700" fontSize="md">
                Our Doctors
              </Text>
              <Button
                size="xs"
                variant="ghost"
                colorPalette="teal"
                onClick={() => navigate("/hospital/doctors")}
              >
                Manage <MdArrowForward />
              </Button>
            </Flex>
          </Card.Header>
          <Card.Body pt={0}>
            {doctors.length === 0 ? (
              <EmptyState
                title="No doctors yet"
                description="Add your first doctor to get started"
                actionLabel="Add Doctor"
                onAction={() => navigate("/hospital/doctors/add")}
                icon={<MdPerson size={36} />}
                withCard={false}
                py={8}
              />
            ) : (
              <Stack gap={2}>
                {doctors.map((d) => (
                  <Flex
                    key={d.id}
                    justify="space-between"
                    align="center"
                    p={3}
                    bg="gray.50"
                    rounded="lg"
                    _hover={{ bg: "teal.50" }}
                    transition="background 0.15s"
                  >
                    <Flex align="center" gap={3}>
                      <Avatar.Root size="sm" bg="teal.500">
                        <Avatar.Fallback name={d.name} />
                      </Avatar.Root>
                      <Box>
                        <Text fontWeight="600" fontSize="sm">
                          {d.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {d.specialty}
                        </Text>
                      </Box>
                    </Flex>
                    <Box textAlign="right">
                      <Text fontSize="xs" color="gray.400">
                        Fee
                      </Text>
                      <Text fontWeight="700" fontSize="sm" color="teal.600">
                        ${d.fee}
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </Stack>
            )}
          </Card.Body>
        </Card.Root>

        {/* ─── Recent Appointments Panel ─── */}
        <Card.Root shadow="sm" rounded="xl">
          <Card.Header>
            <Flex justify="space-between" align="center">
              <Text fontWeight="700" fontSize="md">
                Recent Appointments
              </Text>
              <Button
                size="xs"
                variant="ghost"
                colorPalette="teal"
                onClick={() => navigate("/hospital/appointments")}
              >
                View All <MdArrowForward />
              </Button>
            </Flex>
          </Card.Header>
          <Card.Body pt={0}>
            {appointments.length === 0 ? (
              <EmptyState
                title="No recent appointments"
                description="Appointments will appear here once patients start booking"
                icon={<MdEventNote size={36} />}
                withCard={false}
                py={8}
              />
            ) : (
              <Box overflowX="auto">
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Patient</Table.ColumnHeader>
                      <Table.ColumnHeader>Doctor</Table.ColumnHeader>
                      <Table.ColumnHeader>Time</Table.ColumnHeader>
                      <Table.ColumnHeader>Status</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {appointments.map((a) => (
                      <Table.Row
                        key={a.id}
                        _hover={{ bg: "gray.50" }}
                        cursor="pointer"
                        onClick={() =>
                          navigate(`/hospital/appointments/${a.id}`)
                        }
                      >
                        <Table.Cell fontSize="sm">{a.patientName}</Table.Cell>
                        <Table.Cell fontSize="sm">{a.doctorName}</Table.Cell>
                        <Table.Cell fontSize="sm">{a.time}</Table.Cell>
                        <Table.Cell>
                          <Badge
                            colorPalette={STATUS_COLOR[a.status] || "gray"}
                            size="sm"
                          >
                            {a.status}
                          </Badge>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            )}
          </Card.Body>
        </Card.Root>
      </Grid>

      {/* ─── Quick Actions ─── */}
      <Card.Root shadow="sm" rounded="xl" bg="teal.700" color="white">
        <Card.Body>
          <Text fontWeight="700" fontSize="md" mb={4} color="white">
            Quick Actions
          </Text>
          <Grid templateColumns="repeat(auto-fit, minmax(130px, 1fr))" gap={3}>
            {[
              {
                label: "Add Doctor",
                path: "/hospital/doctors/add",
                icon: MdPerson,
              },
              {
                label: "Schedules",
                path: "/hospital/schedules",
                icon: MdSchedule,
              },
              {
                label: "Appointments",
                path: "/hospital/appointments",
                icon: MdEventNote,
              },
              {
                label: "Hospital Profile",
                path: "/hospital/profile",
                icon: MdCheckCircle,
              },
            ].map(({ label, path, icon: Icon }) => (
              <Button
                key={label}
                variant="outline"
                borderColor="teal.400"
                color="white"
                _hover={{ bg: "teal.600", borderColor: "teal.300" }}
                onClick={() => navigate(path)}
                flexDir="column"
                h="auto"
                py={4}
                gap={2}
              >
                <Icon size={22} />
                <Text fontSize="xs">{label}</Text>
              </Button>
            ))}
          </Grid>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
}
