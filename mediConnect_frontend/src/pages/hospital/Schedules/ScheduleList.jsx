import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Stack, Text, Flex, Button, Card, Grid, Badge,
} from '@chakra-ui/react'
import { MdSchedule, MdPerson, MdArrowForward } from 'react-icons/md'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import Loader from '@/components/common/Loader'
import { selectDoctors, selectDoctorsLoading } from '@/features/doctors/doctorSelectors'
import { selectSchedules } from '@/features/schedules/scheduleSelectors'
import { selectDashboardData } from '@/features/dashboard/dashboardSelectors'
import * as doctorSlice from '@/features/doctors/doctorSlice'
import * as scheduleSlice from '@/features/schedules/scheduleSlice'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function ScheduleList() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const doctors = useSelector(selectDoctors)
  const loading = useSelector(selectDoctorsLoading)
  const allSchedules = useSelector(selectSchedules)
  const dashboardData = useSelector(selectDashboardData)

  const hospitalId = dashboardData?.hospital?._id

  useEffect(() => {
    if (hospitalId) dispatch(doctorSlice.fetchDoctorsRequest({ hospitalId }))
    dispatch(scheduleSlice.fetchSchedulesRequest())
  }, [dispatch, hospitalId])

  const doctorScheduleMap = useMemo(() => {
    const map = new Map()
    for (const s of allSchedules) {
      const dId = s.doctorId?._id || s.doctorId
      if (!map.has(dId)) map.set(dId, [])
      map.get(dId).push(s)
    }
    return map
  }, [allSchedules])

  if (loading) return <Loader />

  return (
    <Stack gap={6}>
      <PageHeader
        title="Doctor Schedules"
        subtitle="Manage availability and appointment slots"
      />

      {doctors.length === 0 ? (
        <EmptyState
          title="No doctors yet"
          description="Add doctors first to manage their schedules"
          icon={<MdPerson size={36} />}
          actionLabel="Add Doctor"
          onAction={() => navigate('/hospital/doctors/add')}
        />
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
          {doctors.map((d) => {
            const schedules = doctorScheduleMap.get(d._id) || []
            return (
              <Card.Root
                key={d._id}
                shadow="sm"
                rounded="xl"
                _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                <Card.Body>
                  <Flex justify="space-between" align="flex-start" mb={3}>
                    <Flex align="center" gap={2}>
                      <Box color="teal.500"><MdPerson size={22} /></Box>
                      <Box>
                        <Text fontWeight="700">{d.name}</Text>
                        <Badge colorPalette="teal" size="sm">
                          {d.specialtyIds?.[0]?.name || 'General'}
                        </Badge>
                      </Box>
                    </Flex>
                    <Badge colorPalette={schedules.length > 0 ? 'green' : 'gray'} size="sm">
                      {schedules.length} schedule{schedules.length !== 1 && 's'}
                    </Badge>
                  </Flex>

                  {schedules.length > 0 ? (
                    <Stack gap={2} mb={3}>
                      {schedules.map((s) => (
                        <Flex key={s._id} align="center" gap={2} bg="teal.50" px={3} py={2} rounded="md">
                          <MdSchedule color="#0b9c9c" size={14} />
                          <Text fontSize="xs" fontWeight="600" color="teal.700">
                            {DAY_NAMES[s.dayOfWeek] || `Day ${s.dayOfWeek}`}
                          </Text>
                          <Text fontSize="xs" color="gray.500">{s.startTime} – {s.endTime}</Text>
                          <Badge colorPalette="teal" size="sm" ml="auto">{s.slotDuration}min</Badge>
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
                    onClick={() => navigate(`/hospital/schedules/slots/${d._id}`)}
                  >
                    {schedules.length > 0 ? 'Manage Slots' : 'Create Schedule'} <MdArrowForward />
                  </Button>
                </Card.Body>
              </Card.Root>
            )
          })}
        </Grid>
      )}
    </Stack>
  )
}
