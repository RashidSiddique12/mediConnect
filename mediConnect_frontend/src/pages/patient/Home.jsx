import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box, Grid, Heading, Text, Stack, Spinner, Center, Card, Flex, Button, Badge, Avatar,
} from '@chakra-ui/react'
import {
  MdSearch, MdCalendarToday, MdDescription, MdStar, MdLocalHospital, MdPerson, MdArrowForward,
} from 'react-icons/md'
import { FaHeartbeat } from 'react-icons/fa'
import * as dashboardSlice from '@/features/dashboard/dashboardSlice'

const STATUS_COLOR = { confirmed: 'green', pending: 'orange', completed: 'teal', cancelled: 'red' }

export default function PatientHome() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data, loading } = useSelector((s) => s.dashboard)
  const user = useSelector((s) => s.auth.user)

  useEffect(() => { dispatch(dashboardSlice.fetchDashboardRequest()) }, [dispatch])

  if (loading) return <Center h="60vh"><Spinner size="xl" color="brand.500" /></Center>

  const stats = data?.stats || {}
  const appointments = data?.appointments || []

  const STAT_CARDS = [
    { label: 'Upcoming',     value: stats.upcomingAppointments  ?? 0, icon: MdCalendarToday, color: 'teal',   to: '/patient/appointments' },
    { label: 'Completed',    value: stats.completedAppointments ?? 0, icon: FaHeartbeat,     color: 'green',  to: '/patient/appointments' },
    { label: 'Prescriptions',value: stats.prescriptions         ?? 0, icon: MdDescription,   color: 'blue',   to: '/patient/prescriptions' },
    { label: 'Reviews Given',value: stats.reviews               ?? 0, icon: MdStar,          color: 'orange', to: '/patient/appointments' },
  ]

  return (
    <Stack gap={8}>
      {/* Welcome Banner */}
      <Card.Root shadow="sm" rounded="xl" bg="teal.700" color="white" overflow="hidden">
        <Card.Body>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Box>
              <Text opacity={0.8} fontSize="sm" mb={1}>Welcome back,</Text>
              <Heading size="xl" color="white">{user?.name || 'Patient'} 👋</Heading>
              <Text opacity={0.7} mt={2}>Your health journey, simplified.</Text>
            </Box>
            <Flex gap={3}>
              <Button bg="white" color="teal.700" _hover={{ bg: 'teal.50' }} size="sm" onClick={() => navigate('/patient/doctors')}>
                <MdSearch /> Find Doctor
              </Button>
              <Button variant="outline" borderColor="white" color="white" _hover={{ bg: 'teal.600' }} size="sm"
                onClick={() => navigate('/patient/appointments')}>
                My Appointments
              </Button>
            </Flex>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* Stats */}
      <Grid templateColumns="repeat(auto-fit, minmax(160px, 1fr))" gap={4}>
        {STAT_CARDS.map(({ label, value, icon: Icon, color, to }) => (
          <Card.Root key={label} shadow="sm" rounded="xl" cursor="pointer" _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            transition="all 0.2s" onClick={() => navigate(to)} borderTop="3px solid" borderColor={`${color}.400`}>
            <Card.Body>
              <Flex justify="space-between" align="flex-start">
                <Box>
                  <Text fontSize="sm" color="gray.500">{label}</Text>
                  <Heading size="2xl" color={`${color}.500`} mt={1}>{value}</Heading>
                </Box>
                <Box color={`${color}.400`} bg={`${color}.50`} p={2} rounded="lg">
                  <Icon size={22} />
                </Box>
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Box>
        <Heading size="md" mb={4}>Quick Actions</Heading>
        <Grid templateColumns="repeat(auto-fit, minmax(160px, 1fr))" gap={3}>
          {[
            { label: 'Find Hospitals', path: '/patient/hospitals', icon: MdLocalHospital, color: 'teal' },
            { label: 'Find Doctors',   path: '/patient/doctors',   icon: MdPerson,        color: 'blue' },
            { label: 'Appointments',   path: '/patient/appointments', icon: MdCalendarToday, color: 'orange' },
            { label: 'Prescriptions',  path: '/patient/prescriptions', icon: MdDescription, color: 'purple' },
          ].map(({ label, path, icon: Icon, color }) => (
            <Button key={label} variant="outline" colorPalette={color} h="auto" py={5} flexDir="column" gap={2}
              onClick={() => navigate(path)} rounded="xl">
              <Icon size={24} />
              <Text fontSize="xs">{label}</Text>
            </Button>
          ))}
        </Grid>
      </Box>

      {/* Upcoming appointments */}
      {appointments.length > 0 && (
        <Box>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">Upcoming Appointments</Heading>
            <Button size="sm" variant="ghost" colorPalette="teal" onClick={() => navigate('/patient/appointments')}>
              View All <MdArrowForward />
            </Button>
          </Flex>
          <Stack gap={3}>
            {appointments.slice(0, 3).map((a) => (
              <Card.Root key={a.id} shadow="sm" rounded="xl" borderLeft="3px solid" borderColor={`${STATUS_COLOR[a.status] || 'gray'}.400`}>
                <Card.Body>
                  <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
                    <Flex align="center" gap={3}>
                      <Avatar.Root size="sm" bg="teal.500">
                        <Avatar.Fallback name={a.doctorName} />
                      </Avatar.Root>
                      <Box>
                        <Text fontWeight="700" fontSize="sm">{a.doctorName}</Text>
                        <Text fontSize="xs" color="gray.500">{a.specialty}</Text>
                      </Box>
                    </Flex>
                    <Flex align="center" gap={3}>
                      <Box textAlign="right">
                        <Text fontSize="sm" fontWeight="600">{a.date}</Text>
                        <Text fontSize="xs" color="gray.500">{a.time}</Text>
                      </Box>
                      <Badge colorPalette={STATUS_COLOR[a.status] || 'gray'} size="sm">{a.status}</Badge>
                    </Flex>
                  </Flex>
                </Card.Body>
              </Card.Root>
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  )
}
