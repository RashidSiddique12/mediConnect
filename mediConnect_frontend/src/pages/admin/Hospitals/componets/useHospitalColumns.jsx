import {
  Flex, Text, Badge, Box, IconButton, Avatar,
  MenuRoot, MenuTrigger, MenuContent, MenuItem, MenuPositioner,
} from '@chakra-ui/react'
import {
  MdLocationOn, MdPerson, MdEventNote, MdStar, MdEdit, MdCancel,
  MdCheckCircle, MdVisibility, MdMoreVert, MdPhone, MdBusiness,
  MdAdminPanelSettings,
} from 'react-icons/md'

export default function useHospitalColumns(onView, onEdit, onToggle) {
  return [
    {
      key: 'name',
      header: 'Hospital',
      width: '250px',
      accessor: (row) => row.name,
      render: (_, row) => (
        <Flex align="center" gap={3} cursor="pointer" onClick={() => onView(row._id)}>
          <Avatar.Root size="sm" bg="teal.100">
            <Avatar.Fallback color="teal.600" name={row.name} />
          </Avatar.Root>
          <Text fontWeight="600" lineClamp={1} color="teal.700" _hover={{ textDecoration: 'underline' }}>{row.name}</Text>
        </Flex>
      ),
    },
    {
      key: 'city',
      header: 'Location',
      accessor: (row) => row.address?.city || '',
      render: (_, row) => (
        <Flex align="center" gap={1} color="gray.500">
          <MdLocationOn size={14} />
          <Text fontSize="sm">{row.address?.city || 'N/A'}</Text>
        </Flex>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (val) => (
        <Flex align="center" gap={1} color="gray.600">
          <MdBusiness size={14} />
          <Text fontSize="sm" textTransform="capitalize">{val || 'N/A'}</Text>
        </Flex>
      ),
    },
    {
      key: 'admin',
      header: 'Admin',
      accessor: (row) => row.hospitalAdminId?.name || '',
      render: (_, row) => {
        const admin = row.hospitalAdminId
        return admin ? (
          <Flex align="center" gap={1} color="gray.600">
            <MdAdminPanelSettings size={14} />
            <Text fontSize="sm" lineClamp={1}>{admin.name}</Text>
          </Flex>
        ) : (
          <Text fontSize="sm" color="gray.400">—</Text>
        )
      },
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (val) => (
        <Flex align="center" gap={1} color="gray.500">
          <MdPhone size={14} />
          <Text fontSize="sm">{val || 'N/A'}</Text>
        </Flex>
      ),
    },
    {
      key: 'totalDoctors',
      header: 'Doctors',
      align: 'center',
      render: (val) => (
        <Flex align="center" justify="center" gap={1}>
          <MdPerson size={14} color="var(--chakra-colors-blue-400)" />
          <Text fontSize="sm" fontWeight="600" color="blue.600">{val || 0}</Text>
        </Flex>
      ),
    },
    {
      key: 'totalAppointments',
      header: 'Appointments',
      align: 'center',
      render: (val) => (
        <Flex align="center" justify="center" gap={1}>
          <MdEventNote size={14} color="var(--chakra-colors-purple-400)" />
          <Text fontSize="sm" fontWeight="600" color="purple.600">{val || 0}</Text>
        </Flex>
      ),
    },
    // {
    //   key: 'rating',
    //   header: 'Rating',
    //   align: 'center',
    //   render: (val) => (
    //     <Flex align="center" justify="center" gap={1}>
    //       <MdStar size={14} color="var(--chakra-colors-orange-400)" />
    //       <Text fontSize="sm" fontWeight="600" color="orange.600">{val || '—'}</Text>
    //     </Flex>
    //   ),
    // },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (val) => {
        const isActive = val === 'active'
        return (
          <Badge
            colorPalette={isActive ? 'teal' : 'gray'}
            size="sm"
            display="inline-flex"
            alignItems="center"
            gap={1}
            variant="subtle"
          >
            <Box w="6px" h="6px" rounded="full" bg={isActive ? 'teal.400' : 'gray.400'} />
            {val}
          </Badge>
        )
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      sortable: false,
      render: (_, row) => {
        const isActive = row.status === 'active'
        return (
          <Flex justify="flex-end">
            <MenuRoot>
              <MenuTrigger asChild>
                <IconButton
                  size="xs"
                  variant="ghost"
                  colorPalette="gray"
                  aria-label="Actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MdMoreVert />
                </IconButton>
              </MenuTrigger>
              <MenuPositioner>
                <MenuContent minW="150px">
                  <MenuItem value="view" onClick={(e) => { e.stopPropagation(); onView(row._id) }}>
                    <MdVisibility /> View
                  </MenuItem>
                  <MenuItem value="edit" onClick={(e) => { e.stopPropagation(); onEdit(row._id) }}>
                    <MdEdit /> Edit
                  </MenuItem>
                  <MenuItem
                    value="toggle"
                    color={isActive ? 'red.500' : 'green.500'}
                    onClick={(e) => { e.stopPropagation(); onToggle(row) }}
                  >
                    {isActive ? <><MdCancel /> Deactivate</> : <><MdCheckCircle /> Activate</>}
                  </MenuItem>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          </Flex>
        )
      },
    },
  ]
}
