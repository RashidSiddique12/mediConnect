import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Card,
  Circle,
  Icon,
  Stack,
  Badge,
  Image,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import {
  MdCalendarToday,
  MdDescription,
  MdSearch,
  MdArrowForward,
  MdShield,
  MdVerified,
  MdHealthAndSafety,
  MdAccessTime,
} from 'react-icons/md'
import {
  FaHospitalUser,
  FaHeartbeat,
  FaUserMd,
  FaHospital,
} from 'react-icons/fa'

const MotionBox = motion.create(Box)

/* ── Animation variant ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

/* ── Data ── */
const STATS = [
  { label: 'Hospitals', value: '50+', icon: FaHospital, color: 'teal' },
  { label: 'Doctors', value: '200+', icon: FaUserMd, color: 'blue' },
  { label: 'Patients Served', value: '10K+', icon: FaHeartbeat, color: 'red' },
  {
    label: 'Specialties',
    value: '30+',
    icon: MdHealthAndSafety,
    color: 'purple',
  },
]

const FEATURES = [
  {
    icon: MdSearch,
    title: 'Find Hospitals & Doctors',
    desc: 'Search by name, specialty, or location to find the right healthcare provider for your needs.',
    color: 'teal',
  },
  {
    icon: MdCalendarToday,
    title: 'Easy Appointment Booking',
    desc: 'Select your doctor, pick an available time slot, and confirm your visit in seconds.',
    color: 'blue',
  },
  {
    icon: MdDescription,
    title: 'Digital Prescriptions',
    desc: 'Access, view, and download your prescriptions digitally — no more lost paperwork.',
    color: 'green',
  },
  {
    icon: MdVerified,
    title: 'Reviews & Ratings',
    desc: 'Read trusted patient reviews and rate your own healthcare experiences.',
    color: 'orange',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Search',
    desc: 'Find hospitals and doctors by specialty or name',
    icon: MdSearch,
  },
  {
    num: '02',
    title: 'Book',
    desc: 'Select a time slot and confirm your appointment',
    icon: MdCalendarToday,
  },
  {
    num: '03',
    title: 'Visit',
    desc: 'Get treated and receive digital prescriptions',
    icon: FaHeartbeat,
  },
]

const SHOWCASES = [
  {
    title: 'Modern Hospitals',
    desc: 'State-of-the-art facilities with cutting-edge infrastructure for world-class healthcare.',
    img: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80',
  },
  {
    title: 'Advanced Equipment',
    desc: 'Latest medical technology and diagnostic tools ensuring accurate and efficient care.',
    img: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&q=80',
  },
  {
    title: 'Patient-First Care',
    desc: 'Compassionate healthcare professionals dedicated to your well-being and recovery.',
    img: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&q=80',
  },
]

const TESTIMONIAL_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80',
    alt: 'Doctor with stethoscope',
  },
  {
    src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80',
    alt: 'Medical laboratory',
  },
  {
    src: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600&q=80',
    alt: 'Doctor consulting patient',
  },
  {
    src: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&q=80',
    alt: 'Nurse attending patient',
  },
]

const ROLES = [
  {
    role: 'Patients',
    icon: FaHeartbeat,
    color: 'teal',
    features: [
      'Search hospitals & doctors',
      'Book appointments online',
      'View digital prescriptions',
      'Rate & review doctors',
    ],
  },
  {
    role: 'Hospitals',
    icon: FaHospital,
    color: 'blue',
    features: [
      'Manage doctor profiles',
      'Set schedules & time slots',
      'Track appointments',
      'Upload prescriptions',
    ],
  },
  {
    role: 'Administrators',
    icon: MdShield,
    color: 'purple',
    features: [
      'Oversee all hospitals',
      'Manage specialties',
      'Monitor user activity',
      'Moderate reviews',
    ],
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((s) => s.auth)

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      const routes = {
        super_admin: '/admin',
        hospital_admin: '/hospital',
        patient: '/patient',
      }
      navigate(routes[user.role] || '/login', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  return (
    <Box minH="100vh" bg="white">
      {/* ─── Navbar ─── */}
      <Flex
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={50}
        h="70px"
        align="center"
        justify="space-between"
        px={{ base: 5, md: 10 }}
        bg="whiteAlpha.900"
        backdropFilter="blur(12px)"
        borderBottom="1px solid"
        borderColor="gray.100"
        shadow="sm"
      >
        <Flex
          align="center"
          gap={2.5}
          cursor="pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Circle size="38px" bg="brand.500">
            <Icon fontSize="18px" color="white">
              <FaHospitalUser />
            </Icon>
          </Circle>
          <Heading
            size="lg"
            color="brand.700"
            letterSpacing="-0.3px"
            fontWeight="700"
          >
            MediConnect
          </Heading>
        </Flex>
        <Flex gap={3} align="center">
          <Button
            variant="ghost"
            color="gray.600"
            _hover={{ color: 'brand.600', bg: 'brand.50' }}
            size={{ base: 'sm', md: 'md' }}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            colorPalette="teal"
            size={{ base: 'sm', md: 'md' }}
            onClick={() => navigate('/register')}
          >
            Get Started <MdArrowForward />
          </Button>
        </Flex>
      </Flex>

      {/* ─── Hero ─── */}
      <Box
        pt="70px"
        minH="100vh"
        display="flex"
        alignItems="center"
        position="relative"
        overflow="hidden"
        bgGradient="to-br"
        gradientFrom="brand.800"
        gradientVia="brand.700"
        gradientTo="brand.900"
        color="white"
      >
        {/* Decorative bg circles */}
        <Box
          position="absolute"
          top="-150px"
          left="-150px"
          w="500px"
          h="500px"
          rounded="full"
          opacity={0.06}
          bg="white"
        />
        <Box
          position="absolute"
          bottom="-100px"
          right="-100px"
          w="400px"
          h="400px"
          rounded="full"
          opacity={0.05}
          bg="white"
        />
        <Box
          position="absolute"
          top="40%"
          right="30%"
          w="200px"
          h="200px"
          rounded="full"
          opacity={0.03}
          bg="white"
        />
        <Box
          position="absolute"
          bottom="20%"
          left="10%"
          w="120px"
          h="120px"
          rounded="full"
          opacity={0.04}
          bg="brand.300"
        />

        <Flex
          maxW="7xl"
          mx="auto"
          px={{ base: 5, md: 10 }}
          py={{ base: 16, md: 0 }}
          w="full"
          align="center"
          justify="space-between"
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: 12, lg: 8 }}
        >
          {/* Left — copy */}
          <MotionBox
            flex={1}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            textAlign={{ base: 'center', lg: 'left' }}
          >
            <Badge
              bg="whiteAlpha.200"
              color="brand.200"
              px={4}
              py={1.5}
              rounded="full"
              fontSize="xs"
              fontWeight="600"
              letterSpacing="0.5px"
              mb={6}
              display="inline-flex"
              alignItems="center"
              gap={1.5}
            >
              <FaHospitalUser /> #1 Healthcare Platform
            </Badge>
            <Heading
              size={{ base: '3xl', md: '4xl', lg: '5xl' }}
              color="white"
              fontWeight="800"
              lineHeight="1.1"
              letterSpacing="-1px"
            >
              Connecting You to
              <br />
              <Text as="span" color="brand.200">
                Better Health.
              </Text>
            </Heading>
            <Text
              mt={5}
              fontSize={{ base: 'md', md: 'lg' }}
              opacity={0.75}
              maxW="lg"
              mx={{ base: 'auto', lg: '0' }}
              lineHeight="tall"
            >
              A centralized healthcare platform connecting patients, hospitals,
              and doctors — book appointments, get digital prescriptions, and
              manage your health journey seamlessly.
            </Text>
            <Flex
              mt={8}
              gap={4}
              justify={{ base: 'center', lg: 'flex-start' }}
              wrap="wrap"
            >
              <Button
                size="lg"
                bg="white"
                color="brand.700"
                _hover={{
                  bg: 'brand.50',
                  transform: 'translateY(-2px)',
                  shadow: 'xl',
                }}
                transition="all 0.2s"
                px={8}
                rounded="xl"
                fontWeight="700"
                onClick={() => navigate('/register')}
              >
                Get Started Free <MdArrowForward />
              </Button>
              <Button
                size="lg"
                variant="outline"
                borderColor="whiteAlpha.400"
                color="white"
                _hover={{
                  bg: 'whiteAlpha.100',
                  borderColor: 'whiteAlpha.600',
                }}
                transition="all 0.2s"
                px={8}
                rounded="xl"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </Flex>
            <Flex
              mt={8}
              gap={6}
              align="center"
              justify={{ base: 'center', lg: 'flex-start' }}
              opacity={0.5}
            >
              <Flex align="center" gap={1.5}>
                <MdShield size={16} />
                <Text fontSize="xs">Secure & Private</Text>
              </Flex>
              <Flex align="center" gap={1.5}>
                <MdVerified size={16} />
                <Text fontSize="xs">Verified Doctors</Text>
              </Flex>
              <Flex align="center" gap={1.5}>
                <MdAccessTime size={16} />
                <Text fontSize="xs">24/7 Available</Text>
              </Flex>
            </Flex>
          </MotionBox>

          {/* Right — illustration */}
          <MotionBox
            flex={1}
            display="flex"
            justifyContent="center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Box position="relative">
              {/* Main circle */}
              <Circle
                size={{ base: '280px', md: '360px' }}
                bg="whiteAlpha.100"
                backdropFilter="blur(8px)"
                border="1px solid"
                borderColor="whiteAlpha.200"
              >
                <Icon
                  fontSize={{ base: '100px', md: '130px' }}
                  color="brand.200"
                >
                  <FaHospitalUser />
                </Icon>
              </Circle>
              {/* Floating icons */}
              <MotionBox
                position="absolute"
                top={{ base: '-10px', md: '-15px' }}
                right={{ base: '-10px', md: '-20px' }}
                animate={{ y: [-6, 6, -6] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Circle size="60px" bg="blue.400" shadow="lg">
                  <Icon fontSize="24px" color="white">
                    <FaUserMd />
                  </Icon>
                </Circle>
              </MotionBox>
              <MotionBox
                position="absolute"
                bottom={{ base: '10px', md: '20px' }}
                left={{ base: '-20px', md: '-35px' }}
                animate={{ y: [6, -6, 6] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Circle size="55px" bg="green.400" shadow="lg">
                  <Icon fontSize="22px" color="white">
                    <MdCalendarToday />
                  </Icon>
                </Circle>
              </MotionBox>
              <MotionBox
                position="absolute"
                top="50%"
                left={{ base: '-25px', md: '-40px' }}
                animate={{ y: [-4, 8, -4] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Circle size="50px" bg="orange.400" shadow="lg">
                  <Icon fontSize="20px" color="white">
                    <MdDescription />
                  </Icon>
                </Circle>
              </MotionBox>
              <MotionBox
                position="absolute"
                bottom={{ base: '-10px', md: '-15px' }}
                right={{ base: '20px', md: '30px' }}
                animate={{ y: [5, -5, 5] }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Circle size="48px" bg="red.400" shadow="lg">
                  <Icon fontSize="20px" color="white">
                    <FaHeartbeat />
                  </Icon>
                </Circle>
              </MotionBox>
            </Box>
          </MotionBox>
        </Flex>
      </Box>

      {/* ─── Stats Bar ─── */}
      <Box
        bg="white"
        py={{ base: 10, md: 14 }}
        px={{ base: 5, md: 10 }}
        shadow="sm"
        position="relative"
        zIndex={2}
      >
        <SimpleGrid
          columns={{ base: 2, md: 4 }}
          gap={{ base: 6, md: 10 }}
          maxW="5xl"
          mx="auto"
        >
          {STATS.map((s, i) => (
            <MotionBox
              key={s.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              textAlign="center"
            >
              <Circle size="56px" bg={`${s.color}.50`} mx="auto" mb={3}>
                <Icon fontSize="24px" color={`${s.color}.500`}>
                  <s.icon />
                </Icon>
              </Circle>
              <Heading
                size={{ base: 'xl', md: '2xl' }}
                color="gray.800"
                fontWeight="800"
              >
                {s.value}
              </Heading>
              <Text fontSize="sm" color="gray.500" mt={1}>
                {s.label}
              </Text>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Box>

      {/* ─── Features ─── */}
      <Box bg="gray.50" py={{ base: 16, md: 24 }} px={{ base: 5, md: 10 }}>
        <Box maxW="7xl" mx="auto">
          <MotionBox
            textAlign="center"
            mb={{ base: 10, md: 14 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <Badge colorPalette="teal" px={3} py={1} rounded="full" mb={4}>
              Features
            </Badge>
            <Heading
              size={{ base: 'xl', md: '2xl' }}
              color="gray.800"
              fontWeight="700"
            >
              Everything You Need for Better Healthcare
            </Heading>
            <Text
              color="gray.500"
              mt={3}
              maxW="2xl"
              mx="auto"
              fontSize={{ base: 'sm', md: 'md' }}
            >
              MediConnect streamlines every step of your healthcare journey —
              from finding the right doctor to managing your medical records.
            </Text>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={{ base: 5, md: 6 }}>
            {FEATURES.map((f, i) => (
              <MotionBox
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card.Root
                  shadow="sm"
                  rounded="2xl"
                  h="full"
                  _hover={{ shadow: 'xl', transform: 'translateY(-6px)' }}
                  css={{ transition: 'all 0.3s ease' }}
                  borderTop="3px solid"
                  borderColor={`${f.color}.400`}
                >
                  <Card.Body p={6}>
                    <Circle size="50px" bg={`${f.color}.50`} mb={4}>
                      <Icon fontSize="22px" color={`${f.color}.500`}>
                        <f.icon />
                      </Icon>
                    </Circle>
                    <Heading size="md" color="gray.800" mb={2}>
                      {f.title}
                    </Heading>
                    <Text fontSize="sm" color="gray.500" lineHeight="tall">
                      {f.desc}
                    </Text>
                  </Card.Body>
                </Card.Root>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      {/* ─── How It Works ─── */}
      <Box bg="white" py={{ base: 16, md: 24 }} px={{ base: 5, md: 10 }}>
        <Box maxW="5xl" mx="auto">
          <MotionBox
            textAlign="center"
            mb={{ base: 10, md: 14 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <Badge colorPalette="teal" px={3} py={1} rounded="full" mb={4}>
              How It Works
            </Badge>
            <Heading
              size={{ base: 'xl', md: '2xl' }}
              color="gray.800"
              fontWeight="700"
            >
              Book an Appointment in 3 Steps
            </Heading>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 8, md: 10 }}>
            {STEPS.map((step, i) => (
              <MotionBox
                key={step.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                textAlign="center"
              >
                <Circle
                  size="80px"
                  bg="brand.50"
                  mx="auto"
                  mb={5}
                  border="2px solid"
                  borderColor="brand.200"
                >
                  <Text fontSize="2xl" fontWeight="800" color="brand.600">
                    {step.num}
                  </Text>
                </Circle>
                <Heading size="lg" color="gray.800" mb={2}>
                  {step.title}
                </Heading>
                <Text color="gray.500" fontSize="sm">
                  {step.desc}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      {/* ─── Image Showcase ─── */}
      <Box py={{ base: 16, md: 24 }} px={{ base: 5, md: 10 }} bg="gray.50">
        <Box maxW="7xl" mx="auto">
          <MotionBox
            textAlign="center"
            mb={{ base: 10, md: 14 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <Badge colorPalette="teal" px={3} py={1} rounded="full" mb={4}>
              Our Impact
            </Badge>
            <Heading
              size={{ base: 'xl', md: '2xl' }}
              color="gray.800"
              fontWeight="700"
            >
              Transforming Healthcare, One Click at a Time
            </Heading>
            <Text color="gray.500" mt={3} maxW="2xl" mx="auto">
              See how MediConnect is revolutionizing the way patients, hospitals,
              and doctors connect.
            </Text>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 6, md: 8 }}>
            {SHOWCASES.map((item, i) => (
              <MotionBox
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <Box
                  h={{ base: '280px', md: '340px' }}
                  rounded="2xl"
                  overflow="hidden"
                  position="relative"
                  cursor="pointer"
                  _hover={{ transform: 'scale(1.03)', shadow: '2xl' }}
                  css={{ transition: 'all 0.4s ease' }}
                  shadow="lg"
                >
                  <Image
                    src={item.img}
                    alt={item.title}
                    w="full"
                    h="full"
                    objectFit="cover"
                    loading="lazy"
                  />
                  <Box
                    position="absolute"
                    inset={0}
                    bgGradient="to-t"
                    gradientFrom="blackAlpha.800"
                    gradientVia="blackAlpha.300"
                    gradientTo="transparent"
                  />
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    p={6}
                  >
                    <Heading size="md" color="white" mb={1}>
                      {item.title}
                    </Heading>
                    <Text fontSize="sm" color="whiteAlpha.800">
                      {item.desc}
                    </Text>
                  </Box>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      {/* ─── Who It Serves ─── */}
      <Box bg="white" py={{ base: 16, md: 24 }} px={{ base: 5, md: 10 }}>
        <Box maxW="7xl" mx="auto">
          <MotionBox
            textAlign="center"
            mb={{ base: 10, md: 14 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <Badge colorPalette="teal" px={3} py={1} rounded="full" mb={4}>
              Built For Everyone
            </Badge>
            <Heading
              size={{ base: 'xl', md: '2xl' }}
              color="gray.800"
              fontWeight="700"
            >
              One Platform, Three Powerful Dashboards
            </Heading>
            <Text color="gray.500" mt={3} maxW="2xl" mx="auto">
              Whether you&#39;re a patient, hospital, or administrator —
              MediConnect has the tools you need.
            </Text>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 6, md: 8 }}>
            {ROLES.map((r, i) => (
              <MotionBox
                key={r.role}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <Card.Root
                  shadow="md"
                  rounded="2xl"
                  h="full"
                  _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}
                  css={{ transition: 'all 0.3s ease' }}
                  overflow="hidden"
                >
                  <Box
                    bgGradient="to-br"
                    gradientFrom={`${r.color}.500`}
                    gradientTo={`${r.color}.700`}
                    py={8}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Circle size="70px" bg="whiteAlpha.200" mb={3}>
                      <Icon fontSize="30px" color="white">
                        <r.icon />
                      </Icon>
                    </Circle>
                    <Heading size="lg" color="white">
                      {r.role}
                    </Heading>
                  </Box>
                  <Card.Body p={6}>
                    <Stack gap={3}>
                      {r.features.map((f) => (
                        <Flex key={f} align="center" gap={2.5}>
                          <Circle
                            size="24px"
                            bg={`${r.color}.50`}
                            flexShrink={0}
                          >
                            <Icon fontSize="12px" color={`${r.color}.500`}>
                              <MdVerified />
                            </Icon>
                          </Circle>
                          <Text fontSize="sm" color="gray.600">
                            {f}
                          </Text>
                        </Flex>
                      ))}
                    </Stack>
                  </Card.Body>
                </Card.Root>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      {/* ─── Gallery / Trust ─── */}
      <Box bg="gray.50" py={{ base: 16, md: 24 }} px={{ base: 5, md: 10 }}>
        <Box maxW="7xl" mx="auto">
          <MotionBox
            textAlign="center"
            mb={{ base: 10, md: 14 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <Badge colorPalette="teal" px={3} py={1} rounded="full" mb={4}>
              Trusted Care
            </Badge>
            <Heading
              size={{ base: 'xl', md: '2xl' }}
              color="gray.800"
              fontWeight="700"
            >
              Real Doctors, Real Hospitals, Real Care
            </Heading>
            <Text color="gray.500" mt={3} maxW="2xl" mx="auto">
              Our network includes verified healthcare professionals and
              accredited medical facilities across the country.
            </Text>
          </MotionBox>

          {/* Masonry-style gallery */}
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
            {TESTIMONIAL_IMAGES.map((img, i) => (
              <MotionBox
                key={img.alt}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Box
                  h={{ base: '200px', md: '260px' }}
                  rounded="2xl"
                  overflow="hidden"
                  shadow="md"
                  _hover={{ shadow: 'xl', transform: 'scale(1.03)' }}
                  css={{ transition: 'all 0.3s ease' }}
                  position="relative"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    w="full"
                    h="full"
                    objectFit="cover"
                    loading="lazy"
                  />
                  <Box
                    position="absolute"
                    inset={0}
                    bgGradient="to-t"
                    gradientFrom="blackAlpha.400"
                    gradientTo="transparent"
                    opacity={0}
                    _hover={{ opacity: 1 }}
                    css={{ transition: 'opacity 0.3s ease' }}
                    display="flex"
                    alignItems="flex-end"
                    p={4}
                  >
                    <Text fontSize="xs" color="white" fontWeight="600">
                      {img.alt}
                    </Text>
                  </Box>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      {/* ─── CTA ─── */}
      <Box
        py={{ base: 16, md: 24 }}
        px={{ base: 5, md: 10 }}
        bgGradient="to-br"
        gradientFrom="brand.700"
        gradientTo="brand.900"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-60px"
          right="-60px"
          w="250px"
          h="250px"
          rounded="full"
          opacity={0.06}
          bg="white"
        />
        <Box
          position="absolute"
          bottom="-40px"
          left="-40px"
          w="200px"
          h="200px"
          rounded="full"
          opacity={0.04}
          bg="white"
        />
        <MotionBox
          maxW="3xl"
          mx="auto"
          textAlign="center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <Heading
            size={{ base: '2xl', md: '3xl' }}
            color="white"
            fontWeight="800"
            lineHeight="1.2"
          >
            Ready to Transform Your Healthcare Experience?
          </Heading>
          <Text
            color="whiteAlpha.700"
            mt={4}
            fontSize={{ base: 'md', md: 'lg' }}
          >
            Join thousands of patients and hospitals already using MediConnect
            to simplify healthcare management.
          </Text>
          <Flex mt={8} gap={4} justify="center" wrap="wrap">
            <Button
              size="lg"
              bg="white"
              color="brand.700"
              _hover={{
                bg: 'brand.50',
                transform: 'translateY(-2px)',
                shadow: 'xl',
              }}
              transition="all 0.2s"
              px={10}
              rounded="xl"
              fontWeight="700"
              onClick={() => navigate('/register')}
            >
              Create Free Account <MdArrowForward />
            </Button>
            <Button
              size="lg"
              variant="outline"
              borderColor="whiteAlpha.400"
              color="white"
              _hover={{ bg: 'whiteAlpha.100' }}
              px={8}
              rounded="xl"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Flex>
        </MotionBox>
      </Box>

      {/* ─── Footer ─── */}
      <Box bg="gray.900" color="gray.400" py={10} px={{ base: 5, md: 10 }}>
        <Flex
          maxW="7xl"
          mx="auto"
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap={4}
        >
          <Flex align="center" gap={2}>
            <Circle size="32px" bg="brand.500">
              <Icon fontSize="14px" color="white">
                <FaHospitalUser />
              </Icon>
            </Circle>
            <Text fontWeight="600" color="gray.300">
              MediConnect
            </Text>
          </Flex>
          <Text fontSize="sm" textAlign="center">
            © 2026 MediConnect. All rights reserved. Built with ❤️ for better
            healthcare.
          </Text>
          <Flex gap={4}>
            <Text
              fontSize="sm"
              cursor="pointer"
              _hover={{ color: 'white' }}
              css={{ transition: 'color 0.2s' }}
            >
              Privacy
            </Text>
            <Text
              fontSize="sm"
              cursor="pointer"
              _hover={{ color: 'white' }}
              css={{ transition: 'color 0.2s' }}
            >
              Terms
            </Text>
            <Text
              fontSize="sm"
              cursor="pointer"
              _hover={{ color: 'white' }}
              css={{ transition: 'color 0.2s' }}
            >
              Contact
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}
