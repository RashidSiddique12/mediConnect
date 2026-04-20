/**
 * @author Healthcare Appointment App
 * @description Specialty List — super admin manages medical specialties.
 * JIRA: HAA-ADM-004 #comment Admin specialties UI
 */

import { useState } from 'react'
import {
  Box, Stack, Heading, Text, Flex, Badge, Input, Button, Card, Grid, Dialog, Field,
} from '@chakra-ui/react'
import { MdAdd, MdSearch, MdMedicalServices, MdEdit, MdDelete } from 'react-icons/md'
import { MOCK_SPECIALTIES } from '@/services/mockApi'

export default function SpecialtyList() {
  const [specialties, setSpecialties] = useState(MOCK_SPECIALTIES)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState({ name: '', icon: '🏥' })

  const filtered = specialties.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))

  const handleAdd = (e) => {
    e.preventDefault()
    if (editTarget) {
      setSpecialties((prev) => prev.map((s) => s.id === editTarget.id ? { ...s, ...form } : s))
      setEditTarget(null)
    } else {
      setSpecialties((prev) => [{ id: `s-${Date.now()}`, ...form, totalDoctors: 0 }, ...prev])
    }
    setForm({ name: '', icon: '🏥' })
    setShowAdd(false)
  }

  const openEdit = (s) => {
    setEditTarget(s)
    setForm({ name: s.name, icon: s.icon })
    setShowAdd(true)
  }

  const handleDelete = (id) => {
    setSpecialties((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <Stack gap={6}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Box>
          <Heading size="lg">Medical Specialties</Heading>
          <Text color="gray.500" fontSize="sm">{specialties.length} specialties configured</Text>
        </Box>
        <Button colorPalette="teal" onClick={() => { setEditTarget(null); setForm({ name: '', icon: '🏥' }); setShowAdd(true) }}>
          <MdAdd /> Add Specialty
        </Button>
      </Flex>

      {/* Search */}
      <Box position="relative" maxW="400px">
        <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1}>
          <MdSearch size={18} />
        </Box>
        <Input pl={9} placeholder="Search specialties…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </Box>

      {/* Specialty Grid */}
      <Grid templateColumns="repeat(auto-fill, minmax(220px, 1fr))" gap={4}>
        {filtered.map((s) => (
          <Card.Root key={s.id} shadow="sm" rounded="xl" _hover={{ shadow: 'md', transform: 'translateY(-2px)' }} transition="all 0.2s">
            <Card.Body>
              <Flex justify="space-between" align="flex-start" mb={3}>
                <Box fontSize="3xl">{s.icon}</Box>
                <Flex gap={1}>
                  <Button size="xs" variant="ghost" colorPalette="teal" onClick={() => openEdit(s)}>
                    <MdEdit />
                  </Button>
                  <Button size="xs" variant="ghost" colorPalette="red" onClick={() => handleDelete(s.id)}>
                    <MdDelete />
                  </Button>
                </Flex>
              </Flex>
              <Text fontWeight="700" fontSize="md">{s.name}</Text>
              <Flex align="center" gap={2} mt={2}>
                <MdMedicalServices color="#0b9c9c" size={14} />
                <Text fontSize="xs" color="gray.500">{s.totalDoctors} doctors</Text>
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      {filtered.length === 0 && (
        <Box textAlign="center" py={10} color="gray.400">
          <Text>No specialties found</Text>
        </Box>
      )}

      {/* Add/Edit Modal */}
      <Dialog.Root open={showAdd} onOpenChange={(e) => { setShowAdd(e.open); if (!e.open) setEditTarget(null) }}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="xl" maxW="400px">
            <Dialog.Header>
              <Dialog.Title>{editTarget ? 'Edit Specialty' : 'Add Specialty'}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Box as="form" id="specialty-form" onSubmit={handleAdd}>
                <Stack gap={4}>
                  <Field.Root required>
                    <Field.Label>Specialty Name</Field.Label>
                    <Input placeholder="e.g. Cardiology" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Icon (emoji)</Field.Label>
                    <Input placeholder="🏥" value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} />
                  </Field.Root>
                </Stack>
              </Box>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button type="submit" form="specialty-form" colorPalette="teal">
                {editTarget ? 'Save Changes' : 'Add Specialty'}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Stack>
  )
}
