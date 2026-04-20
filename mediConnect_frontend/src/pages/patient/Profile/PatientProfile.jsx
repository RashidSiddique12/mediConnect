/**
 * @author Healthcare Appointment App
 * @description Patient Profile — view and edit personal info.
 * JIRA: HAA-PAT-002 #comment Patient profile UI
 */

import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Box, Stack, Heading, Text, Flex, Button, Field, Input, Card, Grid, Badge, Avatar, Select, createListCollection,
} from '@chakra-ui/react'
import { MdEdit, MdSave, MdPerson } from 'react-icons/md'

const genders = createListCollection({
  items: [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ],
})

export default function PatientProfile() {
  const user = useSelector((s) => s.auth.user)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'patient@healthcare.com',
    phone: user?.phone || '+1-555-0100',
    dob: user?.dob || '1990-06-15',
    gender: user?.gender || 'male',
    address: user?.address || '45 Park Lane, Brooklyn, NY',
    bloodGroup: 'O+',
    allergies: 'Penicillin',
    emergencyContact: '+1-555-0199',
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Stack gap={6} maxW="750px">
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Box>
          <Heading size="lg">My Profile</Heading>
          <Text color="gray.500" fontSize="sm">Manage your personal information</Text>
        </Box>
        <Button
          colorPalette={editing ? 'gray' : 'teal'}
          variant={editing ? 'outline' : 'solid'}
          onClick={() => setEditing((v) => !v)}
        >
          {editing ? 'Cancel' : <><MdEdit /> Edit Profile</>}
        </Button>
      </Flex>

      {saved && (
        <Box bg="teal.50" border="1px solid" borderColor="teal.200" p={4} rounded="lg">
          <Text color="teal.700" fontWeight="600">✓ Profile updated!</Text>
        </Box>
      )}

      {/* Profile header */}
      <Card.Root shadow="sm" rounded="xl" bg="teal.700">
        <Card.Body>
          <Flex align="center" gap={4}>
            <Avatar.Root size="2xl" bg="white">
              <Avatar.Fallback name={form.name} color="teal.700" fontSize="2xl" />
            </Avatar.Root>
            <Box>
              <Heading size="lg" color="white">{form.name}</Heading>
              <Text color="teal.200">{form.email}</Text>
              <Flex gap={2} mt={2}>
                <Badge bg="teal.500" color="white" size="sm">Patient</Badge>
                <Badge bg="teal.600" color="white" size="sm">Blood: {form.bloodGroup}</Badge>
              </Flex>
            </Box>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* Form */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body as="form" onSubmit={handleSave}>
          <Stack gap={5}>
            <Flex align="center" gap={2} pb={2} borderBottomWidth="1px">
              <Box color="teal.500"><MdPerson size={18} /></Box>
              <Heading size="sm" color="teal.700">Personal Information</Heading>
            </Flex>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <Field.Root>
                <Field.Label>Full Name</Field.Label>
                <Input name="name" value={form.name} onChange={handleChange} readOnly={!editing} bg={editing ? 'white' : 'gray.50'} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Email</Field.Label>
                <Input name="email" type="email" value={form.email} onChange={handleChange} readOnly={!editing} bg={editing ? 'white' : 'gray.50'} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Phone</Field.Label>
                <Input name="phone" value={form.phone} onChange={handleChange} readOnly={!editing} bg={editing ? 'white' : 'gray.50'} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Date of Birth</Field.Label>
                <Input name="dob" type={editing ? 'date' : 'text'} value={form.dob} onChange={handleChange} readOnly={!editing} bg={editing ? 'white' : 'gray.50'} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Gender</Field.Label>
                {editing ? (
                  <Select.Root collection={genders} defaultValue={[form.gender]}
                    onValueChange={(v) => setForm((p) => ({ ...p, gender: v.value[0] || '' }))}>
                    <Select.Trigger><Select.ValueText /></Select.Trigger>
                    <Select.Content>
                      {genders.items.map((item) => (
                        <Select.Item key={item.value} item={item}>{item.label}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                ) : (
                  <Input value={form.gender} readOnly bg="gray.50" />
                )}
              </Field.Root>
              <Field.Root>
                <Field.Label>Address</Field.Label>
                <Input name="address" value={form.address} onChange={handleChange} readOnly={!editing} bg={editing ? 'white' : 'gray.50'} />
              </Field.Root>
            </Grid>

            <Flex align="center" gap={2} pb={2} borderBottomWidth="1px" pt={2}>
              <Heading size="sm" color="teal.700">Medical Information</Heading>
            </Flex>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={4}>
              <Field.Root>
                <Field.Label>Blood Group</Field.Label>
                <Input name="bloodGroup" value={form.bloodGroup} onChange={handleChange} readOnly={!editing} bg={editing ? 'white' : 'gray.50'} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Known Allergies</Field.Label>
                <Input name="allergies" value={form.allergies} onChange={handleChange} readOnly={!editing} bg={editing ? 'white' : 'gray.50'} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Emergency Contact</Field.Label>
                <Input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} readOnly={!editing} bg={editing ? 'white' : 'gray.50'} />
              </Field.Root>
            </Grid>

            {editing && (
              <Flex justify="flex-end">
                <Button type="submit" colorPalette="teal">
                  <MdSave /> Save Changes
                </Button>
              </Flex>
            )}
          </Stack>
        </Card.Body>
      </Card.Root>
    </Stack>
  )
}
