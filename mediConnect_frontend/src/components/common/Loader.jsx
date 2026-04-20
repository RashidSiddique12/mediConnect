/**
 * @author Healthcare Appointment App
 * @description Loader — full-screen Chakra Spinner used as Suspense fallback.
 * JIRA: HAA-008 #comment Reusable loader component
 */

import { Center, Spinner } from '@chakra-ui/react'

export default function Loader() {
  return (
    <Center minH="100vh">
      <Spinner size="xl" color="primary.500" borderWidth="4px" />
    </Center>
  )
}
