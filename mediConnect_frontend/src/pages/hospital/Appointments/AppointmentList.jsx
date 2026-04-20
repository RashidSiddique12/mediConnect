/**
 * @author Healthcare Appointment App
 * @description Appointment List — hospital admin views all appointments.
 * JIRA: HAA-HOSP-008 #comment Hospital appointments UI
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Stack, Heading, Text, Flex, Badge, Button, Table, Input, Select, createListCollection,
} from '@chakra-ui/react'
import { MdSearch, MdEventNote, MdArrowForward } from 'react-icons/md'
import { MOCK_APPOINTMENTS } from '@/services/mockApi'

const STATUS_OPTIONS = createListCollection({
  items: [
    { label: 'All Status', value: '' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ],
})

const STATUS_COLOR = { confirmed: 'green', pending: 'orange', completed: 'teal', cancelled: 'red' }

export default function AppointmentList() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState(
    MOCK_APPOINTMENTS.filter((a) => a.hospitalId === 'h-001')
  )
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = appointments.filter((a) => {
    const matchSearch = a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter ? a.status === statusFilter : true
    return matchSearch && matchStatus
  })

  const updateStatus = (id, status) => {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status } : a))
  }

  const counts = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
  }

  return (
    <Stack gap={6}>
      <Box>
        <Heading size="lg">Appointments</Heading>
        <Text color="gray.500" fontSize="sm">Manage all hospital appointments</Text>
      </Box>

      {/* Summary */}
      <Flex gap={3} wrap="wrap">
        {[
          { label: 'Total', value: counts.total, color: 'gray' },
          { label: 'Pending', value: counts.pending, color: 'orange' },
          { label: 'Confirmed', value: counts.confirmed, color: 'green' },
          { label: 'Completed', value: counts.completed, color: 'teal' },
        ].map(({ label, value, color }) => (
          <Box key={label} bg={`${color}.50`} border="1px solid" borderColor={`${color}.200`} px={4} py={2} rounded="lg">
            <Text fontSize="xs" color={`${color}.600`} fontWeight="500">{label}</Text>
            <Text fontSize="xl" fontWeight="700" color={`${color}.600`}>{value}</Text>
          </Box>
        ))}
      </Flex>

      {/* Filters */}
      <Flex gap={3} wrap="wrap">
        <Box position="relative" flex="1" minW="200px">
          <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1}>
            <MdSearch size={18} />
          </Box>
          <Input pl={9} placeholder="Search patient or doctor…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </Box>
        <Select.Root collection={STATUS_OPTIONS} w="180px" onValueChange={(v) => setStatusFilter(v.value[0] || '')}>
          <Select.Trigger><Select.ValueText placeholder="Filter status" /></Select.Trigger>
          <Select.Content>
            {STATUS_OPTIONS.items.map((item) => (
              <Select.Item key={item.value} item={item}>{item.label}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>

      {/* Table */}
      <Box overflowX="auto" rounded="xl" shadow="sm" borderWidth="1px">
        <Table.Root>
          <Table.Header>
            <Table.Row bg="gray.50">
              <Table.ColumnHeader>Patient</Table.ColumnHeader>
              <Table.ColumnHeader>Doctor</Table.ColumnHeader>
              <Table.ColumnHeader>Specialty</Table.ColumnHeader>
              <Table.ColumnHeader>Date & Time</Table.ColumnHeader>
              <Table.ColumnHeader>Fee</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filtered.map((a) => (
              <Table.Row key={a.id} _hover={{ bg: 'gray.50' }}>
                <Table.Cell fontWeight="600" fontSize="sm">{a.patientName}</Table.Cell>
                <Table.Cell fontSize="sm">{a.doctorName}</Table.Cell>
                <Table.Cell>
                  <Badge colorPalette="teal" size="sm" variant="outline">{a.specialty}</Badge>
                </Table.Cell>
                <Table.Cell fontSize="sm">
                  {a.date} <Text as="span" color="gray.500">{a.time}</Text>
                </Table.Cell>
                <Table.Cell fontSize="sm" color="teal.600" fontWeight="600">${a.fee}</Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={STATUS_COLOR[a.status] || 'gray'} size="sm">{a.status}</Badge>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap={1} wrap="wrap">
                    {a.status === 'confirmed' && (
                      <Button size="xs" colorPalette="teal" onClick={() => updateStatus(a.id, 'completed')}>
                        Complete
                      </Button>
                    )}
                    {a.status === 'pending' && (
                      <Button size="xs" colorPalette="green" onClick={() => updateStatus(a.id, 'confirmed')}>
                        Confirm
                      </Button>
                    )}
                    {(a.status === 'confirmed' || a.status === 'pending') && (
                      <Button size="xs" variant="outline" colorPalette="red" onClick={() => updateStatus(a.id, 'cancelled')}>
                        Cancel
                      </Button>
                    )}
                    <Button size="xs" variant="ghost" colorPalette="teal"
                      onClick={() => navigate(`/hospital/appointments/${a.id}`)}>
                      <MdArrowForward />
                    </Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      {filtered.length === 0 && (
        <Box textAlign="center" py={10} color="gray.400">
          <MdEventNote size={40} style={{ margin: '0 auto 8px' }} />
          <Text>No appointments found</Text>
        </Box>
      )}
    </Stack>
  )
}
