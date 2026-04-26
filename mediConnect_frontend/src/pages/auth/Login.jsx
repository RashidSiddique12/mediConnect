
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  Stack,
  Text,
  Alert,
  Badge,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react'
import { MdEmail, MdLock, MdLocalHospital } from 'react-icons/md'
import { FaHospitalUser } from 'react-icons/fa'
import * as authSlice from '@/features/auth/authSlice'

const DEMO_CREDENTIALS = [
  { role: 'Super Admin',    email: 'admin@healthcare.com',    password: 'Admin@123',    color: 'red'    },
  { role: 'Hospital Admin', email: 'hospital@healthcare.com', password: 'Hospital@123', color: 'purple' },
  { role: 'Patient',        email: 'patient@healthcare.com',  password: 'Patient@123',  color: 'teal'   },
]

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useSelector((state) => state.auth)

  const [form, setForm] = useState({ email: '', password: '' })

  useEffect(() => {
    if (user) {
      const routes = { super_admin: '/admin', hospital_admin: '/hospital', patient: '/patient' }
      navigate(routes[user.role] || '/admin', { replace: true })
    }
  }, [user, navigate])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const fillDemo = (cred) => {
    setForm({ email: cred.email, password: cred.password })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(authSlice.loginRequest(form))
  }

  return (
    <Flex minH="100vh" bg="brand.700">
      {/* Left panel — branding */}
      <Box
        display={{ base: 'none', lg: 'flex' }}
        flex={1}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={12}
        bg="brand.800"
        color="white"
        gap={6}
      >
        <Box fontSize="6xl" color="brand.300">
          <FaHospitalUser />
        </Box>
        <Heading size="3xl" color="white">MediConnect</Heading>
        <Text opacity={0.7} textAlign="center" maxW="sm" fontSize="lg">
          Your unified healthcare platform connecting patients, hospitals and doctors.
        </Text>
        <SimpleGrid columns={2} gap={4} pt={4} w="full" maxW="sm">
          {['Appointment Booking', 'Digital Prescriptions', 'Doctor Search', 'Medical Records'].map((f) => (
            <Box key={f} bg="brand.700" px={4} py={3} rounded="lg" textAlign="center">
              <Text fontSize="sm" fontWeight="500">{f}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Right panel — form */}
      <Flex flex={{ base: 1, lg: '0 0 460px' }} align="center" justify="center" p={6} bg="white">
        <Box w="full" maxW="400px">
          <Stack gap={6}>
            {/* Mobile brand */}
            <Flex align="center" gap={2} display={{ lg: 'none' }}>
              <Box color="brand.500" fontSize="2xl"><FaHospitalUser /></Box>
              <Heading size="lg" color="brand.600">MediConnect</Heading>
            </Flex>

            <Box>
              <Heading size="xl" color="gray.800">Welcome back</Heading>
              <Text color="gray.500" mt={1}>Sign in to your healthcare account</Text>
            </Box>

            {error && (
              <Alert.Root status="error" rounded="md">
                <Alert.Indicator />
                <Alert.Title>{error}</Alert.Title>
              </Alert.Root>
            )}

            <Box as="form" onSubmit={handleSubmit}>
              <Stack gap={4}>
                <Field.Root required>
                  <Field.Label>Email address</Field.Label>
                  <Box position="relative">
                    <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1}>
                      <MdEmail />
                    </Box>
                    <Input
                      name="email"
                      type="email"
                      pl={9}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                  </Box>
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Password</Field.Label>
                  <Box position="relative">
                    <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1}>
                      <MdLock />
                    </Box>
                    <Input
                      name="password"
                      type="password"
                      pl={9}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                    />
                  </Box>
                </Field.Root>

                <Button
                  type="submit"
                  colorPalette="teal"
                  loading={loading}
                  loadingText="Signing in…"
                  w="full"
                  size="lg"
                >
                  Sign In
                </Button>
              </Stack>
            </Box>

            <Text fontSize="sm" textAlign="center" color="gray.500">
              New patient?{' '}
              <Text as={Link} to="/register" color="brand.500" fontWeight="600" _hover={{ textDecoration: 'underline' }}>
                Create account
              </Text>
            </Text>

            {/* Demo credentials */}
            <Box borderTopWidth="1px" borderColor="gray.200" pt={4}>
              <Text fontSize="xs" color="gray.400" mb={3} textAlign="center" textTransform="uppercase" letterSpacing="wider">
                Demo — click to auto-fill
              </Text>
              <SimpleGrid columns={3} gap={2}>
                {DEMO_CREDENTIALS.map((cred) => (
                  <Button
                    key={cred.role}
                    size="xs"
                    variant="outline"
                    colorPalette={cred.color}
                    onClick={() => fillDemo(cred)}
                    flexDir="column"
                    h="auto"
                    py={2}
                    gap={1}
                  >
                    <Badge colorPalette={cred.color} size="sm">{cred.role}</Badge>
                    <Text fontSize="9px" opacity={0.7} fontWeight="normal" wordBreak="break-all">
                      {cred.email}
                    </Text>
                  </Button>
                ))}
              </SimpleGrid>
            </Box>
          </Stack>
        </Box>
      </Flex>
    </Flex>
  )
}
