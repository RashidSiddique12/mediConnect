import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Image,
  Dialog,
  IconButton,
} from '@chakra-ui/react'
import {
  MdDescription,
  MdDownload,
  MdSearch,
  MdCalendarToday,
  MdLocalHospital,
  MdNotes,
  MdOpenInNew,
  MdVisibility,
  MdImage,
  MdPictureAsPdf,
  MdZoomIn,
  MdZoomOut,
  MdClose,
  MdArrowForward,
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

function isImage(url) {
  return /\.(jpe?g|png|gif|webp)$/i.test(url || '')
}

function fileType(url) {
  if (isImage(url)) return 'Image'
  if (/\.pdf$/i.test(url || '')) return 'PDF'
  return 'File'
}

export default function MyPrescriptions() {
  const navigate = useNavigate()
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
  const [lightboxUrl, setLightboxUrl] = useState(null)
  const [zoom, setZoom] = useState(1)

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
                      Uploaded {formatDate(rx.createdAt)}
                    </Text>
                  </Box>
                </Flex>
                <Flex gap={2} align="center">
                  <Badge
                    bg="whiteAlpha.300"
                    color="white"
                    size="sm"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    {isImage(rx.fileUrl) ? (
                      <MdImage size={12} />
                    ) : (
                      <MdPictureAsPdf size={12} />
                    )}
                    {fileType(rx.fileUrl)}
                  </Badge>
                  <Badge bg="whiteAlpha.300" color="white" size="sm">
                    #{rx._id?.slice(-6).toUpperCase()}
                  </Badge>
                </Flex>
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
                    {rx.doctorId?.name || 'Unknown Doctor'}
                  </Text>
                  {rx.doctorId?.specialtyIds?.length > 0 ? (
                    <Flex gap={1} wrap="wrap" mt={0.5}>
                      {rx.doctorId.specialtyIds.map((s, i) => (
                        <Badge
                          key={i}
                          colorPalette="teal"
                          size="xs"
                          variant="outline"
                        >
                          {s.name || s}
                        </Badge>
                      ))}
                    </Flex>
                  ) : (
                    <Text fontSize="xs" color="gray.500">
                      Prescribing Physician
                    </Text>
                  )}
                </Box>
              </Flex>

              {/* Prescription preview */}
              {rx.fileUrl && isImage(rx.fileUrl) && (
                <Box
                  mb={4}
                  rounded="lg"
                  overflow="hidden"
                  border="1px solid"
                  borderColor="gray.200"
                  cursor="pointer"
                  onClick={() => {
                    setZoom(1)
                    setLightboxUrl(rx.fileUrl)
                  }}
                  position="relative"
                  _hover={{ '& > div': { opacity: 1 } }}
                >
                  <Image
                    src={rx.fileUrl}
                    alt="Prescription"
                    maxH="180px"
                    w="100%"
                    objectFit="cover"
                  />
                  <Flex
                    position="absolute"
                    inset={0}
                    bg="blackAlpha.400"
                    align="center"
                    justify="center"
                    opacity={0}
                    transition="opacity 0.2s"
                  >
                    <MdZoomIn size={28} color="white" />
                  </Flex>
                </Box>
              )}

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
              <Flex gap={2} wrap="wrap">
                <Button
                  flex={1}
                  variant="outline"
                  colorPalette="teal"
                  size="sm"
                  onClick={() => {
                    const url = rx.fileUrl
                    if (!url) return
                    // Add fl_attachment to Cloudinary URL to force browser download
                    let dlUrl = url
                    if (url.includes('/upload/')) {
                      dlUrl = url.replace('/upload/', '/upload/fl_attachment/')
                    }
                    const a = document.createElement('a')
                    a.href = dlUrl
                    a.target = '_blank'
                    a.rel = 'noopener noreferrer'
                    document.body.appendChild(a)
                    a.click()
                    a.remove()
                  }}
                >
                  <MdDownload /> Download File
                </Button>
                {rx.appointmentId?._id && (
                  <Button
                    flex={1}
                    colorPalette="teal"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/patient/appointments/${rx.appointmentId._id}`,
                      )
                    }
                  >
                    <MdVisibility /> View Appointment
                  </Button>
                )}
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Flex justify="center" align="center" gap={3} mt={2} direction="column">
          <Text fontSize="xs" color="gray.400">
            Showing {(page - 1) * 10 + 1}–
            {Math.min(page * 10, pagination.total)} of {pagination.total}
          </Text>
          <Flex gap={3} align="center">
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
        </Flex>
      )}

      {/* Image Lightbox */}
      {lightboxUrl && (
        <Dialog.Root
          open={!!lightboxUrl}
          onOpenChange={(e) => {
            if (!e.open) setLightboxUrl(null)
          }}
          size="cover"
        >
          <Dialog.Backdrop bg="blackAlpha.800" />
          <Dialog.Positioner>
            <Dialog.Content
              bg="transparent"
              shadow="none"
              maxW="95vw"
              maxH="95vh"
            >
              <Flex justify="center" align="center" gap={3} py={3}>
                <IconButton
                  rounded="full"
                  size="sm"
                  bg="whiteAlpha.800"
                  color="gray.700"
                  _hover={{ bg: 'white' }}
                  onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
                  aria-label="Zoom in"
                >
                  <MdZoomIn size={20} />
                </IconButton>
                <Text
                  fontSize="sm"
                  color="whiteAlpha.700"
                  minW="40px"
                  textAlign="center"
                >
                  {Math.round(zoom * 100)}%
                </Text>
                <IconButton
                  rounded="full"
                  size="sm"
                  bg="whiteAlpha.800"
                  color="gray.700"
                  _hover={{ bg: 'white' }}
                  onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                  aria-label="Zoom out"
                >
                  <MdZoomOut size={20} />
                </IconButton>
                <Dialog.CloseTrigger asChild>
                  <IconButton
                    rounded="full"
                    size="sm"
                    bg="whiteAlpha.800"
                    color="gray.700"
                    _hover={{ bg: 'white' }}
                    aria-label="Close"
                    ml={4}
                  >
                    <MdClose size={20} />
                  </IconButton>
                </Dialog.CloseTrigger>
              </Flex>
              <Flex
                justify="center"
                align="center"
                w="100%"
                h="90vh"
                overflow="auto"
              >
                <Image
                  src={lightboxUrl}
                  alt="Prescription"
                  maxW="90vw"
                  maxH="85vh"
                  objectFit="contain"
                  transform={`scale(${zoom})`}
                  transition="transform 0.2s ease"
                  rounded="md"
                />
              </Flex>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      )}
    </Stack>
  )
}
