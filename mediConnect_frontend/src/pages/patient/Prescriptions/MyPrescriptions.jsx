import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Stack,
  Text,
  Flex,
  Badge,
  Card,
  Grid,
  Button,
  Avatar,
  Icon,
} from '@chakra-ui/react'
import {
  MdDescription,
  MdDownload,
  MdSearch,
  MdCalendarToday,
  MdLocalHospital,
  MdNotes,
  MdOpenInNew,
} from 'react-icons/md'
import Loader from '@/components/common/Loader'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import SearchInput from '@/components/common/SearchInput'
import useDebounce from '@/hooks/useDebounce'
import * as prescriptionSlice from '@/features/prescriptions/prescriptionSlice'
import * as prescriptionSelectors from '@/features/prescriptions/prescriptionSelectors'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function MyPrescriptions() {
  const dispatch = useDispatch()
  const prescriptions = useSelector(prescriptionSelectors.selectPrescriptions)
  const pagination = useSelector(
    prescriptionSelectors.selectPrescriptionsPagination,
  )
  const loading = useSelector(prescriptionSelectors.selectPrescriptionsLoading)
  const error = useSelector(prescriptionSelectors.selectPrescriptionsError)

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 400)
  const initialLoad = useRef(true)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  useEffect(() => {
    dispatch(
      prescriptionSlice.fetchPrescriptionsRequest({
        page,
        limit: 10,
        ...(debouncedSearch && { search: debouncedSearch }),
      }),
    )
  }, [dispatch, page, debouncedSearch])

  useEffect(() => {
    if (!loading && initialLoad.current) {
      initialLoad.current = false
    }
  }, [loading])

  // Full-page loader only on first load
  if (loading && initialLoad.current) return <Loader />

  const total = pagination?.total || prescriptions.length

  return (
    <Stack gap={6} w="100%">
      <PageHeader
        title="My Prescriptions"
        subtitle={`${total} prescription${total !== 1 ? 's' : ''} on record`}
      />

      {/* Search bar */}
      {(prescriptions.length > 0 || search) && (
        <Flex gap={3} align="center" wrap="wrap">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by doctor name…"
            maxW="400px"
          />
          {loading && (
            <Text fontSize="xs" color="gray.400">
              Searching…
            </Text>
          )}
        </Flex>
      )}

      {/* Error state */}
      {error && (
        <Box bg="red.50" border="1px solid" borderColor="red.200" rounded="lg" p={4}>
          <Text color="red.600" fontSize="sm">
            {error}
          </Text>
          <Button
            size="xs"
            colorPalette="red"
            variant="outline"
            mt={2}
            onClick={() =>
              dispatch(
                prescriptionSlice.fetchPrescriptionsRequest({
                  page,
                  limit: 10,
                }),
              )
            }
          >
            Retry
          </Button>
        </Box>
      )}

      {/* Empty states */}
      {!loading && prescriptions.length === 0 && !search && (
        <EmptyState
          icon={<MdDescription size={36} />}
          title="No prescriptions yet"
          description="Your prescriptions will appear here after a doctor uploads one following your appointment."
        />
      )}

      {!loading && prescriptions.length === 0 && search && (
        <EmptyState
          icon={<MdSearch size={36} />}
          search={search}
          searchEmptyText={`No prescriptions matching "${search}"`}
          actionLabel="Clear Search"
          onAction={() => setSearch('')}
          withCard={false}
        />
      )}

      {/* Prescription cards */}
      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(auto-fill, minmax(360px, 1fr))',
        }}
        gap={5}
        opacity={loading && !initialLoad.current ? 0.6 : 1}
        transition="opacity 0.2s"
      >
        {prescriptions.map((rx) => (
          <Card.Root
            key={rx._id}
            shadow="sm"
            rounded="xl"
            overflow="hidden"
            _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            {/* Header */}
            <Box
              bgGradient="to-r"
              gradientFrom="teal.500"
              gradientTo="teal.700"
              px={5}
              py={4}
              color="white"
            >
              <Flex justify="space-between" align="center">
                <Flex align="center" gap={2}>
                  <MdDescription size={20} />
                  <Box>
                    <Text fontWeight="700" fontSize="sm">
                      Prescription
                    </Text>
                    <Text opacity={0.8} fontSize="xs">
                      {formatDate(rx.createdAt)}
                    </Text>
                  </Box>
                </Flex>
                <Badge bg="whiteAlpha.300" color="white" size="sm">
                  #{rx._id?.slice(-6).toUpperCase()}
                </Badge>
              </Flex>
            </Box>

            <Card.Body p={5}>
              {/* Doctor info */}
              <Flex align="center" gap={3} mb={4} pb={4} borderBottomWidth="1px">
                <Avatar.Root size="sm" colorPalette="teal">
                  <Avatar.Fallback name={rx.doctorId?.name || 'Doctor'} />
                </Avatar.Root>
                <Box flex={1}>
                  <Text fontWeight="600" fontSize="sm">
                    Dr. {rx.doctorId?.name || 'Unknown'}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Prescribing Physician
                  </Text>
                </Box>
              </Flex>

              {/* Appointment details */}
              {rx.appointmentId && (
                <Stack gap={2} mb={4}>
                  {rx.appointmentId.hospitalId?.name && (
                    <Flex align="center" gap={2}>
                      <Icon color="teal.500">
                        <MdLocalHospital />
                      </Icon>
                      <Text fontSize="sm" color="gray.600">
                        {rx.appointmentId.hospitalId.name}
                      </Text>
                    </Flex>
                  )}
                  {rx.appointmentId.appointmentDate && (
                    <Flex align="center" gap={2}>
                      <Icon color="teal.500">
                        <MdCalendarToday />
                      </Icon>
                      <Text fontSize="sm" color="gray.600">
                        Appointment:{' '}
                        {formatDate(rx.appointmentId.appointmentDate)}
                        {rx.appointmentId.timeSlot &&
                          ` • ${rx.appointmentId.timeSlot}`}
                      </Text>
                    </Flex>
                  )}
                  {rx.appointmentId.reason && (
                    <Flex align="flex-start" gap={2}>
                      <Icon color="teal.500" mt={0.5}>
                        <MdLocalHospital />
                      </Icon>
                      <Text fontSize="sm" color="gray.600">
                        {rx.appointmentId.reason}
                      </Text>
                    </Flex>
                  )}
                </Stack>
              )}

              {/* Notes */}
              {rx.notes && (
                <Box
                  bg="teal.50"
                  rounded="lg"
                  p={3}
                  mb={4}
                  borderLeft="3px solid"
                  borderColor="teal.400"
                >
                  <Flex align="center" gap={1} mb={1}>
                    <MdNotes size={14} color="var(--chakra-colors-teal-600)" />
                    <Text fontSize="xs" fontWeight="600" color="teal.700">
                      Doctor&apos;s Notes
                    </Text>
                  </Flex>
                  <Text fontSize="sm" color="gray.700">
                    {rx.notes}
                  </Text>
                </Box>
              )}

              {/* Actions */}
              <Flex gap={2}>
                <Button
                  flex={1}
                  variant="outline"
                  colorPalette="teal"
                  size="sm"
                  asChild
                >
                  <a
                    href={rx.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MdOpenInNew /> View File
                  </a>
                </Button>
                <Button
                  flex={1}
                  colorPalette="teal"
                  size="sm"
                  asChild
                >
                  <a href={rx.fileUrl} download>
                    <MdDownload /> Download
                  </a>
                </Button>
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Flex justify="center" align="center" gap={3} mt={2}>
          <Button
            size="sm"
            variant="outline"
            colorPalette="teal"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Text fontSize="sm" color="gray.600" fontWeight="500">
            Page {page} of {pagination.totalPages}
          </Text>
          <Button
            size="sm"
            variant="outline"
            colorPalette="teal"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </Flex>
      )}
    </Stack>
  )
}
