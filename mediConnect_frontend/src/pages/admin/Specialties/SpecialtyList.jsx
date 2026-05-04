import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Heading,
  Text,
  Flex,
  Badge,
  Input,
  Button,
  Card,
  Grid,
  Dialog,
  Field,
  Spinner,
  Center,
  Textarea,
} from "@chakra-ui/react";
import {
  MdAdd,
  MdSearch,
  MdMedicalServices,
  MdEdit,
  MdDelete,
  MdClose,
  MdWarning,
  MdFavorite,
  MdVisibility,
  MdPsychology,
  MdChildCare,
  MdFace,
  MdRemoveRedEye,
  MdHearing,
  MdPregnantWoman,
  MdLocalHospital,
  MdBiotech,
  MdScience,
  MdFilterList,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import * as specialtySlice from "@/features/specialties/specialtySlice";
import * as specialtySelectors from "@/features/specialties/specialtySelectors";
import useDebounce from "@/hooks/useDebounce";

const SPECIALTY_ICONS = {
  cardiology: { icon: MdFavorite, color: "red" },
  neurology: { icon: MdPsychology, color: "purple" },
  orthopedics: { icon: MdLocalHospital, color: "blue" },
  pediatrics: { icon: MdChildCare, color: "pink" },
  dermatology: { icon: MdFace, color: "orange" },
  ophthalmology: { icon: MdRemoveRedEye, color: "cyan" },
  "ent (otolaryngology)": { icon: MdHearing, color: "teal" },
  "gynecology & obstetrics": { icon: MdPregnantWoman, color: "pink" },
  "general surgery": { icon: MdLocalHospital, color: "green" },
  psychiatry: { icon: MdPsychology, color: "indigo" },
  oncology: { icon: MdBiotech, color: "red" },
  urology: { icon: MdScience, color: "blue" },
  pulmonology: { icon: MdVisibility, color: "teal" },
  gastroenterology: { icon: MdScience, color: "yellow" },
  endocrinology: { icon: MdBiotech, color: "purple" },
};

function getSpecialtyStyle(name) {
  const key = name?.toLowerCase();
  return SPECIALTY_ICONS[key] || { icon: MdMedicalServices, color: "teal" };
}

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function SpecialtyList() {
  const dispatch = useDispatch();
  const specialties = useSelector(specialtySelectors.selectSpecialties);
  const loading = useSelector(specialtySelectors.selectSpecialtiesLoading);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    dispatch(
      specialtySlice.fetchSpecialtiesRequest({
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      }),
    );
  }, [dispatch, debouncedSearch, statusFilter]);

  const counts = useMemo(() => {
    const active = specialties.filter((s) => s.status === "active").length;
    return {
      total: specialties.length,
      active,
      inactive: specialties.length - active,
    };
  }, [specialties]);

  const filtered = specialties;

  if (loading)
    return (
      <Center py={12}>
        <Spinner size="xl" color="teal.500" />
      </Center>
    );

  const handleAdd = (e) => {
    e.preventDefault();
    if (editTarget) {
      dispatch(
        specialtySlice.updateSpecialtyRequest({
          id: editTarget._id,
          data: form,
        }),
      );
      setEditTarget(null);
    } else {
      dispatch(specialtySlice.addSpecialtyRequest(form));
    }
    setForm({ name: "", description: "" });
    setShowAdd(false);
  };

  const openEdit = (s) => {
    setEditTarget(s);
    setForm({ name: s.name, description: s.description || "" });
    setShowAdd(true);
  };

  const openAdd = () => {
    setEditTarget(null);
    setForm({ name: "", description: "" });
    setShowAdd(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      dispatch(specialtySlice.deleteSpecialtyRequest(deleteTarget._id));
      setDeleteTarget(null);
    }
  };

  return (
    <Stack gap={6}>
      {/* Page Header */}
      <Card.Root
        shadow="sm"
        rounded="xl"
        bg="linear-gradient(135deg, var(--chakra-colors-teal-600) 0%, var(--chakra-colors-teal-800) 100%)"
        color="white"
        overflow="hidden"
        position="relative"
      >
        <Box
          position="absolute"
          right="-20px"
          top="-20px"
          w="120px"
          h="120px"
          bg="whiteAlpha.100"
          rounded="full"
        />
        <Box
          position="absolute"
          right="50px"
          bottom="-25px"
          w="80px"
          h="80px"
          bg="whiteAlpha.50"
          rounded="full"
        />
        <Card.Body py={5}>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Flex align="center" gap={3}>
              <Box bg="whiteAlpha.200" p={2.5} rounded="xl">
                <MdMedicalServices size={24} />
              </Box>
              <Box>
                <Heading size="lg" color="white">
                  Medical Specialties
                </Heading>
                <Text color="teal.200" fontSize="sm" mt={0.5}>
                  Manage the medical specialties available across your platform
                </Text>
              </Box>
            </Flex>
            <Button
              bg="whiteAlpha.200"
              color="white"
              _hover={{ bg: "whiteAlpha.300" }}
              onClick={openAdd}
            >
              <MdAdd /> Add Specialty
            </Button>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* Stat Summary */}
      <Grid templateColumns="repeat(auto-fit, minmax(160px, 1fr))" gap={4}>
        {[
          {
            label: "Total",
            value: counts.total,
            color: "teal",
            icon: MdMedicalServices,
          },
          {
            label: "Active",
            value: counts.active,
            color: "green",
            icon: MdCheckCircle,
          },
          {
            label: "Inactive",
            value: counts.inactive,
            color: "red",
            icon: MdCancel,
          },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card.Root
            key={label}
            shadow="sm"
            rounded="xl"
            borderWidth="1px"
            borderColor="gray.100"
            _hover={{ shadow: "md" }}
            transition="all 0.2s"
            cursor="default"
          >
            <Card.Body py={4} px={5}>
              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontSize="2xl" fontWeight="800" color="gray.800">
                    {value}
                  </Text>
                  <Text fontSize="xs" color="gray.500" fontWeight="500">
                    {label} Specialties
                  </Text>
                </Box>
                <Box
                  color={`${color}.500`}
                  bg={`${color}.50`}
                  p={2}
                  rounded="lg"
                >
                  <Icon size={20} />
                </Box>
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      {/* Search & Filter Bar */}
      <Flex gap={3} wrap="wrap" align="center">
        <Box position="relative" flex="1" minW="220px" maxW="400px">
          <Box
            position="absolute"
            left={3}
            top="50%"
            transform="translateY(-50%)"
            color="gray.400"
            zIndex={1}
          >
            <MdSearch size={18} />
          </Box>
          <Input
            pl={9}
            pr={search ? 8 : 3}
            placeholder="Search specialties…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg="white"
          />
          {search && (
            <Box
              position="absolute"
              right={3}
              top="50%"
              transform="translateY(-50%)"
              color="gray.400"
              cursor="pointer"
              onClick={() => setSearch("")}
              zIndex={1}
              _hover={{ color: "gray.600" }}
            >
              <MdClose size={16} />
            </Box>
          )}
        </Box>
        <Flex bg="gray.100" rounded="lg" p={0.5} gap={0.5}>
          {STATUS_FILTERS.map(({ label, value }) => (
            <Button
              key={value}
              size="sm"
              variant={statusFilter === value ? "solid" : "ghost"}
              colorPalette={statusFilter === value ? "teal" : "gray"}
              fontWeight={statusFilter === value ? "600" : "400"}
              rounded="md"
              onClick={() => setStatusFilter(value)}
            >
              {label}
            </Button>
          ))}
        </Flex>
      </Flex>

      {search && (
        <Text fontSize="sm" color="gray.500">
          Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""} for
          &ldquo;{search}&rdquo;
        </Text>
      )}

      {/* Specialty Grid */}
      <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={4}>
        {filtered.map((s) => {
          const { icon: Icon, color } = getSpecialtyStyle(s.name);
          const isActive = s.status === "active";
          return (
            <Card.Root
              key={s._id}
              shadow="sm"
              rounded="xl"
              _hover={{
                shadow: "lg",
                transform: "translateY(-3px)",
                borderColor: `${color}.200`,
              }}
              transition="all 0.2s"
              borderWidth="1px"
              borderColor="gray.100"
              opacity={isActive ? 1 : 0.7}
            >
              <Card.Body>
                <Flex justify="space-between" align="flex-start" mb={3}>
                  <Box
                    color={`${color}.500`}
                    bg={`${color}.50`}
                    p={3}
                    rounded="xl"
                  >
                    <Icon size={24} />
                  </Box>
                  <Flex gap={0.5} align="center">
                    <Badge
                      colorPalette={isActive ? "green" : "red"}
                      size="sm"
                      variant="subtle"
                      rounded="full"
                      px={2}
                    >
                      {s.status}
                    </Badge>
                    <Button
                      size="xs"
                      variant="ghost"
                      colorPalette="teal"
                      onClick={() => openEdit(s)}
                      title="Edit"
                    >
                      <MdEdit />
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      colorPalette="red"
                      onClick={() => setDeleteTarget(s)}
                      title="Delete"
                    >
                      <MdDelete />
                    </Button>
                  </Flex>
                </Flex>
                <Text fontWeight="700" fontSize="md" color="gray.800" mb={1}>
                  {s.name}
                </Text>
                {s.description && (
                  <Text fontSize="xs" color="gray.500" lineClamp={2} mb={3}>
                    {s.description}
                  </Text>
                )}
                <Grid
                  templateColumns="1fr 1fr"
                  gap={2}
                  pt={3}
                  borderTopWidth="1px"
                  borderColor="gray.100"
                >
                  <Flex align="center" gap={1.5}>
                    <MdMedicalServices color="#0b9c9c" size={14} />
                    <Text fontSize="xs" color="gray.600" fontWeight="500">
                      {s.totalDoctors || 0} doctor
                      {(s.totalDoctors || 0) !== 1 ? "s" : ""}
                    </Text>
                  </Flex>
                  <Flex align="center" gap={1.5}>
                    <MdLocalHospital color="#3182CE" size={14} />
                    <Text fontSize="xs" color="gray.600" fontWeight="500">
                      {s.totalHospitals || 0} hospital
                      {(s.totalHospitals || 0) !== 1 ? "s" : ""}
                    </Text>
                  </Flex>
                </Grid>
              </Card.Body>
            </Card.Root>
          );
        })}
      </Grid>

      {filtered.length === 0 && (
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body textAlign="center" py={12}>
            <Box color="gray.300" mb={3}>
              {search || statusFilter !== "all" ? (
                <MdFilterList size={48} style={{ margin: "0 auto" }} />
              ) : (
                <MdMedicalServices size={48} style={{ margin: "0 auto" }} />
              )}
            </Box>
            <Text fontWeight="600" color="gray.500" mb={1}>
              {search || statusFilter !== "all"
                ? "No matching specialties"
                : "No specialties yet"}
            </Text>
            <Text fontSize="sm" color="gray.400" maxW="sm" mx="auto">
              {search
                ? `No results for "${search}". Try a different keyword.`
                : statusFilter !== "all"
                  ? `No ${statusFilter} specialties found.`
                  : "Add your first medical specialty to start building your platform."}
            </Text>
            {!search && statusFilter === "all" && (
              <Button size="sm" colorPalette="teal" mt={4} onClick={openAdd}>
                <MdAdd /> Add Specialty
              </Button>
            )}
            {(search || statusFilter !== "all") && (
              <Button
                size="sm"
                variant="outline"
                colorPalette="teal"
                mt={4}
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </Card.Body>
        </Card.Root>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog.Root
        open={!!deleteTarget}
        onOpenChange={(e) => {
          if (!e.open) setDeleteTarget(null);
        }}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="xl" maxW="420px">
            <Dialog.Header>
              <Flex align="center" gap={2}>
                <Box color="red.500">
                  <MdWarning size={20} />
                </Box>
                <Dialog.Title>Delete Specialty</Dialog.Title>
              </Flex>
            </Dialog.Header>
            <Dialog.Body>
              <Text fontSize="sm" color="gray.600">
                Are you sure you want to delete{" "}
                <Text as="span" fontWeight="700">
                  {deleteTarget?.name}
                </Text>
                ? This action cannot be undone.
              </Text>
              {(deleteTarget?.totalDoctors || 0) > 0 && (
                <Box bg="red.50" p={3} rounded="lg" mt={3}>
                  <Text fontSize="xs" color="red.600" fontWeight="500">
                    ⚠️ This specialty has {deleteTarget.totalDoctors} doctor
                    {deleteTarget.totalDoctors > 1 ? "s" : ""} assigned. They
                    will need to be reassigned.
                  </Text>
                </Box>
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button colorPalette="red" onClick={confirmDelete}>
                <MdDelete /> Delete
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {/* Add/Edit Modal */}
      <Dialog.Root
        open={showAdd}
        onOpenChange={(e) => {
          setShowAdd(e.open);
          if (!e.open) setEditTarget(null);
        }}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="xl" maxW="460px">
            <Dialog.Header>
              <Flex align="center" gap={2}>
                <Box color="teal.500" bg="teal.50" p={1.5} rounded="lg">
                  <MdMedicalServices size={18} />
                </Box>
                <Dialog.Title>
                  {editTarget ? "Edit Specialty" : "Add New Specialty"}
                </Dialog.Title>
              </Flex>
            </Dialog.Header>
            <Dialog.Body>
              <Box as="form" id="specialty-form" onSubmit={handleAdd}>
                <Stack gap={4}>
                  <Field.Root required>
                    <Field.Label>Specialty Name</Field.Label>
                    <Input
                      placeholder="e.g. Cardiology"
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Description</Field.Label>
                    <Textarea
                      placeholder="Brief description of this medical specialty…"
                      value={form.description}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, description: e.target.value }))
                      }
                      rows={3}
                      resize="vertical"
                    />
                    <Text fontSize="xs" color="gray.400" mt={1}>
                      {form.description.length}/500 characters
                    </Text>
                  </Field.Root>
                </Stack>
              </Box>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button type="submit" form="specialty-form" colorPalette="teal">
                {editTarget ? "Save Changes" : "Add Specialty"}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Stack>
  );
}
