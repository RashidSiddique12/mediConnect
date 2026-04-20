/**
 * @author Healthcare Appointment App
 * @description Hospital Profile — hospital admin updates hospital details.
 * JIRA: HAA-HOSP-005 #comment Hospital profile UI
 */

import { useState } from 'react'
import {
  Box, Stack, Heading, Text, Flex, Button, Field, Input, Textarea,
  Card, Grid, Badge,
} from '@chakra-ui/react'
import { MdLocalHospital, MdEdit, MdSave } from 'react-icons/md'
import { useSelector } from 'react-redux'

const MOCK_PROFILE = {
  name: 'City General Hospital',
  city: 'New York',
  address: '123 Medical Ave, Manhattan, NY 10001',
  phone: '+1-212-555-0100',
  email: 'contact@citygeneral.com',
  website: 'www.citygeneral.com',
  description: 'City General Hospital is a leading multi-specialty healthcare facility serving New York since 1985.',
  beds: 320,
  established: '1985',
  accreditation: 'JCI Accredited',
}

export default function HospitalProfile() {
  const user = useSelector((s) => s.auth.user)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(MOCK_PROFILE)
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Stack gap={6} maxW="800px">
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Box>
          <Heading size="lg">Hospital Profile</Heading>
          <Text color="gray.500" fontSize="sm">Manage your hospital's public information</Text>
        </Box>
        <Button
          colorPalette={editing ? 'gray' : 'teal'}
          variant={editing ? 'outline' : 'solid'}
          onClick={() => setEditing((e) => !e)}
        >
          {editing ? 'Cancel' : <><MdEdit /> Edit Profile</>}
        </Button>
      </Flex>

      {saved && (
        <Box bg="teal.50" border="1px solid" borderColor="teal.200" p={4} rounded="lg">
          <Text color="teal.700" fontWeight="600">✓ Profile updated successfully!</Text>
        </Box>
      )}

      {/* Header Card */}
      <Card.Root shadow="sm" rounded="xl" bg="teal.700" color="white">
        <Card.Body>
          <Flex align="center" gap={4}>
            <Box bg="white" p={3} rounded="xl" color="teal.600" fontSize="3xl">
              <MdLocalHospital />
            </Box>
            <Box>
              <Heading size="xl" color="white">{form.name}</Heading>
              <Text opacity={0.8}>{form.city} • {form.address}</Text>
              <Flex gap={2} mt={2}>
                <Badge bg="teal.500" color="white" size="sm">{form.accreditation}</Badge>
                <Badge bg="teal.600" color="white" size="sm">Est. {form.established}</Badge>
              </Flex>
            </Box>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* Profile Form */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body>
          <Box as="form" onSubmit={handleSave}>
            <Stack gap={5}>
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                <Field.Root>
                  <Field.Label>Hospital Name</Field.Label>
                  <Input name="name" value={form.name} onChange={handleChange} readOnly={!editing} bg={editing ? 'white' : 'gray.50'} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>City</Field.Label>
                  <Input name="city" value={form.city} onChange={handleChange} readOnly={!editing} bg={editing ? 'white' : 'gray.50'} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Address</Field.Label>
                  <Input name="address" value={form.address} onChange={handleChange} readOnly={!editing} bg={editing ? 'white' : 'gray.50'} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Phone</Field.Label>
                  <Input name="phone" value={form.phone} onChange={handleChange} readOnly={!editing} bg={editing ? 'white' : 'gray.50'} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Email</Field.Label>
                  <Input name="email" type="email" value={form.email} onChange={handleChange} readOnly={!editing} bg={editing ? 'white' : 'gray.50'} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Website</Field.Label>
                  <Input name="website" value={form.website} onChange={handleChange} readOnly={!editing} bg={editing ? 'white' : 'gray.50'} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Total Beds</Field.Label>
                  <Input name="beds" type="number" value={form.beds} onChange={handleChange} readOnly={!editing} bg={editing ? 'white' : 'gray.50'} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Accreditation</Field.Label>
                  <Input name="accreditation" value={form.accreditation} onChange={handleChange} readOnly={!editing} bg={editing ? 'white' : 'gray.50'} />
                </Field.Root>
              </Grid>
              <Field.Root>
                <Field.Label>Description</Field.Label>
                <Textarea name="description" rows={3} value={form.description} onChange={handleChange} readOnly={!editing} bg={editing ? 'white' : 'gray.50'} />
              </Field.Root>
              {editing && (
                <Flex justify="flex-end">
                  <Button type="submit" colorPalette="teal">
                    <MdSave /> Save Changes
                  </Button>
                </Flex>
              )}
            </Stack>
          </Box>
        </Card.Body>
      </Card.Root>
    </Stack>
  )
}
