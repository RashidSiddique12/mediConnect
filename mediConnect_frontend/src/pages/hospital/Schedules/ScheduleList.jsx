/**
 * @author Healthcare Appointment App
 * @description Schedule List — hospital admin views & manages doctor schedules.
 * JIRA: HAA-HOSP-006 #comment Schedule list UI
 */

import { useNavigate } from 'react-router-dom'
import {
  Box, Stack, Heading, Text, Flex, Button, Card, Grid, Badge,
} from '@chakra-ui/react'
import { MdSchedule, MdPerson, MdArrowForward } from 'react-icons/md'
import { MOCK_DOCTORS, MOCK_SCHEDULES } from '@/services/mockApi'

export default function ScheduleList() {
  const navigate = useNavigate()
  const hospitalDoctors = MOCK_DOCTORS.filter((d) => d.hospitalId === 'h-001')

  return (
    <Stack gap={6}>
      <Box>
        <Heading size="lg">Doctor Schedules</Heading>
        <Text color="gray.500" fontSize="sm">Manage availability and appointment slots</Text>
      </Box>

      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
        {hospitalDoctors.map((d) => {
          const schedules = MOCK_SCHEDULES.filter((s) => s.doctorId === d.id)
          return (
            <Card.Root key={d.id} shadow="sm" rounded="xl" _hover={{ shadow: 'md' }} transition="all 0.2s">
              <Card.Body>
                <Flex justify="space-between" align="flex-start" mb={3}>
                  <Flex align="center" gap={2}>
                    <Box color="teal.500"><MdPerson size={22} /></Box>
                    <Box>
                      <Text fontWeight="700">{d.name}</Text>
                      <Badge colorPalette="teal" size="sm">{d.specialty}</Badge>
                    </Box>
                  </Flex>
                  <Badge colorPalette={schedules.length > 0 ? 'green' : 'gray'} size="sm">
                    {schedules.length} schedules
                  </Badge>
                </Flex>

                {schedules.length > 0 ? (
                  <Stack gap={2} mb={3}>
                    {schedules.map((s) => (
                      <Flex key={s.id} align="center" gap={2} bg="teal.50" px={3} py={2} rounded="md">
                        <MdSchedule color="#0b9c9c" size={14} />
                        <Text fontSize="xs" fontWeight="600" color="teal.700">{s.day}</Text>
                        <Text fontSize="xs" color="gray.500">{s.start} – {s.end}</Text>
                        <Badge colorPalette="teal" size="sm" ml="auto">{s.slots.length} slots</Badge>
                      </Flex>
                    ))}
                  </Stack>
                ) : (
                  <Box bg="orange.50" p={3} rounded="md" mb={3}>
                    <Text fontSize="xs" color="orange.600">No schedules configured yet</Text>
                  </Box>
                )}

                <Button
                  size="sm"
                  w="full"
                  colorPalette="teal"
                  variant={schedules.length > 0 ? 'outline' : 'solid'}
                  onClick={() => navigate(`/hospital/schedules/slots/${d.id}`)}
                >
                  {schedules.length > 0 ? 'Manage Slots' : 'Create Schedule'} <MdArrowForward />
                </Button>
              </Card.Body>
            </Card.Root>
          )
        })}
      </Grid>
    </Stack>
  )
}
