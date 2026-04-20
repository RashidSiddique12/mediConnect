/**
 * @author Healthcare Appointment App
 * @description Header component — user info, role badge, logout.
 * JIRA: HAA-006 #comment Layout header
 */

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, Heading, Button, Text, Badge, Avatar } from '@chakra-ui/react'
import { MdLogout, MdNotifications } from 'react-icons/md'
import { FaHospitalUser } from 'react-icons/fa'
import { logout } from '@/pages/auth/authSlice'

const ROLE_COLORS = {
  super_admin:   'red',
  hospital_admin: 'purple',
  patient:        'teal',
}

const ROLE_LABELS = {
  super_admin:   'Super Admin',
  hospital_admin: 'Hospital Admin',
  patient:        'Patient',
}

export default function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <Box
      as="header"
      px={6}
      py={3}
      bg="white"
      _dark={{ bg: 'gray.800' }}
      borderBottomWidth="1px"
      borderColor="brand.100"
      shadow="sm"
    >
      <Flex align="center" gap={4}>
        {/* Brand */}
        <Flex align="center" gap={2}>
          <Box color="brand.500" fontSize="xl">
            <FaHospitalUser />
          </Box>
          <Heading size="sm" color="brand.600">
            MediConnect
          </Heading>
        </Flex>

        <Box flex={1} />

        {/* Notification bell placeholder */}
        <Box color="gray.400" cursor="pointer" _hover={{ color: 'brand.500' }}>
          <MdNotifications size={22} />
        </Box>

        {/* User info */}
        {user && (
          <Flex align="center" gap={3}>
            <Avatar.Root size="sm" bg="brand.500">
              <Avatar.Fallback name={user.name} />
            </Avatar.Root>
            <Box display={{ base: 'none', md: 'block' }}>
              <Text fontSize="sm" fontWeight="600" lineHeight="1.2">{user.name}</Text>
              <Badge size="sm" colorPalette={ROLE_COLORS[user.role] || 'gray'}>
                {ROLE_LABELS[user.role] || user.role}
              </Badge>
            </Box>
          </Flex>
        )}

        <Button
          size="sm"
          variant="ghost"
          colorPalette="red"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <MdLogout />
          <Text display={{ base: 'none', sm: 'inline' }}>Logout</Text>
        </Button>
      </Flex>
    </Box>
  )
}
