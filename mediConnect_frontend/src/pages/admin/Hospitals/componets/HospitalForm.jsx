import {
  Box,
  Stack,
  Text,
  Flex,
  Input,
  Grid,
  Textarea,
  Checkbox,
  Field,
  Button,
} from "@chakra-ui/react";
import {
  MdLocalHospital,
  MdLocationOn,
  MdPhone,
  MdAccessTime,
  MdVerified,
  MdMedicalServices,
  MdAdminPanelSettings,
  MdWarning,
} from "react-icons/md";
import { HOSPITAL_TYPES, FACILITY_OPTIONS } from "./constants";

function SectionHeading({ icon: Icon, children }) {
  return (
    <Flex align="center" gap={2} pt={2}>
      <Icon size={16} color="var(--chakra-colors-teal-500)" />
      <Text fontSize="sm" fontWeight="600" color="teal.600">
        {children}
      </Text>
    </Flex>
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

function Section({ children }) {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      rounded="xl"
      p={5}
    >
      {children}
    </Box>
  );
}

export default function HospitalForm({
  form,
  setForm,
  specialties,
  mode = "create",
}) {
  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

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

  return (
    <Stack gap={5}>
      {/* ── Basic Information ── */}
      <Section>
        <SectionHeading icon={MdLocalHospital}>
          Basic Information
        </SectionHeading>
        <Stack gap={4} mt={3}>
          <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={4}>
            <Field.Root required>
              <Field.Label>Hospital Name</Field.Label>
              <Input
                placeholder="City General Hospital"
                value={form.name}
                onChange={updateField("name")}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>Type</Field.Label>
              <Box
                as="select"
                value={form.type}
                onChange={updateField("type")}
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
                placeholder="REG-2024-00123"
                value={form.registrationNumber}
                onChange={updateField("registrationNumber")}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>Website</Field.Label>
              <Input
                placeholder="https://hospital.com"
                value={form.website}
                onChange={updateField("website")}
              />
            </Field.Root>
          </Grid>
          <Field.Root>
            <Field.Label>Description</Field.Label>
            <Textarea
              placeholder="Brief description of the hospital…"
              value={form.description}
              onChange={updateField("description")}
              rows={2}
            />
          </Field.Root>
        </Stack>
      </Section>

      {/* ── Location ── */}
      <Section>
        <SectionHeading icon={MdLocationOn}>Location</SectionHeading>
        <Stack gap={4} mt={3}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
            <Field.Root required>
              <Field.Label>City</Field.Label>
              <Input
                placeholder="New York"
                value={form.city}
                onChange={updateField("city")}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>State</Field.Label>
              <Input
                placeholder="New York"
                value={form.state}
                onChange={updateField("state")}
              />
            </Field.Root>
          </Grid>
          <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={4}>
            <Field.Root>
              <Field.Label>Street Address</Field.Label>
              <Input
                placeholder="123 Medical Drive"
                value={form.street}
                onChange={updateField("street")}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>Zip Code</Field.Label>
              <Input
                placeholder="10001"
                value={form.zipCode}
                onChange={updateField("zipCode")}
              />
            </Field.Root>
          </Grid>
        </Stack>
      </Section>

      {/* ── Contact ── */}
      <Section>
        <SectionHeading icon={MdPhone}>Contact Details</SectionHeading>
        <Stack gap={4} mt={3}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
            <Field.Root required>
              <Field.Label>Phone</Field.Label>
              <Input
                placeholder="+1-555-0000"
                value={form.phone}
                onChange={updateField("phone")}
              />
            </Field.Root>
            <Field.Root required>
              <Field.Label>Email</Field.Label>
              <Input
                type="email"
                placeholder="contact@hospital.com"
                value={form.email}
                onChange={updateField("email")}
              />
            </Field.Root>
          </Grid>
          <Field.Root>
            <Field.Label>Emergency Contact</Field.Label>
            <Input
              placeholder="+1-555-9999"
              value={form.emergencyContact}
              onChange={updateField("emergencyContact")}
            />
          </Field.Root>
        </Stack>
      </Section>

      {/* ── Operating Hours ── */}
      <Section>
        <SectionHeading icon={MdAccessTime}>Operating Hours</SectionHeading>
        <Stack gap={4} mt={3}>
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
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              <Field.Root>
                <Field.Label>Opening Time</Field.Label>
                <Input
                  type="time"
                  value={form.openTime}
                  onChange={updateField("openTime")}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Closing Time</Field.Label>
                <Input
                  type="time"
                  value={form.closeTime}
                  onChange={updateField("closeTime")}
                />
              </Field.Root>
            </Grid>
          )}
        </Stack>
      </Section>

      {/* ── Specialties & Facilities ── */}
      <Section>
        <SectionHeading icon={MdMedicalServices}>Specialties</SectionHeading>
        {specialties.length > 0 ? (
          <Flex gap={2} wrap="wrap" mt={3}>
            {specialties.map((sp) => (
              <ChipToggle
                key={sp._id}
                label={sp.name}
                selected={form.specialties.includes(sp._id)}
                onToggle={() => toggleSpecialty(sp._id)}
              />
            ))}
          </Flex>
        ) : (
          <Text fontSize="sm" color="gray.400" mt={2}>
            No specialties available.
          </Text>
        )}

        <SectionHeading icon={MdVerified}>Facilities</SectionHeading>
        <Flex gap={2} wrap="wrap" mt={3}>
          {FACILITY_OPTIONS.map((f) => (
            <ChipToggle
              key={f}
              label={f}
              selected={form.facilities.includes(f)}
              onToggle={() => toggleFacility(f)}
            />
          ))}
        </Flex>

        <Field.Root mt={4}>
          <Field.Label>Insurance Panels (comma-separated)</Field.Label>
          <Input
            placeholder="BlueCross, Aetna, Cigna"
            value={form.insurancePanels}
            onChange={updateField("insurancePanels")}
          />
        </Field.Root>
      </Section>

      {/* ── Admin Account (create only) ── */}
      {mode === "create" && (
        <Section>
          <SectionHeading icon={MdAdminPanelSettings}>
            Hospital Admin Account
          </SectionHeading>
          <Text fontSize="xs" color="gray.500" mt={1} mb={3}>
            This person will manage doctors, schedules & appointments for this
            hospital.
          </Text>
          <Stack gap={4}>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              <Field.Root required>
                <Field.Label>Admin Name</Field.Label>
                <Input
                  placeholder="Dr. John Smith"
                  value={form.adminName}
                  onChange={updateField("adminName")}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Admin Phone</Field.Label>
                <Input
                  placeholder="+1-555-1234"
                  value={form.adminPhone}
                  onChange={updateField("adminPhone")}
                />
              </Field.Root>
            </Grid>
            <Field.Root required>
              <Field.Label>Admin Email</Field.Label>
              <Input
                type="email"
                placeholder="admin@hospital.com"
                value={form.adminEmail}
                onChange={updateField("adminEmail")}
              />
              <Text fontSize="xs" color="gray.400" mt={1}>
                This will be used to log in to the platform.
              </Text>
            </Field.Root>
            <Field.Root required>
              <Field.Label>Temporary Password</Field.Label>
              <Input
                type="password"
                placeholder="Minimum 6 characters"
                value={form.adminPassword}
                onChange={updateField("adminPassword")}
              />
              <Text fontSize="xs" color="gray.400" mt={1}>
                Share this with the admin. They can change it after first login.
              </Text>
            </Field.Root>
            {form.adminPassword && form.adminPassword.length < 6 && (
              <Flex align="center" gap={2} bg="red.50" p={3} rounded="lg">
                <MdWarning size={14} color="var(--chakra-colors-red-400)" />
                <Text color="red.600" fontSize="xs">
                  Password must be at least 6 characters.
                </Text>
              </Flex>
            )}
          </Stack>
        </Section>
      )}
    </Stack>
  );
}
