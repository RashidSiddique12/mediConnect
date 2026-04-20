/**
 * @author Healthcare Appointment App
 * @description Manage Slots — configure time slots for a specific doctor's schedule.
 * JIRA: HAA-HOSP-007 #comment Manage slots UI
 */

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Stack, Heading, Text, Flex, Button, Card, Grid, Badge, Input, Field,
  Select, createListCollection,
} from '@chakra-ui/react'
import { MdArrowBack, MdAdd, MdDelete, MdSchedule } from 'react-icons/md'
import { MOCK_DOCTORS, MOCK_SCHEDULES } from '@/services/mockApi'

const dayCollection = createListCollection({
  items: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
    (d) => ({ label: d, value: d })
  ),
})

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
  const doctor = MOCK_DOCTORS.find((d) => d.id === doctorId)
  const existingSchedules = MOCK_SCHEDULES.filter((s) => s.doctorId === doctorId)

  const [schedules, setSchedules] = useState(existingSchedules)
  const [form, setForm] = useState({ day: '', start: '09:00', end: '13:00' })
  const [saved, setSaved] = useState(false)

  if (!doctor) return (
    <Box textAlign="center" py={12} color="gray.400">
      <Text>Doctor not found.</Text>
    </Box>
  )

  const handleAddSchedule = (e) => {
    e.preventDefault()
    if (!form.day) return
    const slots = generateSlots(form.start, form.end)
    const newSch = {
      id: `sch-${Date.now()}`,
      doctorId,
      doctorName: doctor.name,
      day: form.day,
      start: form.start,
      end: form.end,
      slots,
    }
    setSchedules((prev) => [...prev, newSch])
    setForm({ day: '', start: '09:00', end: '13:00' })
  }

  const removeSchedule = (id) => setSchedules((prev) => prev.filter((s) => s.id !== id))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => navigate('/hospital/schedules'), 1200)
  }

  return (
    <Stack gap={6} maxW="800px">
      <Flex align="center" gap={3}>
        <Button variant="ghost" colorPalette="teal" onClick={() => navigate('/hospital/schedules')}>
          <MdArrowBack /> Back
        </Button>
        <Box>
          <Heading size="lg">Manage Slots</Heading>
          <Text color="gray.500" fontSize="sm">{doctor.name} — {doctor.specialty}</Text>
        </Box>
      </Flex>

      {saved && (
        <Box bg="teal.50" border="1px solid" borderColor="teal.200" p={4} rounded="lg">
          <Text color="teal.700" fontWeight="600">✓ Schedule saved! Redirecting…</Text>
        </Box>
      )}

      {/* Add New Schedule */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Header>
          <Heading size="md">Add Schedule Block</Heading>
        </Card.Header>
        <Card.Body as="form" onSubmit={handleAddSchedule}>
          <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr 1fr auto' }} gap={3} alignItems="flex-end">
            <Field.Root required>
              <Field.Label>Day</Field.Label>
              <Select.Root collection={dayCollection} onValueChange={(v) => setForm((p) => ({ ...p, day: v.value[0] || '' }))}>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select day" />
                </Select.Trigger>
                <Select.Content>
                  {dayCollection.items.map((item) => (
                    <Select.Item key={item.value} item={item}>{item.label}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Field.Root>
            <Field.Root required>
              <Field.Label>Start Time</Field.Label>
              <Input type="time" value={form.start} onChange={(e) => setForm((p) => ({ ...p, start: e.target.value }))} />
            </Field.Root>
            <Field.Root required>
              <Field.Label>End Time</Field.Label>
              <Input type="time" value={form.end} onChange={(e) => setForm((p) => ({ ...p, end: e.target.value }))} />
            </Field.Root>
            <Button type="submit" colorPalette="teal" alignSelf="flex-end">
              <MdAdd /> Add
            </Button>
          </Grid>
        </Card.Body>
      </Card.Root>

      {/* Current Schedules */}
      <Stack gap={4}>
        {schedules.length === 0 && (
          <Box textAlign="center" py={8} color="gray.400" border="2px dashed" borderColor="gray.200" rounded="xl">
            <MdSchedule size={40} style={{ margin: '0 auto 8px' }} />
            <Text>No schedules yet. Add one above.</Text>
          </Box>
        )}
        {schedules.map((s) => (
          <Card.Root key={s.id} shadow="sm" rounded="xl">
            <Card.Body>
              <Flex justify="space-between" align="center" mb={3}>
                <Flex align="center" gap={2}>
                  <Badge colorPalette="teal" size="md">{s.day}</Badge>
                  <Text fontSize="sm" color="gray.600">{s.start} – {s.end}</Text>
                  <Badge colorPalette="blue" size="sm">{s.slots.length} slots</Badge>
                </Flex>
                <Button size="xs" variant="ghost" colorPalette="red" onClick={() => removeSchedule(s.id)}>
                  <MdDelete />
                </Button>
              </Flex>
              <Flex gap={2} wrap="wrap">
                {s.slots.map((slot) => (
                  <Badge key={slot} colorPalette="gray" variant="outline" size="sm">{slot}</Badge>
                ))}
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Stack>

      {schedules.length > 0 && (
        <Flex justify="flex-end">
          <Button colorPalette="teal" onClick={handleSave}>Save All Schedules</Button>
        </Flex>
      )}
    </Stack>
  )
}
