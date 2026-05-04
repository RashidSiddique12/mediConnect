import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Flex,
  Button,
  Field,
  Input,
  Textarea,
  Card,
  Grid,
  Select,
  createListCollection,
  Text,
  Badge,
  Checkbox,
} from "@chakra-ui/react";
import {
  MdPerson,
  MdMedicalServices,
  MdPhone,
  MdEmail,
  MdBadge,
  MdLanguage,
  MdVideoCall,
  MdSave,
  MdClose,
} from "react-icons/md";
import * as specialtySlice from "@/features/specialties/specialtySlice";
import { selectSpecialties } from "@/features/specialties/specialtySelectors";

const GENDER_COLLECTION = createListCollection({
  items: [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ],
});

const LANGUAGE_COLLECTION = createListCollection({
  items: [
    { label: "English", value: "english" },
    { label: "Hindi", value: "hindi" },
    { label: "Bengali", value: "bengali" },
    { label: "Telugu", value: "telugu" },
    { label: "Marathi", value: "marathi" },
    { label: "Tamil", value: "tamil" },
    { label: "Urdu", value: "urdu" },
    { label: "Gujarati", value: "gujarati" },
    { label: "Kannada", value: "kannada" },
    { label: "Malayalam", value: "malayalam" },
    { label: "Punjabi", value: "punjabi" },
    { label: "Odia", value: "odia" },
    { label: "Assamese", value: "assamese" },
  ],
});

const CONSULTATION_TYPES = [
  { label: "In Person", value: "in_person" },
  { label: "Video Call", value: "video" },
  { label: "Phone", value: "phone" },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  specialtyIds: "",
  experience: "",
  consultationFee: "",
  qualification: "",
  licenseNumber: "",
  registrationCouncil: "",
  registrationYear: "",
  languages: [],
  consultationTypes: ["in_person"],
  bio: "",
};

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <Flex
      align="center"
      gap={2}
      pb={2}
      borderBottomWidth="1px"
      borderColor="gray.100"
    >
      <Flex
        align="center"
        justify="center"
        w={8}
        h={8}
        rounded="lg"
        bg="teal.50"
        color="teal.500"
        flexShrink={0}
      >
        <Icon size={18} />
      </Flex>
      <Box>
        <Text fontSize="sm" fontWeight="600" color="gray.700">
          {title}
        </Text>
        {description && (
          <Text fontSize="xs" color="gray.400">
            {description}
          </Text>
        )}
      </Box>
    </Flex>
  );
}

export default function DoctorForm({
  mode = "create",
  doctor,
  onSubmit,
  saving,
  error,
  saved,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const specialties = useSelector(selectSpecialties);

  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    dispatch(specialtySlice.fetchSpecialtiesRequest());
  }, [dispatch]);

  useEffect(() => {
    if (mode === "edit" && doctor) {
      setForm({
        name: doctor.name || "",
        email: doctor.email || "",
        phone: doctor.phone || "",
        gender: doctor.gender || "",
        specialtyIds:
          doctor.specialtyIds?.[0]?._id || doctor.specialtyIds?.[0] || "",
        experience: doctor.experience ?? "",
        consultationFee: doctor.consultationFee ?? "",
        qualification: doctor.qualification || "",
        licenseNumber: doctor.licenseNumber || "",
        registrationCouncil: doctor.registrationCouncil || "",
        registrationYear: doctor.registrationYear ?? "",
        languages: (doctor.languages || []).map((l) => l.toLowerCase()),
        consultationTypes: doctor.consultationTypes?.length
          ? doctor.consultationTypes
          : ["in_person"],
        bio: doctor.bio || "",
      });
    }
  }, [doctor, mode]);

  const specialtyCollection = createListCollection({
    items: specialties.map((s) => ({ label: s.name, value: s._id })),
  });

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      languages: form.languages,
      specialtyIds: form.specialtyIds ? [form.specialtyIds] : [],
      experience: Number(form.experience) || 0,
      consultationFee: Number(form.consultationFee) || 0,
      registrationYear: form.registrationYear
        ? Number(form.registrationYear)
        : undefined,
    });
  };

  const isEdit = mode === "edit";

  return (
    <Stack gap={5}>
      {saved && !error && (
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
              {isEdit ? "Changes saved!" : "Doctor added successfully!"}{" "}
              Redirecting…
            </Text>
          </Flex>
        </Box>
      )}

      {error && (
        <Box
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          p={4}
          rounded="lg"
        >
          <Text fontSize="sm" fontWeight="600" color="red.700">
            {error}
          </Text>
        </Box>
      )}

      <Box as="form" onSubmit={handleSubmit}>
        <Stack gap={5}>
          {/* ─── Personal Information ─── */}
          <Card.Root shadow="sm" rounded="xl">
            <Card.Body>
              <Stack gap={4}>
                <SectionHeader
                  icon={MdPerson}
                  title="Personal Information"
                  description="Basic details about the doctor"
                />
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                  <Field.Root required>
                    <Field.Label>Full Name</Field.Label>
                    <Input
                      name="name"
                      placeholder="Dr. Jane Smith"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Gender</Field.Label>
                    <Select.Root
                      collection={GENDER_COLLECTION}
                      value={form.gender ? [form.gender] : []}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, gender: v.value[0] || "" }))
                      }
                      positioning={{
                        sameWidth: true,
                        placement: "bottom",
                        strategy: "fixed",
                      }}
                    >
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select gender" />
                      </Select.Trigger>
                      <Select.Positioner style={{ zIndex: 1500 }}>
                        <Select.Content>
                          {GENDER_COLLECTION.items.map((item) => (
                            <Select.Item key={item.value} item={item}>
                              {item.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>
                      <Flex align="center" gap={1}>
                        <MdEmail size={14} /> Email
                      </Flex>
                    </Field.Label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="doctor@email.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>
                      <Flex align="center" gap={1}>
                        <MdPhone size={14} /> Phone
                      </Flex>
                    </Field.Label>
                    <Input
                      name="phone"
                      placeholder="+1 234 567 8900"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </Field.Root>
                </Grid>
              </Stack>
            </Card.Body>
          </Card.Root>

          {/* ─── Professional Details ─── */}
          <Card.Root shadow="sm" rounded="xl">
            <Card.Body>
              <Stack gap={4}>
                <SectionHeader
                  icon={MdMedicalServices}
                  title="Professional Details"
                  description="Specialty, experience and fees"
                />
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                  <Field.Root required>
                    <Field.Label>Specialty</Field.Label>
                    <Select.Root
                      collection={specialtyCollection}
                      value={form.specialtyIds ? [form.specialtyIds] : []}
                      onValueChange={(v) =>
                        setForm((p) => ({
                          ...p,
                          specialtyIds: v.value[0] || "",
                        }))
                      }
                      positioning={{
                        sameWidth: true,
                        placement: "bottom",
                        strategy: "fixed",
                      }}
                    >
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select specialty" />
                      </Select.Trigger>
                      <Select.Positioner style={{ zIndex: 1500 }}>
                        <Select.Content>
                          {specialtyCollection.items.map((item) => (
                            <Select.Item key={item.value} item={item}>
                              {item.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Qualification</Field.Label>
                    <Input
                      name="qualification"
                      placeholder="MBBS, MD Cardiology"
                      value={form.qualification}
                      onChange={handleChange}
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label>Experience (years)</Field.Label>
                    <Input
                      name="experience"
                      type="number"
                      min="0"
                      placeholder="5"
                      value={form.experience}
                      onChange={handleChange}
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label>Consultation Fee ($)</Field.Label>
                    <Input
                      name="consultationFee"
                      type="number"
                      min="0"
                      placeholder="120"
                      value={form.consultationFee}
                      onChange={handleChange}
                    />
                  </Field.Root>
                </Grid>

                <Field.Root>
                  <Field.Label>Bio / Description</Field.Label>
                  <Textarea
                    name="bio"
                    placeholder="Brief professional bio…"
                    rows={3}
                    value={form.bio}
                    onChange={handleChange}
                  />
                </Field.Root>
              </Stack>
            </Card.Body>
          </Card.Root>

          {/* ─── Registration & License ─── */}
          <Card.Root shadow="sm" rounded="xl">
            <Card.Body>
              <Stack gap={4}>
                <SectionHeader
                  icon={MdBadge}
                  title="Registration & License"
                  description="Medical license and registration details"
                />
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                  <Field.Root>
                    <Field.Label>License Number</Field.Label>
                    <Input
                      name="licenseNumber"
                      placeholder="MED-2024-12345"
                      value={form.licenseNumber}
                      onChange={handleChange}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Registration Council</Field.Label>
                    <Input
                      name="registrationCouncil"
                      placeholder="State Medical Board"
                      value={form.registrationCouncil}
                      onChange={handleChange}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Registration Year</Field.Label>
                    <Input
                      name="registrationYear"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      placeholder="2018"
                      value={form.registrationYear}
                      onChange={handleChange}
                    />
                  </Field.Root>
                </Grid>
              </Stack>
            </Card.Body>
          </Card.Root>

          {/* ─── Consultation & Languages ─── */}
          <Card.Root shadow="sm" rounded="xl">
            <Card.Body>
              <Stack gap={4}>
                <SectionHeader
                  icon={MdLanguage}
                  title="Consultation & Languages"
                  description="How the doctor consults and languages spoken"
                />

                <Field.Root>
                  <Field.Label>
                    <Flex align="center" gap={1}>
                      <MdVideoCall size={14} /> Consultation Types
                    </Flex>
                  </Field.Label>
                  <Checkbox.Group
                    value={form.consultationTypes}
                    onValueChange={(values) =>
                      setForm((p) => ({ ...p, consultationTypes: values }))
                    }
                  >
                    <Flex gap={4} wrap="wrap" mt={1}>
                      {CONSULTATION_TYPES.map(({ label, value }) => (
                        <Checkbox.Root
                          key={value}
                          value={value}
                          colorPalette="teal"
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control />
                          <Checkbox.Label>{label}</Checkbox.Label>
                        </Checkbox.Root>
                      ))}
                    </Flex>
                  </Checkbox.Group>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Languages Spoken</Field.Label>
                  <Select.Root
                    multiple
                    collection={LANGUAGE_COLLECTION}
                    value={form.languages}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, languages: v.value }))
                    }
                    positioning={{
                      sameWidth: true,
                      placement: "bottom",
                      strategy: "fixed",
                    }}
                  >
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select languages" />
                    </Select.Trigger>
                    <Select.Positioner style={{ zIndex: 1500 }}>
                      <Select.Content>
                        {LANGUAGE_COLLECTION.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                </Field.Root>
              </Stack>
            </Card.Body>
          </Card.Root>

          {/* ─── Actions ─── */}
          <Flex gap={3} justify="flex-end">
            <Button
              variant="outline"
              onClick={() => navigate("/hospital/doctors")}
            >
              <MdClose /> Cancel
            </Button>
            <Button
              type="submit"
              colorPalette="teal"
              loading={saving}
              loadingText={isEdit ? "Saving…" : "Adding…"}
            >
              <MdSave /> {isEdit ? "Save Changes" : "Add Doctor"}
            </Button>
          </Flex>
        </Stack>
      </Box>
    </Stack>
  );
}
