import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Stack, Text, Flex, Badge, Button, Table, Select, createListCollection,
} from '@chakra-ui/react'
import { MdEventNote, MdArrowForward } from 'react-icons/md'
import PageHeader from '@/components/common/PageHeader'
import SearchInput from '@/components/common/SearchInput'
import EmptyState from '@/components/common/EmptyState'
import Loader from '@/components/common/Loader'
import * as appointmentSlice from '@/features/appointments/appointmentSlice'
import { selectAppointments, selectAppointmentsLoading } from '@/features/appointments/appointmentSelectors'

const STATUS_OPTIONS = createListCollection({
  items: [
    { label: 'All Status', value: '' },
    { label: 'Booked', value: 'booked' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ],
})

const STATUS_COLOR = { booked: 'green', completed: 'teal', cancelled: 'red' }

const SUMMARY_ITEMS = [
  { label: 'Total', key: 'total', color: 'gray' },
  { label: 'Booked', key: 'booked', color: 'green' },
  { label: 'Completed', key: 'completed', color: 'teal' },
  { label: 'Cancelled', key: 'cancelled', color: 'red' },
]

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function AppointmentList() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const appointments = useSelector(selectAppointments)
  const loading = useSelector(selectAppointmentsLoading)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    dispatch(appointmentSlice.fetchAppointmentsRequest({ limit: 100 }))
  }, [dispatch])

  const filtered = useMemo(() => {
    const term = search.toLowerCase()
    return appointments.filter((a) => {
      const matchSearch =
        (a.patientId?.name || '').toLowerCase().includes(term) ||
        (a.doctorId?.name || '').toLowerCase().includes(term)
      const matchStatus = statusFilter ? a.status === statusFilter : true
      return matchSearch && matchStatus
    })
  }, [appointments, search, statusFilter])

  const counts = useMemo(() => ({
    total: appointments.length,
    booked: appointments.filter((a) => a.status === 'booked').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  }), [appointments])

  const handleUpdateStatus = (id, status) =>
    dispatch(appointmentSlice.updateAppointmentRequest({ id, status }))

  const handleCancel = (id) =>
    dispatch(appointmentSlice.cancelAppointmentRequest(id))

  if (loading) return <Loader />

  return (
    <Stack gap={6}>
      <PageHeader title="Appointments" subtitle="Manage all hospital appointments" />

      {/* ─── Summary Chips ─── */}
      <Flex gap={3} wrap="wrap">
        {SUMMARY_ITEMS.map(({ label, key, color }) => (
          <Box
            key={key}
            bg={`${color}.50`}
            border="1px solid"
            borderColor={`${color}.200`}
            px={4}
            py={2}
            rounded="lg"
            _hover={{ shadow: 'sm' }}
            transition="shadow 0.15s"
          >
            <Text fontSize="xs" color={`${color}.600`} fontWeight="500">{label}</Text>
            <Text fontSize="xl" fontWeight="700" color={`${color}.600`}>{counts[key]}</Text>
          </Box>
        ))}
      </Flex>

      {/* ─── Filters ─── */}
      <Flex gap={3} wrap="wrap" align="center">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search patient or doctor…"
          flex="1"
          minW="200px"
          maxW="none"
        />
        <Select.Root
          collection={STATUS_OPTIONS}
          w="180px"
          onValueChange={(v) => setStatusFilter(v.value[0] || '')}
        >
          <Select.Trigger>
            <Select.ValueText placeholder="Filter status" />
          </Select.Trigger>
          <Select.Content>
            {STATUS_OPTIONS.items.map((item) => (
              <Select.Item key={item.value} item={item}>{item.label}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>

      {/* ─── Table ─── */}
      {filtered.length === 0 ? (
        <EmptyState
          search={search || statusFilter}
          title="No appointments yet"
          description="Appointments will appear here once patients start booking"
          icon={<MdEventNote size={36} />}
        />
      ) : (
        <Box overflowX="auto" rounded="xl" shadow="sm" borderWidth="1px">
          <Table.Root>
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader>Patient</Table.ColumnHeader>
                <Table.ColumnHeader>Doctor</Table.ColumnHeader>
                <Table.ColumnHeader>Date & Time</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.map((a) => (
                <Table.Row key={a._id} _hover={{ bg: 'gray.50' }} transition="background 0.15s">
                  <Table.Cell fontWeight="600" fontSize="sm">{a.patientId?.name || 'N/A'}</Table.Cell>
                  <Table.Cell fontSize="sm">{a.doctorId?.name || 'N/A'}</Table.Cell>
                  <Table.Cell fontSize="sm">
                    {formatDate(a.appointmentDate)}{' '}
                    <Text as="span" color="gray.500">{a.timeSlot}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={STATUS_COLOR[a.status] || 'gray'} size="sm">{a.status}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap={1} wrap="wrap">
                      {a.status === 'booked' && (
                        <>
                          <Button size="xs" colorPalette="teal" onClick={() => handleUpdateStatus(a._id, 'completed')}>
                            Complete
                          </Button>
                          <Button size="xs" variant="outline" colorPalette="red" onClick={() => handleCancel(a._id)}>
                            Cancel
                          </Button>
                        </>
                      )}
                      <Button
                        size="xs"
                        variant="ghost"
                        colorPalette="teal"
                        onClick={() => navigate(`/hospital/appointments/${a._id}`)}
                      >
                        <MdArrowForward />
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Stack>
  )
}
