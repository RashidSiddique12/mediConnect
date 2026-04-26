
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  Stack,
  Text,
  Alert,
  Flex,
  SimpleGrid,
  Select,
  createListCollection,
} from '@chakra-ui/react'
import { MdPerson, MdEmail, MdLock, MdPhone } from 'react-icons/md'
import { FaHospitalUser } from 'react-icons/fa'
import * as authSlice from '@/features/auth/authSlice'

const genders = createListCollection({
  items: [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ],
})

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', dob: '', gender: '',
  })
  const [localError, setLocalError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setLocalError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setLocalError('Password must be at least 8 characters.')
      return
    }
    const { confirmPassword, ...payload } = form
    dispatch(authSlice.registerRequest({ ...payload, role: 'patient' }))
  }

  const displayError = localError || error

  return (
    <Flex minH="100vh" bg="brand.700">
      {/* Left branding panel */}
      <Box
        display={{ base: 'none', lg: 'flex' }}
        flex={1}
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        p={12}
        bg="brand.800"
        color="white"
        gap={4}
      >
        <Box fontSize="6xl" color="brand.300"><FaHospitalUser /></Box>
        <Heading size="3xl" color="white">MediConnect</Heading>
        <Text opacity={0.7} textAlign="center" maxW="sm">
          Create your free patient account to book appointments and manage your health records.
        </Text>
      </Box>

      {/* Right form panel */}
      <Flex flex={{ base: 1, lg: '0 0 500px' }} align="center" justify="center" p={6} bg="white" overflowY="auto">
        <Box w="full" maxW="440px" py={8}>
          <Stack gap={5}>
            <Flex align="center" gap={2} display={{ lg: 'none' }}>
              <Box color="brand.500" fontSize="xl"><FaHospitalUser /></Box>
              <Heading size="md" color="brand.600">MediConnect</Heading>
            </Flex>

            <Box>
              <Heading size="xl" color="gray.800">Create account</Heading>
              <Text color="gray.500" mt={1}>Patient registration</Text>
            </Box>

            {displayError && (
              <Alert.Root status="error" rounded="md">
                <Alert.Indicator />
                <Alert.Title>{displayError}</Alert.Title>
              </Alert.Root>
            )}

            <Box as="form" onSubmit={handleSubmit}>
              <Stack gap={4}>
                <Field.Root required>
                  <Field.Label>Full Name</Field.Label>
                  <Box position="relative">
                    <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1}>
                      <MdPerson />
                    </Box>
                    <Input name="name" pl={9} placeholder="John Doe" value={form.name} onChange={handleChange} />
                  </Box>
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Email</Field.Label>
                  <Box position="relative">
                    <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1}>
                      <MdEmail />
                    </Box>
                    <Input name="email" type="email" pl={9} placeholder="you@example.com" value={form.email} onChange={handleChange} />
                  </Box>
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Phone</Field.Label>
                  <Box position="relative">
                    <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1}>
                      <MdPhone />
                    </Box>
                    <Input name="phone" type="tel" pl={9} placeholder="+1-555-0100" value={form.phone} onChange={handleChange} />
                  </Box>
                </Field.Root>

                <SimpleGrid columns={2} gap={4}>
                  <Field.Root>
                    <Field.Label>Date of Birth</Field.Label>
                    <Input name="dob" type="date" value={form.dob} onChange={handleChange} />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Gender</Field.Label>
                    <Select.Root collection={genders} onValueChange={(v) => setForm((p) => ({ ...p, gender: v.value[0] || '' }))}>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select" />
                      </Select.Trigger>
                      <Select.Content>
                        {genders.items.map((item) => (
                          <Select.Item key={item.value} item={item}>{item.label}</Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Field.Root>
                </SimpleGrid>

                <Field.Root required>
                  <Field.Label>Password</Field.Label>
                  <Box position="relative">
                    <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1}>
                      <MdLock />
                    </Box>
                    <Input name="password" type="password" pl={9} placeholder="Min. 8 characters" value={form.password} onChange={handleChange} />
                  </Box>
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Confirm Password</Field.Label>
                  <Box position="relative">
                    <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1}>
                      <MdLock />
                    </Box>
                    <Input name="confirmPassword" type="password" pl={9} placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} />
                  </Box>
                </Field.Root>

                <Button
                  type="submit"
                  colorPalette="teal"
                  loading={loading}
                  loadingText="Creating account…"
                  w="full"
                  size="lg"
                  mt={2}
                >
                  Create Account
                </Button>
              </Stack>
            </Box>

            <Text fontSize="sm" textAlign="center" color="gray.500">
              Already have an account?{' '}
              <Text as={Link} to="/login" color="brand.500" fontWeight="600" _hover={{ textDecoration: 'underline' }}>
                Sign in
              </Text>
            </Text>
          </Stack>
        </Box>
      </Flex>
    </Flex>
  )
}

