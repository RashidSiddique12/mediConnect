import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Stack, Heading, Text, Flex, Input, Card, Grid, Button, Spinner, Center,
} from '@chakra-ui/react'
import { MdSearch, MdLocalHospital, MdLocationOn, MdStar, MdPerson, MdArrowForward } from 'react-icons/md'
import * as hospitalSlice from '@/features/hospitals/hospitalSlice'
import * as hospitalSelectors from '@/features/hospitals/hospitalSelectors'

export default function SearchHospitals() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const hospitals = useSelector(hospitalSelectors.selectHospitals)
  const loading = useSelector(hospitalSelectors.selectHospitalsLoading)
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(hospitalSlice.fetchHospitalsRequest())
  }, [dispatch])

  if (loading) return <Center py={12}><Spinner size="xl" color="teal.500" /></Center>

  const filtered = hospitals.filter(
    (h) => h.name.toLowerCase().includes(search.toLowerCase()) || (h.address?.city || '').toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Stack gap={6}>
      {/* Hero */}
      <Box bg="teal.700" color="white" p={8} rounded="2xl" textAlign="center">
        <Heading size="xl" mb={2} color="white">Find a Hospital</Heading>
        <Text opacity={0.8} mb={6}>Discover quality healthcare facilities near you</Text>
        <Flex justify="center">
          <Box position="relative" w="full" maxW="500px">
            <Box position="absolute" left={4} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1}>
              <MdSearch size={20} />
            </Box>
            <Input
              pl={11}
              size="lg"
              bg="white"
              color="gray.800"
              placeholder="Search by hospital name or city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              _placeholder={{ color: 'gray.400' }}
            />
          </Box>
        </Flex>
      </Box>

      {/* Results */}
      <Flex justify="space-between" align="center">
        <Text color="gray.500" fontSize="sm">{filtered.length} hospitals found</Text>
      </Flex>

      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
        {filtered.map((h) => (
          <Card.Root key={h.id} shadow="sm" rounded="xl" _hover={{ shadow: 'lg', transform: 'translateY(-3px)' }}
            transition="all 0.25s" overflow="hidden">
            {/* Colored top strip */}
            <Box h={2} bg="teal.500" />
            <Card.Body>
              <Flex align="flex-start" gap={3} mb={4}>
                <Box bg="teal.100" p={3} rounded="xl" color="teal.600" fontSize="2xl" flexShrink={0}>
                  <MdLocalHospital />
                </Box>
                <Box>
                  <Text fontWeight="700" fontSize="md">{h.name}</Text>
                  <Flex align="center" gap={1} color="gray.500" mt={1}>
                    <MdLocationOn size={14} />
                    <Text fontSize="xs">{h.address?.city || 'N/A'}</Text>
                  </Flex>
                </Box>
              </Flex>

              <Grid templateColumns="repeat(3, 1fr)" gap={2} mb={4}>
                <Box textAlign="center" bg="teal.50" rounded="md" py={2}>
                  <Text fontSize="xs" color="gray.500">Doctors</Text>
                  <Flex justify="center" align="center" gap={1}>
                    <MdPerson size={12} color="#0b9c9c" />
                    <Text fontWeight="700" fontSize="sm" color="teal.700">{h.totalDoctors || 0}</Text>
                  </Flex>
                </Box>
                <Box textAlign="center" bg="orange.50" rounded="md" py={2}>
                  <Text fontSize="xs" color="gray.500">Visits</Text>
                  <Text fontWeight="700" fontSize="sm" color="orange.500">{h.totalAppointments || 0}</Text>
                </Box>
                <Box textAlign="center" bg="yellow.50" rounded="md" py={2}>
                  <Text fontSize="xs" color="gray.500">Rating</Text>
                  <Flex justify="center" align="center" gap={1}>
                    <MdStar size={12} color="#F6AD55" />
                    <Text fontWeight="700" fontSize="sm" color="yellow.700">{h.rating || 0}</Text>
                  </Flex>
                </Box>
              </Grid>

              <Button
                w="full"
                colorPalette="teal"
                onClick={() => navigate(`/patient/doctors?hospital=${h._id}`)}
              >
                View Doctors <MdArrowForward />
              </Button>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      {filtered.length === 0 && (
        <Box textAlign="center" py={12} color="gray.400">
          <MdLocalHospital size={48} style={{ margin: '0 auto 8px' }} />
          <Text>No hospitals found matching "{search}"</Text>
        </Box>
      )}
    </Stack>
  )
}
