/**
 * @author Healthcare Appointment App
 * @description Review Moderation — super admin approves or rejects reviews.
 * JIRA: HAA-ADM-005 #comment Admin review moderation UI
 */

import { useState } from 'react'
import {
  Box, Stack, Heading, Text, Flex, Badge, Button, Card, Grid, Textarea, Select, createListCollection,
} from '@chakra-ui/react'
import { MdStar, MdCheckCircle, MdCancel, MdPerson } from 'react-icons/md'
import { MOCK_REVIEWS } from '@/services/mockApi'

const statusFilter = createListCollection({
  items: [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ],
})

function StarRating({ rating }) {
  return (
    <Flex gap={0.5}>
      {[1, 2, 3, 4, 5].map((n) => (
        <MdStar key={n} size={16} color={n <= rating ? '#F6AD55' : '#E2E8F0'} />
      ))}
    </Flex>
  )
}

export default function ReviewModeration() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS)
  const [filter, setFilter] = useState('')

  const filtered = filter ? reviews.filter((r) => r.status === filter) : reviews
  const pending = reviews.filter((r) => r.status === 'pending').length

  const updateStatus = (id, status) => {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status } : r))
  }

  const STATUS_COLOR = { approved: 'green', pending: 'orange', rejected: 'red' }

  return (
    <Stack gap={6}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Box>
          <Heading size="lg">Review Moderation</Heading>
          <Text color="gray.500" fontSize="sm">
            {pending > 0 ? (
              <Badge colorPalette="orange" mr={2}>{pending} pending</Badge>
            ) : null}
            {reviews.length} total reviews
          </Text>
        </Box>
        <Select.Root collection={statusFilter} w="160px" onValueChange={(v) => setFilter(v.value[0] || '')}>
          <Select.Trigger>
            <Select.ValueText placeholder="Filter status" />
          </Select.Trigger>
          <Select.Content>
            {statusFilter.items.map((item) => (
              <Select.Item key={item.value} item={item}>{item.label}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>

      {/* Summary badges */}
      <Flex gap={3} wrap="wrap">
        {[
          { label: 'Pending', count: reviews.filter((r) => r.status === 'pending').length, color: 'orange' },
          { label: 'Approved', count: reviews.filter((r) => r.status === 'approved').length, color: 'green' },
          { label: 'Rejected', count: reviews.filter((r) => r.status === 'rejected').length, color: 'red' },
        ].map(({ label, count, color }) => (
          <Box key={label} bg={`${color}.50`} border="1px solid" borderColor={`${color}.200`} px={4} py={2} rounded="lg">
            <Text fontSize="xs" color={`${color}.600`} fontWeight="500">{label}</Text>
            <Text fontSize="xl" fontWeight="700" color={`${color}.600`}>{count}</Text>
          </Box>
        ))}
      </Flex>

      {/* Review Cards */}
      <Stack gap={4}>
        {filtered.map((r) => (
          <Card.Root key={r.id} shadow="sm" rounded="xl" borderLeft="4px solid" borderColor={`${STATUS_COLOR[r.status]}.400`}>
            <Card.Body>
              <Flex justify="space-between" align="flex-start" mb={3} wrap="wrap" gap={2}>
                <Flex align="center" gap={3}>
                  <Box bg="teal.100" p={2} rounded="full" color="teal.600">
                    <MdPerson size={20} />
                  </Box>
                  <Box>
                    <Text fontWeight="700">{r.patientName}</Text>
                    <Text fontSize="xs" color="gray.500">About: {r.doctorName} — {r.hospitalId}</Text>
                  </Box>
                </Flex>
                <Flex align="center" gap={3}>
                  <StarRating rating={r.rating} />
                  <Badge colorPalette={STATUS_COLOR[r.status]} size="sm">{r.status}</Badge>
                </Flex>
              </Flex>

              <Box bg="gray.50" p={3} rounded="lg" mb={3}>
                <Text fontSize="sm" color="gray.700" fontStyle="italic">"{r.comment}"</Text>
              </Box>

              <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
                <Text fontSize="xs" color="gray.400">{r.date}</Text>
                {r.status === 'pending' && (
                  <Flex gap={2}>
                    <Button size="sm" colorPalette="green" onClick={() => updateStatus(r.id, 'approved')}>
                      <MdCheckCircle /> Approve
                    </Button>
                    <Button size="sm" colorPalette="red" variant="outline" onClick={() => updateStatus(r.id, 'rejected')}>
                      <MdCancel /> Reject
                    </Button>
                  </Flex>
                )}
                {r.status === 'approved' && (
                  <Button size="sm" colorPalette="red" variant="ghost" onClick={() => updateStatus(r.id, 'rejected')}>
                    Revoke Approval
                  </Button>
                )}
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Stack>

      {filtered.length === 0 && (
        <Box textAlign="center" py={12} color="gray.400">
          <MdStar size={48} style={{ margin: '0 auto 8px' }} />
          <Text>No reviews in this category</Text>
        </Box>
      )}
    </Stack>
  )
}
