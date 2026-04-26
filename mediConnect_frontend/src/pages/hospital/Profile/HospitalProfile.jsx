import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Text,
  Flex,
  Button,
  Field,
  Input,
  Textarea,
  Card,
  Grid,
  Badge,
  Checkbox,
  Separator,
} from "@chakra-ui/react";
import {
  MdLocalHospital,
  MdEdit,
  MdSave,
  MdPhone,
  MdEmail,
  MdLanguage,
  MdLocationOn,
  MdAccessTime,
  MdVerified,
  MdMedicalServices,
  MdEmergency,
  MdBadge,
  MdSchool,
  MdHealthAndSafety,
  MdClose,
  MdPerson,
  MdCalendarMonth,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import * as hospitalSlice from "@/features/hospitals/hospitalSlice";
import {
  selectCurrentHospital,
  selectHospitalsLoading,
} from "@/features/hospitals/hospitalSelectors";
import { selectDashboardData } from "@/features/dashboard/dashboardSelectors";
import { fetchSpecialtiesRequest } from "@/features/specialties/specialtySlice";
import { selectSpecialties } from "@/features/specialties/specialtySelectors";
import { HOSPITAL_TYPES, FACILITY_OPTIONS } from "@/constants/common";


function SectionCard({ icon: Icon, title, children }) {
  return (
    <Card.Root shadow="sm" rounded="xl">
      <Card.Body>
        <Flex align="center" gap={2} mb={4}>
          <Box bg="teal.50" color="teal.600" p={2} rounded="lg">
            <Icon size={18} />
          </Box>
          <Text fontSize="md" fontWeight="700" color="gray.700">
            {title}
          </Text>
        </Flex>
        {children}
      </Card.Body>
    </Card.Root>
  );
}

function InfoRow({ label, value, color }) {
  return (
    <Box>
      <Text fontSize="xs" color="gray.400" mb={0.5}>
        {label}
      </Text>
      <Text
        fontSize="sm"
        fontWeight="600"
        color={value ? color || "gray.700" : "gray.400"}
      >
        {value || "Not set"}
      </Text>
    </Box>
  );
}

function ChipToggle({ label, selected, onToggle }) {
  return (
    <Button
      size="xs"
      variant={selected ? "solid" : "outline"}
      colorPalette={selected ? "teal" : "gray"}
      onClick={onToggle}
      rounded="full"
    >
      {label}
    </Button>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatType(type) {
  const found = HOSPITAL_TYPES.find((t) => t.value === type);
  return found ? found.label : type;
}

function formatTime(time24) {
  if (!time24) return null;
  const [h, m] = time24.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

export default function HospitalProfile() {
  const dispatch = useDispatch();
  const hospital = useSelector(selectCurrentHospital);
  const loading = useSelector(selectHospitalsLoading);
  const dashboardData = useSelector(selectDashboardData);
  const allSpecialties = useSelector(selectSpecialties);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const hospitalId = dashboardData?.hospital?._id;

  const [form, setForm] = useState({
    name: "",
    type: "general",
    city: "",
    street: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    emergencyContact: "",
    registrationNumber: "",
    is24x7: false,
    openTime: "08:00",
    closeTime: "20:00",
    specialties: [],
    facilities: [],
    insurancePanels: "",
  });

  useEffect(() => {
    if (hospitalId)
      dispatch(hospitalSlice.fetchHospitalByIdRequest(hospitalId));
    dispatch(fetchSpecialtiesRequest());
  }, [dispatch, hospitalId]);

  useEffect(() => {
    if (hospital) {
      setForm({
        name: hospital.name || "",
        type: hospital.type || "general",
        city: hospital.address?.city || "",
        street: hospital.address?.street || "",
        state: hospital.address?.state || "",
        zipCode: hospital.address?.zipCode || "",
        phone: hospital.phone || "",
        email: hospital.email || "",
        website: hospital.website || "",
        description: hospital.description || "",
        emergencyContact: hospital.emergencyContact || "",
        registrationNumber: hospital.registrationNumber || "",
        is24x7: hospital.operatingHours?.is24x7 || false,
        openTime: hospital.operatingHours?.open || "08:00",
        closeTime: hospital.operatingHours?.close || "20:00",
        specialties: hospital.specialties?.map((s) => s._id || s) || [],
        facilities: hospital.facilities || [],
        insurancePanels: (hospital.insurancePanels || []).join(", "),
      });
    }
  }, [hospital]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const toggleSpecialty = (id) =>
    setForm((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(id)
        ? prev.specialties.filter((s) => s !== id)
        : [...prev.specialties, id],
    }));

  const toggleFacility = (name) =>
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(name)
        ? prev.facilities.filter((f) => f !== name)
        : [...prev.facilities, name],
    }));

  const handleSave = (e) => {
    e.preventDefault();
    const panels = form.insurancePanels
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    dispatch(
      hospitalSlice.editHospitalRequest({
        id: hospitalId,
        name: form.name,
        type: form.type,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
        },
        phone: form.phone,
        email: form.email,
        website: form.website,
        description: form.description,
        emergencyContact: form.emergencyContact,
        registrationNumber: form.registrationNumber,
        operatingHours: {
          open: form.is24x7 ? "" : form.openTime,
          close: form.is24x7 ? "" : form.closeTime,
          is24x7: form.is24x7,
        },
        specialties: form.specialties,
        facilities: form.facilities,
        insurancePanels: panels,
      }),
    );
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setEditing(false);
    if (hospital) {
      setForm({
        name: hospital.name || "",
        type: hospital.type || "general",
        city: hospital.address?.city || "",
        street: hospital.address?.street || "",
        state: hospital.address?.state || "",
        zipCode: hospital.address?.zipCode || "",
        phone: hospital.phone || "",
        email: hospital.email || "",
        website: hospital.website || "",
        description: hospital.description || "",
        emergencyContact: hospital.emergencyContact || "",
        registrationNumber: hospital.registrationNumber || "",
        is24x7: hospital.operatingHours?.is24x7 || false,
        openTime: hospital.operatingHours?.open || "08:00",
        closeTime: hospital.operatingHours?.close || "20:00",
        specialties: hospital.specialties?.map((s) => s._id || s) || [],
        facilities: hospital.facilities || [],
        insurancePanels: (hospital.insurancePanels || []).join(", "),
      });
    }
  };

  if (loading) return <Loader />;

  const operatingHoursDisplay = hospital?.operatingHours?.is24x7
    ? "24/7"
    : hospital?.operatingHours?.open && hospital?.operatingHours?.close
      ? `${formatTime(hospital.operatingHours.open)} — ${formatTime(hospital.operatingHours.close)}`
      : null;

  const specialtyNames =
    hospital?.specialties?.map((s) => s.name || s).filter(Boolean) || [];
  const adminInfo = hospital?.hospitalAdminId;

  return (
    <Stack gap={6}>
      <PageHeader
        title="Hospital Profile"
        subtitle="Manage your hospital's public information"
        actions={[
          editing ? (
            <Button
              key="cancel"
              colorPalette="gray"
              variant="outline"
              onClick={handleCancel}
            >
              <MdClose /> Cancel
            </Button>
          ) : (
            <Button
              key="edit"
              colorPalette="teal"
              onClick={() => setEditing(true)}
            >
              <MdEdit /> Edit Profile
            </Button>
          ),
        ]}
      />

      {saved && (
        <Box
          bg="teal.50"
          border="1px solid"
          borderColor="teal.200"
          p={4}
          rounded="lg"
        >
          <Flex align="center" gap={2}>
            <Box
              w={5}
              h={5}
              bg="teal.500"
              color="white"
              rounded="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="xs"
              fontWeight="700"
              flexShrink={0}
            >
              ✓
            </Box>
            <Text fontSize="sm" fontWeight="600" color="teal.700">
              Profile updated successfully!
            </Text>
          </Flex>
        </Box>
      )}

      {/* ─── Hero Card ─── */}
      <Card.Root shadow="sm" rounded="xl" bg="teal.700" color="white">
        <Card.Body py={6}>
          <Flex
            align={{ base: "flex-start", md: "center" }}
            justify="space-between"
            direction={{ base: "column", md: "row" }}
            gap={4}
          >
            <Flex align="center" gap={4}>
              <Box
                bg="white"
                p={3}
                rounded="xl"
                color="teal.600"
                fontSize="3xl"
                flexShrink={0}
              >
                <MdLocalHospital />
              </Box>
              <Box>
                <Text fontSize="2xl" fontWeight="800" color="white">
                  {form.name || "Hospital"}
                </Text>
                <Flex align="center" gap={2} mt={1} opacity={0.85}>
                  <MdLocationOn size={14} />
                  <Text fontSize="sm">
                    {[form.street, form.city, form.state, form.zipCode]
                      .filter(Boolean)
                      .join(", ") || "No address set"}
                  </Text>
                </Flex>
                <Flex gap={2} mt={2} wrap="wrap">
                  {hospital?.status && (
                    <Badge
                      bg={
                        hospital.status === "active" ? "green.500" : "red.500"
                      }
                      color="white"
                      size="sm"
                    >
                      {hospital.status}
                    </Badge>
                  )}
                  {hospital?.type && (
                    <Badge bg="whiteAlpha.300" color="white" size="sm">
                      {formatType(hospital.type)}
                    </Badge>
                  )}
                  {hospital?.isVerified && (
                    <Badge bg="blue.500" color="white" size="sm">
                      <Flex align="center" gap={1}>
                        <MdVerified size={12} /> Verified
                      </Flex>
                    </Badge>
                  )}
                  {hospital?.registrationNumber && (
                    <Badge bg="whiteAlpha.300" color="white" size="sm">
                      Reg: {hospital.registrationNumber}
                    </Badge>
                  )}
                </Flex>
              </Box>
            </Flex>
            {operatingHoursDisplay && (
              <Box
                bg="whiteAlpha.200"
                px={4}
                py={2}
                rounded="lg"
                textAlign="center"
                flexShrink={0}
              >
                <Text fontSize="xs" opacity={0.7}>
                  Hours
                </Text>
                <Text fontSize="sm" fontWeight="700">
                  {operatingHoursDisplay}
                </Text>
              </Box>
            )}
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* ─────── READ-ONLY VIEW ─────── */}
      {!editing && (
        <Stack gap={5}>
          {/* Quick Contact Cards */}
          <Grid
            templateColumns={{
              base: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(4, 1fr)",
            }}
            gap={3}
          >
            {[
              {
                icon: MdPhone,
                label: "Phone",
                value: hospital?.phone,
                color: "blue",
              },
              {
                icon: MdEmail,
                label: "Email",
                value: hospital?.email,
                color: "purple",
              },
              {
                icon: MdLanguage,
                label: "Website",
                value: hospital?.website,
                color: "teal",
              },
              {
                icon: MdEmergency,
                label: "Emergency",
                value: hospital?.emergencyContact,
                color: "red",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <Card.Root key={label} shadow="sm" rounded="xl">
                <Card.Body py={3}>
                  <Flex align="center" gap={3}>
                    <Box
                      bg={`${color}.100`}
                      color={`${color}.600`}
                      p={2}
                      rounded="lg"
                      flexShrink={0}
                    >
                      <Icon size={18} />
                    </Box>
                    <Box minW={0}>
                      <Text fontSize="xs" color="gray.400">
                        {label}
                      </Text>
                      <Text
                        fontSize="sm"
                        fontWeight="600"
                        color={value ? "gray.700" : "gray.400"}
                        truncate
                      >
                        {value || "Not set"}
                      </Text>
                    </Box>
                  </Flex>
                </Card.Body>
              </Card.Root>
            ))}
          </Grid>

          {/* Description */}
          {hospital?.description && (
            <SectionCard icon={MdLocalHospital} title="About">
              <Text fontSize="sm" color="gray.600" lineHeight="tall">
                {hospital.description}
              </Text>
            </SectionCard>
          )}

          {/* Location Details */}
          <SectionCard icon={MdLocationOn} title="Location">
            <Grid
              templateColumns={{ base: "1fr 1fr", md: "repeat(4, 1fr)" }}
              gap={4}
            >
              <InfoRow label="Street" value={hospital?.address?.street} />
              <InfoRow label="City" value={hospital?.address?.city} />
              <InfoRow label="State" value={hospital?.address?.state} />
              <InfoRow label="Zip Code" value={hospital?.address?.zipCode} />
            </Grid>
          </SectionCard>

          {/* Operating Hours */}
          <SectionCard icon={MdAccessTime} title="Operating Hours">
            {hospital?.operatingHours?.is24x7 ? (
              <Badge colorPalette="green" size="lg">
                Open 24/7
              </Badge>
            ) : hospital?.operatingHours?.open &&
              hospital?.operatingHours?.close ? (
              <Flex gap={6}>
                <InfoRow
                  label="Opens"
                  value={formatTime(hospital.operatingHours.open)}
                  color="green.600"
                />
                <InfoRow
                  label="Closes"
                  value={formatTime(hospital.operatingHours.close)}
                  color="red.600"
                />
              </Flex>
            ) : (
              <Text fontSize="sm" color="gray.400">
                No operating hours set
              </Text>
            )}
          </SectionCard>

          {/* Specialties */}
          <SectionCard icon={MdMedicalServices} title="Specialties">
            {specialtyNames.length > 0 ? (
              <Flex gap={2} wrap="wrap">
                {specialtyNames.map((name) => (
                  <Badge
                    key={name}
                    colorPalette="teal"
                    size="md"
                    rounded="full"
                    px={3}
                    py={1}
                  >
                    {name}
                  </Badge>
                ))}
              </Flex>
            ) : (
              <Text fontSize="sm" color="gray.400">
                No specialties assigned
              </Text>
            )}
          </SectionCard>

          {/* Facilities */}
          <SectionCard icon={MdHealthAndSafety} title="Facilities">
            {hospital?.facilities?.length > 0 ? (
              <Flex gap={2} wrap="wrap">
                {hospital.facilities.map((f) => (
                  <Badge
                    key={f}
                    colorPalette="blue"
                    variant="subtle"
                    size="md"
                    rounded="full"
                    px={3}
                    py={1}
                  >
                    {f}
                  </Badge>
                ))}
              </Flex>
            ) : (
              <Text fontSize="sm" color="gray.400">
                No facilities listed
              </Text>
            )}
          </SectionCard>

          {/* Insurance Panels */}
          <SectionCard icon={MdSchool} title="Insurance Panels">
            {hospital?.insurancePanels?.length > 0 ? (
              <Flex gap={2} wrap="wrap">
                {hospital.insurancePanels.map((p) => (
                  <Badge
                    key={p}
                    colorPalette="purple"
                    variant="subtle"
                    size="md"
                    rounded="full"
                    px={3}
                    py={1}
                  >
                    {p}
                  </Badge>
                ))}
              </Flex>
            ) : (
              <Text fontSize="sm" color="gray.400">
                No insurance panels listed
              </Text>
            )}
          </SectionCard>

          {/* Admin & Meta Info */}
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5}>
            <SectionCard icon={MdPerson} title="Hospital Admin">
              {adminInfo ? (
                <Stack gap={2}>
                  <InfoRow label="Name" value={adminInfo.name} />
                  <InfoRow label="Email" value={adminInfo.email} />
                </Stack>
              ) : (
                <Text fontSize="sm" color="gray.400">
                  No admin assigned
                </Text>
              )}
            </SectionCard>

            <SectionCard icon={MdCalendarMonth} title="Registration Info">
              <Stack gap={2}>
                <InfoRow
                  label="Registration No."
                  value={hospital?.registrationNumber}
                />
                <InfoRow
                  label="Verified"
                  value={hospital?.isVerified ? "Yes" : "No"}
                  color={hospital?.isVerified ? "green.600" : "red.500"}
                />
                <InfoRow
                  label="Created"
                  value={formatDate(hospital?.createdAt)}
                />
                <InfoRow
                  label="Last Updated"
                  value={formatDate(hospital?.updatedAt)}
                />
              </Stack>
            </SectionCard>
          </Grid>
        </Stack>
      )}

      {/* ─────── EDIT FORM ─────── */}
      {editing && (
        <Box as="form" onSubmit={handleSave}>
          <Stack gap={5}>
            {/* Basic Information */}
            <SectionCard icon={MdLocalHospital} title="Basic Information">
              <Stack gap={4}>
                <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={4}>
                  <Field.Root>
                    <Field.Label>Hospital Name</Field.Label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Type</Field.Label>
                    <Box
                      as="select"
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--chakra-colors-gray-200)",
                        fontSize: "14px",
                        background: "white",
                      }}
                    >
                      {HOSPITAL_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </Box>
                  </Field.Root>
                </Grid>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                  <Field.Root>
                    <Field.Label>Registration / License No.</Field.Label>
                    <Input
                      name="registrationNumber"
                      value={form.registrationNumber}
                      onChange={handleChange}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Website</Field.Label>
                    <Input
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                    />
                  </Field.Root>
                </Grid>
                <Field.Root>
                  <Field.Label>Description</Field.Label>
                  <Textarea
                    name="description"
                    rows={3}
                    value={form.description}
                    onChange={handleChange}
                  />
                </Field.Root>
              </Stack>
            </SectionCard>

            {/* Location */}
            <SectionCard icon={MdLocationOn} title="Location">
              <Stack gap={4}>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                  <Field.Root>
                    <Field.Label>City</Field.Label>
                    <Input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>State</Field.Label>
                    <Input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                    />
                  </Field.Root>
                </Grid>
                <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={4}>
                  <Field.Root>
                    <Field.Label>Street Address</Field.Label>
                    <Input
                      name="street"
                      value={form.street}
                      onChange={handleChange}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Zip Code</Field.Label>
                    <Input
                      name="zipCode"
                      value={form.zipCode}
                      onChange={handleChange}
                    />
                  </Field.Root>
                </Grid>
              </Stack>
            </SectionCard>

            {/* Contact */}
            <SectionCard icon={MdPhone} title="Contact Details">
              <Stack gap={4}>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                  <Field.Root>
                    <Field.Label>Phone</Field.Label>
                    <Input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </Field.Root>
                </Grid>
                <Field.Root>
                  <Field.Label>Emergency Contact</Field.Label>
                  <Input
                    name="emergencyContact"
                    value={form.emergencyContact}
                    onChange={handleChange}
                  />
                </Field.Root>
              </Stack>
            </SectionCard>

            {/* Operating Hours */}
            <SectionCard icon={MdAccessTime} title="Operating Hours">
              <Stack gap={4}>
                <Checkbox.Root
                  checked={form.is24x7}
                  onCheckedChange={(e) =>
                    setForm((prev) => ({ ...prev, is24x7: !!e.checked }))
                  }
                  colorPalette="teal"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>
                    <Text fontSize="sm">Open 24/7</Text>
                  </Checkbox.Label>
                </Checkbox.Root>
                {!form.is24x7 && (
                  <Grid
                    templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                    gap={4}
                  >
                    <Field.Root>
                      <Field.Label>Opening Time</Field.Label>
                      <Input
                        name="openTime"
                        type="time"
                        value={form.openTime}
                        onChange={handleChange}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Closing Time</Field.Label>
                      <Input
                        name="closeTime"
                        type="time"
                        value={form.closeTime}
                        onChange={handleChange}
                      />
                    </Field.Root>
                  </Grid>
                )}
              </Stack>
            </SectionCard>

            {/* Specialties & Facilities */}
            <SectionCard
              icon={MdMedicalServices}
              title="Specialties & Facilities"
            >
              <Stack gap={4}>
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>
                    Specialties
                  </Text>
                  {allSpecialties.length > 0 ? (
                    <Flex gap={2} wrap="wrap">
                      {allSpecialties.map((sp) => (
                        <ChipToggle
                          key={sp._id}
                          label={sp.name}
                          selected={form.specialties.includes(sp._id)}
                          onToggle={() => toggleSpecialty(sp._id)}
                        />
                      ))}
                    </Flex>
                  ) : (
                    <Text fontSize="sm" color="gray.400">
                      No specialties available
                    </Text>
                  )}
                </Box>
                <Separator />
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>
                    Facilities
                  </Text>
                  <Flex gap={2} wrap="wrap">
                    {FACILITY_OPTIONS.map((f) => (
                      <ChipToggle
                        key={f}
                        label={f}
                        selected={form.facilities.includes(f)}
                        onToggle={() => toggleFacility(f)}
                      />
                    ))}
                  </Flex>
                </Box>
                <Separator />
                <Field.Root>
                  <Field.Label>Insurance Panels (comma-separated)</Field.Label>
                  <Input
                    name="insurancePanels"
                    placeholder="BlueCross, Aetna, Cigna"
                    value={form.insurancePanels}
                    onChange={handleChange}
                  />
                </Field.Root>
              </Stack>
            </SectionCard>

            {/* Save Button */}
            <Flex justify="flex-end" gap={3}>
              <Button
                variant="outline"
                colorPalette="gray"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button type="submit" colorPalette="teal">
                <MdSave /> Save Changes
              </Button>
            </Flex>
          </Stack>
        </Box>
      )}
    </Stack>
  );
}
