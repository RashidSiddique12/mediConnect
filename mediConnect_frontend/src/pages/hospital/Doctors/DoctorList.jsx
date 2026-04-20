/**
 * @author Healthcare Appointment App
 * @description Doctor List — hospital admin manages doctors.
 * JIRA: HAA-HOSP-002 #comment Hospital doctors UI
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Stack, Heading, Text, Flex, Badge, Button, Card, Grid, Input, Avatar, Dialog,
} from '@chakra-ui/react'
import { MdAdd, MdSearch, MdEdit, MdDelete, MdStar, MdPerson } from 'react-icons/md'
import { MOCK_DOCTORS } from '@/services/mockApi'

export default function DoctorList() {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState(MOCK_DOCTORS.filter((d) => d.hospitalId === 'h-001'))
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = doctors.filter(
    (d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = () => {
    setDoctors((prev) => prev.filter((d) => d.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <Stack gap={6}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Box>
          <Heading size="lg">Doctor Management</Heading>
          <Text color="gray.500" fontSize="sm">{doctors.length} doctors in your hospital</Text>
        </Box>
        <Button colorPalette="teal" onClick={() => navigate('/hospital/doctors/add')}>
          <MdAdd /> Add Doctor
        </Button>
      </Flex>

      <Box position="relative" maxW="400px">
        <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1}>
          <MdSearch size={18} />
        </Box>
        <Input pl={9} placeholder="Search doctors…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </Box>

      <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={4}>
        {filtered.map((d) => (
          <Card.Root key={d.id} shadow="sm" rounded="xl" _hover={{ shadow: 'md' }} transition="all 0.2s">
            <Card.Body>
              <Flex justify="space-between" align="flex-start" mb={4}>
                <Flex align="center" gap={3}>
                  <Avatar.Root size="lg" bg="teal.500">
                    <Avatar.Fallback name={d.name} />
                  </Avatar.Root>
                  <Box>
                    <Text fontWeight="700">{d.name}</Text>
                    <Badge colorPalette="teal" size="sm" mt={1}>{d.specialty}</Badge>
                  </Box>
                </Flex>
                <Flex gap={1}>
                  <Button size="xs" variant="ghost" colorPalette="teal" onClick={() => navigate(`/hospital/doctors/edit/${d.id}`)}>
                    <MdEdit />
                  </Button>
                  <Button size="xs" variant="ghost" colorPalette="red" onClick={() => setDeleteTarget(d)}>
                    <MdDelete />
                  </Button>
                </Flex>
              </Flex>

              <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                <Box textAlign="center" bg="gray.50" rounded="md" py={2}>
                  <Text fontSize="xs" color="gray.400">Exp</Text>
                  <Text fontWeight="700" fontSize="sm">{d.experience}y</Text>
                </Box>
                <Box textAlign="center" bg="gray.50" rounded="md" py={2}>
                  <Text fontSize="xs" color="gray.400">Fee</Text>
                  <Text fontWeight="700" fontSize="sm" color="teal.600">${d.fee}</Text>
                </Box>
                <Box textAlign="center" bg="gray.50" rounded="md" py={2}>
                  <Text fontSize="xs" color="gray.400">Rating</Text>
                  <Flex align="center" justify="center" gap={1}>
                    <MdStar color="#F6AD55" size={12} />
                    <Text fontWeight="700" fontSize="sm">{d.rating}</Text>
                  </Flex>
                </Box>
              </Grid>

              <Button size="sm" w="full" variant="outline" colorPalette="teal" mt={3}
                onClick={() => navigate(`/hospital/schedules/slots/${d.id}`)}>
                <MdPerson /> Manage Schedule
              </Button>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      {filtered.length === 0 && (
        <Box textAlign="center" py={12} color="gray.400">
          <MdPerson size={48} style={{ margin: '0 auto 8px' }} />
          <Text>No doctors found</Text>
        </Box>
      )}

      {/* Delete Confirmation */}
      <Dialog.Root open={!!deleteTarget} onOpenChange={(e) => !e.open && setDeleteTarget(null)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="xl" maxW="380px">
            <Dialog.Header><Dialog.Title>Remove Doctor</Dialog.Title></Dialog.Header>
            <Dialog.Body>
              <Text>Are you sure you want to remove <strong>{deleteTarget?.name}</strong> from your hospital?</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette="red" onClick={handleDelete}>Remove</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Stack>
  )
}
