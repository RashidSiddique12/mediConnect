import { Flex, Box, Text } from '@chakra-ui/react'



export default function StatCard({ label, value, color, icon: Icon }) {
  return (
    <Flex
      flex="1"
      minW="140px"
      align="center"
      gap={3}
      bg={`${color}.50`}
      border="1px solid"
      borderColor={`${color}.200`}
      px={4}
      py={3}
      rounded="xl"
    >
      <Flex
        align="center"
        justify="center"
        bg={`${color}.100`}
        color={`${color}.600`}
        rounded="lg"
        p={2}
      >
        <Icon size={18} />
      </Flex>
      <Box>
        <Text fontSize="xs" color={`${color}.600`} fontWeight="500">{label}</Text>
        <Text fontSize="xl" fontWeight="700" color={`${color}.700`}>{value}</Text>
      </Box>
    </Flex>
  )
}
