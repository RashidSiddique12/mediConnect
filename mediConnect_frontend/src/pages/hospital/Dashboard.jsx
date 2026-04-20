/**
 * @author Healthcare Appointment App
 * @description Hospital Admin Dashboard — hospital-specific stats and overview.
 * JIRA: HAA-HOSP-001 #comment Hospital dashboard UI
 */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box, Grid, Heading, Text, Stack, Badge, Spinner, Center, Table, Card, Flex, Button, Avatar,
} from '@chakra-ui/react'
import {
  MdPerson, MdEventNote, MdPeople, MdCalendarToday, MdSchedule, MdCheckCircle, MdArrowForward,
} from 'react-icons/md'
import { fetchDashboardRequest } from '@/pages/dashboard/dashboardSlice'

const STATUS_COLOR = { confirmed: 'green', pending: 'orange', completed: 'teal', cancelled: 'red' }

export default function HospitalDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data, loading } = useSelector((s) => s.dashboard)
  const user = useSelector((s) => s.auth.user)

  useEffect(() => { dispatch(fetchDashboardRequest()) }, [dispatch])

  if (loading) return <Center h="60vh"><Spinner size="xl" color="brand.500" /></Center>

  const stats = data?.stats || {}
  const appointments = data?.recentAppointments || []
  const doctors = data?.doctors || []

  const STAT_CARDS = [
    { label: 'Total Doctors',        value: stats.totalDoctors        ?? 0, icon: MdPerson,        color: 'blue'   },
    { label: "Today's Appointments", value: stats.todayAppointments   ?? 0, icon: MdCalendarToday, color: 'teal'   },
    { label: 'Pending',              value: stats.pendingAppointments ?? 0, icon: MdEventNote,     color: 'orange' },
    { label: 'Total Patients',       value: stats.totalPatients       ?? 0, icon: MdPeople,        color: 'purple' },
  ]

  return (
    <Stack gap={8}>
      <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
        <Box>
          <Heading size="lg" color="gray.800">Hospital Dashboard</Heading>
          <Text color="gray.500" fontSize="sm">{user?.hospitalName || 'City General Hospital'}</Text>
        </Box>
        <Flex gap={2}>
          <Button size="sm" colorPalette="teal" onClick={() => navigate('/hospital/doctors/add')}>
            + Add Doctor
          </Button>
          <Button size="sm" variant="outline" colorPalette="teal" onClick={() => navigate('/hospital/appointments')}>
            View All Appointments
          </Button>
        </Flex>
      </Flex>

      {/* Stat Cards */}
      <Grid templateColumns="repeat(auto-fit, minmax(180px, 1fr))" gap={4}>
        {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
          <Card.Root key={label} shadow="sm" rounded="xl" borderTop="3px solid" borderColor={`${color}.400`}>
            <Card.Body>
              <Flex justify="space-between" align="flex-start">
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>{label}</Text>
                  <Heading size="2xl" color={`${color}.500`}>{value}</Heading>
                </Box>
                <Box color={`${color}.400`} bg={`${color}.50`} p={2} rounded="lg" fontSize="2xl">
                  <Icon size={24} />
                </Box>
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      <Grid templateColumns={{ base: '1fr', xl: '1fr 1fr' }} gap={6}>
        {/* Doctors on duty */}
        <Card.Root shadow="sm" rounded="xl">
          <Card.Header>
            <Flex justify="space-between" align="center">
              <Heading size="md">Our Doctors</Heading>
              <Button size="xs" variant="ghost" colorPalette="teal" onClick={() => navigate('/hospital/doctors')}>
                Manage <MdArrowForward />
              </Button>
            </Flex>
          </Card.Header>
          <Card.Body pt={0}>
            <Stack gap={3}>
              {doctors.map((d) => (
                <Flex key={d.id} justify="space-between" align="center" p={3} bg="gray.50" rounded="lg">
                  <Flex align="center" gap={3}>
                    <Avatar.Root size="sm" bg="teal.500">
                      <Avatar.Fallback name={d.name} />
                    </Avatar.Root>
                    <Box>
                      <Text fontWeight="600" fontSize="sm">{d.name}</Text>
                      <Text fontSize="xs" color="gray.500">{d.specialty}</Text>
                    </Box>
                  </Flex>
                  <Box textAlign="right">
                    <Text fontSize="xs" color="gray.400">Fee</Text>
                    <Text fontWeight="700" fontSize="sm" color="teal.600">${d.fee}</Text>
                  </Box>
                </Flex>
              ))}
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Recent Appointments */}
        <Card.Root shadow="sm" rounded="xl">
          <Card.Header>
            <Flex justify="space-between" align="center">
              <Heading size="md">Recent Appointments</Heading>
              <Button size="xs" variant="ghost" colorPalette="teal" onClick={() => navigate('/hospital/appointments')}>
                View All <MdArrowForward />
              </Button>
            </Flex>
          </Card.Header>
          <Card.Body pt={0}>
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
                    <Table.Row key={a.id}>
                      <Table.Cell fontSize="sm">{a.patientName}</Table.Cell>
                      <Table.Cell fontSize="sm">{a.doctorName}</Table.Cell>
                      <Table.Cell fontSize="sm">{a.time}</Table.Cell>
                      <Table.Cell>
                        <Badge colorPalette={STATUS_COLOR[a.status] || 'gray'} size="sm">{a.status}</Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Card.Body>
        </Card.Root>
      </Grid>

      {/* Quick nav */}
      <Card.Root shadow="sm" rounded="xl" bg="teal.700" color="white">
        <Card.Body>
          <Heading size="md" mb={4} color="white">Quick Actions</Heading>
          <Grid templateColumns="repeat(auto-fit, minmax(130px, 1fr))" gap={3}>
            {[
              { label: 'Add Doctor', path: '/hospital/doctors/add', icon: MdPerson },
              { label: 'Schedules', path: '/hospital/schedules', icon: MdSchedule },
              { label: 'Appointments', path: '/hospital/appointments', icon: MdEventNote },
              { label: 'Hospital Profile', path: '/hospital/profile', icon: MdCheckCircle },
            ].map(({ label, path, icon: Icon }) => (
              <Button key={label} variant="outline" borderColor="teal.300" color="white"
                _hover={{ bg: 'teal.600' }} onClick={() => navigate(path)}
                flexDir="column" h="auto" py={4} gap={2}
              >
                <Icon size={22} />
                <Text fontSize="xs">{label}</Text>
              </Button>
            ))}
          </Grid>
        </Card.Body>
      </Card.Root>
    </Stack>
  )
}
