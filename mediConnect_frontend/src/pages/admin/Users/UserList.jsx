
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Stack, Heading, Text, Flex, Badge, Input, Table, Avatar, Button, Select, createListCollection,
  Spinner, Center, Card, Grid,
} from '@chakra-ui/react'
import { MdSearch, MdPeople, MdClose, MdPerson, MdAdminPanelSettings, MdLocalHospital } from 'react-icons/md'
import * as userSlice from '@/features/users/userSlice'
import * as userSelectors from '@/features/users/userSelectors'

const ROLE_COLOR = { super_admin: 'red', hospital_admin: 'purple', patient: 'teal' }
const ROLE_LABEL = { super_admin: 'Super Admin', hospital_admin: 'Hospital Admin', patient: 'Patient' }
const ROLE_ICON = { super_admin: MdAdminPanelSettings, hospital_admin: MdLocalHospital, patient: MdPerson }

const roleFilter = createListCollection({
  items: [
    { label: 'All Roles', value: '' },
    { label: 'Super Admin', value: 'super_admin' },
    { label: 'Hospital Admin', value: 'hospital_admin' },
    { label: 'Patient', value: 'patient' },
  ],
})

export default function UserList() {
  const dispatch = useDispatch()
  const users = useSelector(userSelectors.selectUsers)
  const loading = useSelector(userSelectors.selectUsersLoading)
  const [search, setSearch] = useState('')
  const [roleVal, setRoleVal] = useState('')

  useEffect(() => {
    dispatch(userSlice.fetchUsersRequest({ limit: 100 }))
  }, [dispatch])

  if (loading) return <Center py={12}><Spinner size="xl" color="teal.500" /></Center>

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleVal ? u.role === roleVal : true
    return matchSearch && matchRole
  })

  const roleCounts = {
    total: users.length,
    patients: users.filter((u) => u.role === 'patient').length,
    hospitalAdmins: users.filter((u) => u.role === 'hospital_admin').length,
    superAdmins: users.filter((u) => u.role === 'super_admin').length,
  }

  return (
    <Stack gap={6}>
      {/* Header */}
      <Flex align="center" gap={3}>
        <Box color="blue.500" bg="blue.50" p={2.5} rounded="xl">
          <MdPeople size={22} />
        </Box>
        <Box>
          <Heading size="lg">User Management</Heading>
          <Text color="gray.500" fontSize="sm">Monitor and manage all platform accounts</Text>
        </Box>
      </Flex>

      {/* Summary Cards */}
      <Grid templateColumns="repeat(auto-fit, minmax(140px, 1fr))" gap={3}>
        {[
          { label: 'Total Users', value: roleCounts.total, color: 'teal', icon: MdPeople },
          { label: 'Patients', value: roleCounts.patients, color: 'green', icon: MdPerson },
          { label: 'Hospital Admins', value: roleCounts.hospitalAdmins, color: 'purple', icon: MdLocalHospital },
          { label: 'Super Admins', value: roleCounts.superAdmins, color: 'red', icon: MdAdminPanelSettings },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card.Root key={label} shadow="sm" rounded="xl" _hover={{ shadow: 'md' }} transition="all 0.15s">
            <Card.Body py={3} px={4}>
              <Flex align="center" gap={3}>
                <Box color={`${color}.500`} bg={`${color}.50`} p={2} rounded="lg">
                  <Icon size={18} />
                </Box>
                <Box>
                  <Text fontSize="2xl" fontWeight="700" color={`${color}.600`} lineHeight="1">{value}</Text>
                  <Text fontSize="xs" color="gray.500">{label}</Text>
                </Box>
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      {/* Filters */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body py={3}>
          <Flex gap={3} wrap="wrap" align="center">
            <Box position="relative" flex="1" minW="220px" maxW="400px">
              <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1}>
                <MdSearch size={18} />
              </Box>
              <Input
                pl={9}
                pr={search ? 8 : 3}
                placeholder="Search by name or email…"
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
            {(search || roleVal) && (
              <Button
                size="sm"
                variant="ghost"
                colorPalette="gray"
                onClick={() => { setSearch(''); setRoleVal('') }}
              >
                Clear filters
              </Button>
            )}
          </Flex>
        </Card.Body>
      </Card.Root>

      {search && (
        <Text fontSize="sm" color="gray.500">
          Showing {filtered.length} of {users.length} users
        </Text>
      )}

      {/* Table */}
      <Card.Root shadow="sm" rounded="xl" overflow="hidden">
        <Box overflowX="auto">
          <Table.Root>
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader pl={4}>User</Table.ColumnHeader>
                <Table.ColumnHeader>Role</Table.ColumnHeader>
                <Table.ColumnHeader>Details</Table.ColumnHeader>
                <Table.ColumnHeader>Joined</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">Status</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.map((u) => {
                const RoleIcon = ROLE_ICON[u.role] || MdPerson
                return (
                  <Table.Row key={u.id} _hover={{ bg: 'brand.50' }} transition="background 0.1s">
                    <Table.Cell pl={4}>
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
                      <Badge
                        colorPalette={ROLE_COLOR[u.role] || 'gray'}
                        size="sm"
                        display="inline-flex"
                        alignItems="center"
                        gap={1}
                      >
                        <RoleIcon size={12} />
                        {ROLE_LABEL[u.role] || u.role}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="xs" color="gray.500">
                        {u.hospitalName || u.phone || '—'}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm" color="gray.600">{u.joinedDate}</Text>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Badge
                        colorPalette={u.status === 'active' ? 'green' : 'red'}
                        size="sm"
                        display="inline-flex"
                        alignItems="center"
                        gap={1}
                      >
                        <Box w="6px" h="6px" rounded="full" bg={u.status === 'active' ? 'green.400' : 'red.400'} />
                        {u.status}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table.Root>
        </Box>
      </Card.Root>

      {filtered.length === 0 && (
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body textAlign="center" py={12}>
            <MdPeople size={48} style={{ margin: '0 auto 12px', opacity: 0.3, color: '#CBD5E0' }} />
            <Text fontWeight="600" color="gray.500" mb={1}>No users found</Text>
            <Text fontSize="sm" color="gray.400">
              {search || roleVal ? 'Try adjusting your search or filter criteria.' : 'Users will appear here once they register.'}
            </Text>
            {(search || roleVal) && (
              <Button
                size="sm"
                variant="outline"
                colorPalette="teal"
                mt={3}
                onClick={() => { setSearch(''); setRoleVal('') }}
              >
                Clear Filters
              </Button>
            )}
          </Card.Body>
        </Card.Root>
      )}
    </Stack>
  )
}
