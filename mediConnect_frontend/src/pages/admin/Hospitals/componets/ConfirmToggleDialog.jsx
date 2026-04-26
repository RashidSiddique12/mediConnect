import { Flex, Text, Button, Dialog, Box } from '@chakra-ui/react'
import { MdWarning } from 'react-icons/md'

export default function ConfirmToggleDialog({ hospital, onConfirm, onCancel }) {
  const isActive = hospital?.status === 'active'
  const action = isActive ? 'Deactivate' : 'Activate'

  return (
    <Dialog.Root open={!!hospital} onOpenChange={(e) => { if (!e.open) onCancel() }}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content rounded="xl" maxW="420px">
          <Dialog.Header>
            <Flex align="center" gap={2}>
              <Flex
                align="center"
                justify="center"
                bg={isActive ? 'red.50' : 'green.50'}
                color={isActive ? 'red.500' : 'green.500'}
                rounded="lg"
                p={1.5}
              >
                <MdWarning size={18} />
              </Flex>
              <Dialog.Title>{action} Hospital</Dialog.Title>
            </Flex>
          </Dialog.Header>
          <Dialog.Body>
            <Text fontSize="sm" color="gray.600">
              Are you sure you want to {action.toLowerCase()}{' '}
              <Text as="span" fontWeight="700">{hospital?.name}</Text>?
            </Text>
            {isActive && (
              <Flex align="center" gap={2} mt={3} bg="red.50" p={3} rounded="lg">
                <MdWarning size={14} color="var(--chakra-colors-red-400)" />
                <Text color="red.600" fontSize="xs">
                  This will hide the hospital from patient searches and disable new appointments.
                </Text>
              </Flex>
            )}
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button
              colorPalette={isActive ? 'red' : 'green'}
              onClick={() => onConfirm(hospital?._id)}
            >
              {action}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
