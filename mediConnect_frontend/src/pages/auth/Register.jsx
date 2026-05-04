import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
  Circle,
  Icon,
  createListCollection,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdPerson,
  MdEmail,
  MdLock,
  MdPhone,
  MdArrowForward,
  MdShield,
  MdVerifiedUser,
  MdHealthAndSafety,
} from "react-icons/md";
import { FaHospitalUser, FaHeartbeat, FaUserMd } from "react-icons/fa";
import * as authSlice from "@/features/auth/authSlice";

const MotionBox = motion.create(Box);

const genders = createListCollection({
  items: [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ],
});

const BENEFITS = [
  {
    icon: FaHeartbeat,
    title: "Book Appointments",
    desc: "Schedule visits with top doctors in seconds",
  },
  {
    icon: MdHealthAndSafety,
    title: "Health Records",
    desc: "Access your medical history anytime",
  },
  {
    icon: FaUserMd,
    title: "Find Specialists",
    desc: "Search doctors by specialty & location",
  },
  {
    icon: MdVerifiedUser,
    title: "Secure & Private",
    desc: "Your data is encrypted and protected",
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

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    gender: "",
  });
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }
    const { confirmPassword, ...payload } = form;
    dispatch(authSlice.registerRequest({ ...payload, role: "patient" }));
  };

  const displayError = localError || error;

  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Left branding panel */}
      <Box
        hideBelow="lg"
        display="flex"
        flex={1}
        flexDir="column"
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
          right="-120px"
          w="400px"
          h="400px"
          rounded="full"
          opacity={0.08}
          bg="white"
        />
        <Box
          position="absolute"
          bottom="-80px"
          left="-80px"
          w="350px"
          h="350px"
          rounded="full"
          opacity={0.06}
          bg="white"
        />
        <Box
          position="absolute"
          top="60%"
          right="15%"
          w="150px"
          h="150px"
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
            Create your free patient account and take control of your healthcare
            journey.
          </Text>
        </MotionBox>

        <Stack gap={3} pt={10} w="full" maxW="sm" zIndex={1}>
          {BENEFITS.map((b, i) => (
            <MotionBox
              key={b.title}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              display="flex"
              alignItems="center"
              gap={3.5}
              bg="whiteAlpha.100"
              backdropFilter="blur(8px)"
              px={4}
              py={3.5}
              rounded="xl"
              borderWidth="1px"
              borderColor="whiteAlpha.100"
              _hover={{ bg: "whiteAlpha.200", borderColor: "whiteAlpha.200" }}
              css={{ transition: "all 0.2s" }}
            >
              <Circle size="36px" bg="whiteAlpha.200" flexShrink={0}>
                <Icon fontSize="16px" color="brand.200">
                  <b.icon />
                </Icon>
              </Circle>
              <Box>
                <Text fontSize="sm" fontWeight="600" lineHeight="short">
                  {b.title}
                </Text>
                <Text fontSize="xs" opacity={0.45} lineHeight="short">
                  {b.desc}
                </Text>
              </Box>
            </MotionBox>
          ))}
        </Stack>

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          pt={10}
          zIndex={1}
        >
          <Flex align="center" gap={2} opacity={0.35}>
            <MdShield size={14} />
            <Text fontSize="xs">HIPAA-compliant & secured with encryption</Text>
          </Flex>
        </MotionBox>
      </Box>

      {/* Right form panel */}
      <Flex
        flex={{ base: 1, lg: "0 0 540px" }}
        align="center"
        justify="center"
        p={{ base: 5, md: 10 }}
        bg="white"
        overflowY="auto"
      >
        <MotionBox
          w="full"
          maxW="440px"
          py={{ base: 4, lg: 8 }}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Stack gap={5}>
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
                Create account
              </Heading>
              <Text color="gray.500" mt={1}>
                Join as a patient — it only takes a minute
              </Text>
            </Box>

            <AnimatePresence>
              {displayError && (
                <MotionBox
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert.Root status="error" rounded="xl">
                    <Alert.Indicator />
                    <Alert.Title>{displayError}</Alert.Title>
                  </Alert.Root>
                </MotionBox>
              )}
            </AnimatePresence>

            <Box as="form" onSubmit={handleSubmit}>
              <Stack gap={3.5}>
                <SimpleGrid columns={2} gap={3.5}>
                  <Field.Root required>
                    <Field.Label
                      fontWeight="500"
                      fontSize="sm"
                      color="gray.600"
                    >
                      Full Name
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
                        <MdPerson size={18} />
                      </Box>
                      <Input
                        name="name"
                        pl={10}
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        {...inputStyles}
                      />
                    </Box>
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label
                      fontWeight="500"
                      fontSize="sm"
                      color="gray.600"
                    >
                      Phone
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
                        <MdPhone size={18} />
                      </Box>
                      <Input
                        name="phone"
                        type="tel"
                        pl={10}
                        placeholder="+1-555-0100"
                        value={form.phone}
                        onChange={handleChange}
                        {...inputStyles}
                      />
                    </Box>
                  </Field.Root>
                </SimpleGrid>

                <Field.Root required>
                  <Field.Label fontWeight="500" fontSize="sm" color="gray.600">
                    Email
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
                      {...inputStyles}
                    />
                  </Box>
                </Field.Root>

                <SimpleGrid columns={2} gap={3.5}>
                  <Field.Root>
                    <Field.Label
                      fontWeight="500"
                      fontSize="sm"
                      color="gray.600"
                    >
                      Date of Birth
                    </Field.Label>
                    <Input
                      name="dob"
                      type="date"
                      value={form.dob}
                      onChange={handleChange}
                      {...inputStyles}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label
                      fontWeight="500"
                      fontSize="sm"
                      color="gray.600"
                    >
                      Gender
                    </Field.Label>
                    <Select.Root
                      collection={genders}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, gender: v.value[0] || "" }))
                      }
                    >
                      <Select.Trigger
                        h="46px"
                        rounded="xl"
                        bg="gray.50"
                        borderColor="gray.200"
                        _hover={{ borderColor: "brand.300", bg: "white" }}
                      >
                        <Select.ValueText placeholder="Select" />
                      </Select.Trigger>
                      <Select.Content>
                        {genders.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Field.Root>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3.5}>
                  <Field.Root required>
                    <Field.Label
                      fontWeight="500"
                      fontSize="sm"
                      color="gray.600"
                    >
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
                        placeholder="Min. 8 chars"
                        value={form.password}
                        onChange={handleChange}
                        {...inputStyles}
                      />
                    </Box>
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label
                      fontWeight="500"
                      fontSize="sm"
                      color="gray.600"
                    >
                      Confirm Password
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
                        name="confirmPassword"
                        type="password"
                        pl={10}
                        placeholder="Repeat"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        {...inputStyles}
                      />
                    </Box>
                  </Field.Root>
                </SimpleGrid>

                <Button
                  type="submit"
                  colorPalette="teal"
                  loading={loading}
                  loadingText="Creating account…"
                  w="full"
                  size="lg"
                  h="46px"
                  rounded="xl"
                  fontSize="md"
                  fontWeight="600"
                  mt={1}
                  _hover={{ opacity: 0.9 }}
                >
                  Create Account
                  <MdArrowForward />
                </Button>
              </Stack>
            </Box>

            <Text fontSize="sm" textAlign="center" color="gray.500">
              Already have an account?{" "}
              <Text
                as={Link}
                to="/login"
                color="brand.500"
                fontWeight="600"
                _hover={{ textDecoration: "underline", color: "brand.600" }}
              >
                Sign in
              </Text>
            </Text>
          </Stack>
        </MotionBox>
      </Flex>
    </Flex>
  );
}
