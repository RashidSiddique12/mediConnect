/**
 * @author Healthcare Appointment App
 * @description Search Doctors — patient searches and filters doctors.
 * JIRA: HAA-PAT-004 #comment Search doctors UI
 */

import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box, Stack, Heading, Text, Flex, Input, Card, Grid, Badge, Button, Avatar, Select, createListCollection,
} from '@chakra-ui/react'
import { MdSearch, MdStar, MdPerson, MdArrowForward } from 'react-icons/md'
import { MOCK_DOCTORS, MOCK_SPECIALTIES, MOCK_HOSPITALS } from '@/services/mockApi'

const specialtyCollection = createListCollection({
  items: [
    { label: 'All Specialties', value: '' },
    ...MOCK_SPECIALTIES.map((s) => ({ label: s.name, value: s.name })),
  ],
})

const hospitalCollection = createListCollection({
  items: [
    { label: 'All Hospitals', value: '' },
    ...MOCK_HOSPITALS.map((h) => ({ label: h.name, value: h.id })),
  ],
})

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
  const [searchParams] = useSearchParams()
  const initialHospital = searchParams.get('hospital') || ''

  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [hospital, setHospital] = useState(initialHospital)

  const filtered = MOCK_DOCTORS.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase())
    const matchSpecialty = specialty ? d.specialty === specialty : true
    const matchHospital = hospital ? d.hospitalId === hospital : true
    return matchSearch && matchSpecialty && matchHospital
  })

  const getHospitalName = (id) => MOCK_HOSPITALS.find((h) => h.id === id)?.name || id

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
          <Card.Root key={d.id} shadow="sm" rounded="xl" _hover={{ shadow: 'lg', transform: 'translateY(-3px)' }}
            transition="all 0.25s" overflow="hidden">
            <Box h={2} bg="teal.500" />
            <Card.Body>
              <Flex align="flex-start" gap={3} mb={4}>
                <Avatar.Root size="lg" bg="teal.500" flexShrink={0}>
                  <Avatar.Fallback name={d.name} />
                </Avatar.Root>
                <Box flex={1}>
                  <Text fontWeight="700">{d.name}</Text>
                  <Badge colorPalette="teal" size="sm" mt={0.5}>{d.specialty}</Badge>
                  <StarRating rating={d.rating} />
                </Box>
              </Flex>

              <Stack gap={2} mb={4}>
                <Flex justify="space-between">
                  <Text fontSize="xs" color="gray.500">Hospital</Text>
                  <Text fontSize="xs" fontWeight="600">{getHospitalName(d.hospitalId)}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontSize="xs" color="gray.500">Experience</Text>
                  <Text fontSize="xs" fontWeight="600">{d.experience} years</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontSize="xs" color="gray.500">Consultation Fee</Text>
                  <Text fontSize="sm" fontWeight="700" color="teal.600">${d.fee}</Text>
                </Flex>
              </Stack>

              <Grid templateColumns="1fr 1fr" gap={2}>
                <Button size="sm" variant="outline" colorPalette="teal"
                  onClick={() => navigate(`/patient/doctors/${d.id}`)}>
                  View Profile
                </Button>
                <Button size="sm" colorPalette="teal"
                  onClick={() => navigate(`/patient/book/${d.id}`)}>
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
