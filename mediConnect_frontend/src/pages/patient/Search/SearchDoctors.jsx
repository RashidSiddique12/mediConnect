import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Stack, Heading, Text, Flex, Input, Card, Grid, Badge, Button, Avatar, Select, createListCollection, Spinner, Center,
} from '@chakra-ui/react'
import { MdSearch, MdStar, MdPerson, MdArrowForward } from 'react-icons/md'
import * as doctorSlice from '@/features/doctors/doctorSlice'
import * as doctorSelectors from '@/features/doctors/doctorSelectors'
import * as specialtySlice from '@/features/specialties/specialtySlice'
import * as specialtySelectors from '@/features/specialties/specialtySelectors'
import * as hospitalSlice from '@/features/hospitals/hospitalSlice'
import * as hospitalSelectors from '@/features/hospitals/hospitalSelectors'

function StarRating({ rating }) {
  return (
    <Flex gap={0.5}>
      {[1, 2, 3, 4, 5].map((n) => (
        <MdStar key={n} size={14} color={n <= Math.round(rating) ? '#F6AD55' : '#E2E8F0'} />
      ))}
    </Flex>
  )
}

export default function SearchDoctors() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const initialHospital = searchParams.get('hospital') || ''

  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [hospital, setHospital] = useState(initialHospital)

  const doctors = useSelector(doctorSelectors.selectDoctors)
  const specialties = useSelector(specialtySelectors.selectSpecialties)
  const hospitals = useSelector(hospitalSelectors.selectHospitals)
  const loading = useSelector(doctorSelectors.selectDoctorsLoading)

  useEffect(() => {
    dispatch(doctorSlice.fetchDoctorsRequest())
    dispatch(specialtySlice.fetchSpecialtiesRequest())
    dispatch(hospitalSlice.fetchHospitalsRequest())
  }, [dispatch])

  const specialtyCollection = useMemo(() => createListCollection({
    items: [
      { label: 'All Specialties', value: '' },
      ...specialties.map((s) => ({ label: s.name, value: s._id })),
    ],
  }), [specialties])

  const hospitalCollection = useMemo(() => createListCollection({
    items: [
      { label: 'All Hospitals', value: '' },
      ...hospitals.map((h) => ({ label: h.name, value: h._id })),
    ],
  }), [hospitals])

  if (loading) return <Center py={12}><Spinner size="xl" color="teal.500" /></Center>

  const filtered = doctors.filter((d) => {
    const name = d.userId?.name || d.name || ''
    const matchSearch = name.toLowerCase().includes(search.toLowerCase())
    const matchSpecialty = specialty ? (d.specialtyIds || []).some((s) => (s._id || s) === specialty) : true
    const matchHospital = hospital ? (d.hospitalId?._id || d.hospitalId) === hospital : true
    return matchSearch && matchSpecialty && matchHospital
  })

  const getHospitalName = (doc) => doc.hospitalId?.name || 'N/A'
  const getDoctorName = (d) => d.userId?.name || d.name || 'Doctor'
  const getSpecialtyName = (d) => (d.specialtyIds || []).map((s) => s.name || s).join(', ') || 'General'

  return (
    <Stack gap={6}>
      {/* Hero */}
      <Box bg="teal.700" color="white" p={8} rounded="2xl" textAlign="center">
        <Heading size="xl" mb={2} color="white">Find a Doctor</Heading>
        <Text opacity={0.8} mb={6}>Book an appointment with the best specialists</Text>
        <Box position="relative" maxW="500px" mx="auto">
          <Box position="absolute" left={4} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1}>
            <MdSearch size={20} />
          </Box>
          <Input
            pl={11} size="lg" bg="white" color="gray.800"
            placeholder="Search by doctor name…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            _placeholder={{ color: 'gray.400' }}
          />
        </Box>
      </Box>

      {/* Filters */}
      <Flex gap={3} wrap="wrap">
        <Select.Root collection={specialtyCollection} w={{ base: 'full', sm: '220px' }}
          onValueChange={(v) => setSpecialty(v.value[0] || '')}>
          <Select.Trigger><Select.ValueText placeholder="All Specialties" /></Select.Trigger>
          <Select.Content>
            {specialtyCollection.items.map((item) => (
              <Select.Item key={item.value} item={item}>{item.label}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <Select.Root collection={hospitalCollection} w={{ base: 'full', sm: '240px' }}
          defaultValue={initialHospital ? [initialHospital] : []}
          onValueChange={(v) => setHospital(v.value[0] || '')}>
          <Select.Trigger><Select.ValueText placeholder="All Hospitals" /></Select.Trigger>
          <Select.Content>
            {hospitalCollection.items.map((item) => (
              <Select.Item key={item.value} item={item}>{item.label}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <Text color="gray.500" fontSize="sm" alignSelf="center">{filtered.length} doctors found</Text>
      </Flex>

      {/* Doctor Cards */}
      <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={4}>
        {filtered.map((d) => (
          <Card.Root key={d._id} shadow="sm" rounded="xl" _hover={{ shadow: 'lg', transform: 'translateY(-3px)' }}
            transition="all 0.25s" overflow="hidden">
            <Box h={2} bg="teal.500" />
            <Card.Body>
              <Flex align="flex-start" gap={3} mb={4}>
                <Avatar.Root size="lg" bg="teal.500" flexShrink={0}>
                  <Avatar.Fallback name={getDoctorName(d)} />
                </Avatar.Root>
                <Box flex={1}>
                  <Text fontWeight="700">{getDoctorName(d)}</Text>
                  <Badge colorPalette="teal" size="sm" mt={0.5}>{getSpecialtyName(d)}</Badge>
                  <StarRating rating={d.rating || 0} />
                </Box>
              </Flex>

              <Stack gap={2} mb={4}>
                <Flex justify="space-between">
                  <Text fontSize="xs" color="gray.500">Hospital</Text>
                  <Text fontSize="xs" fontWeight="600">{getHospitalName(d)}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontSize="xs" color="gray.500">Experience</Text>
                  <Text fontSize="xs" fontWeight="600">{d.experience || 0} years</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontSize="xs" color="gray.500">Consultation Fee</Text>
                  <Text fontSize="sm" fontWeight="700" color="teal.600">${d.consultationFee || d.fee || 0}</Text>
                </Flex>
              </Stack>

              <Grid templateColumns="1fr 1fr" gap={2}>
                <Button size="sm" variant="outline" colorPalette="teal"
                  onClick={() => navigate(`/patient/doctors/${d._id}`)}>
                  View Profile
                </Button>
                <Button size="sm" colorPalette="teal"
                  onClick={() => navigate(`/patient/book/${d._id}`)}>
                  Book Now <MdArrowForward />
                </Button>
              </Grid>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      {filtered.length === 0 && (
        <Box textAlign="center" py={12} color="gray.400">
          <MdPerson size={48} style={{ margin: '0 auto 8px' }} />
          <Text>No doctors found with current filters</Text>
        </Box>
      )}
    </Stack>
  )
}
