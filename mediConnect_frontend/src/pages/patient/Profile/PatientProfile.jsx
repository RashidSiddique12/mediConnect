import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Stack,
  Heading,
  Text,
  Flex,
  Button,
  Field,
  Input,
  Card,
  Grid,
  Badge,
  Avatar,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import {
  MdEdit,
  MdSave,
  MdPerson,
  MdLocalHospital,
  MdPhone,
  MdEmail,
  MdClose,
} from "react-icons/md";
import PageHeader from "@/components/common/PageHeader";
import { updateProfileRequest } from "@/features/auth/authSlice";

const genders = createListCollection({
  items: [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ],
});

const bloodGroups = createListCollection({
  items: [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
  ],
});

export default function PatientProfile() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const loading = useSelector((s) => s.auth.loading);
  const error = useSelector((s) => s.auth.error);
  const [editing, setEditing] = useState(false);

  const buildForm = () => ({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dob: user?.dob ? user.dob.slice(0, 10) : "",
    gender: user?.gender || "",
    address: user?.address || "",
    bloodGroup: user?.bloodGroup || "",
    allergies: user?.allergies || "",
    emergencyContact: user?.emergencyContact || "",
  });

  const [form, setForm] = useState(buildForm);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && !error && saved) {
      setEditing(false);
      const timer = setTimeout(() => setSaved(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, error, saved]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    const { email, ...profileData } = form;
    dispatch(updateProfileRequest(profileData));
    setSaved(true);
  };

  const handleCancel = () => {
    setForm(buildForm());
    setEditing(false);
  };

  return (
    <Stack gap={6} w="100%">
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal and medical information"
        actions={[
          editing ? (
            <Flex key="edit-actions" gap={2}>
              <Button
                size="sm"
                variant="outline"
                colorPalette="gray"
                onClick={handleCancel}
              >
                <MdClose /> Cancel
              </Button>
            </Flex>
          ) : (
            <Button
              key="edit"
              size="sm"
              colorPalette="teal"
              onClick={() => setEditing(true)}
            >
              <MdEdit /> Edit Profile
            </Button>
          ),
        ]}
      />

      {saved && !error && !loading && (
        <Box
          bg="teal.50"
          border="1px solid"
          borderColor="teal.200"
          p={4}
          rounded="xl"
        >
          <Text color="teal.700" fontWeight="600">
            Profile updated successfully!
          </Text>
        </Box>
      )}

      {error && (
        <Box
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          p={4}
          rounded="xl"
        >
          <Text color="red.700" fontWeight="600">
            {error}
          </Text>
        </Box>
      )}

      {/* Profile header card */}
      <Card.Root
        shadow="md"
        rounded="2xl"
        overflow="hidden"
        bgGradient="to-br"
        gradientFrom="teal.600"
        gradientTo="teal.800"
      >
        <Card.Body p={{ base: 5, md: 8 }}>
          <Flex align="center" gap={{ base: 4, md: 6 }} wrap="wrap">
            <Avatar.Root size="2xl" bg="white" flexShrink={0}>
              <Avatar.Fallback
                name={form.name}
                color="teal.700"
                fontSize="2xl"
              />
            </Avatar.Root>
            <Box flex={1}>
              <Heading size={{ base: "md", md: "lg" }} color="white">
                {form.name}
              </Heading>
              <Flex align="center" gap={2} mt={1}>
                <MdEmail size={14} color="rgba(255,255,255,0.7)" />
                <Text color="teal.100" fontSize="sm">
                  {form.email}
                </Text>
              </Flex>
              <Flex align="center" gap={2} mt={0.5}>
                <MdPhone size={14} color="rgba(255,255,255,0.7)" />
                <Text color="teal.100" fontSize="sm">
                  {form.phone}
                </Text>
              </Flex>
              <Flex gap={2} mt={3} wrap="wrap">
                <Badge bg="whiteAlpha.300" color="white" size="sm">
                  Patient
                </Badge>
                <Badge bg="whiteAlpha.300" color="white" size="sm">
                  Blood: {form.bloodGroup}
                </Badge>
                <Badge
                  bg="whiteAlpha.300"
                  color="white"
                  size="sm"
                  textTransform="capitalize"
                >
                  {form.gender}
                </Badge>
              </Flex>
            </Box>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* Form */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body as="form" onSubmit={handleSave}>
          <Stack gap={6}>
            {/* Personal Information Section */}
            <Flex align="center" gap={2} pb={2} borderBottomWidth="1px">
              <Box color="teal.500">
                <MdPerson size={18} />
              </Box>
              <Heading size="sm" color="teal.700">
                Personal Information
              </Heading>
            </Flex>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              <Field.Root>
                <Field.Label fontSize="sm">Full Name</Field.Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  readOnly={!editing}
                  bg={editing ? "white" : "gray.50"}
                  borderColor={editing ? "teal.200" : "gray.200"}
                  _focus={editing ? { borderColor: "teal.400" } : {}}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label fontSize="sm">Email</Field.Label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  readOnly
                  bg="gray.50"
                />
                <Text fontSize="xs" color="gray.400">
                  Email cannot be changed
                </Text>
              </Field.Root>
              <Field.Root>
                <Field.Label fontSize="sm">Phone</Field.Label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  readOnly={!editing}
                  bg={editing ? "white" : "gray.50"}
                  borderColor={editing ? "teal.200" : "gray.200"}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label fontSize="sm">Date of Birth</Field.Label>
                <Input
                  name="dob"
                  type={editing ? "date" : "text"}
                  value={form.dob}
                  onChange={handleChange}
                  readOnly={!editing}
                  bg={editing ? "white" : "gray.50"}
                  borderColor={editing ? "teal.200" : "gray.200"}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label fontSize="sm">Gender</Field.Label>
                {editing ? (
                  <Select.Root
                    collection={genders}
                    defaultValue={[form.gender]}
                    positioning={{ placement: "bottom", sameWidth: true }}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, gender: v.value[0] || "" }))
                    }
                  >
                    <Select.Trigger>
                      <Select.ValueText />
                    </Select.Trigger>
                    <Select.Positioner>
                      <Select.Content>
                        {genders.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                ) : (
                  <Input
                    value={form.gender}
                    readOnly
                    bg="gray.50"
                    textTransform="capitalize"
                  />
                )}
              </Field.Root>
              <Field.Root>
                <Field.Label fontSize="sm">Address</Field.Label>
                <Input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  readOnly={!editing}
                  bg={editing ? "white" : "gray.50"}
                  borderColor={editing ? "teal.200" : "gray.200"}
                />
              </Field.Root>
            </Grid>

            {/* Medical Information Section */}
            <Flex align="center" gap={2} pb={2} borderBottomWidth="1px" pt={2}>
              <Box color="teal.500">
                <MdLocalHospital size={18} />
              </Box>
              <Heading size="sm" color="teal.700">
                Medical Information
              </Heading>
            </Flex>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={4}>
              <Field.Root>
                <Field.Label fontSize="sm">Blood Group</Field.Label>
                {editing ? (
                  <Select.Root
                    collection={bloodGroups}
                    defaultValue={[form.bloodGroup]}
                    positioning={{ placement: "bottom", sameWidth: true }}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, bloodGroup: v.value[0] || "" }))
                    }
                  >
                    <Select.Trigger>
                      <Select.ValueText />
                    </Select.Trigger>
                    <Select.Positioner>
                      <Select.Content>
                        {bloodGroups.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                ) : (
                  <Input value={form.bloodGroup} readOnly bg="gray.50" />
                )}
              </Field.Root>
              <Field.Root>
                <Field.Label fontSize="sm">Known Allergies</Field.Label>
                <Input
                  name="allergies"
                  value={form.allergies}
                  onChange={handleChange}
                  readOnly={!editing}
                  bg={editing ? "white" : "gray.50"}
                  borderColor={editing ? "teal.200" : "gray.200"}
                  placeholder={editing ? "e.g., Penicillin, Peanuts" : ""}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label fontSize="sm">Emergency Contact</Field.Label>
                <Input
                  name="emergencyContact"
                  value={form.emergencyContact}
                  onChange={handleChange}
                  readOnly={!editing}
                  bg={editing ? "white" : "gray.50"}
                  borderColor={editing ? "teal.200" : "gray.200"}
                />
              </Field.Root>
            </Grid>

            {editing && (
              <Flex justify="flex-end" gap={3} pt={2}>
                <Button
                  variant="outline"
                  colorPalette="gray"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorPalette="teal"
                  size="md"
                  loading={loading}
                >
                  <MdSave /> Save Changes
                </Button>
              </Flex>
            )}
          </Stack>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
}
