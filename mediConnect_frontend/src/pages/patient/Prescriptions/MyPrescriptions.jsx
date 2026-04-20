/**
 * @author Healthcare Appointment App
 * @description My Prescriptions — patient views all prescriptions and downloads them.
 * JIRA: HAA-PAT-008 #comment Patient prescriptions UI
 */

import {
  Box, Stack, Heading, Text, Flex, Badge, Card, Grid, Button, Avatar,
} from '@chakra-ui/react'
import { MdDescription, MdDownload } from 'react-icons/md'
import { MOCK_PRESCRIPTIONS } from '@/services/mockApi'

export default function MyPrescriptions() {
  const prescriptions = MOCK_PRESCRIPTIONS.filter((p) => p.patientId === 'u-003')

  return (
    <Stack gap={6}>
      <Box>
        <Heading size="lg">My Prescriptions</Heading>
        <Text color="gray.500" fontSize="sm">{prescriptions.length} prescriptions on record</Text>
      </Box>

      {prescriptions.length === 0 && (
        <Box textAlign="center" py={12} color="gray.400" border="2px dashed" borderColor="gray.200" rounded="2xl">
          <MdDescription size={48} style={{ margin: '0 auto 8px' }} />
          <Text>No prescriptions yet</Text>
        </Box>
      )}

      <Grid templateColumns="repeat(auto-fill, minmax(320px, 1fr))" gap={4}>
        {prescriptions.map((rx) => (
          <Card.Root key={rx.id} shadow="sm" rounded="xl" overflow="hidden">
            {/* Prescription header */}
            <Box bg="teal.700" px={5} py={4} color="white">
              <Flex justify="space-between" align="flex-start">
                <Box>
                  <Flex align="center" gap={2} mb={1}>
                    <MdDescription size={18} />
                    <Text fontWeight="700" fontSize="sm">Prescription</Text>
                  </Flex>
                  <Text opacity={0.7} fontSize="xs">{rx.date}</Text>
                </Box>
                <Badge bg="teal.500" color="white" size="sm">#{rx.id}</Badge>
              </Flex>
            </Box>

            <Card.Body>
              {/* Doctor info */}
              <Flex align="center" gap={2} mb={4} pb={3} borderBottomWidth="1px">
                <Avatar.Root size="sm" bg="teal.500">
                  <Avatar.Fallback name={rx.doctorName} />
                </Avatar.Root>
                <Box>
                  <Text fontWeight="600" fontSize="sm">{rx.doctorName}</Text>
                  <Text fontSize="xs" color="gray.500">Prescribing physician</Text>
                </Box>
              </Flex>

              {/* Diagnosis */}
              <Box bg="teal.50" rounded="lg" p={3} mb={4}>
                <Text fontSize="xs" color="gray.500" mb={1}>Diagnosis</Text>
                <Text fontWeight="700" color="teal.700">{rx.diagnosis}</Text>
              </Box>

              {/* Medicines */}
              <Box mb={4}>
                <Text fontWeight="600" fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={2}>
                  Medicines
                </Text>
                <Stack gap={2}>
                  {rx.medicines.map((m, i) => (
                    <Flex key={i} justify="space-between" align="center" bg="gray.50" rounded="md" px={3} py={2}>
                      <Box>
                        <Text fontSize="sm" fontWeight="600">{m.name}</Text>
                        <Text fontSize="xs" color="gray.500">{m.dosage}</Text>
                      </Box>
                      <Badge colorPalette="teal" size="sm" variant="outline">{m.duration}</Badge>
                    </Flex>
                  ))}
                </Stack>
              </Box>

              {/* Notes */}
              {rx.notes && (
                <Box bg="yellow.50" rounded="lg" p={3} mb={4} borderLeft="3px solid" borderColor="yellow.400">
                  <Text fontSize="xs" color="gray.500" mb={1}>Doctor's Notes</Text>
                  <Text fontSize="sm" color="gray.700">{rx.notes}</Text>
                </Box>
              )}

              <Button w="full" variant="outline" colorPalette="teal" size="sm">
                <MdDownload /> Download PDF
              </Button>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>
    </Stack>
  )
}
