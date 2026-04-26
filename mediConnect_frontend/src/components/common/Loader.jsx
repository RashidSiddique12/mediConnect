import { Center, Spinner } from '@chakra-ui/react'

export default function Loader() {
  return (
    <Center minH="100vh">
      <Spinner size="xl" color="primary.500" borderWidth="4px" />
    </Center>
  )
}
