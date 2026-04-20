/**
 * @author Healthcare Appointment App
 * @description MainLayout — wraps protected pages with Sidebar, Header, and Outlet.
 * JIRA: HAA-006 #comment Main layout shell
 */

import { Box, Flex } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function MainLayout({ role }) {
  return (
    <Flex minH="100vh" bg="chakra-body-bg">
      <Sidebar role={role} />
      <Flex direction="column" flex={1} overflow="hidden">
        <Header />
        <Box as="main" flex={1} overflowY="auto" p={6}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  )
}
