/**
 * @author Healthcare Appointment App
 * @description Super Admin Dashboard — system-wide analytics and quick overview.
 * JIRA: HAA-ADM-001 #comment Admin dashboard UI
 */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box, Grid, Heading, Text, Stack, Badge, Spinner, Center, Table, Card, Flex, Button,
} from '@chakra-ui/react'
import {
  MdLocalHospital, MdPerson, MdPeople, MdEventNote, MdTrendingUp, MdCheckCircle, MdCancel, MdPending,
} from 'react-icons/md'
import { fetchDashboardRequest } from '@/pages/dashboard/dashboardSlice'

const STATUS_COLOR = { confirmed: 'green', pending: 'orange', completed: 'teal', cancelled: 'red' }

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data, loading } = useSelector((s) => s.dashboard)

  useEffect(() => { dispatch(fetchDashboardRequest()) }, [dispatch])

  if (loading) return (
    <Center h="60vh"><Spinner size="xl" color="brand.500" /></Center>
  )

  const stats = data?.stats || {}
  const appointments = data?.recentAppointments || []
  const hospitals = data?.hospitals || []

  const STAT_CARDS = [
    { label: 'Total Hospitals',    value: stats.totalHospitals    ?? 0, icon: MdLocalHospital, color: 'teal'   },
    { label: 'Total Doctors',      value: stats.totalDoctors      ?? 0, icon: MdPerson,        color: 'blue'   },
    { label: 'Total Patients',     value: stats.totalPatients     ?? 0, icon: MdPeople,        color: 'purple' },
    { label: 'Total Appointments', value: stats.totalAppointments ?? 0, icon: MdEventNote,     color: 'orange' },
  ]

  return (
    <Stack gap={8}>
      <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
        <Box>
          <Heading size="lg" color="gray.800">System Dashboard</Heading>
          <Text color="gray.500" fontSize="sm">Platform-wide analytics overview</Text>
        </Box>
        <Badge colorPalette="teal" size="lg" px={3} py={1}>Super Admin Control Panel</Badge>
      </Flex>

      {/* Stat Cards */}
      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
        {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
          <Card.Root key={label} shadow="sm" rounded="xl" borderTop="3px solid" borderColor={`${color}.400`}>
            <Card.Body>
              <Flex justify="space-between" align="flex-start">
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>{label}</Text>
                  <Heading size="2xl" color={`${color}.500`}>{value}</Heading>
                </Box>
                <Box color={`${color}.400`} fontSize="2xl" bg={`${color}.50`} p={2} rounded="lg">
                  <Icon size={24} />
                </Box>
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      {/* Hospitals + Appointments Grid */}
      <Grid templateColumns={{ base: '1fr', xl: '1fr 1fr' }} gap={6}>
        {/* Registered Hospitals */}
        <Card.Root shadow="sm" rounded="xl">
          <Card.Header>
            <Flex justify="space-between" align="center">
              <Heading size="md">Registered Hospitals</Heading>
              <Button size="xs" variant="ghost" colorPalette="teal" onClick={() => navigate('/admin/hospitals')}>
                View All
              </Button>
            </Flex>
          </Card.Header>
          <Card.Body pt={0}>
            <Stack gap={3}>
              {hospitals.map((h) => (
                <Flex key={h.id} justify="space-between" align="center" p={3} bg="gray.50" rounded="lg">
                  <Box>
                    <Text fontWeight="600" fontSize="sm">{h.name}</Text>
                    <Text fontSize="xs" color="gray.500">{h.city}</Text>
                  </Box>
                  <Flex gap={4} align="center">
                    <Box textAlign="center">
                      <Text fontSize="xs" color="gray.400">Doctors</Text>
                      <Text fontWeight="700" fontSize="sm" color="blue.500">{h.totalDoctors}</Text>
                    </Box>
                    <Box textAlign="center">
                      <Text fontSize="xs" color="gray.400">Rating</Text>
                      <Text fontWeight="700" fontSize="sm" color="orange.500">⭐ {h.rating}</Text>
                    </Box>
                  </Flex>
                </Flex>
              ))}
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Recent Appointments */}
        <Card.Root shadow="sm" rounded="xl">
          <Card.Header>
            <Heading size="md">Recent Appointments</Heading>
          </Card.Header>
          <Card.Body pt={0}>
            <Box overflowX="auto">
              <Table.Root size="sm">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Patient</Table.ColumnHeader>
                    <Table.ColumnHeader>Doctor</Table.ColumnHeader>
                    <Table.ColumnHeader>Date</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {appointments.map((a) => (
                    <Table.Row key={a.id}>
                      <Table.Cell>{a.patientName}</Table.Cell>
                      <Table.Cell>{a.doctorName}</Table.Cell>
                      <Table.Cell>{a.date}</Table.Cell>
                      <Table.Cell>
                        <Badge colorPalette={STATUS_COLOR[a.status] || 'gray'} size="sm">
                          {a.status}
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Card.Body>
        </Card.Root>
      </Grid>

      {/* Quick Actions */}
      <Card.Root shadow="sm" rounded="xl" bg="brand.700" color="white">
        <Card.Body>
          <Heading size="md" mb={4} color="white">Quick Actions</Heading>
          <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={3}>
            {[
              { label: 'Add Hospital',   path: '/admin/hospitals',   icon: MdLocalHospital },
              { label: 'Manage Users',   path: '/admin/users',       icon: MdPeople },
              { label: 'Specialties',    path: '/admin/specialties', icon: MdTrendingUp },
              { label: 'Review Queue',   path: '/admin/reviews',     icon: MdCheckCircle },
            ].map(({ label, path, icon: Icon }) => (
              <Button
                key={label}
                variant="outline"
                borderColor="brand.300"
                color="white"
                _hover={{ bg: 'brand.600' }}
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
  )
}
