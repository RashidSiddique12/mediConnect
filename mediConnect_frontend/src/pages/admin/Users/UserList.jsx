/**
 * @author Healthcare Appointment App
 * @description User list — super admin view of all platform users.
 * JIRA: HAA-ADM-003 #comment Admin users UI
 */

import { useState } from 'react'
import {
  Box, Stack, Heading, Text, Flex, Badge, Input, Table, Avatar, Button, Select, createListCollection,
} from '@chakra-ui/react'
import { MdSearch, MdPeople } from 'react-icons/md'
import { MOCK_USERS_LIST } from '@/services/mockApi'

const ROLE_COLOR = { super_admin: 'red', hospital_admin: 'purple', patient: 'teal' }
const ROLE_LABEL = { super_admin: 'Super Admin', hospital_admin: 'Hospital Admin', patient: 'Patient' }

const roleFilter = createListCollection({
  items: [
    { label: 'All Roles', value: '' },
    { label: 'Super Admin', value: 'super_admin' },
    { label: 'Hospital Admin', value: 'hospital_admin' },
    { label: 'Patient', value: 'patient' },
  ],
})

export default function UserList() {
  const [search, setSearch] = useState('')
  const [roleVal, setRoleVal] = useState('')
  const users = MOCK_USERS_LIST

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleVal ? u.role === roleVal : true
    return matchSearch && matchRole
  })

  const roleCounts = {
    total: users.length,
    patients: users.filter((u) => u.role === 'patient').length,
    hospitalAdmins: users.filter((u) => u.role === 'hospital_admin').length,
  }

  return (
    <Stack gap={6}>
      <Box>
        <Heading size="lg">User Management</Heading>
        <Text color="gray.500" fontSize="sm">Monitor all platform users</Text>
      </Box>

      {/* Summary Pills */}
      <Flex gap={3} wrap="wrap">
        {[
          { label: 'Total Users', value: roleCounts.total, color: 'teal' },
          { label: 'Patients', value: roleCounts.patients, color: 'green' },
          { label: 'Hospital Admins', value: roleCounts.hospitalAdmins, color: 'purple' },
        ].map(({ label, value, color }) => (
          <Box key={label} bg={`${color}.50`} border="1px solid" borderColor={`${color}.200`} px={4} py={2} rounded="lg">
            <Text fontSize="xs" color={`${color}.600`} fontWeight="500">{label}</Text>
            <Text fontSize="xl" fontWeight="700" color={`${color}.600`}>{value}</Text>
          </Box>
        ))}
      </Flex>

      {/* Filters */}
      <Flex gap={3} wrap="wrap">
        <Box position="relative" flex="1" minW="220px">
          <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1}>
            <MdSearch size={18} />
          </Box>
          <Input pl={9} placeholder="Search users…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </Box>
        <Select.Root collection={roleFilter} w="200px" onValueChange={(v) => setRoleVal(v.value[0] || '')}>
          <Select.Trigger>
            <Select.ValueText placeholder="Filter by role" />
          </Select.Trigger>
          <Select.Content>
            {roleFilter.items.map((item) => (
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
              <Table.ColumnHeader>User</Table.ColumnHeader>
              <Table.ColumnHeader>Role</Table.ColumnHeader>
              <Table.ColumnHeader>Details</Table.ColumnHeader>
              <Table.ColumnHeader>Joined</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filtered.map((u) => (
              <Table.Row key={u.id} _hover={{ bg: 'gray.50' }}>
                <Table.Cell>
                  <Flex align="center" gap={3}>
                    <Avatar.Root size="sm" bg="brand.500">
                      <Avatar.Fallback name={u.name} />
                    </Avatar.Root>
                    <Box>
                      <Text fontWeight="600" fontSize="sm">{u.name}</Text>
                      <Text fontSize="xs" color="gray.500">{u.email}</Text>
                    </Box>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={ROLE_COLOR[u.role] || 'gray'} size="sm">
                    {ROLE_LABEL[u.role] || u.role}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Text fontSize="xs" color="gray.500">
                    {u.hospitalName || u.phone || '—'}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text fontSize="sm">{u.joinedDate}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={u.status === 'active' ? 'green' : 'red'} size="sm">
                    {u.status}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      {filtered.length === 0 && (
        <Box textAlign="center" py={10} color="gray.400">
          <MdPeople size={40} style={{ margin: '0 auto 8px' }} />
          <Text>No users found</Text>
        </Box>
      )}
    </Stack>
  )
}
