/**
 * @author Healthcare Appointment App
 * @description Add Doctor — form to add a new doctor to the hospital.
 * JIRA: HAA-HOSP-003 #comment Add doctor UI
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Stack, Heading, Text, Flex, Button, Field, Input, Textarea,
  Card, Grid, Select, createListCollection,
} from '@chakra-ui/react'
import { MdArrowBack, MdPerson } from 'react-icons/md'
import { MOCK_SPECIALTIES } from '@/services/mockApi'

const specialtyCollection = createListCollection({
  items: MOCK_SPECIALTIES.map((s) => ({ label: s.name, value: s.name })),
})

export default function AddDoctor() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', specialty: '', experience: '', fee: '', qualification: '', bio: '', phone: '', email: '',
  })
  const [saved, setSaved] = useState(false)

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
          <Heading size="lg">Add Doctor</Heading>
          <Text color="gray.500" fontSize="sm">Register a new doctor at your hospital</Text>
        </Box>
      </Flex>

      {saved && (
        <Box bg="teal.50" border="1px solid" borderColor="teal.200" p={4} rounded="lg">
          <Text color="teal.700" fontWeight="600">✓ Doctor added successfully! Redirecting…</Text>
        </Box>
      )}

      <Card.Root shadow="sm" rounded="xl">
        <Card.Body>
          <Box as="form" onSubmit={handleSubmit}>
            <Stack gap={5}>
              <Flex align="center" gap={2} pb={2} borderBottomWidth="1px">
                <Box color="teal.500"><MdPerson size={20} /></Box>
                <Heading size="sm" color="teal.700">Personal Information</Heading>
              </Flex>

              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                <Field.Root required>
                  <Field.Label>Full Name</Field.Label>
                  <Input name="name" placeholder="Dr. Jane Smith" value={form.name} onChange={handleChange} />
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Specialty</Field.Label>
                  <Select.Root
                    collection={specialtyCollection}
                    onValueChange={(v) => setForm((p) => ({ ...p, specialty: v.value[0] || '' }))}
                  >
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select specialty" />
                    </Select.Trigger>
                    <Select.Content>
                      {specialtyCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>{item.label}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Experience (years)</Field.Label>
                  <Input name="experience" type="number" min="0" placeholder="5" value={form.experience} onChange={handleChange} />
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Consultation Fee ($)</Field.Label>
                  <Input name="fee" type="number" min="0" placeholder="120" value={form.fee} onChange={handleChange} />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Qualification</Field.Label>
                  <Input name="qualification" placeholder="MBBS, MD Cardiology" value={form.qualification} onChange={handleChange} />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Phone</Field.Label>
                  <Input name="phone" placeholder="+1-555-0000" value={form.phone} onChange={handleChange} />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Email</Field.Label>
                  <Input name="email" type="email" placeholder="doctor@hospital.com" value={form.email} onChange={handleChange} />
                </Field.Root>
              </Grid>

              <Field.Root>
                <Field.Label>Bio / Description</Field.Label>
                <Textarea name="bio" placeholder="Brief professional bio…" rows={3} value={form.bio} onChange={handleChange} />
              </Field.Root>

              <Flex gap={3} justify="flex-end">
                <Button variant="outline" onClick={() => navigate('/hospital/doctors')}>Cancel</Button>
                <Button type="submit" colorPalette="teal" loading={saved} loadingText="Saving…">
                  Add Doctor
                </Button>
              </Flex>
            </Stack>
          </Box>
        </Card.Body>
      </Card.Root>
    </Stack>
  )
}
