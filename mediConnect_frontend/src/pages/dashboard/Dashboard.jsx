
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
} from '@chakra-ui/react'
import * as dashboardSlice from '@/features/dashboard/dashboardSlice'

const STAT_CARDS = [
  { label: 'Total Appointments', value: '128', color: 'blue' },
  { label: 'Pending', value: '14', color: 'orange' },
  { label: 'Completed', value: '102', color: 'green' },
  { label: 'Cancelled', value: '12', color: 'red' },
]

const MOCK_APPOINTMENTS = [
  { id: 1, patient: 'Alice Johnson', doctor: 'Dr. Smith', date: '2026-04-15', status: 'Confirmed' },
  { id: 2, patient: 'Bob Williams', doctor: 'Dr. Patel', date: '2026-04-16', status: 'Pending' },
  { id: 3, patient: 'Carol Davis', doctor: 'Dr. Lee', date: '2026-04-17', status: 'Cancelled' },
]

const STATUS_COLOR = {
  Confirmed: 'green',
  Pending: 'orange',
  Cancelled: 'red',
}

export default function Dashboard() {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(dashboardSlice.fetchDashboardRequest())
  }, [dispatch])

  if (loading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="primary.500" />
      </Center>
    )
  }

  return (
    <Stack gap={8} p={6}>
      <Heading size="lg">Dashboard Overview</Heading>

      {/* ── Stat Cards ── */}
      <Grid templateColumns="repeat(auto-fit, minmax(180px, 1fr))" gap={4}>
        {STAT_CARDS.map((stat) => (
          <Card.Root key={stat.label} shadow="sm" rounded="xl">
            <Card.Body gap={2}>
              <Text fontSize="sm" color="gray.500">
                {stat.label}
              </Text>
              <Heading size="2xl" color={`${stat.color}.500`}>
                {stat.value}
              </Heading>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      {/* ── Upcoming Appointments Table ── */}
      <Box>
        <Heading size="md" mb={4}>
          Upcoming Appointments
        </Heading>
        <Box overflowX="auto" rounded="xl" shadow="sm" borderWidth="1px">
          <Table.Root>
            <Table.Header>
              <Table.Row bg="gray.50" _dark={{ bg: 'gray.700' }}>
                <Table.ColumnHeader>#</Table.ColumnHeader>
                <Table.ColumnHeader>Patient</Table.ColumnHeader>
                <Table.ColumnHeader>Doctor</Table.ColumnHeader>
                <Table.ColumnHeader>Date</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {MOCK_APPOINTMENTS.map((appt) => (
                <Table.Row key={appt.id}>
                  <Table.Cell>{appt.id}</Table.Cell>
                  <Table.Cell>{appt.patient}</Table.Cell>
                  <Table.Cell>{appt.doctor}</Table.Cell>
                  <Table.Cell>{appt.date}</Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={STATUS_COLOR[appt.status]}>
                      {appt.status}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
    </Stack>
  )
}
