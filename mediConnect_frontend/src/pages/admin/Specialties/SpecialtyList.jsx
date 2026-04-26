
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Stack, Heading, Text, Flex, Badge, Input, Button, Card, Grid, Dialog, Field, Spinner, Center,
} from '@chakra-ui/react'
import { MdAdd, MdSearch, MdMedicalServices, MdEdit, MdDelete, MdClose, MdWarning } from 'react-icons/md'
import * as specialtySlice from '@/features/specialties/specialtySlice'
import * as specialtySelectors from '@/features/specialties/specialtySelectors'

export default function SpecialtyList() {
  const dispatch = useDispatch()
  const specialties = useSelector(specialtySelectors.selectSpecialties)
  const loading = useSelector(specialtySelectors.selectSpecialtiesLoading)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({ name: '', icon: '🏥' })

  useEffect(() => {
    dispatch(specialtySlice.fetchSpecialtiesRequest())
  }, [dispatch])

  if (loading) return <Center py={12}><Spinner size="xl" color="teal.500" /></Center>

  const filtered = specialties.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
  const totalDoctors = specialties.reduce((sum, s) => sum + (s.totalDoctors || 0), 0)

  const handleAdd = (e) => {
    e.preventDefault()
    if (editTarget) {
      dispatch(specialtySlice.updateSpecialtyRequest({ id: editTarget._id, data: form }))
      setEditTarget(null)
    } else {
      dispatch(specialtySlice.addSpecialtyRequest(form))
    }
    setForm({ name: '', icon: '🏥' })
    setShowAdd(false)
  }

  const openEdit = (s) => {
    setEditTarget(s)
    setForm({ name: s.name, icon: s.icon || '🏥' })
    setShowAdd(true)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      dispatch(specialtySlice.deleteSpecialtyRequest(deleteTarget._id))
      setDeleteTarget(null)
    }
  }

  return (
    <Stack gap={6}>
      {/* Header */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Flex align="center" gap={3}>
          <Box color="purple.500" bg="purple.50" p={2.5} rounded="xl">
            <MdMedicalServices size={22} />
          </Box>
          <Box>
            <Heading size="lg">Medical Specialties</Heading>
            <Flex align="center" gap={2} mt={0.5}>
              <Text color="gray.500" fontSize="sm">{specialties.length} specialties</Text>
              <Text color="gray.300">&bull;</Text>
              <Text color="gray.500" fontSize="sm">{totalDoctors} doctors total</Text>
            </Flex>
          </Box>
        </Flex>
        <Button colorPalette="teal" onClick={() => { setEditTarget(null); setForm({ name: '', icon: '🏥' }); setShowAdd(true) }}>
          <MdAdd /> Add Specialty
        </Button>
      </Flex>

      {/* Search */}
      <Box position="relative" maxW="400px">
        <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1}>
          <MdSearch size={18} />
        </Box>
        <Input
          pl={9}
          pr={search ? 8 : 3}
          placeholder="Search specialties…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <Box
            position="absolute"
            right={3}
            top="50%"
            transform="translateY(-50%)"
            color="gray.400"
            cursor="pointer"
            onClick={() => setSearch('')}
            zIndex={1}
            _hover={{ color: 'gray.600' }}
          >
            <MdClose size={16} />
          </Box>
        )}
      </Box>

      {search && (
        <Text fontSize="sm" color="gray.500">
          Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
        </Text>
      )}

      {/* Specialty Grid */}
      <Grid templateColumns="repeat(auto-fill, minmax(240px, 1fr))" gap={4}>
        {filtered.map((s) => (
          <Card.Root
            key={s._id}
            shadow="sm"
            rounded="xl"
            _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
            borderWidth="1px"
            borderColor="gray.100"
          >
            <Card.Body>
              <Flex justify="space-between" align="flex-start" mb={4}>
                <Box
                  fontSize="2xl"
                  bg="gray.50"
                  w="48px"
                  h="48px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  rounded="xl"
                >
                  {s.icon || '🏥'}
                </Box>
                <Flex gap={0.5}>
                  <Button
                    size="xs"
                    variant="ghost"
                    colorPalette="teal"
                    onClick={() => openEdit(s)}
                    title="Edit specialty"
                  >
                    <MdEdit />
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    colorPalette="red"
                    onClick={() => setDeleteTarget(s)}
                    title="Delete specialty"
                  >
                    <MdDelete />
                  </Button>
                </Flex>
              </Flex>
              <Text fontWeight="700" fontSize="md" mb={2}>{s.name}</Text>
              <Flex align="center" justify="space-between">
                <Flex align="center" gap={2}>
                  <MdMedicalServices color="#0b9c9c" size={14} />
                  <Text fontSize="sm" color="gray.600" fontWeight="500">{s.totalDoctors || 0} doctors</Text>
                </Flex>
                {(s.totalDoctors || 0) > 0 && (
                  <Badge colorPalette="teal" size="sm" variant="subtle">Active</Badge>
                )}
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      {filtered.length === 0 && (
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body textAlign="center" py={10}>
            <MdMedicalServices size={48} style={{ margin: '0 auto 12px', opacity: 0.3, color: '#CBD5E0' }} />
            <Text fontWeight="600" color="gray.500" mb={1}>No specialties found</Text>
            <Text fontSize="sm" color="gray.400">
              {search ? `No results for "${search}". Try a different keyword.` : 'Add your first medical specialty to get started.'}
            </Text>
            {!search && (
              <Button
                size="sm"
                colorPalette="teal"
                mt={4}
                onClick={() => { setEditTarget(null); setForm({ name: '', icon: '🏥' }); setShowAdd(true) }}
              >
                <MdAdd /> Add Specialty
              </Button>
            )}
          </Card.Body>
        </Card.Root>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={!!deleteTarget} onOpenChange={(e) => { if (!e.open) setDeleteTarget(null) }}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="xl" maxW="400px">
            <Dialog.Header>
              <Flex align="center" gap={2}>
                <Box color="red.500"><MdWarning size={20} /></Box>
                <Dialog.Title>Delete Specialty</Dialog.Title>
              </Flex>
            </Dialog.Header>
            <Dialog.Body>
              <Text fontSize="sm" color="gray.600">
                Are you sure you want to delete{' '}
                <Text as="span" fontWeight="700">{deleteTarget?.name}</Text>?
              </Text>
              {(deleteTarget?.totalDoctors || 0) > 0 && (
                <Box bg="red.50" p={3} rounded="lg" mt={3}>
                  <Text fontSize="xs" color="red.600" fontWeight="500">
                    This specialty has {deleteTarget.totalDoctors} doctor{deleteTarget.totalDoctors > 1 ? 's' : ''} assigned. They will need to be reassigned.
                  </Text>
                </Box>
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button colorPalette="red" onClick={confirmDelete}>
                <MdDelete /> Delete
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {/* Add/Edit Modal */}
      <Dialog.Root open={showAdd} onOpenChange={(e) => { setShowAdd(e.open); if (!e.open) setEditTarget(null) }}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="xl" maxW="400px">
            <Dialog.Header>
              <Flex align="center" gap={2}>
                <Box color="teal.500"><MdMedicalServices size={20} /></Box>
                <Dialog.Title>{editTarget ? 'Edit Specialty' : 'Add Specialty'}</Dialog.Title>
              </Flex>
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
                    <Text fontSize="xs" color="gray.400" mt={1}>Choose an emoji to represent this specialty</Text>
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
