import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Stack, Text, Flex, Badge, Button, Card, Grid, Avatar, Dialog,
} from '@chakra-ui/react'
import { MdAdd, MdEdit, MdDelete, MdPerson } from 'react-icons/md'
import PageHeader from '@/components/common/PageHeader'
import SearchInput from '@/components/common/SearchInput'
import EmptyState from '@/components/common/EmptyState'
import Loader from '@/components/common/Loader'
import * as doctorSlice from '@/features/doctors/doctorSlice'
import { selectDoctors, selectDoctorsLoading } from '@/features/doctors/doctorSelectors'
import { selectDashboardData } from '@/features/dashboard/dashboardSelectors'

const STAT_ITEMS = [
  { key: 'experience', label: 'Exp', format: (v) => `${v || 0}y` },
  { key: 'consultationFee', label: 'Fee', format: (v) => `$${v || 0}`, color: 'teal.600' },
]

export default function DoctorList() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const doctors = useSelector(selectDoctors)
  const loading = useSelector(selectDoctorsLoading)
  const dashboardData = useSelector(selectDashboardData)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const hospitalId = dashboardData?.hospital?._id

  useEffect(() => {
    if (hospitalId) dispatch(doctorSlice.fetchDoctorsRequest({ hospitalId }))
  }, [dispatch, hospitalId])

  const filtered = useMemo(() => {
    const term = search.toLowerCase()
    return doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(term) ||
        (d.specialtyIds?.[0]?.name || '').toLowerCase().includes(term),
    )
  }, [doctors, search])

  const handleDelete = () => {
    dispatch(doctorSlice.deleteDoctorRequest(deleteTarget._id))
    setDeleteTarget(null)
  }

  if (loading) return <Loader />

  return (
    <Stack gap={6}>
      <PageHeader
        title="Doctor Management"
        subtitle={`${doctors.length} doctors in your hospital`}
        actions={[
          <Button key="add" colorPalette="teal" onClick={() => navigate('/hospital/doctors/add')}>
            <MdAdd /> Add Doctor
          </Button>,
        ]}
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search doctors by name or specialty…"
      />

      {filtered.length === 0 ? (
        <EmptyState
          search={search}
          title="No doctors yet"
          description="Add your first doctor to get started"
          icon={<MdPerson size={36} />}
          actionLabel="Add Doctor"
          onAction={() => navigate('/hospital/doctors/add')}
        />
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={4}>
          {filtered.map((d) => (
            <Card.Root
              key={d._id}
              shadow="sm"
              rounded="xl"
              _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
              transition="all 0.2s"
            >
              <Card.Body>
                <Flex justify="space-between" align="flex-start" mb={4}>
                  <Flex align="center" gap={3}>
                    <Avatar.Root size="lg" bg="teal.500">
                      <Avatar.Fallback name={d.name} />
                    </Avatar.Root>
                    <Box>
                      <Text fontWeight="700">{d.name}</Text>
                      <Badge colorPalette="teal" size="sm" mt={1}>
                        {d.specialtyIds?.[0]?.name || 'General'}
                      </Badge>
                    </Box>
                  </Flex>
                  <Flex gap={1}>
                    <Button
                      size="xs"
                      variant="ghost"
                      colorPalette="teal"
                      onClick={() => navigate(`/hospital/doctors/edit/${d._id}`)}
                    >
                      <MdEdit />
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      colorPalette="red"
                      onClick={() => setDeleteTarget(d)}
                    >
                      <MdDelete />
                    </Button>
                  </Flex>
                </Flex>

                <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                  {STAT_ITEMS.map(({ key, label, format, color }) => (
                    <Box key={key} textAlign="center" bg="gray.50" rounded="md" py={2}>
                      <Text fontSize="xs" color="gray.400">{label}</Text>
                      <Text fontWeight="700" fontSize="sm" color={color}>{format(d[key])}</Text>
                    </Box>
                  ))}
                  <Box textAlign="center" bg="gray.50" rounded="md" py={2}>
                    <Text fontSize="xs" color="gray.400">Status</Text>
                    <Badge colorPalette={d.status === 'active' ? 'green' : 'red'} size="sm">
                      {d.status}
                    </Badge>
                  </Box>
                </Grid>

                <Button
                  size="sm"
                  w="full"
                  variant="outline"
                  colorPalette="teal"
                  mt={3}
                  onClick={() => navigate(`/hospital/schedules/slots/${d._id}`)}
                >
                  <MdPerson /> Manage Schedule
                </Button>
              </Card.Body>
            </Card.Root>
          ))}
        </Grid>
      )}

      {/* ─── Delete Confirmation ─── */}
      <Dialog.Root open={!!deleteTarget} onOpenChange={(e) => !e.open && setDeleteTarget(null)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="xl" maxW="380px">
            <Dialog.Header>
              <Dialog.Title>Remove Doctor</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>
                Are you sure you want to remove <strong>{deleteTarget?.name}</strong> from your hospital?
              </Text>
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
