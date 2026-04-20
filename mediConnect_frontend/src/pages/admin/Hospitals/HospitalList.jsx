/**
 * @author Healthcare Appointment App
 * @description Hospital List — super admin view of all hospitals with actions.
 * JIRA: HAA-ADM-002 #comment Admin hospitals UI
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Stack, Heading, Text, Button, Flex, Badge, Input, Card, Grid,
  Dialog, Field, Switch,
} from '@chakra-ui/react'
import {
  MdLocalHospital, MdAdd, MdSearch, MdEdit, MdCheckCircle, MdCancel, MdStar,
} from 'react-icons/md'
import { MOCK_HOSPITALS } from '@/services/mockApi'

const initialHospitals = MOCK_HOSPITALS.map((h) => ({ ...h, status: 'active' }))

export default function HospitalList() {
  const navigate = useNavigate()
  const [hospitals, setHospitals] = useState(initialHospitals)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', city: '', address: '', phone: '', email: '' })

  const filtered = hospitals.filter(
    (h) => h.name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase()),
  )

  const toggleStatus = (id) => {
    setHospitals((prev) =>
      prev.map((h) => h.id === id ? { ...h, status: h.status === 'active' ? 'inactive' : 'active' } : h)
    )
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const newH = { id: `h-${Date.now()}`, ...form, rating: 0, totalDoctors: 0, totalAppointments: 0, status: 'active' }
    setHospitals((prev) => [newH, ...prev])
    setForm({ name: '', city: '', address: '', phone: '', email: '' })
    setShowAdd(false)
  }

  return (
    <Stack gap={6}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Box>
          <Heading size="lg">Hospital Management</Heading>
          <Text color="gray.500" fontSize="sm">{hospitals.length} hospitals registered</Text>
        </Box>
        <Button colorPalette="teal" onClick={() => setShowAdd(true)}>
          <MdAdd /> Add Hospital
        </Button>
      </Flex>

      {/* Search */}
      <Box position="relative">
        <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1}>
          <MdSearch size={18} />
        </Box>
        <Input pl={9} placeholder="Search by name or city…" value={search} onChange={(e) => setSearch(e.target.value)} maxW="400px" />
      </Box>

      {/* Hospital Cards */}
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
        {filtered.map((h) => (
          <Card.Root key={h.id} shadow="sm" rounded="xl" borderLeft="4px solid" borderColor={h.status === 'active' ? 'teal.400' : 'gray.300'}>
            <Card.Body>
              <Flex justify="space-between" align="flex-start" mb={3}>
                <Flex align="center" gap={2}>
                  <Box color="teal.500" fontSize="2xl"><MdLocalHospital /></Box>
                  <Box>
                    <Text fontWeight="700">{h.name}</Text>
                    <Text fontSize="xs" color="gray.500">{h.city}</Text>
                  </Box>
                </Flex>
                <Badge colorPalette={h.status === 'active' ? 'teal' : 'gray'} size="sm">
                  {h.status}
                </Badge>
              </Flex>

              <Grid templateColumns="repeat(3, 1fr)" gap={2} mb={4}>
                <Box textAlign="center" bg="gray.50" rounded="md" py={2}>
                  <Text fontSize="xs" color="gray.500">Doctors</Text>
                  <Text fontWeight="700" color="blue.500">{h.totalDoctors}</Text>
                </Box>
                <Box textAlign="center" bg="gray.50" rounded="md" py={2}>
                  <Text fontSize="xs" color="gray.500">Appointments</Text>
                  <Text fontWeight="700" color="purple.500">{h.totalAppointments}</Text>
                </Box>
                <Box textAlign="center" bg="gray.50" rounded="md" py={2}>
                  <Text fontSize="xs" color="gray.500">Rating</Text>
                  <Flex align="center" justify="center" gap={1}>
                    <MdStar color="#F6AD55" size={12} />
                    <Text fontWeight="700" color="orange.400">{h.rating}</Text>
                  </Flex>
                </Box>
              </Grid>

              <Flex gap={2}>
                <Button size="xs" variant="outline" colorPalette="teal" flex={1} onClick={() => {}}>
                  <MdEdit /> Edit
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  colorPalette={h.status === 'active' ? 'red' : 'green'}
                  flex={1}
                  onClick={() => toggleStatus(h.id)}
                >
                  {h.status === 'active' ? <><MdCancel /> Deactivate</> : <><MdCheckCircle /> Activate</>}
                </Button>
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      {filtered.length === 0 && (
        <Box textAlign="center" py={12} color="gray.400">
          <MdLocalHospital size={48} style={{ margin: '0 auto 8px' }} />
          <Text>No hospitals found matching "{search}"</Text>
        </Box>
      )}

      {/* Add Hospital Modal */}
      <Dialog.Root open={showAdd} onOpenChange={(e) => setShowAdd(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="xl" maxW="480px">
            <Dialog.Header>
              <Dialog.Title>Add New Hospital</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Box as="form" id="add-hospital-form" onSubmit={handleAdd}>
                <Stack gap={4}>
                  <Field.Root required>
                    <Field.Label>Hospital Name</Field.Label>
                    <Input placeholder="City General Hospital" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                  </Field.Root>
                  <Field.Root required>
                    <Field.Label>City</Field.Label>
                    <Input placeholder="New York" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Address</Field.Label>
                    <Input placeholder="123 Medical Drive" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
                  </Field.Root>
                  <Grid templateColumns="1fr 1fr" gap={4}>
                    <Field.Root>
                      <Field.Label>Phone</Field.Label>
                      <Input placeholder="+1-555-0000" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Email</Field.Label>
                      <Input type="email" placeholder="contact@hospital.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                    </Field.Root>
                  </Grid>
                </Stack>
              </Box>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button type="submit" form="add-hospital-form" colorPalette="teal">
                Add Hospital
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Stack>
  )
}
