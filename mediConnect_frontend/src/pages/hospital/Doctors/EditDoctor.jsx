/**
 * @author Healthcare Appointment App
 * @description Edit Doctor — pre-filled form to update doctor info.
 * JIRA: HAA-HOSP-004 #comment Edit doctor UI
 */

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Stack, Heading, Text, Flex, Button, Field, Input, Textarea,
  Card, Grid, Select, createListCollection, Spinner, Center,
} from '@chakra-ui/react'
import { MdArrowBack } from 'react-icons/md'
import { MOCK_DOCTORS, MOCK_SPECIALTIES } from '@/services/mockApi'

const specialtyCollection = createListCollection({
  items: MOCK_SPECIALTIES.map((s) => ({ label: s.name, value: s.name })),
})

export default function EditDoctor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const doctor = MOCK_DOCTORS.find((d) => d.id === id)

  const [form, setForm] = useState({
    name: doctor?.name || '',
    specialty: doctor?.specialty || '',
    experience: doctor?.experience || '',
    fee: doctor?.fee || '',
    qualification: doctor?.qualification || 'MBBS, MD',
    bio: doctor?.bio || '',
    phone: doctor?.phone || '',
    email: doctor?.email || '',
  })
  const [saved, setSaved] = useState(false)

  if (!doctor) return (
    <Center h="40vh">
      <Text color="gray.500">Doctor not found.</Text>
    </Center>
  )

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => navigate('/hospital/doctors'), 1200)
  }

  return (
    <Stack gap={6} maxW="700px">
      <Flex align="center" gap={3}>
        <Button variant="ghost" colorPalette="teal" onClick={() => navigate('/hospital/doctors')}>
          <MdArrowBack /> Back
        </Button>
        <Box>
          <Heading size="lg">Edit Doctor</Heading>
          <Text color="gray.500" fontSize="sm">Update information for {doctor.name}</Text>
        </Box>
      </Flex>

      {saved && (
        <Box bg="teal.50" border="1px solid" borderColor="teal.200" p={4} rounded="lg">
          <Text color="teal.700" fontWeight="600">✓ Changes saved! Redirecting…</Text>
        </Box>
      )}

      <Card.Root shadow="sm" rounded="xl">
        <Card.Body>
          <Box as="form" onSubmit={handleSubmit}>
            <Stack gap={5}>
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                <Field.Root required>
                  <Field.Label>Full Name</Field.Label>
                  <Input name="name" value={form.name} onChange={handleChange} />
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Specialty</Field.Label>
                  <Select.Root
                    collection={specialtyCollection}
                    defaultValue={[form.specialty]}
                    onValueChange={(v) => setForm((p) => ({ ...p, specialty: v.value[0] || '' }))}
                  >
                    <Select.Trigger>
                      <Select.ValueText />
                    </Select.Trigger>
                    <Select.Content>
                      {specialtyCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>{item.label}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Experience (years)</Field.Label>
                  <Input name="experience" type="number" value={form.experience} onChange={handleChange} />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Consultation Fee ($)</Field.Label>
                  <Input name="fee" type="number" value={form.fee} onChange={handleChange} />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Qualification</Field.Label>
                  <Input name="qualification" value={form.qualification} onChange={handleChange} />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Phone</Field.Label>
                  <Input name="phone" value={form.phone} onChange={handleChange} />
                </Field.Root>
              </Grid>

              <Field.Root>
                <Field.Label>Bio</Field.Label>
                <Textarea name="bio" rows={3} value={form.bio} onChange={handleChange} />
              </Field.Root>

              <Flex gap={3} justify="flex-end">
                <Button variant="outline" onClick={() => navigate('/hospital/doctors')}>Cancel</Button>
                <Button type="submit" colorPalette="teal" loading={saved} loadingText="Saving…">
                  Save Changes
                </Button>
              </Flex>
            </Stack>
          </Box>
        </Card.Body>
      </Card.Root>
    </Stack>
  )
}
