import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
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
  Circle,
  Icon,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdEmail,
  MdLock,
  MdCalendarMonth,
  MdMedicalServices,
  MdSearch,
  MdDescription,
  MdArrowForward,
  MdShield,
} from "react-icons/md";
import { FaHospitalUser, FaHeartbeat } from "react-icons/fa";
import * as authSlice from "@/features/auth/authSlice";

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);

const DEMO_CREDENTIALS = [
  {
    role: "Super Admin",
    email: "admin@mediconnect.com",
    password: "Admin@123",
    color: "red",
    icon: MdShield,
  },
  {
    role: "Hospital Admin",
    email: "admin.apollo.chennai@mediconnect.com",
    password: "test@123",
    color: "purple",
    icon: FaHospitalUser,
  },
  {
    role: "Patient",
    email: "patient@mediconnect.com",
    password: "Patient@123",
    color: "teal",
    icon: FaHeartbeat,
  },
];

const FEATURES = [
  {
    icon: MdCalendarMonth,
    label: "Appointment Booking",
    desc: "Schedule visits with ease",
  },
  {
    icon: MdDescription,
    label: "Digital Prescriptions",
    desc: "Paperless Rx management",
  },
  { icon: MdSearch, label: "Doctor Search", desc: "Find the right specialist" },
  {
    icon: MdMedicalServices,
    label: "Medical Records",
    desc: "All your health data in one place",
  },
];

const inputStyles = {
  h: "46px",
  w: "100%",
  rounded: "xl",
  bg: "gray.50",
  borderColor: "gray.200",
  _hover: { borderColor: "brand.300", bg: "white" },
  _focus: {
    borderColor: "brand.500",
    bg: "white",
    boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
  },
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user) {
      const routes = {
        super_admin: "/admin",
        hospital_admin: "/hospital",
        patient: "/patient",
      };
      navigate(routes[user.role] || "/admin", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fillDemo = (cred) => {
    setForm({ email: cred.email, password: cred.password });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(authSlice.loginRequest(form));
  };

  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Left panel — branding */}
      <Box
        hideBelow="lg"
        display="flex"
        flex={1}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={12}
        bg="brand.800"
        color="white"
        position="relative"
        overflow="hidden"
      >
        {/* Decorative background shapes */}
        <Box
          position="absolute"
          inset={0}
          bgGradient="to-br"
          gradientFrom="brand.800"
          gradientVia="brand.700"
          gradientTo="brand.900"
        />
        <Box
          position="absolute"
          top="-120px"
          left="-120px"
          w="400px"
          h="400px"
          rounded="full"
          opacity={0.08}
          bg="white"
        />
        <Box
          position="absolute"
          bottom="-80px"
          right="-80px"
          w="350px"
          h="350px"
          rounded="full"
          opacity={0.06}
          bg="white"
        />
        <Box
          position="absolute"
          top="50%"
          left="70%"
          w="180px"
          h="180px"
          rounded="full"
          opacity={0.04}
          bg="white"
        />

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          zIndex={1}
          textAlign="center"
        >
          <Circle
            size="72px"
            bg="whiteAlpha.200"
            mx="auto"
            mb={5}
            backdropFilter="blur(8px)"
          >
            <Icon fontSize="32px" color="white">
              <FaHospitalUser />
            </Icon>
          </Circle>

          <Heading size="3xl" color="white" mb={3} letterSpacing="-0.5px">
            MediConnect
          </Heading>
          <Text opacity={0.65} maxW="sm" fontSize="md" lineHeight="tall">
            Your unified healthcare platform connecting patients, hospitals, and
            doctors.
          </Text>
        </MotionBox>

        <SimpleGrid columns={2} gap={3} pt={10} w="full" maxW="md" zIndex={1}>
          {FEATURES.map((f, i) => (
            <MotionBox
              key={f.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              bg="whiteAlpha.100"
              backdropFilter="blur(8px)"
              px={4}
              py={3.5}
              rounded="xl"
              display="flex"
              alignItems="center"
              gap={3}
              borderWidth="1px"
              borderColor="whiteAlpha.100"
              _hover={{ bg: "whiteAlpha.200", borderColor: "whiteAlpha.200" }}
              css={{ transition: "all 0.2s" }}
            >
              <Circle size="34px" bg="whiteAlpha.200" flexShrink={0}>
                <Icon fontSize="15px" color="brand.200">
                  <f.icon />
                </Icon>
              </Circle>
              <Box>
                <Text fontSize="sm" fontWeight="600" lineHeight="short">
                  {f.label}
                </Text>
                <Text fontSize="xs" opacity={0.45} lineHeight="short">
                  {f.desc}
                </Text>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          pt={10}
          zIndex={1}
        >
          <Flex align="center" gap={2} opacity={0.35}>
            <MdShield size={14} />
            <Text fontSize="xs">Secured with end-to-end encryption</Text>
          </Flex>
        </MotionBox>
      </Box>

      {/* Right panel — form */}
      <Flex
        flex={{ base: 1, lg: "0 0 520px" }}
        align="center"
        justify="center"
        p={{ base: 5, md: 10 }}
        bg="white"
        overflowY="auto"
      >
        <MotionBox
          w="full"
          maxW="400px"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Stack gap={6}>
            {/* Mobile brand */}
            <Flex align="center" gap={2.5} hideFrom="lg">
              <Circle size="38px" bg="brand.500">
                <Icon fontSize="16px" color="white">
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

            <Box>
              <Heading
                size="2xl"
                color="gray.800"
                letterSpacing="-0.5px"
                fontWeight="700"
              >
                Welcome back
              </Heading>
              <Text color="gray.500" mt={1}>
                Sign in to access your healthcare dashboard
              </Text>
            </Box>

            <AnimatePresence>
              {error && (
                <MotionBox
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert.Root status="error" rounded="xl">
                    <Alert.Indicator />
                    <Alert.Title>{error}</Alert.Title>
                  </Alert.Root>
                </MotionBox>
              )}
            </AnimatePresence>

            <Box as="form" onSubmit={handleSubmit}>
              <Stack gap={4}>
                <Field.Root required>
                  <Field.Label fontWeight="500" fontSize="sm" color="gray.600">
                    Email address
                  </Field.Label>
                  <Box position="relative" w="full">
                    <Box
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="gray.400"
                      zIndex={1}
                    >
                      <MdEmail size={18} />
                    </Box>
                    <Input
                      name="email"
                      type="email"
                      pl={10}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      {...inputStyles}
                    />
                  </Box>
                </Field.Root>

                <Field.Root required>
                  <Field.Label fontWeight="500" fontSize="sm" color="gray.600">
                    Password
                  </Field.Label>
                  <Box position="relative" w="full">
                    <Box
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="gray.400"
                      zIndex={1}
                    >
                      <MdLock size={18} />
                    </Box>
                    <Input
                      name="password"
                      type="password"
                      pl={10}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      {...inputStyles}
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
                  h="46px"
                  rounded="xl"
                  fontSize="md"
                  fontWeight="600"
                  mt={1}
                  _hover={{ opacity: 0.9 }}
                >
                  Sign In
                  <MdArrowForward />
                </Button>
              </Stack>
            </Box>

            <Text fontSize="sm" textAlign="center" color="gray.500">
              New patient?{" "}
              <Text
                as={Link}
                to="/register"
                color="brand.500"
                fontWeight="600"
                _hover={{ textDecoration: "underline", color: "brand.600" }}
              >
                Create your free account
              </Text>
            </Text>

            {/* Demo credentials */}
            <Box borderTopWidth="1px" borderColor="gray.100" pt={4}>
              <Text
                fontSize="xs"
                color="gray.400"
                mb={3}
                textAlign="center"
                textTransform="uppercase"
                letterSpacing="wider"
                fontWeight="600"
              >
                Quick Demo Access
              </Text>
              <Stack gap={2}>
                {DEMO_CREDENTIALS.map((cred) => (
                  <MotionFlex
                    key={cred.role}
                    as="button"
                    type="button"
                    onClick={() => fillDemo(cred)}
                    align="center"
                    gap={3}
                    px={3.5}
                    py={2.5}
                    rounded="xl"
                    bg="gray.50"
                    cursor="pointer"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    _hover={{ bg: "gray.100" }}
                    css={{ transition: "all 0.15s", textAlign: "left" }}
                    w="full"
                  >
                    <Circle size="30px" bg={`${cred.color}.100`} flexShrink={0}>
                      <Icon fontSize="13px" color={`${cred.color}.600`}>
                        <cred.icon />
                      </Icon>
                    </Circle>
                    <Box flex={1} minW={0}>
                      <Text
                        fontSize="sm"
                        fontWeight="600"
                        color="gray.700"
                        lineHeight="short"
                      >
                        {cred.role}
                      </Text>
                      <Text
                        fontSize="xs"
                        color="gray.400"
                        truncate
                        lineHeight="short"
                      >
                        {cred.email}
                      </Text>
                    </Box>
                    <Badge colorPalette={cred.color} size="sm" variant="subtle">
                      Demo
                    </Badge>
                  </MotionFlex>
                ))}
              </Stack>
            </Box>
          </Stack>
        </MotionBox>
      </Flex>
    </Flex>
  );
}
