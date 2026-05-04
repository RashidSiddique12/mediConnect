import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Heading,
  Text,
  Flex,
  Button,
  Badge,
  Grid,
  Spinner,
  Center,
  Separator,
} from "@chakra-ui/react";
import {
  MdLocalHospital,
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdLanguage,
  MdAccessTime,
  MdVerified,
  MdMedicalServices,
  MdAdminPanelSettings,
  MdArrowBack,
  MdEdit,
  MdEmergency,
  MdBadge,
  MdDescription,
} from "react-icons/md";
import * as hospitalSlice from "@/features/hospitals/hospitalSlice";
import * as hospitalSelectors from "@/features/hospitals/hospitalSelectors";
import { HOSPITAL_TYPES } from "./componets/constants";

function InfoRow({ icon: Icon, label, value, color = "gray" }) {
  if (!value) return null;
  return (
    <Flex align="flex-start" gap={3}>
      <Flex
        align="center"
        justify="center"
        bg={`${color}.100`}
        color={`${color}.600`}
        rounded="lg"
        p={2}
        mt={0.5}
      >
        <Icon size={16} />
      </Flex>
      <Box>
        <Text fontSize="xs" color="gray.400" fontWeight="500">
          {label}
        </Text>
        <Text fontSize="sm" fontWeight="600">
          {value}
        </Text>
      </Box>
    </Flex>
  );
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      rounded="xl"
      p={5}
    >
      <Flex align="center" gap={2} mb={4}>
        <Icon size={18} color="var(--chakra-colors-teal-500)" />
        <Heading size="sm" color="teal.700">
          {title}
        </Heading>
      </Flex>
      {children}
    </Box>
  );
}

export default function HospitalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hospital = useSelector(hospitalSelectors.selectCurrentHospital);
  const loading = useSelector(hospitalSelectors.selectHospitalsLoading);

  useEffect(() => {
    dispatch(hospitalSlice.fetchHospitalByIdRequest(id));
  }, [dispatch, id]);

  if (loading || !hospital) {
    return (
      <Center py={16}>
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  const typeLabel =
    HOSPITAL_TYPES.find((t) => t.value === hospital.type)?.label ||
    hospital.type;
  const isActive = hospital.status === "active";
  const address = [
    hospital.address?.street,
    hospital.address?.city,
    hospital.address?.state,
    hospital.address?.zipCode,
  ]
    .filter(Boolean)
    .join(", ");
  const operatingHours = hospital.operatingHours?.is24x7
    ? "24/7"
    : [hospital.operatingHours?.open, hospital.operatingHours?.close]
        .filter(Boolean)
        .join(" – ") || "Not specified";

  return (
    <Stack gap={6}>
      {/* ── Page header ── */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Flex align="center" gap={3}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/hospitals")}
          >
            <MdArrowBack />
          </Button>
          <Flex
            align="center"
            justify="center"
            color="teal.500"
            bg="teal.50"
            p={2.5}
            rounded="xl"
          >
            <MdLocalHospital size={22} />
          </Flex>
          <Box>
            <Flex align="center" gap={2}>
              <Heading size="lg">{hospital.name}</Heading>
              <Badge
                colorPalette={isActive ? "teal" : "gray"}
                size="sm"
                variant="subtle"
                display="inline-flex"
                alignItems="center"
                gap={1}
              >
                <Box
                  w="6px"
                  h="6px"
                  rounded="full"
                  bg={isActive ? "teal.400" : "gray.400"}
                />
                {hospital.status}
              </Badge>
              {hospital.isVerified && (
                <Badge colorPalette="blue" size="sm" variant="subtle">
                  <MdVerified size={12} /> Verified
                </Badge>
              )}
            </Flex>
            <Text color="gray.500" fontSize="sm">
              {typeLabel}
            </Text>
          </Box>
        </Flex>
        <Button
          colorPalette="teal"
          onClick={() => navigate(`/admin/hospitals/edit/${hospital._id}`)}
        >
          <MdEdit /> Edit Hospital
        </Button>
      </Flex>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5}>
        {/* ── Contact & Location ── */}
        <SectionCard icon={MdLocationOn} title="Contact & Location">
          <Stack gap={4}>
            <InfoRow
              icon={MdLocationOn}
              label="Address"
              value={address || "Not provided"}
              color="teal"
            />
            <InfoRow
              icon={MdPhone}
              label="Phone"
              value={hospital.phone}
              color="blue"
            />
            <InfoRow
              icon={MdEmail}
              label="Email"
              value={hospital.email}
              color="purple"
            />
            <InfoRow
              icon={MdEmergency}
              label="Emergency Contact"
              value={hospital.emergencyContact}
              color="red"
            />
            <InfoRow
              icon={MdLanguage}
              label="Website"
              value={hospital.website}
              color="cyan"
            />
            <InfoRow
              icon={MdBadge}
              label="Registration No."
              value={hospital.registrationNumber}
              color="orange"
            />
          </Stack>
        </SectionCard>

        {/* ── Operating Hours ── */}
        <SectionCard icon={MdAccessTime} title="Operating Hours">
          <Flex
            align="center"
            gap={3}
            p={4}
            rounded="xl"
            bg={hospital.operatingHours?.is24x7 ? "teal.50" : "blue.50"}
            border="1px solid"
            borderColor={
              hospital.operatingHours?.is24x7 ? "teal.200" : "blue.200"
            }
          >
            <Flex
              align="center"
              justify="center"
              rounded="lg"
              p={2}
              bg={hospital.operatingHours?.is24x7 ? "teal.100" : "blue.100"}
              color={hospital.operatingHours?.is24x7 ? "teal.600" : "blue.600"}
            >
              <MdAccessTime size={20} />
            </Flex>
            <Box>
              <Text
                fontSize="sm"
                fontWeight="600"
                color={
                  hospital.operatingHours?.is24x7 ? "teal.700" : "blue.700"
                }
              >
                {operatingHours}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {hospital.operatingHours?.is24x7
                  ? "Open round the clock"
                  : "Daily operating hours"}
              </Text>
            </Box>
          </Flex>

          {hospital.description && (
            <>
              <Separator my={4} />
              <Flex align="flex-start" gap={2}>
                <MdDescription
                  size={16}
                  color="var(--chakra-colors-gray-400)"
                  style={{ marginTop: 2 }}
                />
                <Box>
                  <Text fontSize="xs" color="gray.400" fontWeight="500">
                    Description
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {hospital.description}
                  </Text>
                </Box>
              </Flex>
            </>
          )}
        </SectionCard>

        {/* ── Specialties ── */}
        <SectionCard icon={MdMedicalServices} title="Specialties">
          {hospital.specialties?.length > 0 ? (
            <Flex gap={2} wrap="wrap">
              {hospital.specialties.map((sp) => (
                <Badge
                  key={sp._id || sp}
                  colorPalette="teal"
                  variant="subtle"
                  size="sm"
                  rounded="full"
                  px={3}
                  py={1}
                >
                  {sp.name || sp}
                </Badge>
              ))}
            </Flex>
          ) : (
            <Text fontSize="sm" color="gray.400">
              No specialties assigned
            </Text>
          )}

          {hospital.facilities?.length > 0 && (
            <>
              <Separator my={4} />
              <Text fontSize="xs" fontWeight="600" color="gray.500" mb={2}>
                Facilities
              </Text>
              <Flex gap={2} wrap="wrap">
                {hospital.facilities.map((f) => (
                  <Badge
                    key={f}
                    colorPalette="blue"
                    variant="subtle"
                    size="sm"
                    rounded="full"
                    px={3}
                    py={1}
                  >
                    {f}
                  </Badge>
                ))}
              </Flex>
            </>
          )}
        </SectionCard>

        {/* ── Admin & Insurance ── */}
        <SectionCard icon={MdAdminPanelSettings} title="Admin & Insurance">
          {hospital.hospitalAdminId && (
            <Flex
              align="center"
              gap={3}
              p={4}
              rounded="xl"
              bg="teal.50"
              border="1px solid"
              borderColor="teal.200"
              mb={4}
            >
              <Flex
                align="center"
                justify="center"
                bg="teal.100"
                color="teal.600"
                rounded="lg"
                p={2}
              >
                <MdAdminPanelSettings size={20} />
              </Flex>
              <Box>
                <Text fontSize="sm" fontWeight="600" color="teal.700">
                  {hospital.hospitalAdminId.name || "Hospital Admin"}
                </Text>
                <Text fontSize="xs" color="teal.600">
                  {hospital.hospitalAdminId.email || ""}
                </Text>
              </Box>
            </Flex>
          )}

          {hospital.insurancePanels?.length > 0 ? (
            <>
              <Text fontSize="xs" fontWeight="600" color="gray.500" mb={2}>
                Insurance Panels
              </Text>
              <Flex gap={2} wrap="wrap">
                {hospital.insurancePanels.map((ins) => (
                  <Badge
                    key={ins}
                    colorPalette="purple"
                    variant="subtle"
                    size="sm"
                    rounded="full"
                    px={3}
                    py={1}
                  >
                    {ins}
                  </Badge>
                ))}
              </Flex>
            </>
          ) : (
            <Text fontSize="sm" color="gray.400">
              No insurance panels listed
            </Text>
          )}
        </SectionCard>
      </Grid>
    </Stack>
  );
}
