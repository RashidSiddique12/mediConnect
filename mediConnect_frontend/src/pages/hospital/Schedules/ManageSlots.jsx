import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Stack, Heading, Text, Flex, Button, Card, Grid, Badge, Input, Field,
  Select, createListCollection,
} from '@chakra-ui/react'
import { MdAdd, MdDelete, MdSchedule } from 'react-icons/md'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import Loader from '@/components/common/Loader'
import * as doctorSlice from '@/features/doctors/doctorSlice'
import { selectCurrentDoctor, selectDoctorsLoading } from '@/features/doctors/doctorSelectors'
import * as scheduleSlice from '@/features/schedules/scheduleSlice'
import { selectSchedules, selectSchedulesSaving } from '@/features/schedules/scheduleSelectors'

const DAY_COLLECTION = createListCollection({
  items: [
    { label: 'Sunday', value: 0 },
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
  ],
})

const DURATION_COLLECTION = createListCollection({
  items: [
    { label: '15 min', value: 15 },
    { label: '20 min', value: 20 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '60 min', value: 60 },
  ],
})

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function generateSlots(start, end, intervalMins = 30) {
  const slots = []
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  let curr = sh * 60 + sm
  const endMin = eh * 60 + em
  while (curr < endMin) {
    const h = String(Math.floor(curr / 60)).padStart(2, '0')
    const m = String(curr % 60).padStart(2, '0')
    slots.push(`${h}:${m}`)
    curr += intervalMins
  }
  return slots
}

export default function ManageSlots() {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const doctor = useSelector(selectCurrentDoctor)
  const doctorLoading = useSelector(selectDoctorsLoading)
  const schedules = useSelector(selectSchedules)
  const saving = useSelector(selectSchedulesSaving)

  const [form, setForm] = useState({
    dayOfWeek: '', startTime: '09:00', endTime: '13:00', slotDuration: 30,
  })

  useEffect(() => {
    dispatch(doctorSlice.fetchDoctorByIdRequest(doctorId))
    dispatch(scheduleSlice.fetchSchedulesRequest({ doctorId }))
    return () => dispatch(doctorSlice.clearCurrentDoctor())
  }, [dispatch, doctorId])

  const doctorSchedules = useMemo(
    () => schedules.filter((s) => (s.doctorId?._id || s.doctorId) === doctorId),
    [schedules, doctorId],
  )

  if (doctorLoading) return <Loader />

  if (!doctor && !doctorLoading) {
    return (
      <EmptyState
        title="Doctor not found"
        description="The doctor you're looking for doesn't exist"
        actionLabel="Back to Schedules"
        onAction={() => navigate('/hospital/schedules')}
      />
    )
  }

  const handleAddSchedule = (e) => {
    e.preventDefault()
    if (form.dayOfWeek === '') return
    dispatch(scheduleSlice.createScheduleRequest({
      doctorId,
      dayOfWeek: Number(form.dayOfWeek),
      startTime: form.startTime,
      endTime: form.endTime,
      slotDuration: Number(form.slotDuration),
    }))
    setForm({ dayOfWeek: '', startTime: '09:00', endTime: '13:00', slotDuration: 30 })
  }

  const handleRemoveSchedule = (id) =>
    dispatch(scheduleSlice.deleteScheduleRequest(id))

  return (
    <Stack gap={6} maxW="800px">
      <PageHeader
        title="Manage Slots"
        subtitle={`${doctor?.name} — ${doctor?.specialtyIds?.[0]?.name || 'General'}`}
        backTo="/hospital/schedules"
      />

      {/* ─── Add New Schedule ─── */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Header>
          <Heading size="md">Add Schedule Block</Heading>
        </Card.Header>
        <Card.Body as="form" onSubmit={handleAddSchedule}>
          <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap={3}>
            <Field.Root required>
              <Field.Label>Day</Field.Label>
              <Select.Root
                collection={DAY_COLLECTION}
                onValueChange={(v) => setForm((p) => ({ ...p, dayOfWeek: v.value[0] ?? '' }))}
              >
                <Select.Trigger>
                  <Select.ValueText placeholder="Select day" />
                </Select.Trigger>
                <Select.Content>
                  {DAY_COLLECTION.items.map((item) => (
                    <Select.Item key={item.value} item={item}>{item.label}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Field.Root>
            <Field.Root>
              <Field.Label>Slot Duration</Field.Label>
              <Select.Root
                collection={DURATION_COLLECTION}
                value={[form.slotDuration]}
                onValueChange={(v) => setForm((p) => ({ ...p, slotDuration: v.value[0] ?? 30 }))}
              >
                <Select.Trigger>
                  <Select.ValueText />
                </Select.Trigger>
                <Select.Content>
                  {DURATION_COLLECTION.items.map((item) => (
                    <Select.Item key={item.value} item={item}>{item.label}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Field.Root>
            <Field.Root required>
              <Field.Label>Start Time</Field.Label>
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
              />
            </Field.Root>
            <Field.Root required>
              <Field.Label>End Time</Field.Label>
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))}
              />
            </Field.Root>
          </Grid>
          <Flex justify="flex-end" mt={4}>
            <Button type="submit" colorPalette="teal" loading={saving}>
              <MdAdd /> Add Schedule
            </Button>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* ─── Current Schedules ─── */}
      <Stack gap={4}>
        <Text fontWeight="700" fontSize="md" color="gray.700">
          Current Schedules ({doctorSchedules.length})
        </Text>
        {doctorSchedules.length === 0 ? (
          <EmptyState
            title="No schedules yet"
            description="Add a schedule block above to get started"
            icon={<MdSchedule size={36} />}
          />
        ) : (
          doctorSchedules.map((s) => {
            const previewSlots = generateSlots(s.startTime, s.endTime, s.slotDuration)
            return (
              <Card.Root key={s._id} shadow="sm" rounded="xl">
                <Card.Body>
                  <Flex justify="space-between" align="center" mb={3}>
                    <Flex align="center" gap={2}>
                      <Badge colorPalette="teal" size="md">{DAY_NAMES[s.dayOfWeek]}</Badge>
                      <Text fontSize="sm" color="gray.600">{s.startTime} – {s.endTime}</Text>
                      <Badge colorPalette="blue" size="sm">{previewSlots.length} slots</Badge>
                      <Badge colorPalette="purple" size="sm">{s.slotDuration}min</Badge>
                    </Flex>
                    <Button size="xs" variant="ghost" colorPalette="red" onClick={() => handleRemoveSchedule(s._id)}>
                      <MdDelete />
                    </Button>
                  </Flex>
                  <Flex gap={2} wrap="wrap">
                    {previewSlots.map((slot) => (
                      <Badge key={slot} colorPalette="gray" variant="outline" size="sm">{slot}</Badge>
                    ))}
                  </Flex>
                </Card.Body>
              </Card.Root>
            )
          })
        )}
      </Stack>
    </Stack>
  )
}
