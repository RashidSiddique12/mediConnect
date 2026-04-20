/**
 * @author Healthcare Appointment App
 * @description Upload Prescription — hospital admin uploads prescription for completed appointment.
 * JIRA: HAA-HOSP-010 #comment Upload prescription UI
 */

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Stack, Heading, Text, Flex, Button, Card, Grid, Field, Input, Textarea,
} from '@chakra-ui/react'
import { MdArrowBack, MdAdd, MdDelete, MdUpload } from 'react-icons/md'
import { MOCK_APPOINTMENTS } from '@/services/mockApi'

export default function UploadPrescription() {
  const { id } = useParams()
  const navigate = useNavigate()
  const appointment = MOCK_APPOINTMENTS.find((a) => a.id === id)

  const [form, setForm] = useState({ diagnosis: '', notes: '' })
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '' }])
  const [saved, setSaved] = useState(false)

  const addMedicine = () => setMedicines((prev) => [...prev, { name: '', dosage: '', duration: '' }])
  const removeMedicine = (idx) => setMedicines((prev) => prev.filter((_, i) => i !== idx))
  const updateMedicine = (idx, field, value) => {
    setMedicines((prev) => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => navigate(`/hospital/appointments/${id}`), 1500)
  }

  if (!appointment) return (
    <Box textAlign="center" py={12} color="gray.400"><Text>Appointment not found.</Text></Box>
  )

  return (
    <Stack gap={6} maxW="700px">
      <Flex align="center" gap={3}>
        <Button variant="ghost" colorPalette="teal" onClick={() => navigate(`/hospital/appointments/${id}`)}>
          <MdArrowBack /> Back
        </Button>
        <Box>
          <Heading size="lg">Upload Prescription</Heading>
          <Text color="gray.500" fontSize="sm">
            For: {appointment.patientName} | {appointment.doctorName}
          </Text>
        </Box>
      </Flex>

      {saved && (
        <Box bg="teal.50" border="1px solid" borderColor="teal.200" p={4} rounded="lg">
          <Text color="teal.700" fontWeight="600">✓ Prescription uploaded successfully!</Text>
        </Box>
      )}

      <Card.Root shadow="sm" rounded="xl">
        <Card.Body as="form" onSubmit={handleSubmit}>
          <Stack gap={5}>
            <Field.Root required>
              <Field.Label>Diagnosis</Field.Label>
              <Input
                placeholder="e.g. Hypertension Stage 1"
                value={form.diagnosis}
                onChange={(e) => setForm((p) => ({ ...p, diagnosis: e.target.value }))}
              />
            </Field.Root>

            <Box>
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="600">Medicines</Text>
                <Button size="xs" colorPalette="teal" onClick={addMedicine}>
                  <MdAdd /> Add Medicine
                </Button>
              </Flex>
              <Stack gap={3}>
                {medicines.map((med, idx) => (
                  <Box key={idx} bg="gray.50" p={3} rounded="lg">
                    <Grid templateColumns={{ base: '1fr', sm: '2fr 2fr 2fr auto' }} gap={3} alignItems="flex-end">
                      <Field.Root>
                        <Field.Label fontSize="xs">Medicine Name</Field.Label>
                        <Input
                          size="sm"
                          placeholder="Amlodipine 5mg"
                          value={med.name}
                          onChange={(e) => updateMedicine(idx, 'name', e.target.value)}
                        />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label fontSize="xs">Dosage</Field.Label>
                        <Input
                          size="sm"
                          placeholder="1 tablet daily"
                          value={med.dosage}
                          onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
                        />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label fontSize="xs">Duration</Field.Label>
                        <Input
                          size="sm"
                          placeholder="30 days"
                          value={med.duration}
                          onChange={(e) => updateMedicine(idx, 'duration', e.target.value)}
                        />
                      </Field.Root>
                      {medicines.length > 1 && (
                        <Button size="sm" variant="ghost" colorPalette="red" alignSelf="flex-end" onClick={() => removeMedicine(idx)}>
                          <MdDelete />
                        </Button>
                      )}
                    </Grid>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Field.Root>
              <Field.Label>Additional Notes</Field.Label>
              <Textarea
                rows={3}
                placeholder="Follow-up instructions, dietary advice…"
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              />
            </Field.Root>

            <Flex gap={3} justify="flex-end">
              <Button variant="outline" onClick={() => navigate(`/hospital/appointments/${id}`)}>Cancel</Button>
              <Button type="submit" colorPalette="teal" loading={saved} loadingText="Uploading…">
                <MdUpload /> Upload Prescription
              </Button>
            </Flex>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Stack>
  )
}
